/**
 * Hierarchical folder/file structure types
 * Supports Obsidian-style nested navigation: Equipo > Proyecto > Files
 */

export type NodeType = 'folder' | 'file';

export interface FolderNode {
  /** Unique identifier */
  id: string;
  
  /** Display name */
  name: string;
  
  /** Node type: folder or file */
  type: NodeType;
  
  /** Optional emoji icon */
  icon?: string;
  
  /** For files: slug to navigate to */
  slug?: string;
  
  /** For folders: nested children */
  children?: FolderNode[];
  
  /** Full hierarchical path (e.g., 'Equipo/Proyecto/Frontend') */
  path: string;
  
  /** Order/priority for sorting */
  order?: number;
  
  /** Badge count (e.g., number of docs in category) */
  count?: number;
}

export interface FolderTreeState {
  /** Map of folder paths to their expanded state */
  expandedFolders: Record<string, boolean>;
}
