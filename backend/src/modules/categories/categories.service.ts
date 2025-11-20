import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateCategoryDto {
  id: string; // 'getting-started', 'architecture', etc.
  name: string;
  icon: string;
  order?: number;
}

export interface UpdateCategoryDto {
  name?: string;
  icon?: string;
  order?: number;
}

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Obtiene todas las categorías con sus estadísticas
   */
  async findAll() {
    const categories = await this.prisma.category.findMany({
      orderBy: { order: 'asc' },
    });

    // Obtener estadísticas para cada categoría
    const categoriesWithStats = await Promise.all(
      categories.map(async (category) => {
        const stats = await this.prisma.categoryStats.findUnique({
          where: { categoryId: category.id },
        });

        // Si no existen stats, calcular manualmente
        if (!stats) {
          const totalDocuments = await this.prisma.document.count({
            where: { categoryId: category.id },
          });
          const publishedDocs = await this.prisma.document.count({
            where: { categoryId: category.id, status: 'PUBLISHED' },
          });

          return {
            ...category,
            stats: {
              totalDocuments,
              publishedDocs,
              draftDocs: 0,
              archivedDocs: 0,
            },
          };
        }

        return {
          ...category,
          stats: {
            totalDocuments: stats.totalDocuments,
            publishedDocs: stats.publishedDocs,
            draftDocs: stats.draftDocs,
            archivedDocs: stats.archivedDocs,
          },
        };
      }),
    );

    return categoriesWithStats;
  }

  /**
   * Obtiene una categoría por ID con sus estadísticas
   */
  async findById(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        documents: {
          where: { status: 'PUBLISHED' },
          select: {
            id: true,
            title: true,
            slug: true,
            excerpt: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!category) {
      throw new NotFoundException(`Category with id "${id}" not found`);
    }

    // Obtener stats
    const stats = await this.prisma.categoryStats.findUnique({
      where: { categoryId: id },
    });

    return {
      ...category,
      stats: stats || {
        totalDocuments: category.documents.length,
        publishedDocs: category.documents.length,
        draftDocs: 0,
        archivedDocs: 0,
      },
    };
  }

  /**
   * Crea una nueva categoría
   */
  async create(createCategoryDto: CreateCategoryDto) {
    // Verificar que el ID sea único
    const existing = await this.prisma.category.findUnique({
      where: { id: createCategoryDto.id },
    });

    if (existing) {
      throw new Error(`Category with id "${createCategoryDto.id}" already exists`);
    }

    return this.prisma.category.create({
      data: createCategoryDto,
    });
  }

  /**
   * Actualiza una categoría existente
   */
  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Category with id "${id}" not found`);
    }

    return this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
    });
  }

  /**
   * Elimina una categoría (debe validar que no tenga documentos)
   */
  async delete(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { documents: true },
        },
      },
    });

    if (!category) {
      throw new NotFoundException(`Category with id "${id}" not found`);
    }

    if (category._count.documents > 0) {
      throw new Error(
        `Cannot delete category "${category.name}" because it has ${category._count.documents} documents`,
      );
    }

    await this.prisma.category.delete({ where: { id } });
  }
}
