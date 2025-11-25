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
   * Alias para getCategories (compatibilidad)
   */
  async getAll(): Promise<Category[]> {
    return this.getCategories();
  }

  /**
   * GET /categories/:id - Obtiene una categoría específica
   */
  async getCategoryById(id: string): Promise<Category> {
    return this.get<Category>(`/categories/${id}`);
  }

  /**
   * POST /categories - Crea una nueva categoría
   */
  async createCategory(data: { id: string; name: string; icon: string; order: number }): Promise<Category> {
    return this.post<Category>('/categories', data);
  }

  /**
   * PUT /categories/:id - Actualiza una categoría
   */
  async updateCategory(id: string, data: { name: string; icon: string; order: number }): Promise<Category> {
    return this.put<Category>(`/categories/${id}`, data);
  }

  /**
   * DELETE /categories/:id - Elimina una categoría
   */
  async deleteCategory(id: string): Promise<void> {
    return this.delete<void>(`/categories/${id}`);
  }
}

// Singleton instance
export const categoriesApi = new CategoriesApiService();
