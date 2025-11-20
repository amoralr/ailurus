import { useStore } from "@nanostores/react";
import { searchStore } from "../stores/search.store";
import { Badge } from "@/components/ui/badge";
import { FileText, Search } from "lucide-react";
import { SearchResultsSkeleton } from "@/components/ui/skeleton";

export function SearchResults() {
  const state = useStore(searchStore);

  // No mostrar nada si no se ha buscado
  if (!state.hasSearched) {
    return (
      <div className="search-results-empty">
        <Search className="empty-icon" size={48} />
        <h3>Busca en la documentación</h3>
        <p>Escribe un término para comenzar la búsqueda</p>
      </div>
    );
  }

  // Loading state with skeleton
  if (state.isSearching) {
    return <SearchResultsSkeleton />;
  }

  // Sin resultados
  if (state.results.length === 0) {
    return (
      <div className="search-results-empty">
        <Search className="empty-icon" size={48} />
        <h3>No se encontraron resultados</h3>
        <p>
          No hay documentos que coincidan con{" "}
          <strong>"{state.query}"</strong>
        </p>
        <p className="suggestion">
          Intenta con otros términos o navega por las{" "}
          <a href="/docs">categorías</a>
        </p>
      </div>
    );
  }

  // Mostrar resultados
  return (
    <div className="search-results">
      <div className="results-header">
        <h2>
          {state.results.length} resultado{state.results.length !== 1 ? "s" : ""}{" "}
          para <strong>"{state.query}"</strong>
        </h2>
      </div>

      <div className="results-list">
        {state.results.map((result) => (
          <a
            key={result.id}
            href={`/docs/${result.slug}`}
            className="result-item"
          >
            <div className="result-icon">
              <FileText size={20} />
            </div>

            <div className="result-content">
              <div className="result-header">
                <h3
                  className="result-title"
                  dangerouslySetInnerHTML={{ __html: result.title }}
                />
                <Badge variant="secondary" className="result-badge">
                  {result.category}
                </Badge>
              </div>

              <p
                className="result-excerpt"
                dangerouslySetInnerHTML={{ __html: result.excerpt }}
              />

              {result.highlights.length > 0 && (
                <div className="result-highlights">
                  <span className="highlights-label">También en:</span>
                  {result.highlights.map((highlight, i) => (
                    <span key={i} className="highlight-item">
                      {highlight}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
