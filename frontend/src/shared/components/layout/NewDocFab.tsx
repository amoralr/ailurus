import { useEffect, useState } from "react";
import { Plus, Edit, X, FileText } from "lucide-react";

/**
 * Floating Action Button (FAB) estilo Speed Dial
 * - Al hacer clic se expanden botones alrededor
 * - Se adapta a la página actual
 */
export function NewDocFab() {
  const [isVisible, setIsVisible] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [editUrl, setEditUrl] = useState("");
  const [isOnDocPage, setIsOnDocPage] = useState(false);

  useEffect(() => {
    const checkPath = () => {
      const path = window.location.pathname;

      // Ocultar en páginas de edición y creación
      if (path.includes("/docs/edit") || path.includes("/docs/new")) {
        setIsVisible(false);
        return;
      }

      setIsVisible(true);

      // Detectar si estamos en una página de documento
      if (path.startsWith("/docs/") && path !== "/docs" && path !== "/docs/") {
        const slug = path.replace("/docs/", "");
        setEditUrl(`/docs/edit/${slug}`);
        setIsOnDocPage(true);
      } else {
        setIsOnDocPage(false);
      }
    };

    checkPath();

    const handleNavigation = () => {
      checkPath();
      setIsOpen(false);
    };

    window.addEventListener("popstate", handleNavigation);
    document.addEventListener("astro:page-load", handleNavigation);

    return () => {
      window.removeEventListener("popstate", handleNavigation);
      document.removeEventListener("astro:page-load", handleNavigation);
    };
  }, []);

  if (!isVisible) return null;

  const actions = [
    ...(isOnDocPage && editUrl
      ? [
          {
            icon: <Edit size={20} />,
            label: "Editar",
            href: editUrl,
            color: "hsl(var(--accent))",
          },
        ]
      : []),
    {
      icon: <Plus size={20} />,
      label: "Nuevo",
      href: "/docs/new",
      color: "hsl(var(--primary))",
    },
    {
      icon: <FileText size={20} />,
      label: "Docs",
      href: "/docs",
      color: "hsl(var(--secondary))",
    },
  ];

  return (
    <>
      {/* Overlay para cerrar al hacer clic fuera */}
      {isOpen && (
        <div
          className="fab-overlay"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Botones de acciones */}
      <div className="fab-container">
        {actions.map((action, index) => (
          <a
            key={index}
            href={action.href}
            className={`fab-action ${isOpen ? "fab-action-visible" : ""}`}
            style={{
              transitionDelay: `${index * 50}ms`,
              transform: isOpen
                ? `translateY(-${(index + 1) * 70}px) scale(1)`
                : "translateY(0) scale(0)",
            }}
            title={action.label}
            aria-label={action.label}
          >
            {action.icon}
            <span className="fab-label">{action.label}</span>
          </a>
        ))}

        {/* Botón principal */}
        <button
          className={`new-doc-fab ${isOpen ? "fab-open" : ""}`}
          onClick={() => setIsOpen(!isOpen)}
          title={isOpen ? "Cerrar menú" : "Acciones rápidas"}
          aria-label={isOpen ? "Cerrar menú" : "Menú de acciones rápidas"}
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={24} /> : <Plus size={24} />}
        </button>
      </div>
    </>
  );
}
