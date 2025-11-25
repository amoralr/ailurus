import { Card } from "@/shared/ui/card";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-muted rounded ${className}`}
      aria-busy="true"
      aria-live="polite"
    />
  );
}

// Skeleton para lista de documentos
export function DocumentListSkeleton() {
  return (
    <div className="space-y-4" role="status" aria-label="Cargando documentos">
      {[1, 2, 3, 4, 5].map((i) => (
        <Card key={i} className="p-4">
          <div className="space-y-3">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <div className="flex gap-2 mt-4">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-24" />
            </div>
          </div>
        </Card>
      ))}
      <span className="sr-only">Cargando documentos...</span>
    </div>
  );
}

// Skeleton para resultados de búsqueda
export function SearchResultsSkeleton() {
  return (
    <div className="space-y-4" role="status" aria-label="Buscando...">
      {[1, 2, 3].map((i) => (
        <div key={i} className="border border-border rounded-lg p-4">
          <div className="flex gap-4">
            <Skeleton className="h-12 w-12 rounded" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
              <div className="flex gap-2 mt-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          </div>
        </div>
      ))}
      <span className="sr-only">Buscando documentos...</span>
    </div>
  );
}

// Skeleton para editor (toolbar + textarea)
export function EditorSkeleton() {
  return (
    <div className="space-y-4" role="status" aria-label="Cargando editor">
      {/* Toolbar Skeleton */}
      <div className="border border-border rounded-lg p-2">
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Skeleton key={i} className="h-9 w-9" />
          ))}
        </div>
      </div>

      {/* Content Area Skeleton */}
      <div className="border border-border rounded-lg p-4">
        <Skeleton className="h-8 w-1/2 mb-4" />
        <Skeleton className="h-96 w-full" />
      </div>

      <span className="sr-only">Cargando editor de Markdown...</span>
    </div>
  );
}

// Skeleton para documento individual
export function DocumentViewSkeleton() {
  return (
    <article className="prose prose-neutral dark:prose-invert max-w-none" role="status" aria-label="Cargando documento">
      <Skeleton className="h-10 w-3/4 mb-4" />
      <Skeleton className="h-4 w-1/3 mb-8" />
      
      <div className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        
        <Skeleton className="h-8 w-1/2 mt-8 mb-4" />
        
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        
        <Skeleton className="h-32 w-full mt-6" />
        
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>

      <span className="sr-only">Cargando contenido del documento...</span>
    </article>
  );
}

// Skeleton compacto para navegación/sidebar
export function NavItemSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-2" role="status" aria-label="Cargando navegación">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-8 w-full" />
      ))}
      <span className="sr-only">Cargando menú de navegación...</span>
    </div>
  );
}
