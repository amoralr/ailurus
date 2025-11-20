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
    // Generar slug desde title
    const slug = this.generateSlug(createDto.title);

    // Verificar que el slug no exista
    const existing = await this.prisma.document.findUnique({
      where: { slug },
    });

    if (existing) {
      throw new BadRequestException(`Document with slug "${slug}" already exists`);
    }

    return this.prisma.document.create({
      data: {
        ...createDto,
        slug,
        status: createDto.status || DocumentStatus.DRAFT,
        createdBy: createDto.createdBy || 'anonymous',
      },
      include: {
        category: true,
      },
    });
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
