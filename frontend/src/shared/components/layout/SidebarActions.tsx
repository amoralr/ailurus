import { FilePlus, FolderPlus, Settings, Search } from 'lucide-react';

interface ActionButton {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  label: string;
}

const DEFAULT_ACTIONS: ActionButton[] = [
  {
    href: '/docs/new',
    icon: FilePlus,
    title: 'Nuevo documento',
    label: 'Crear nuevo documento',
  },
  {
    href: '/admin/categories',
    icon: FolderPlus,
    title: 'Gestionar categorías',
    label: 'Gestionar categorías',
  },
  {
    href: '/search',
    icon: Search,
    title: 'Buscar',
    label: 'Buscar documentos',
  },
  {
    href: '/admin',
    icon: Settings,
    title: 'Configuración',
    label: 'Configuración del sistema',
  },
];

interface SidebarActionsProps {
  actions?: ActionButton[];
}

export function SidebarActions({ actions = DEFAULT_ACTIONS }: SidebarActionsProps) {
  return (
    <div className="sidebar-actions">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <a
            key={action.href}
            href={action.href}
            className="sidebar-action-btn"
            title={action.title}
            aria-label={action.label}
          >
            <Icon className="w-4 h-4" />
          </a>
        );
      })}
    </div>
  );
}
