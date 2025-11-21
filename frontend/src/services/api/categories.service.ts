import { BaseApiService } from './base.service';

export interface Category {
  id: string;
  name: string;
  icon: string;
  order: number;
  stats: {
    published: number;
    draft: number;
    archived: number;
    total: number;
  };
}

export class CategoriesApiService extends BaseApiService {
  /**
   * GET /categories - Lista todas las categorías con stats
   */
  async getCategories(): Promise<Category[]> {
    return this.get<Category[]>('/categories');
  }

  /**
   * GET /categories/:id - Obtiene una categoría específica
   */
  async getCategoryById(id: string): Promise<Category> {
    return this.get<Category>(`/categories/${id}`);
  }
}

// Singleton instance
export const categoriesApi = new CategoriesApiService();
