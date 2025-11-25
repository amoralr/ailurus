import { BaseApiService } from './base.service';
import type { Document, CreateDocumentDto, UpdateDocumentDto } from '@/types/document.types';
import { DocumentStatus } from '@/types/document.types';

export class DocumentsApiService extends BaseApiService {
  /**
   * GET /docs - Lista todos los documentos publicados
   */
  async getDocuments(params?: {
    category?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<Document[]> {
    return this.get<Document[]>('/docs', params);
  }

  /**
   * GET /docs/:slug - Obtiene un documento por slug
   */
  async getDocumentBySlug(slug: string): Promise<Document> {
    return this.get<Document>(`/docs/${slug}`);
  }

  /**
   * POST /docs - Crea un nuevo documento (draft)
   */
  async createDocument(data: CreateDocumentDto): Promise<Document> {
    return this.post<Document>('/docs', data);
  }

  /**
   * PUT /docs/:id/draft - Actualiza un draft
   */
  async updateDraft(id: number, data: UpdateDocumentDto): Promise<Document> {
    return this.put<Document>(`/docs/${id}/draft`, data);
  }

  /**
   * PUT /docs/:id/publish - Publica un documento
   */
  async publishDocument(id: number): Promise<Document> {
    return this.put<Document>(`/docs/${id}/publish`, {});
  }

  /**
   * DELETE /docs/:id - Archiva un documento (soft delete)
   */
  async archiveDocument(id: number): Promise<{ success: boolean }> {
    return this.delete<{ success: boolean }>(`/docs/${id}`);
  }

  /**
   * POST /docs/:id/folders/:folderId - Agrega documento a carpeta
   */
  async addToFolder(documentId: number, folderId: number): Promise<{ success: boolean }> {
    return this.post<{ success: boolean }>(`/docs/${documentId}/folders/${folderId}`, {});
  }

  /**
   * DELETE /docs/:id/folders/:folderId - Remueve documento de carpeta
   */
  async removeFromFolder(documentId: number, folderId: number): Promise<{ success: boolean }> {
    return this.delete<{ success: boolean }>(`/docs/${documentId}/folders/${folderId}`);
  }

  /**
   * GET /docs/orphans/list - Obtiene documentos sin carpeta
   */
  async getOrphans(): Promise<Array<{ id: number; slug: string; title: string; excerpt: string | null; categoryId: string }>> {
    return this.get<Array<{ id: number; slug: string; title: string; excerpt: string | null; categoryId: string }>>('/docs/orphans/list');
  }
}

// Singleton instance
export const documentsApi = new DocumentsApiService();
export { DocumentStatus };

