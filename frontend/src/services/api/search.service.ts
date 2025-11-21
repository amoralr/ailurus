import { BaseApiService } from './base.service';

export interface SearchResult {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  path: string;
  rank: number;
  updatedAt: string;
}

export class SearchApiService extends BaseApiService {
  /**
   * GET /search?q=query - Búsqueda full-text con FTS5
   */
  async search(params: {
    q: string;
    limit?: number;
    offset?: number;
    category?: string;
  }): Promise<{ data: SearchResult[]; total: number; query: string; searchTime: string }> {
    return this.get<{ data: SearchResult[]; total: number; query: string; searchTime: string }>('/search', params);
  }
}

// Singleton instance
export const searchApi = new SearchApiService();
