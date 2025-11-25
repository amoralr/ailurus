import { useState, useEffect, useRef } from "react";
import { useStore } from "@nanostores/react";
import {
  searchStore,
  setQuery,
  setResults,
  setSearching,
} from "../stores/search.store";
import { SearchService } from "../services/search.service";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  placeholder?: string;
  autoFocus?: boolean;
  className?: string;
  onSearch?: (query: string) => void;
}

export function SearchBar({
  placeholder = "Buscar documentación...",
  autoFocus = false,
  className = "",
  onSearch,
}: SearchBarProps) {
  const state = useStore(searchStore);
  const [input, setInput] = useState(state.query);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sincronizar input con store
  useEffect(() => {
    setInput(state.query);
  }, [state.query]);

  // Debounce para búsqueda automática
  useEffect(() => {
    if (input === state.query) return;

    const timer = setTimeout(() => {
      performSearch(input);
    }, 300);

    return () => clearTimeout(timer);
  }, [input]);

  const performSearch = async (query: string) => {
    setQuery(query);
    setSearching(true);

    try {
      const { results, total } = await SearchService.search(query, 20, 0);
      setResults(results, total, 0);
      setSearching(false);

      // Callback opcional
      if (onSearch) {
        onSearch(query);
      }
    } catch (error) {
      console.error("[SearchBar] Search failed:", error);
      setResults([], 0, 0);
      setSearching(false);
    }
  };

  const handleClear = () => {
    setInput("");
    setQuery("");
    setResults([], 0, 0);
    inputRef.current?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      performSearch(input);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`search-bar ${className}`}>
      <div className="search-bar-container">
        <Search className="search-icon" size={20} />
        
        <input
          ref={inputRef}
          type="search"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="search-input"
        />

        {input && (
          <button
            type="button"
            onClick={handleClear}
            className="clear-button"
            aria-label="Limpiar búsqueda"
          >
            <X size={16} />
          </button>
        )}

        {state.isSearching && (
          <div className="search-spinner" aria-live="polite">
            <div className="spinner"></div>
          </div>
        )}
      </div>
    </form>
  );
}
