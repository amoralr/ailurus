import { useEffect } from 'react';
import mermaid from 'mermaid';

/**
 * Componente para inicializar Mermaid y renderizar diagramas
 * Se ejecuta del lado del cliente para procesar bloques con clase "mermaid"
 */
export function MermaidInit() {
  useEffect(() => {
    // Configurar Mermaid
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose',
      fontFamily: 'Inter, system-ui, sans-serif',
      logLevel: 'error',
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
        curve: 'basis',
      },
      sequence: {
        useMaxWidth: true,
        wrap: true,
      },
      gantt: {
        useMaxWidth: true,
      },
    });

    // Función para renderizar diagramas
    const renderMermaidDiagrams = async () => {
      const mermaidElements = document.querySelectorAll('.mermaid');
      
      if (mermaidElements.length === 0) return;

      console.log(`[Mermaid] Found ${mermaidElements.length} diagram(s) to render`);

      // Renderizar cada diagrama
      for (let i = 0; i < mermaidElements.length; i++) {
        const element = mermaidElements[i] as HTMLElement;
        
        // Skip si ya fue renderizado
        if (element.getAttribute('data-processed') === 'true') {
          continue;
        }

        const graphDefinition = element.textContent || '';
        
        try {
          // Generar ID único para el diagrama
          const id = `mermaid-diagram-${Date.now()}-${i}`;
          
          // Renderizar con Mermaid
          const { svg } = await mermaid.render(id, graphDefinition);
          
          // Reemplazar contenido con SVG
          element.innerHTML = svg;
          element.setAttribute('data-processed', 'true');
          
          console.log(`[Mermaid] Rendered diagram ${i + 1}`);
        } catch (error) {
          console.error(`[Mermaid] Error rendering diagram ${i + 1}:`, error);
          
          // Mostrar error en el diagrama
          element.innerHTML = `
            <div class="mermaid-error">
              <div class="mermaid-error-icon">⚠️</div>
              <div class="mermaid-error-title">Error en diagrama Mermaid</div>
              <pre class="mermaid-error-details">${error instanceof Error ? error.message : 'Error desconocido'}</pre>
            </div>
          `;
          element.setAttribute('data-processed', 'true');
        }
      }
    };

    // Renderizar diagramas cuando el componente se monta
    renderMermaidDiagrams();

    // Observer para detectar nuevos diagramas añadidos dinámicamente
    const observer = new MutationObserver((mutations) => {
      let hasNewMermaid = false;
      
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            if (node.classList?.contains('mermaid') || node.querySelector('.mermaid')) {
              hasNewMermaid = true;
            }
          }
        });
      });

      if (hasNewMermaid) {
        renderMermaidDiagrams();
      }
    });

    // Observar cambios en el contenedor de markdown
    const markdownContent = document.querySelector('.markdown-content');
    if (markdownContent) {
      observer.observe(markdownContent, {
        childList: true,
        subtree: true,
      });
    }

    // Cleanup
    return () => {
      observer.disconnect();
    };
  }, []);

  return null; // Este componente no renderiza nada visible
}
