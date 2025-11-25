import { useStore } from '@nanostores/react';
import { useEffect, useState } from 'react';
import { ChevronRight, Folder, FolderOpen, File, Trash2, Edit2, MoreHorizontal } from 'lucide-react';
import { folderTreeStore, toggleFolder } from '../../stores/folder-tree.store';
import type { FolderNode } from '../../types/folder-tree.types';

interface SidebarItemProps {
  node: FolderNode;
  depth?: number;
  currentSlug?: string;
}

export function SidebarItem({ node, depth = 0, currentSlug }: SidebarItemProps) {
  const [isHydrated, setIsHydrated] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const { expandedFolders } = useStore(folderTreeStore);
  // During SSR and initial render, start collapsed to match server HTML
  const isExpanded = isHydrated ? (expandedFolders[node.path] ?? false) : false;
  const isActive = node.type === 'file' && node.slug === currentSlug;
  const hasChildren = node.children && node.children.length > 0;
  
  // Initialize client-side state after hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    if (node.type === 'folder') {
      e.preventDefault();
      toggleFolder(node.path);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (node.type === 'folder') {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleFolder(node.path);
      } else if (e.key === 'ArrowRight' && !isExpanded) {
        e.preventDefault();
        toggleFolder(node.path);
      } else if (e.key === 'ArrowLeft' && isExpanded) {
        e.preventDefault();
        toggleFolder(node.path);
      }
    }
  };

  // Calculate indentation based on depth
  const paddingLeft = `${depth * 1.25 + 0.75}rem`;

  // Choose icon based on node type and state
  const Icon = node.type === 'folder' 
    ? (isExpanded ? FolderOpen : Folder)
    : File;

  const iconColor = node.type === 'folder'
    ? 'text-ailurus-orange/80'
    : 'text-slate-500 dark:text-slate-400';

  if (node.type === 'file') {
    const isDraft = node.status === 'DRAFT';
    
    return (
      <>
        <div 
          className="relative"
          onMouseEnter={() => setShowActions(true)}
          onMouseLeave={() => setShowActions(false)}
        >
          <a
            href={`/docs/${node.slug}`}
            className={`
              group flex items-center gap-2 py-2 px-3 text-sm
              transition-all duration-200 rounded-md
              hover:bg-slate-100 dark:hover:bg-slate-800/50
              focus-visible:outline-none focus-visible:ring-2 
              focus-visible:ring-ailurus-orange/50
              ${isActive 
                ? 'bg-ailurus-orange/10 text-ailurus-orange font-medium border-l-2 border-ailurus-orange' 
                : isDraft
                ? 'text-slate-500 dark:text-slate-400 italic'
                : 'text-slate-700 dark:text-slate-300'
              }
            `}
            style={{ paddingLeft }}
            aria-current={isActive ? 'page' : undefined}
          >
            <Icon 
              className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-ailurus-orange' : iconColor}`} 
              aria-hidden="true"
            />
            <span className="flex-1 truncate">{node.name}</span>
            {isDraft && (
              <span 
                className="px-1.5 py-0.5 text-xs font-medium rounded bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                aria-label="Draft document"
              >
                DRAFT
              </span>
            )}
            {node.icon && (
              <span className="text-base flex-shrink-0" aria-hidden="true">
                {node.icon}
              </span>
            )}
          </a>
          
          {/* Hover Actions */}
          {showActions && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1 bg-background/95 backdrop-blur-sm px-1 rounded-md shadow-sm border border-border">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = `/docs/edit/${node.slug}`;
                }}
                className="p-1 hover:bg-primary/10 rounded transition-colors"
                title="Editar documento"
                aria-label="Editar documento"
              >
                <Edit2 className="w-3.5 h-3.5 text-muted-foreground hover:text-primary" />
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  if (confirm(`¿Eliminar "${node.name}"?`)) {
                    console.log('Delete document:', node.id);
                    // TODO: Implement delete functionality
                  }
                }}
                className="p-1 hover:bg-destructive/10 rounded transition-colors"
                title="Eliminar documento"
                aria-label="Eliminar documento"
              >
                <Trash2 className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" />
              </button>
            </div>
          )}
        </div>
        
        {/* Recursively render children */}
        {hasChildren && isExpanded && (
          <div role="group" aria-label={`${node.name} documents`}>
            {node.children!.map((child) => (
              <SidebarItem
                key={child.id}
                node={child}
                depth={depth + 1}
                currentSlug={currentSlug}
              />
            ))}
          </div>
        )}
      </>
    );
  }

  // Folder rendering
  return (
    <>
      <div 
        className="relative"
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        <button
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          className={`
            group flex items-center gap-2 py-2 px-3 text-sm w-full text-left
            transition-all duration-200 rounded-md
            hover:bg-slate-100 dark:hover:bg-slate-800/50
            focus-visible:outline-none focus-visible:ring-2 
            focus-visible:ring-ailurus-orange/50
            text-slate-700 dark:text-slate-300 font-medium
          `}
          style={{ paddingLeft }}
          aria-expanded={isExpanded}
          aria-controls={`folder-${node.id}`}
        >
          <ChevronRight
            className={`
              w-4 h-4 flex-shrink-0 transition-transform duration-200
              text-slate-400 dark:text-slate-500
              ${isExpanded ? 'rotate-90' : ''}
            `}
            aria-hidden="true"
          />
          <Icon 
            className={`w-4 h-4 flex-shrink-0 ${iconColor}`}
            aria-hidden="true"
          />
          <span className="flex-1 truncate">{node.name}</span>
          {node.icon && (
            <span className="text-base flex-shrink-0" aria-hidden="true">
              {node.icon}
            </span>
          )}
          {node.count !== undefined && (
            <span 
              className="px-1.5 py-0.5 text-xs font-medium rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
              aria-label={`${node.count} documents`}
            >
              {node.count}
            </span>
          )}
        </button>
        
        {/* Hover Actions for Folders */}
        {showActions && depth > 0 && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1 bg-background/95 backdrop-blur-sm px-1 rounded-md shadow-sm border border-border">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('More options for folder:', node.id);
                // TODO: Implement folder options menu
              }}
              className="p-1 hover:bg-muted rounded transition-colors"
              title="Más opciones"
              aria-label="Más opciones"
            >
              <MoreHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          </div>
        )}
      </div>

      {/* Recursively render children when expanded */}
      {hasChildren && isExpanded && (
        <div 
          id={`folder-${node.id}`}
          role="group" 
          aria-label={`${node.name} contents`}
        >
          {node.children!.map((child) => (
            <SidebarItem
              key={child.id}
              node={child}
              depth={depth + 1}
              currentSlug={currentSlug}
            />
          ))}
        </div>
      )}
    </>
  );
}
