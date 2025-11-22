# 🎨 Frontend Architecture - Astro + React

**Framework**: Astro 5.15.9 + React 19.2.0  
**Versión**: v0.5  
**Última actualización**: Noviembre 2025

---

## 📋 VISIÓN GENERAL

Aplicación de documentación renderizada por servidor (SSR) con Astro, optimizada para SEO y performance. Utiliza Islands Architecture para interactividad selectiva con React.

### Stack Tecnológico

- **Framework**: Astro 5.15.9 (SSR)
- **UI Library**: React 19.2.0 (islands)
- **Styling**: Tailwind CSS + shadcn/ui
- **State**: Nanostores 0.11.3
- **Markdown**: marked.js + Shiki
- **TypeScript**: 5.x

### Características Principales

- 🚀 SSR para carga inicial rápida y SEO
- 🏝️ Islands Architecture para interactividad selectiva
- 🗂️ Navegación jerárquica recursiva (Obsidian-style)
- 📝 Editor Markdown con auto-save
- 🔍 Búsqueda en tiempo real
- 🖼️ Sistema de imágenes con lightbox
- 🎨 Dark mode con persistencia
- ♿ Accesibilidad WCAG 2.2 AA
- 📱 Responsive design mobile-first

---

## 🗂️ ESTRUCTURA DE CARPETAS

**Implementación**: `frontend/src/`

```
src/
├── components/ui/     # 15 shadcn/ui components
├── documents/         # DocumentList, NewDocumentForm
├── editor/            # MarkdownEditor
├── layouts/           # Layout, DocsLayout, EditorLayout
├── markdown/          # MarkdownRenderer, ImageLightbox
├── mocks/             # documents.mock.ts, folders.mock.ts
├── pages/             # 18 páginas Astro
├── search/            # SearchBar, SearchResults
├── services/          # API services
├── shared/            # components, stores, types, utils
├── styles/            # CSS global
└── lib/               # Utilities
```

**Totales**:
- 22 componentes React (.tsx)
- 18 páginas Astro (.astro)
- 12 carpetas principales
- 15 componentes shadcn/ui instalados

---

## 🏗️ ISLANDS ARCHITECTURE

```mermaid
graph TD
    A[Astro Page SSR] --> B[Static HTML]
    A --> C[React Island 1: SearchBar]
    A --> D[React Island 2: SidebarItem]
    A --> E[React Island 3: ThemeToggle]
    A --> F[React Island 4: ImageLightbox]
    
    B --> G[Browser]
    C --> G
    D --> G
    E --> G
    F --> G
    
    C -.->|Nanostores| H[search.store.ts]
    D -.->|Nanostores| I[folder-tree.store.ts]
    E -.->|Nanostores| J[theme.store.ts]
```

**Concepto**: Astro renderiza HTML estático en el servidor. Solo los componentes que requieren interactividad (islands) se hidratan como React en el cliente, reduciendo el JavaScript enviado al navegador.

---

## 📦 COMPONENTES PRINCIPALES

### Tabla de Componentes shadcn/ui (15 instalados)

| Componente | Ubicación | Uso Principal |
|------------|-----------|---------------|
| Badge | `components/ui/badge.tsx` | Etiquetas de categorías |
| Button | `components/ui/button.tsx` | Acciones principales |
| Card | `components/ui/card.tsx` | Cards de documentos |
| Dialog | `components/ui/dialog.tsx` | Modales (lightbox, forms) |
| Dropdown Menu | `components/ui/dropdown-menu.tsx` | Menús contextuales |
| Input | `components/ui/input.tsx` | Campos de formulario |
| Label | `components/ui/label.tsx` | Labels accesibles |
| Select | `components/ui/select.tsx` | Selectores |
| Separator | `components/ui/separator.tsx` | Separadores visuales |
| Skeleton | `components/ui/skeleton.tsx` | Loading states |
| Tabs | `components/ui/tabs.tsx` | Pestañas |
| Textarea | `components/ui/textarea.tsx` | Editor de texto |
| Toast | `components/ui/toast.tsx` | Notificaciones |
| Toaster | `components/ui/toaster.tsx` | Contenedor de toasts |
| Tooltip | `components/ui/tooltip.tsx` | Tooltips informativos |

### Tabla de Componentes Custom

| Componente | Archivo | Líneas | Descripción |
|------------|---------|--------|-------------|
| SidebarItem | `shared/components/layout/SidebarItem.tsx` | 174 | Navegación recursiva |
| ImageLightbox | `markdown/components/ImageLightbox.tsx` | ~100 | Modal de imágenes |
| MarkdownEditor | `editor/components/MarkdownEditor.tsx` | ~150 | Editor con preview |
| SearchBar | `search/components/SearchBar.tsx` | ~80 | Búsqueda en tiempo real |
| SearchResults | `search/components/SearchResults.tsx` | ~120 | Lista de resultados |
| ThemeToggle | `shared/components/layout/ThemeToggle.tsx` | ~60 | Toggle dark mode |

---

## 🗂️ NAVEGACIÓN JERÁRQUICA

### Componente: SidebarItem.tsx

**Implementación**: `frontend/src/shared/components/layout/SidebarItem.tsx` (174 líneas)

**Características**:
- Renderizado recursivo de niveles ilimitados
- Gestión de estado de expansión con Nanostores
- Soporte completo de teclado (Enter, Space, flechas)
- Etiquetas ARIA para accesibilidad
- Iconos emoji para categorías
- Indicador de conteo de children

### Flujo de Renderizado Recursivo

```mermaid
flowchart TD
    A[SidebarItem recibe node] --> B{¿Tipo de nodo?}
    B -->|folder| C[Renderizar botón con chevron]
    B -->|file| D[Renderizar link a documento]
    
    C --> E{¿Tiene children?}
    E -->|Sí| F{¿Está expandido?}
    E -->|No| Z[Fin]
    
    F -->|Sí| G[Mapear children]
    F -->|No| Z
    
    G --> H[Para cada child]
    H --> I[Renderizar SidebarItem recursivo]
    I --> J{¿Más children?}
    J -->|Sí| H
    J -->|No| Z
    
    D --> Z
```

### Store: folder-tree.store.ts

**Implementación**: `frontend/src/shared/stores/folder-tree.store.ts`

```mermaid
graph LR
    subgraph "Nanostores Atom"
        S1[expandedFolders: Record string boolean]
    end
    
    subgraph "Actions"
        A1[toggleFolder path]
        A2[expandFolder path]
        A3[collapseFolder path]
    end
    
    A1 --> S1
    A2 --> S1
    A3 --> S1
    
    S1 -.->|reactivo| C[SidebarItem components]
```

**Funcionalidad**: Gestiona qué folders están expandidos usando un objeto con paths como keys y booleanos como values. Persiste en memoria durante la sesión.

---

## 🖼️ SISTEMA DE IMÁGENES

### Componente: ImageLightbox

**Implementación**: `frontend/src/markdown/components/ImageLightbox.tsx`

**Características**:
- Modal con shadcn Dialog
- Lazy loading de imágenes
- Captions opcionales (desde atributo `title`)
- Keyboard navigation (Escape para cerrar)
- Focus trap automático
- Bridge vanilla→React para integración con markdown

### Flujo de Interacción

```mermaid
sequenceDiagram
    participant U as Usuario
    participant M as Markdown HTML
    participant B as Bridge Controller
    participant L as ImageLightbox React
    participant D as shadcn Dialog
    
    U->>M: Clic en imagen
    M->>B: Event listener detecta clic
    B->>B: Extraer src, alt, title
    B->>L: Actualizar estado con datos
    L->>D: Abrir modal
    D-->>U: Mostrar imagen ampliada
    
    U->>D: Presionar Escape
    D->>L: Cerrar modal
    L-->>U: Volver a documento
```

---

## 🔍 BÚSQUEDA

### Componentes

**SearchBar.tsx**: Input con debounce de 300ms
**SearchResults.tsx**: Lista de resultados con highlights

### Flujo de Búsqueda

```mermaid
flowchart TD
    A[Usuario escribe en SearchBar] --> B[Debounce 300ms]
    B --> C{¿Query válido?<br/>min 2 caracteres}
    C -->|No| D[No hacer nada]
    C -->|Sí| E[Actualizar search.store]
    E --> F[search.service.ts]
    F --> G[GET /search?q=query]
    G --> H[API retorna resultados]
    H --> I[Actualizar search.store con results]
    I --> J[SearchResults re-renderiza]
    J --> K[Mostrar resultados con highlights]
```

### Store: search.store.ts

**Implementación**: `frontend/src/shared/stores/search.store.ts`

```mermaid
graph LR
    subgraph "Search State"
        S1[query: string]
        S2[results: SearchResult array]
        S3[isSearching: boolean]
    end
    
    subgraph "Components"
        C1[SearchBar] -.->|lee/escribe| S1
        C1 -.->|lee| S3
        C2[SearchResults] -.->|lee| S2
        C2 -.->|lee| S3
    end
```

---

## 🎨 SISTEMA DE TEMAS

### Store: theme.store.ts

**Implementación**: `frontend/src/shared/stores/theme.store.ts`

**Funcionalidad**:
- Gestiona tema actual (light/dark)
- Persiste en localStorage
- Actualiza atributo `data-theme` en `<html>`
- Detecta preferencia del sistema

### Flujo de Cambio de Tema

```mermaid
flowchart TD
    A[Usuario clic en ThemeToggle] --> B[toggleTheme]
    B --> C[Actualizar theme.store]
    C --> D[Guardar en localStorage]
    D --> E[Actualizar data-theme en html]
    E --> F[CSS variables se actualizan]
    F --> G[UI re-renderiza con nuevo tema]
```

---

## 📄 ROUTING

### Tabla de Rutas

| Ruta | Archivo | Descripción |
|------|---------|-------------|
| `/` | `pages/index.astro` | Landing page |
| `/docs` | `pages/docs/index.astro` | Lista de documentos |
| `/docs/[...slug]` | `pages/docs/[...slug].astro` | Vista de documento |
| `/docs/new` | `pages/docs/new.astro` | Crear documento |
| `/docs/edit/[...slug]` | `pages/docs/edit/[...slug].astro` | Editar documento |
| `/search` | `pages/search.astro` | Búsqueda |
| `/architecture` | `pages/architecture/index.astro` | Arquitectura |
| `/architecture/frontend` | `pages/architecture/frontend.astro` | Frontend |
| `/architecture/backend` | `pages/architecture/backend.astro` | Backend |
| `/architecture/database` | `pages/architecture/database.astro` | Database |

**Total**: 18 páginas Astro

---

## 🔄 GESTIÓN DE ESTADO

### Nanostores

**Implementación**: `frontend/src/shared/stores/`

```mermaid
graph TB
    subgraph "Stores"
        S1[folder-tree.store.ts<br/>Expansión de folders]
        S2[theme.store.ts<br/>Dark mode]
        S3[search.store.ts<br/>Búsqueda]
    end
    
    subgraph "Components"
        C1[SidebarItem]
        C2[ThemeToggle]
        C3[SearchBar]
        C4[SearchResults]
    end
    
    S1 -.->|reactivo| C1
    S2 -.->|reactivo| C2
    S3 -.->|reactivo| C3
    S3 -.->|reactivo| C4
```

**Ventajas de Nanostores**:
- Tamaño mínimo (~300 bytes)
- Framework-agnostic (funciona con Astro + React)
- Reactivo sin re-renders innecesarios
- TypeScript nativo

---

## 📡 SERVICIOS API

### Implementación

**Base Service**: `frontend/src/services/api/base.service.ts`
- Cliente HTTP con fetch
- Manejo de errores
- Timeout de 10 segundos

**Servicios Específicos**:
- `documents.service.ts`: CRUD de documentos
- `folders.service.ts`: Árbol jerárquico
- `categories.service.ts`: Categorías fijas
- `search.service.ts`: Búsqueda FTS5

### Flujo de Request

```mermaid
sequenceDiagram
    participant C as Component
    participant S as Service
    participant B as Base Service
    participant A as API Backend
    
    C->>S: documents.service.getBySlug('instalacion')
    S->>B: base.get('/documents/instalacion')
    B->>B: Agregar headers, timeout
    B->>A: fetch('http://localhost:3000/documents/instalacion')
    A-->>B: Response JSON
    B->>B: Validar status, parsear JSON
    B-->>S: Document data
    S-->>C: Document object
```

---

## 🎨 DISEÑO RESPONSIVE

### Breakpoints

| Breakpoint | Ancho | Layout |
|------------|-------|--------|
| Mobile | < 768px | Single column, sidebar hidden |
| Tablet | 768px - 1024px | Two columns, TOC hidden |
| Desktop | > 1024px | Three columns (sidebar, main, TOC) |

### Grid Layout

```mermaid
graph LR
    subgraph "Desktop > 1024px"
        D1[Sidebar<br/>250px]
        D2[Main Content<br/>flex-1]
        D3[TOC<br/>200px]
    end
    
    subgraph "Tablet 768-1024px"
        T1[Sidebar<br/>250px]
        T2[Main Content<br/>flex-1]
    end
    
    subgraph "Mobile < 768px"
        M1[Main Content<br/>100%]
    end
```

---

## ⚡ OPTIMIZACIONES

### 1. Code Splitting

- Lazy loading de componentes pesados (Editor, Mermaid)
- Islands solo cargan JavaScript necesario

### 2. Image Optimization

- Lazy loading nativo (`loading="lazy"`)
- Formato WebP cuando disponible
- Dimensiones especificadas para evitar layout shift

### 3. Prefetch

- Prefetch de documentos populares
- Preload de fuentes críticas

---

## 🧪 TESTING

**Framework**: Vitest (configurado pero no implementado en POC)

**Estrategia futura**:
- Unit tests para utilities y services
- Component tests para componentes React
- E2E tests con Playwright

---

## 🚀 DEPLOYMENT

### Build para Producción

```bash
npm run build
```

Genera `dist/` con:
- Servidor SSR (Node.js)
- Assets estáticos optimizados
- HTML pre-renderizado

### Variables de Entorno

```env
PUBLIC_API_URL=http://localhost:3000
PUBLIC_WS_URL=ws://localhost:3000
```

---

## 📚 REFERENCIAS

- **Componentes**: `frontend/src/`
- **Stores**: `frontend/src/shared/stores/`
- **Services**: `frontend/src/services/`
- **Mocks**: `frontend/src/mocks/`
- **Configuración**: `frontend/astro.config.mjs`, `frontend/tailwind.config.mjs`

**Siguiente**: Ver [Design System](./DESIGN_SYSTEM.md) para detalles de componentes shadcn/ui.
