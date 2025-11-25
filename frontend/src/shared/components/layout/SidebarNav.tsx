import { SidebarItem } from './SidebarItem';
import type { FolderNode } from '../../types/folder-tree.types';

interface SidebarNavProps {
  items: FolderNode[];
  currentSlug?: string;
}

export function SidebarNav({ items, currentSlug }: SidebarNavProps) {
  return (
    <nav
      className="sidebar-nav"
      role="navigation"
      aria-label="Documentation navigation"
    >
      {items.map((rootNode) => (
        <SidebarItem
          key={rootNode.id}
          node={rootNode}
          depth={0}
          currentSlug={currentSlug}
        />
      ))}
    </nav>
  );
}
