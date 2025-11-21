/**
 * Response DTO for folder tree nodes
 * Transforms Prisma entities to frontend-compatible format
 */

export interface FolderNodeResponseDto {
  /** Unique identifier (as string for frontend compatibility) */
  id: string;

  /** Display name */
  name: string;

  /** Node type: folder or file */
  type: 'folder' | 'file';

  /** Optional emoji icon */
  icon?: string | null;

  /** For files: slug to navigate to */
  slug?: string;

  /** For folders: nested children */
  children?: FolderNodeResponseDto[];

  /** Full hierarchical path */
  path: string;

  /** Order/priority for sorting */
  order?: number;

  /** Badge count (e.g., number of docs in category) */
  count?: number;
}
