import { setSaving, setLastSaved, setError } from "../stores/editor.store";
import { documentsApi } from "@/documents/services/documents.service";

interface Draft {
  content: string;
  savedAt: string;
  slug: string;
}

interface DraftStorage {
  [slug: string]: Draft;
}

export class EditorService {
  private static readonly STORAGE_KEY = "ailurus_drafts";
  private static readonly USE_MOCKS = import.meta.env.PUBLIC_USE_MOCKS === "true";

  /**
   * Guarda un borrador usando API o localStorage como fallback
   */
  static async saveDraft(slug: string, content: string, documentId?: number): Promise<void> {
    setSaving(true);
    setError(null);

    try {
      if (!this.USE_MOCKS && documentId) {
        // Usar API
        await documentsApi.updateDraft(documentId, { content });
        console.log(`[EditorService] Draft saved to API for document ${documentId}`);
      } else {
        // Fallback a localStorage (mocks o sin documentId)
        const drafts = this.getDrafts();
        drafts[slug] = {
          content,
          savedAt: new Date().toISOString(),
          slug,
        };
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(drafts));
        console.log(`[EditorService] Draft saved to localStorage for ${slug}`);
      }

      setLastSaved(new Date());
    } catch (error) {
      console.error('[EditorService] saveDraft failed:', error);
      const message = error instanceof Error ? error.message : "Error al guardar";
      setError(message);
      
      // Fallback a localStorage en caso de error
      try {
        const drafts = this.getDrafts();
        drafts[slug] = {
          content,
          savedAt: new Date().toISOString(),
          slug,
        };
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(drafts));
        console.log(`[EditorService] Fallback: Draft saved to localStorage`);
        setLastSaved(new Date());
      } catch (fallbackError) {
        throw error; // Lanzar el error original
      }
    } finally {
      setSaving(false);
    }
  }

  /**
   * Obtiene un borrador específico
   */
  static getDraft(slug: string): string | null {
    const drafts = this.getDrafts();
    return drafts[slug]?.content || null;
  }

  /**
   * Obtiene todos los borradores
   */
  static getDrafts(): DraftStorage {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error("Error al leer borradores:", error);
      return {};
    }
  }

  /**
   * Obtiene información de un borrador (metadata)
   */
  static getDraftInfo(slug: string): Draft | null {
    const drafts = this.getDrafts();
    return drafts[slug] || null;
  }

  /**
   * Elimina un borrador específico
   */
  static deleteDraft(slug: string): void {
    const drafts = this.getDrafts();
    delete drafts[slug];
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(drafts));
  }

  /**
   * Publica un documento usando API
   */
  static async publishDocument(slug: string, documentId: number): Promise<void> {
    setSaving(true);
    setError(null);

    try {
      if (!this.USE_MOCKS && documentId) {
        // Usar API para publicar
        await documentsApi.publishDocument(documentId);
        console.log(`[EditorService] Document ${documentId} published via API`);
      } else {
        // Simular publicación en modo mocks
        console.log(`[EditorService] Simulating publish for ${slug}`);
      }

      // Eliminar el borrador de localStorage después de publicar
      this.deleteDraft(slug);
      setLastSaved(new Date());
    } catch (error) {
      console.error('[EditorService] publishDocument failed:', error);
      const message = error instanceof Error ? error.message : "Error al publicar";
      setError(message);
      throw error;
    } finally {
      setSaving(false);
    }
  }

  /**
   * Verifica si hay cambios sin guardar
   */
  static hasDraft(slug: string): boolean {
    const draft = this.getDraft(slug);
    return draft !== null && draft.length > 0;
  }

  /**
   * Obtiene la lista de todos los borradores con metadata
   */
  static getAllDrafts(): Draft[] {
    const drafts = this.getDrafts();
    return Object.values(drafts).sort(
      (a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
    );
  }

  /**
   * Limpia borradores antiguos (más de 7 días)
   */
  static cleanOldDrafts(): void {
    const drafts = this.getDrafts();
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    Object.entries(drafts).forEach(([slug, draft]) => {
      if (new Date(draft.savedAt) < sevenDaysAgo) {
        delete drafts[slug];
      }
    });

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(drafts));
  }

  /**
   * Exporta un borrador como archivo .md
   */
  static exportDraft(slug: string, content: string): void {
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${slug}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Obtiene el documento desde la API por slug
   */
  static async getDocumentBySlug(slug: string): Promise<{ id: number; content: string } | null> {
    if (this.USE_MOCKS) {
      // En modo mocks, usar localStorage
      const draft = this.getDraft(slug);
      return draft ? { id: 0, content: draft } : null;
    }

    try {
      const doc = await documentsApi.getDocumentBySlug(slug);
      return { id: doc.id, content: doc.content };
    } catch (error) {
      console.error(`[EditorService] getDocumentBySlug failed:`, error);
      // Fallback a localStorage
      const draft = this.getDraft(slug);
      return draft ? { id: 0, content: draft } : null;
    }
  }

  /**
   * Formatea la fecha del último guardado
   */
  static formatLastSaved(date: Date): string {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return "hace menos de un minuto";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `hace ${minutes} minuto${minutes !== 1 ? "s" : ""}`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `hace ${hours} hora${hours !== 1 ? "s" : ""}`;
    } else {
      return date.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  }
}
