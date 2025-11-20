import { useStore } from '@nanostores/react';
import { ChevronRight, Folder, FolderOpen, File } from 'lucide-react';
import { folderTreeStore, toggleFolder } from '../../stores/folder-tree.store';
import type { FolderNode } from '../../types/folder-tree.types';

interface SidebarItemProps {
  node: FolderNode;
  depth?: number;
  currentSlug?: string;
}

export function SidebarItem({ node, depth = 0, currentSlug }: SidebarItemProps) {
  const { expandedFolders } = useStore(folderTreeStore);
  const isExpanded = expandedFolders[node.path] ?? false;
  const isActive = node.type === 'file' && node.slug === currentSlug;
  const hasChildren = node.children && node.children.length > 0;

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
    return (
      <>
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
          {node.icon && (
            <span className="text-base flex-shrink-0" aria-hidden="true">
              {node.icon}
            </span>
          )}
        </a>
        
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
