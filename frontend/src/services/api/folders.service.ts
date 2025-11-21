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
}

// Singleton instance
export const foldersApi = new FoldersApiService();
