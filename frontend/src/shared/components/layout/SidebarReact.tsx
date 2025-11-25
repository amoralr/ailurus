import { useStore } from '@nanostores/react';
import { useEffect } from 'react';
import { sidebarDataStore, initSidebar } from '../../stores/sidebar.store';
import { SidebarHeader } from './SidebarHeader';
import { SidebarActions } from './SidebarActions';
import { SidebarNav } from './SidebarNav';
import type { FolderNode } from '../../types/folder-tree.types';
import './sidebar.css';

interface SidebarReactProps {
  initialData: FolderNode[];
  currentSlug?: string;
}

export function SidebarReact({ initialData, currentSlug }: SidebarReactProps) {
  const folders = useStore(sidebarDataStore);

  useEffect(() => {
    // Initialize sidebar with SSR data
    initSidebar(initialData);

    // Set up event listener for sidebar refresh events
    const handleRefreshSidebar = async () => {
      console.log('[SidebarReact] Received refresh event, reloading data...');
      // Wait a bit for backend to finish processing
      await new Promise(resolve => setTimeout(resolve, 300));
      await initSidebar();
    };

    window.addEventListener('sidebar:refresh', handleRefreshSidebar);

    return () => {
      window.removeEventListener('sidebar:refresh', handleRefreshSidebar);
    };
  }, [initialData]);

  // Use store data if available, otherwise fall back to initial SSR data
  const displayData = folders.length > 0 ? folders : initialData;

  return (
    <aside className="sidebar" id="sidebar">
      <div className="sidebar-header">
        <SidebarHeader />
        <SidebarActions />
      </div>

      <SidebarNav items={displayData} currentSlug={currentSlug} />
    </aside>
  );
}
