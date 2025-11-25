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
  hasMore: boolean;
  total: number;
  offset: number;
  isLoadingMore: boolean;
}

export const searchStore = map<SearchState>({
  query: "",
  results: [],
  isSearching: false,
  hasSearched: false,
  hasMore: false,
  total: 0,
  offset: 0,
  isLoadingMore: false,
});

export function setQuery(query: string) {
  searchStore.setKey("query", query);
}

export function setResults(results: SearchResult[], total: number, offset: number) {
  searchStore.setKey("results", results);
  searchStore.setKey("hasSearched", true);
  searchStore.setKey("total", total);
  searchStore.setKey("offset", offset);
  searchStore.setKey("hasMore", results.length + offset < total);
}

export function appendResults(results: SearchResult[], total: number, offset: number) {
  const current = searchStore.get().results;
  searchStore.setKey("results", [...current, ...results]);
  searchStore.setKey("offset", offset);
  searchStore.setKey("hasMore", current.length + results.length < total);
}

export function setSearching(value: boolean) {
  searchStore.setKey("isSearching", value);
}

export function setLoadingMore(value: boolean) {
  searchStore.setKey("isLoadingMore", value);
}

export function resetSearch() {
  searchStore.set({
    query: "",
    results: [],
    isSearching: false,
    hasSearched: false,
    hasMore: false,
    total: 0,
    offset: 0,
    isLoadingMore: false,
  });
}
