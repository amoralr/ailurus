import { map } from "nanostores";

export interface SearchResult {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  highlights: string[];
}

export interface SearchState {
  query: string;
  results: SearchResult[];
  isSearching: boolean;
  hasSearched: boolean;
}

export const searchStore = map<SearchState>({
  query: "",
  results: [],
  isSearching: false,
  hasSearched: false,
});

export function setQuery(query: string) {
  searchStore.setKey("query", query);
}

export function setResults(results: SearchResult[]) {
  searchStore.setKey("results", results);
  searchStore.setKey("hasSearched", true);
}

export function setSearching(value: boolean) {
  searchStore.setKey("isSearching", value);
}

export function resetSearch() {
  searchStore.set({
    query: "",
    results: [],
    isSearching: false,
    hasSearched: false,
  });
}
