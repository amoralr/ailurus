import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';
import { FolderNodeResponseDto } from './dto/folder-node-response.dto';
import { FolderType } from '@prisma/client';

export interface FolderNode {
  id: number;
  name: string;
  path: string;
  type: string;
  parentId: number | null;
  order: number;
  children: FolderNode[];
  documents?: any[];
  categories?: any[];
}

@Injectable()
export class FoldersService {
  constructor(private prisma: PrismaService) {}

  /**
   * Transforma un FolderNode de Prisma al formato del frontend
   */
  private transformToResponseDto(folder: any): FolderNodeResponseDto {
    const isFile = folder.type === FolderType.FILE;
    const document = isFile && folder.documents?.[0];
    const slug = document?.slug;
    const status = document?.status;

    return {
      id: folder.id.toString(),
      name: folder.name,
      type: folder.type.toLowerCase() as 'folder' | 'file',
      icon: folder.icon,
      slug: slug || undefined,
      status: status || undefined,
      path: folder.path,
      order: folder.order,
      count: folder.children?.length || undefined,
      children: folder.children?.map((child: any) => this.transformToResponseDto(child)),
    };
  }

  /**
   * Construye el árbol jerárquico de folders recursivamente
   */
  private buildTree(folders: any[], parentId: number | null = null): any[] {
    return folders
      .filter((folder) => folder.parentId === parentId)
      .sort((a, b) => a.order - b.order)
      .map((folder) => ({
        ...folder,
        children: this.buildTree(folders, folder.id),
      }));
  }

  /**
   * Obtiene todos los folders en estructura de árbol
   */
  async findAll(): Promise<FolderNodeResponseDto[]> {
    const folders = await this.prisma.folder.findMany({
      include: {
        categories: {
          include: {
            category: true,
          },
        },
        documents: {
          include: {
            document: {
              select: {
                id: true,
                title: true,
                slug: true,
                status: true,
              },
            },
          },
        },
      },
      orderBy: { order: 'asc' },
    });

    // Mapear documentos y categorías para estructura más limpia
    const foldersWithDocs = folders.map((folder) => ({
      ...folder,
      documents: folder.documents.map((fd) => fd.document),
      categories: folder.categories.map((fc) => fc.category),
    }));

    const tree = this.buildTree(foldersWithDocs);
    return tree.map((node) => this.transformToResponseDto(node));
  }

  /**
   * Obtiene un folder por su path con sus children
   */
  async findByPath(path: string): Promise<FolderNodeResponseDto> {
    const folder = await this.prisma.folder.findUnique({
      where: { path },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
        documents: {
          include: {
            document: {
              select: {
                id: true,
                title: true,
                slug: true,
                status: true,
              },
            },
          },
        },
      },
    });

    if (!folder) {
      throw new NotFoundException(`Folder with path "${path}" not found`);
    }

    // Obtener todos los folders para construir el árbol completo
    const allFolders = await this.prisma.folder.findMany({
      include: {
        categories: {
          include: {
            category: true,
          },
        },
        documents: {
          include: {
            document: {
              select: {
                id: true,
                title: true,
                slug: true,
                status: true,
              },
            },
          },
        },
      },
      orderBy: { order: 'asc' },
    });

    const foldersWithDocs = allFolders.map((f) => ({
      ...f,
      documents: f.documents.map((fd) => fd.document),
      categories: f.categories.map((fc) => fc.category),
    }));

    // Construir solo el subárbol desde este folder
    const children = this.buildTree(foldersWithDocs, folder.id);

    const nodeWithChildren = {
      ...folder,
      documents: folder.documents.map((fd) => fd.document),
      categories: folder.categories.map((fc) => fc.category),
      children,
    };

    return this.transformToResponseDto(nodeWithChildren);
  }

  /**
   * Crea un nuevo folder
   */
  async create(createFolderDto: CreateFolderDto) {
    // Verificar que el path sea único
    const existing = await this.prisma.folder.findUnique({
      where: { path: createFolderDto.path },
    });

    if (existing) {
      throw new Error(`Folder with path "${createFolderDto.path}" already exists`);
    }

    const { categoryId, ...folderData } = createFolderDto;

    return this.prisma.folder.create({
      data: folderData,
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
    });
  }

  /**
   * Actualiza un folder existente
   */
  async update(id: number, updateFolderDto: UpdateFolderDto) {
    const folder = await this.prisma.folder.findUnique({ where: { id } });
    if (!folder) {
      throw new NotFoundException(`Folder with id "${id}" not found`);
    }

    const { categoryId, ...folderData } = updateFolderDto;

    return this.prisma.folder.update({
      where: { id },
      data: folderData,
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
    });
  }

  /**
   * Elimina un folder (debe validar que no tenga children)
   */
  async delete(id: number) {
    const folder = await this.prisma.folder.findUnique({
      where: { id },
      include: {
        _count: {
          select: { children: true },
        },
      },
    });

    if (!folder) {
      throw new NotFoundException(`Folder with id "${id}" not found`);
    }

    if (folder._count.children > 0) {
      throw new Error(`Cannot delete folder "${folder.name}" because it has children`);
    }

    await this.prisma.folder.delete({ where: { id } });
  }

  /**
   * Obtiene todos los IDs de carpetas descendientes recursivamente
   */
  private async getDescendantFolderIds(folderId: number): Promise<number[]> {
    const children = await this.prisma.folder.findMany({
      where: { parentId: folderId },
      select: { id: true },
    });

    const descendantIds: number[] = [];
    
    for (const child of children) {
      descendantIds.push(child.id);
      // Recursivamente obtener descendientes de cada hijo
      const childDescendants = await this.getDescendantFolderIds(child.id);
      descendantIds.push(...childDescendants);
    }

    return descendantIds;
  }

  /**
   * Elimina una carpeta y todo su contenido relacionado de forma recursiva
   * Esto incluye:
   * - Todas las subcarpetas (recursivamente)
   * - Todos los documentos asociados a través de FolderDocument
   * - Todas las categorías asociadas a través de FolderCategory
   */
  async deleteRecursive(id: number) {
    const folder = await this.prisma.folder.findUnique({
      where: { id },
      include: {
        children: true,
        documents: true,
        categories: true,
      },
    });

    if (!folder) {
      throw new NotFoundException(`Folder with id "${id}" not found`);
    }

    // Obtener todos los IDs de carpetas descendientes (incluye la carpeta actual)
    const descendantIds = await this.getDescendantFolderIds(id);
    const allFolderIds = [id, ...descendantIds];

    // Usar una transacción para garantizar consistencia
    await this.prisma.$transaction(async (tx) => {
      // 1. Eliminar todas las relaciones FolderDocument de todas las carpetas afectadas
      await tx.folderDocument.deleteMany({
        where: {
          folderId: {
            in: allFolderIds,
          },
        },
      });

      // 2. Eliminar todas las relaciones FolderCategory de todas las carpetas afectadas
      await tx.folderCategory.deleteMany({
        where: {
          folderId: {
            in: allFolderIds,
          },
        },
      });

      // 3. Eliminar todas las carpetas (Prisma se encarga del CASCADE)
      // Eliminamos en orden inverso (hojas primero) para evitar conflictos
      for (let i = allFolderIds.length - 1; i >= 0; i--) {
        await tx.folder.delete({
          where: { id: allFolderIds[i] },
        });
      }
    });

    return {
      deletedFolders: allFolderIds.length,
      message: `Successfully deleted folder "${folder.name}" and ${allFolderIds.length - 1} descendant(s)`,
    };
  }

  /**
   * Cuenta el número total de carpetas que se eliminarán (incluyendo descendientes)
   */
  async countFoldersToDelete(id: number): Promise<{
    folderCount: number;
    documentCount: number;
    folderNames: string[];
  }> {
    const folder = await this.prisma.folder.findUnique({
      where: { id },
    });

    if (!folder) {
      throw new NotFoundException(`Folder with id "${id}" not found`);
    }

    // Obtener todos los IDs de carpetas descendientes
    const descendantIds = await this.getDescendantFolderIds(id);
    const allFolderIds = [id, ...descendantIds];

    // Obtener información de todas las carpetas
    const folders = await this.prisma.folder.findMany({
      where: {
        id: {
          in: allFolderIds,
        },
      },
      select: {
        name: true,
        documents: true,
      },
    });

    // Contar documentos únicos asociados
    const documentIds = new Set<number>();
    folders.forEach((f) => {
      f.documents.forEach((doc) => {
        documentIds.add(doc.documentId);
      });
    });

    return {
      folderCount: allFolderIds.length,
      documentCount: documentIds.size,
      folderNames: folders.map((f) => f.name),
    };
  }
}
