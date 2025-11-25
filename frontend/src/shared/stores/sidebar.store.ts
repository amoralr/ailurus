import { atom } from 'nanostores';
import type { FolderNode } from '../types/folder-tree.types';
import { foldersApi } from '@/services/api/folders.service';

export const sidebarDataStore = atom<FolderNode[]>([]);
export const sidebarLoadingStore = atom<boolean>(false);
export const sidebarErrorStore = atom<string | null>(null);

/**
 * Refresh sidebar data from API
 */
export async function refreshSidebar() {
  sidebarLoadingStore.set(true);
  sidebarErrorStore.set(null);
  
  try {
    const folders = await foldersApi.getFolderTree();
    sidebarDataStore.set(folders);
    console.log('[Sidebar Store] Refreshed sidebar data:', folders.length, 'root nodes');
  } catch (error) {
    console.error('[Sidebar Store] Failed to refresh sidebar:', error);
    sidebarErrorStore.set(error instanceof Error ? error.message : 'Failed to load sidebar');
  } finally {
    sidebarLoadingStore.set(false);
  }
}

/**
 * Initialize sidebar data
 */
export async function initSidebar(initialData?: FolderNode[]) {
  if (initialData && initialData.length > 0) {
    sidebarDataStore.set(initialData);
    console.log('[Sidebar Store] Initialized with SSR data:', initialData.length, 'root nodes');
  } else {
    await refreshSidebar();
  }
}
