import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface SearchResult {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  categoryId: string;
  path: string;
  rank: number;
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  query: string;
  page: number;
  limit: number;
}

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  /**
   * Búsqueda full-text usando FTS5
   */
  async search(
    query: string,
    limit: number = 10,
    offset: number = 0,
  ): Promise<SearchResponse> {
    // Sanitizar query para FTS5
    const sanitizedQuery = query.trim().replace(/[^\w\s]/g, '');
    
    if (!sanitizedQuery) {
      return {
        results: [],
        total: 0,
        query,
        page: Math.floor(offset / limit) + 1,
        limit,
      };
    }

    // FTS5 query con ranking
    const results = await this.prisma.$queryRaw<SearchResult[]>`
      SELECT 
        d.id,
        d.title,
        d.slug,
        COALESCE(d.excerpt, SUBSTR(d.content, 1, 200)) as excerpt,
        d.categoryId,
        d.path,
        fts.rank as rank
      FROM documents_fts fts
      INNER JOIN documents d ON d.id = fts.document_id
      WHERE documents_fts MATCH ${sanitizedQuery}
      ORDER BY fts.rank
      LIMIT ${limit} OFFSET ${offset}
    `;

    // Contar total de resultados
    const countResult = await this.prisma.$queryRaw<[{ count: bigint }]>`
      SELECT COUNT(*) as count
      FROM documents_fts
      WHERE documents_fts MATCH ${sanitizedQuery}
    `;

    const total = Number(countResult[0]?.count || 0n);

    return {
      results,
      total,
      query,
      page: Math.floor(offset / limit) + 1,
      limit,
    };
  }

  /**
   * Registra una búsqueda en el log de actividad
   */
  async logSearch(query: string, userId: string, resultsCount: number, ipAddress?: string) {
    await this.prisma.activityLog.create({
      data: {
        entityType: 'search',
        entityId: 0, // No aplica para búsquedas
        action: 'search',
        userId,
        changes: JSON.stringify({ query, resultsCount }),
        ipAddress,
        userAgent: 'api',
      },
    });
  }
}
