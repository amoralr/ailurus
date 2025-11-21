import { atom } from 'nanostores';
import type { FolderTreeState } from '../types/folder-tree.types';

/**
 * Nanostores for sidebar folder tree state management
 * Persists expanded/collapsed state in localStorage
 */

// Save state to localStorage
const saveExpandedFolders = (state: Record<string, boolean>) => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('ailurus:sidebar:expanded', JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save sidebar state:', error);
  }
};

// Load initial state from localStorage (client-side only)
const loadInitialState = (): Record<string, boolean> => {
  if (typeof window === 'undefined') return {};
  
  try {
    const stored = localStorage.getItem('ailurus:sidebar:expanded');
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Failed to load sidebar state:', error);
    return {};
  }
};

// Atom for folder tree state
export const folderTreeStore = atom<FolderTreeState>({
  expandedFolders: loadInitialState(),
});

/**
 * Toggle folder expanded state
 */
export const toggleFolder = (path: string) => {
  const current = folderTreeStore.get();
  const newExpanded = {
    ...current.expandedFolders,
    [path]: !current.expandedFolders[path],
  };
  
  folderTreeStore.set({ expandedFolders: newExpanded });
  saveExpandedFolders(newExpanded);
};

/**
 * Expand a specific folder
 */
export const expandFolder = (path: string) => {
  const current = folderTreeStore.get();
  if (current.expandedFolders[path]) return; // Already expanded
  
  const newExpanded = {
    ...current.expandedFolders,
    [path]: true,
  };
  
  folderTreeStore.set({ expandedFolders: newExpanded });
  saveExpandedFolders(newExpanded);
};

/**
 * Collapse a specific folder
 */
export const collapseFolder = (path: string) => {
  const current = folderTreeStore.get();
  if (!current.expandedFolders[path]) return; // Already collapsed
  
  const newExpanded = {
    ...current.expandedFolders,
    [path]: false,
  };
  
  folderTreeStore.set({ expandedFolders: newExpanded });
  saveExpandedFolders(newExpanded);
};

/**
 * Expand all parent folders of a given path
 * Useful for navigating to a deep document
 */
export const expandParentsOf = (path: string) => {
  const current = folderTreeStore.get();
  const newExpanded = { ...current.expandedFolders };
  
  // Get all parent paths
  const parts = path.split('/');
  for (let i = 1; i < parts.length; i++) {
    const parentPath = parts.slice(0, i).join('/');
    newExpanded[parentPath] = true;
  }
  
  folderTreeStore.set({ expandedFolders: newExpanded });
  saveExpandedFolders(newExpanded);
};

/**
 * Collapse all folders
 */
export const collapseAll = () => {
  folderTreeStore.set({ expandedFolders: {} });
  saveExpandedFolders({});
};

/**
 * Check if a folder is expanded
 */
export const isFolderExpanded = (path: string): boolean => {
  const current = folderTreeStore.get();
  return current.expandedFolders[path] ?? false;
};
