import { BaseApiService } from "@/shared/services/base.service";
import type { FolderNode } from "@/folders/types/folder-tree.types";

export interface CreateFolderDto {
  name: string;
  path: string;
  type: 'FOLDER' | 'FILE';
  parentId?: number;
  categoryId?: string;
  order?: number;
}

export interface UpdateFolderDto {
  name?: string;
  path?: string;
  parentId?: number;
  order?: number;
}

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
   * POST /folders - Crea un nuevo folder
   */
  async createFolder(data: CreateFolderDto): Promise<FolderNode> {
    return this.post<FolderNode>('/folders', data);
  }

  /**
   * PUT /folders/:id - Actualiza un folder existente
   */
  async updateFolder(id: number, data: UpdateFolderDto): Promise<FolderNode> {
    return this.put<FolderNode>(`/folders/${id}`, data);
  }

  /**
   * DELETE /folders/:id - Elimina un folder (solo si no tiene hijos)
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
