import { useEffect } from 'react';

export function SidebarToggle() {
  useEffect(() => {
    const sidebar = document.getElementById('sidebar');
    const toggle = document.getElementById('sidebar-toggle');
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);

    function openSidebar() {
      sidebar?.classList.add('open');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeSidebar() {
      sidebar?.classList.remove('open');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }

    const handleToggle = () => {
      if (sidebar?.classList.contains('open')) {
        closeSidebar();
      } else {
        openSidebar();
      }
    };

    const handleOverlayClick = () => closeSidebar();

    const handleSidebarClick = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' && window.innerWidth < 1024) {
        closeSidebar();
      }
    };

    toggle?.addEventListener('click', handleToggle);
    overlay.addEventListener('click', handleOverlayClick);
    sidebar?.addEventListener('click', handleSidebarClick);

    return () => {
      toggle?.removeEventListener('click', handleToggle);
      overlay.removeEventListener('click', handleOverlayClick);
      sidebar?.removeEventListener('click', handleSidebarClick);
      overlay.remove();
    };
  }, []);

  return (
    <button
      className="sidebar-toggle"
      id="sidebar-toggle"
      aria-label="Toggle sidebar"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M3 12h18M3 6h18M3 18h18" />
      </svg>
    </button>
  );
}
