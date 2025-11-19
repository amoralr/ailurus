import { MOCK_DOCUMENTS } from "@/mocks";
import type { SearchResult } from "../stores/search.store";

export class SearchService {
  /**
   * Busca documentos que coincidan con la query
   * @param query - Término de búsqueda
   * @returns Array de resultados con excerpts destacados
   */
  static search(query: string): SearchResult[] {
    if (!query || query.trim().length < 2) {
      return [];
    }

    const lowerQuery = query.toLowerCase().trim();
    const queryWords = lowerQuery.split(/\s+/);

    return MOCK_DOCUMENTS.filter((doc) => {
      // Solo buscar en documentos publicados
      if (doc.status !== "published") return false;

      const titleMatch = doc.title.toLowerCase().includes(lowerQuery);
      const contentMatch = doc.content.toLowerCase().includes(lowerQuery);
      const excerptMatch = doc.excerpt?.toLowerCase().includes(lowerQuery);

      return titleMatch || contentMatch || excerptMatch;
    })
      .map((doc) => {
        // Encontrar el mejor excerpt con el término
        const excerpt = this.findBestExcerpt(doc.content, queryWords);
        const highlights = this.findHighlights(doc, queryWords);

        return {
          id: doc.id,
          slug: doc.slug,
          title: this.highlightText(doc.title, queryWords),
          excerpt: this.highlightText(excerpt, queryWords),
          category: doc.category,
          highlights,
        };
      })
      .sort((a, b) => {
        // Priorizar coincidencias en el título
        const aInTitle = a.title.includes("<mark>");
        const bInTitle = b.title.includes("<mark>");
        if (aInTitle && !bInTitle) return -1;
        if (!aInTitle && bInTitle) return 1;
        return 0;
      });
  }

  /**
   * Encuentra el mejor fragmento de texto que contiene la query
   */
  private static findBestExcerpt(
    content: string,
    queryWords: string[]
  ): string {
    const lowerContent = content.toLowerCase();

    // Buscar la primera ocurrencia de cualquier palabra de búsqueda
    let firstIndex = -1;
    for (const word of queryWords) {
      const index = lowerContent.indexOf(word);
      if (index !== -1 && (firstIndex === -1 || index < firstIndex)) {
        firstIndex = index;
      }
    }

    if (firstIndex === -1) {
      return content.slice(0, 200) + "...";
    }

    // Extraer contexto alrededor de la coincidencia
    const start = Math.max(0, firstIndex - 80);
    const end = Math.min(content.length, firstIndex + 120);
    let excerpt = content.slice(start, end);

    // Agregar ellipsis si es necesario
    if (start > 0) excerpt = "..." + excerpt;
    if (end < content.length) excerpt = excerpt + "...";

    return excerpt;
  }

  /**
   * Resalta términos de búsqueda en el texto
   */
  private static highlightText(text: string, queryWords: string[]): string {
    let result = text;

    for (const word of queryWords) {
      const regex = new RegExp(`(${this.escapeRegex(word)})`, "gi");
      result = result.replace(regex, "<mark>$1</mark>");
    }

    return result;
  }

  /**
   * Encuentra todas las ocurrencias destacables del término
   */
  private static findHighlights(
    doc: any,
    queryWords: string[]
  ): string[] {
    const highlights: string[] = [];
    const lowerContent = doc.content.toLowerCase();

    // Buscar en secciones (headings)
    const headingRegex = /^#{1,6}\s+(.+)$/gm;
    let match;

    while ((match = headingRegex.exec(doc.content)) !== null) {
      const heading = match[1];
      const lowerHeading = heading.toLowerCase();

      if (queryWords.some((word) => lowerHeading.includes(word))) {
        highlights.push(heading);
      }
    }

    return highlights.slice(0, 3); // Máximo 3 highlights
  }

  /**
   * Escapa caracteres especiales para regex
   */
  private static escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  /**
   * Obtiene sugerencias de búsqueda basadas en documentos
   */
  static getSuggestions(query: string): string[] {
    if (!query || query.length < 2) return [];

    const lowerQuery = query.toLowerCase();
    const suggestions = new Set<string>();

    MOCK_DOCUMENTS.forEach((doc) => {
      // Sugerir títulos que comiencen con la query
      if (doc.title.toLowerCase().startsWith(lowerQuery)) {
        suggestions.add(doc.title);
      }

      // Sugerir categorías
      if (doc.category.toLowerCase().includes(lowerQuery)) {
        suggestions.add(doc.category);
      }
    });

    return Array.from(suggestions).slice(0, 5);
  }
}
