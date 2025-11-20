import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';

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
   * Construye el árbol jerárquico de folders recursivamente
   */
  private buildTree(folders: any[], parentId: number | null = null): FolderNode[] {
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
  async findAll(): Promise<FolderNode[]> {
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

    return this.buildTree(foldersWithDocs);
  }

  /**
   * Obtiene un folder por su path con sus children
   */
  async findByPath(path: string): Promise<FolderNode> {
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

    return {
      ...folder,
      documents: folder.documents.map((fd) => fd.document),
      categories: folder.categories.map((fc) => fc.category),
      children,
    };
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
}
