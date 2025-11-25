import { BaseApiService } from './base.service';
import type { FolderNode } from '@/shared/types/folder-tree.types';

export class FoldersApiService extends BaseApiService {
  /**
   * GET /folders - Obtiene el árbol jerárquico completo
   */
  async getFolderTree(): Promise<FolderNode[]> {
    return this.get<FolderNode[]>('/folders');
  }

  /**
   * GET /folders/:path - Obtiene un nodo específico con sus hijos
   */
  async getFolderByPath(path: string): Promise<FolderNode> {
    return this.get<FolderNode>(`/folders/${encodeURIComponent(path)}`);
  }

  /**
   * POST /folders - Crea una nueva carpeta
   */
  async createFolder(data: {
    name: string;
    type: 'FOLDER' | 'FILE';
    path: string;
    icon?: string;
    order?: number;
    parentId?: number;
  }): Promise<FolderNode> {
    return this.post<FolderNode>('/folders', data);
  }

  /**
   * PUT /folders/:id - Actualiza una carpeta
   */
  async updateFolder(id: number, data: {
    name?: string;
    icon?: string;
    order?: number;
    parentId?: number;
  }): Promise<FolderNode> {
    return this.put<FolderNode>(`/folders/${id}`, data);
  }

  /**
   * DELETE /folders/:id - Elimina una carpeta
   */
  async deleteFolder(id: number): Promise<void> {
    return this.delete<void>(`/folders/${id}`);
  }

  /**
   * DELETE /folders/:id/recursive - Elimina un folder y todo su contenido recursivamente
   */
  async deleteFolderRecursive(id: number): Promise<{
    deletedFolders: number;
    message: string;
  }> {
    return this.delete(`/folders/${id}/recursive`);
  }

  /**
   * GET /folders/:id/delete-preview - Obtiene información sobre qué se eliminará
   */
  async getDeletePreview(id: number): Promise<{
    folderCount: number;
    documentCount: number;
    folderNames: string[];
  }> {
    return this.get(`/folders/${id}/delete-preview`);
  }
}

// Singleton instance
export const foldersApi = new FoldersApiService();
