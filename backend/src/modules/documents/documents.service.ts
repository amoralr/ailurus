import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { DocumentStatus } from '@prisma/client';

@Injectable()
export class DocumentsService {
  constructor(private prisma: PrismaService) {}

  // GET /docs - Listar documentos publicados
  async findAll() {
    try {
      console.log('📝 Starting findAll...');
      const docs = await this.prisma.document.findMany({
        where: { status: 'PUBLISHED' },
      });
      console.log(`✅ Found ${docs.length} documents`);
      return docs;
    } catch (error) {
      console.error('❌ Error in findAll:', error);
      console.error('❌ Error details:', error.message, error.stack);
      throw error;
    }
  }

  // GET /docs/:slug - Obtener por slug
  async findBySlug(slug: string) {
    const document = await this.prisma.document.findUnique({
      where: { slug },
      include: {
        category: true,
      },
    });

    if (!document) {
      throw new NotFoundException(`Document with slug "${slug}" not found`);
    }

    return document;
  }

  // GET /docs?category=:id - Filtrar por categoría
  async findByCategory(categoryId: string) {
    return this.prisma.document.findMany({
      where: {
        categoryId,
        status: DocumentStatus.PUBLISHED,
      },
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
      },
    });
  }

  // POST /docs - Crear documento
  async create(createDto: CreateDocumentDto) {
    console.log(`\n========================================`);
    console.log(`[DocumentsService] CREATE DOCUMENT - START`);
    console.log(`[DocumentsService] Full payload:`, JSON.stringify(createDto, null, 2));
    console.log(`[DocumentsService] Has categoryName: ${!!createDto.categoryName}`);
    console.log(`[DocumentsService] Has categoryIcon: ${!!createDto.categoryIcon}`);
    console.log(`[DocumentsService] categoryName value: "${createDto.categoryName}"`);
    console.log(`[DocumentsService] categoryIcon value: "${createDto.categoryIcon}"`);
    console.log(`========================================\n`);
    
    // Generar slug desde title
    const slug = this.generateSlug(createDto.title);

    // Verificar que el slug no exista
    const existing = await this.prisma.document.findUnique({
      where: { slug },
    });

    if (existing) {
      throw new BadRequestException(`Document with slug "${slug}" already exists`);
    }

    // 1. Verificar si la categoría existe, si no, crearla
    console.log(`\n[DocumentsService] === CATEGORY CHECK ===`);
    console.log(`[DocumentsService] Looking for category with id: "${createDto.categoryId}"`);
    let category = await this.prisma.category.findUnique({
      where: { id: createDto.categoryId },
    });
    console.log(`[DocumentsService] Category found in DB: ${!!category}`);

    if (!category) {
      console.log(`[DocumentsService] Category NOT found, will create new one...`);
      console.log(`[DocumentsService] Received categoryName: "${createDto.categoryName}"`);
      console.log(`[DocumentsService] Received categoryIcon: "${createDto.categoryIcon}"`);
      
      // Crear categoría automáticamente
      const categoryOrder = await this.prisma.category.count();
      const categoryName = createDto.categoryName || createDto.categoryId
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      const categoryIcon = createDto.categoryIcon || '📄';
      
      console.log(`[DocumentsService] Will create category with:`);
      console.log(`  - id: "${createDto.categoryId}"`);
      console.log(`  - name: "${categoryName}"`);
      console.log(`  - icon: "${categoryIcon}"`);
      console.log(`  - order: ${categoryOrder}`);
      
      category = await this.prisma.category.create({
        data: {
          id: createDto.categoryId,
          name: categoryName,
          icon: categoryIcon,
          order: categoryOrder,
        },
      });
      console.log(`[DocumentsService] ✅ Category created successfully!`);
      console.log(`[DocumentsService] Created category:`, JSON.stringify(category, null, 2));
      
      // Verificar si ya existe carpeta raíz para la categoría
      let categoryRootFolder = await this.prisma.folder.findUnique({
        where: { path: categoryName },
      });
      
      if (!categoryRootFolder) {
        // Crear carpeta raíz para la categoría
        categoryRootFolder = await this.prisma.folder.create({
          data: {
            name: categoryName,
            type: 'FOLDER',
            path: categoryName,
            icon: categoryIcon,
            order: categoryOrder,
            parentId: null,
          },
        });
        console.log(`[DocumentsService] Created root folder for category: ${categoryName}`);
      } else {
        console.log(`[DocumentsService] Root folder already exists for category: ${categoryName}`);
      }
      
      // Verificar si ya existe la vinculación categoría-carpeta
      const existingLink = await this.prisma.folderCategory.findUnique({
        where: {
          folderId_categoryId: {
            folderId: categoryRootFolder.id,
            categoryId: category.id,
          },
        },
      });
      
      if (!existingLink) {
        // Vincular categoría con su carpeta raíz
        await this.prisma.folderCategory.create({
          data: {
            folderId: categoryRootFolder.id,
            categoryId: category.id,
          },
        });
        console.log(`[DocumentsService] Linked category to root folder`);
      }
    }

    // 2. Crear el documento (excluir categoryName y categoryIcon que no son parte del schema)
    const { categoryName: _categoryName, categoryIcon: _categoryIcon, ...documentData } = createDto;
    const document = await this.prisma.document.create({
      data: {
        ...documentData,
        slug,
        status: createDto.status || DocumentStatus.DRAFT,
        createdBy: createDto.createdBy || 'anonymous',
      },
      include: {
        category: true,
      },
    });

    // 3. Crear carpeta FILE automáticamente para el documento
    const folderPath = createDto.path;
    let folder = await this.prisma.folder.findUnique({
      where: { path: folderPath },
    });

    if (!folder) {
      // Determinar parentId basado en el path
      const pathParts = folderPath.split('/');
      let parentId: number | null = null;

      if (pathParts.length > 1) {
        // Buscar o crear carpetas padre
        for (let i = 0; i < pathParts.length - 1; i++) {
          const parentPath = pathParts.slice(0, i + 1).join('/');
          let parentFolder = await this.prisma.folder.findUnique({
            where: { path: parentPath },
          });

          if (!parentFolder) {
            const folderOrder = await this.prisma.folder.count({ where: { parentId } });
            parentFolder = await this.prisma.folder.create({
              data: {
                name: pathParts[i],
                type: 'FOLDER',
                path: parentPath,
                icon: '📁',
                order: folderOrder,
                parentId,
              },
            });
            console.log(`[DocumentsService] Auto-created parent folder: ${parentPath}`);
          }
          parentId = parentFolder.id;
        }
      }

      // Crear carpeta FILE para el documento
      const folderOrder = await this.prisma.folder.count({ where: { parentId } });
      folder = await this.prisma.folder.create({
        data: {
          name: document.title,
          type: 'FILE',
          path: folderPath,
          icon: null,
          order: folderOrder,
          parentId,
        },
      });
      console.log(`[DocumentsService] Auto-created FILE folder: ${folderPath}`);
    }

    // 4. Asociar documento con carpeta
    await this.prisma.folderDocument.create({
      data: {
        folderId: folder.id,
        documentId: document.id,
        order: 0,
      },
    });
    console.log(`[DocumentsService] Linked document ${document.id} to folder ${folder.id}`);

    return document;
  }

  // PUT /docs/:id/draft - Actualizar draft
  async updateDraft(id: number, updateDto: UpdateDocumentDto) {
    await this.findById(id);

    return this.prisma.document.update({
      where: { id },
      data: updateDto,
      include: {
        category: true,
      },
    });
  }

  // PUT /docs/:id/publish - Publicar documento
  async publish(id: number) {
    const document = await this.findById(id);

    if (!document.content || document.content.trim().length === 0) {
      throw new BadRequestException('Cannot publish document with empty content');
    }

    return this.prisma.document.update({
      where: { id },
      data: { status: DocumentStatus.PUBLISHED },
      include: {
        category: true,
      },
    });
  }

  // DELETE /docs/:id - Archivar (soft delete)
  async archive(id: number) {
    await this.findById(id);

    return this.prisma.document.update({
      where: { id },
      data: { status: DocumentStatus.ARCHIVED },
      include: {
        category: true,
      },
    });
  }

  // GET /docs/:slug/navigation - Obtener documentos prev/next
  async getNavigation(slug: string) {
    const current = await this.findBySlug(slug);

    // Buscar documento previo (ordenado por createdAt)
    const prev = await this.prisma.document.findFirst({
      where: {
        status: DocumentStatus.PUBLISHED,
        createdAt: { lt: current.createdAt },
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        slug: true,
        title: true,
      },
    });

    // Buscar documento siguiente (ordenado por createdAt)
    const next = await this.prisma.document.findFirst({
      where: {
        status: DocumentStatus.PUBLISHED,
        createdAt: { gt: current.createdAt },
      },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        slug: true,
        title: true,
      },
    });

    return {
      prev: prev || null,
      next: next || null,
    };
  }

  // Helper: Buscar por ID
  private async findById(id: number) {
    const document = await this.prisma.document.findUnique({
      where: { id },
    });

    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    return document;
  }

  // POST /docs/:id/folders/:folderId - Add document to folder
  async addToFolder(documentId: number, folderId: number) {
    // Verify document exists
    await this.findById(documentId);

    // Verify folder exists
    const folder = await this.prisma.folder.findUnique({
      where: { id: folderId },
    });

    if (!folder) {
      throw new NotFoundException(`Folder with ID ${folderId} not found`);
    }

    // Check if relationship already exists
    const existing = await this.prisma.folderDocument.findUnique({
      where: {
        folderId_documentId: {
          folderId,
          documentId,
        },
      },
    });

    if (existing) {
      throw new BadRequestException('Document is already in this folder');
    }

    // Create relationship
    return this.prisma.folderDocument.create({
      data: {
        folderId,
        documentId,
      },
      include: {
        folder: true,
        document: true,
      },
    });
  }

  // DELETE /docs/:id/folders/:folderId - Remove document from folder
  async removeFromFolder(documentId: number, folderId: number) {
    // Verify relationship exists
    const relationship = await this.prisma.folderDocument.findUnique({
      where: {
        folderId_documentId: {
          folderId,
          documentId,
        },
      },
    });

    if (!relationship) {
      throw new NotFoundException('Document is not in this folder');
    }

    // Delete relationship
    return this.prisma.folderDocument.delete({
      where: {
        folderId_documentId: {
          folderId,
          documentId,
        },
      },
    });
  }

  // GET /docs/orphans/list - Get documents without folder
  async findOrphans() {
    return this.prisma.document.findMany({
      where: {
        status: DocumentStatus.PUBLISHED,
        folders: {
          none: {}, // Documents with no folder relationship
        },
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        categoryId: true,
      },
    });
  }

  // Helper: Generar slug
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Quitar acentos
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}
