# 🎨 Frontend Architecture - Astro + React

**Framework**: Astro 4.x + React 18  
**Fecha**: 20 de noviembre, 2025  
**Versión**: v0.5

---

## 📋 Visión General

Aplicación de documentación renderizada por servidor (SSR) con Astro, optimizada para SEO y performance. Consume API REST de NestJS para contenido dinámico.

### Stack

- **Framework**: Astro 4.x (SSR)
- **UI Library**: React 18 (islands)
- **Styling**: Tailwind CSS + shadcn/ui
- **State**: Nanostores
- **TypeScript**: 5.x

### Características

- 🚀 SSR para carga inicial rápida y SEO
- 🏝️ Islands Architecture para interactividad selectiva
- 🗂️ **Navegación jerárquica** con SidebarItem recursivo
- 📝 Editor Markdown con auto-save
- 🔍 Búsqueda en tiempo real
- 🖼️ **ImageLightbox** con shadcn Dialog
- 🎨 Dark mode con persistencia
- ♿ **Accesibilidad WCAG 2.2 AA**
- 📱 Responsive design mobile-first

---

## 📋 **FILOSOFÍA DE ARQUITECTURA**

### **Feature-Based Organization**

Cada **feature** agrupa componentes, lógica y estilos relacionados en una estructura que incluye components/ (componentes del feature), services/ (lógica de negocio), stores/ (estado con Nanostores), types/ (tipos TypeScript), y utils/ (utilidades específicas).

### **Extensiones por Uso**

| Extensión     | Propósito                      | Ejemplos               |
| ------------- | ------------------------------ | ---------------------- |
| `.astro`      | Componentes SSR/estáticos      | `DocumentPage.astro`   |
| `.tsx`        | Componentes React interactivos | `SimpleMDEditor.tsx`   |
| `.service.ts` | Lógica de negocio/API          | `documents.service.ts` |
| `.store.ts`   | Estado global (Nanostores)     | `editor.store.ts`      |
| `.type.ts`    | Tipos TypeScript               | `document.type.ts`     |
| `.util.ts`    | Utilidades puras               | `slug.util.ts`         |
| `.css`        | Estilos                        | `editor.css`           |

---

## 🗂️ **ESTRUCTURA DE CARPETAS**

```
docs-frontend/
├── src/
│   ├── documents/                      # Feature: Documentación
│   │   ├── components/
│   │   │   ├── DocumentViewer.astro    # Vista de documento
│   │   │   ├── DocumentList.astro      # Lista de docs
│   │   │   └── DocumentMeta.astro      # Metadata
│   │   ├── pages/
│   │   │   ├── [...slug].astro         # /docs/[slug]
│   │   │   └── index.astro             # /docs
│   │   ├── services/
│   │   │   └── documents.service.ts    # API calls
│   │   └── types/
│   │       └── document.type.ts        # Tipos
│   │
│   ├── editor/                         # Feature: Editor
│   │   ├── components/
│   │   │   ├── SimpleMDEditor.tsx      # Editor principal
│   │   │   ├── EditorToolbar.tsx       # Toolbar
│   │   │   ├── EditorPreview.tsx       # Preview
│   │   │   ├── ImageUploader.tsx       # Upload images
│   │   │   └── PresenceIndicator.tsx   # Usuarios editando
│   │   ├── services/
│   │   │   ├── editor.service.ts       # Auto-save, publish
│   │   │   └── presence.service.ts     # WebSocket presence
│   │   ├── stores/
│   │   │   └── editor.store.ts         # Estado editor
│   │   ├── types/
│   │   │   └── editor.type.ts
│   │   └── utils/
│   │       └── editor.util.ts          # Helpers
│   │
│   ├── search/                         # Feature: Búsqueda
│   │   ├── components/
│   │   │   ├── SearchBar.tsx           # Barra de búsqueda
│   │   │   ├── SearchResults.tsx       # Lista resultados
│   │   │   ├── SearchFilters.tsx       # Filtros
│   │   │   └── SearchHighlight.tsx     # Highlight matches
│   │   ├── pages/
│   │   │   └── search.astro            # /search
│   │   ├── services/
│   │   │   └── search.service.ts       # API búsqueda
│   │   ├── stores/
│   │   │   └── search.store.ts         # Estado búsqueda
│   │   └── types/
│   │       └── search.type.ts
│   │
│   ├── markdown/                       # Feature: Renderizado Markdown
│   │   ├── components/
│   │   │   ├── MarkdownRenderer.astro  # Renderizador
│   │   │   ├── CodeBlock.astro         # Code blocks
│   │   │   ├── MermaidDiagram.tsx      # Diagramas
│   │   │   └── CopyButton.tsx          # Copy code
│   │   ├── services/
│   │   │   └── markdown.service.ts     # Parser + syntax highlight
│   │   └── styles/
│   │       └── markdown.css            # Estilos contenido
│   │
│   ├── shared/                         # Código compartido
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   │   ├── Button.astro
│   │   │   │   ├── Card.astro
│   │   │   │   ├── Modal.tsx
│   │   │   │   ├── Tabs.tsx
│   │   │   │   └── Toast.tsx
│   │   │   └── layout/
│   │   │       ├── Sidebar.astro
│   │   │       ├── TOC.astro
│   │   │       ├── Header.astro
│   │   │       └── Footer.astro
│   │   ├── services/
│   │   │   ├── api.service.ts          # HTTP client base
│   │   │   ├── websocket.service.ts    # WebSocket client
│   │   │   └── storage.service.ts      # LocalStorage wrapper
│   │   ├── stores/
│   │   │   ├── theme.store.ts          # Dark mode
│   │   │   └── user.store.ts           # Usuario actual
│   │   ├── types/
│   │   │   ├── api.type.ts             # Tipos API
│   │   │   └── common.type.ts          # Tipos comunes
│   │   ├── utils/
│   │   │   ├── date.util.ts
│   │   │   ├── string.util.ts
│   │   │   ├── slug.util.ts
│   │   │   └── validation.util.ts
│   │   └── hooks/                      # React hooks
│   │       ├── useDebounce.ts
│   │       ├── useLocalStorage.ts
│   │       └── useWebSocket.ts
│   │
│   ├── layouts/                        # Layouts globales
│   │   ├── BaseLayout.astro            # Base HTML
│   │   ├── DocsLayout.astro            # Layout docs
│   │   └── EditorLayout.astro          # Layout editor
│   │
│   ├── pages/                          # Rutas raíz
│   │   └── index.astro                 # Homepage
│   │
│   └── styles/                         # Estilos globales
│       ├── global.css
│       ├── themes/
│       │   ├── light.css
│       │   └── dark.css
│       └── tokens.css                  # Design tokens
│
├── public/
│   ├── fonts/
│   ├── icons/
│   └── favicon.svg
│
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
├── package.json
└── README.md
```

---

## 🔧 **CONFIGURACIÓN TÉCNICA**

### **astro.config.mjs**

Configuración de Astro con output server (SSR habilitado), adapter Node.js para deployment, integrations React y Tailwind CSS, configuración Vite SSR para nanostores y socket.io-client como externos, y servidor en puerto 4321.

### **package.json (Dependencias principales)**

**Dependencias principales**:

- Astro 4.0.0 + React 18.2.0 + Tailwind 5.0.0
- SimpleMDE 1.11.2, Marked 11.0.0, Shiki 1.0.0, Mermaid 10.6.0 (editor/rendering)
- Socket.io-client 4.7.0 (WebSockets)
- Nanostores 0.10.0 (state management)
- Axios 1.6.0, date-fns 3.0.0 (utilidades)

**DevDependencies**:

- TypeScript 5.3.0, Tailwind CSS 3.4.0
- Prettier 3.1.0 con plugin Astro

---

---

## 📦 **FEATURES**

### **1. Documents Feature** (`documents/`)

#### **documents/services/documents.service.ts**

Service for document API operations including getDocument (fetch by slug), getDocuments (fetch all), and getDocumentsByCategory (filter by category).

#### **documents/types/document.type.ts**

TypeScript interfaces: Document (id, slug, title, content, status, dates, createdBy) and DocumentListItem (slug, title, optional excerpt/category, updatedAt).

#### **documents/pages/[...slug].astro**

Dynamic route page that fetches document by slug, handles 404 redirects, and renders DocsLayout with Sidebar, DocumentViewer, and TOC components.

#### **documents/components/DocumentViewer.astro**

Component that renders a document article with header (title and metadata) and content area using MarkdownRenderer.

---

### **2. Editor Feature** (`editor/`)

#### **editor/stores/editor.store.ts**

Nanostores state management for editor with EditorState interface and helper functions for editing status, saving state, last saved timestamp, unsaved changes tracking, and collaborative user presence management.

#### **editor/services/editor.service.ts**

Editor service with saveDraft (auto-save content), publishDocument (publish draft), and uploadImage (upload images with FormData) methods.

#### **editor/components/SimpleMDEditor.tsx**

React component that initializes SimpleMDE markdown editor with toolbar configuration, WebSocket presence connection, auto-save on change (5 second debounce), and publish functionality with save status indicators.

#### **editor/components/PresenceIndicator.tsx**

Component that displays collaborative editing status showing which users are currently editing the document.

#### **editor/services/presence.service.ts**

WebSocket service for real-time collaborative editing presence that emits editing-start events and listens for user-editing, user-stopped-editing, and user-left events.

---

### **3. Search Feature** (`search/`)

#### **search/stores/search.store.ts**

Nanostores state for search feature managing query string, results array, searching status, and search history flag with helper functions.

#### **search/services/search.service.ts**

Search service that queries the API with search parameters, handles empty queries, and updates the search store with results.

#### **search/components/SearchBar.tsx**

Search input component with debounced search (300ms), loading indicator, and real-time search as user types.

---

## 🎨 **SISTEMA DE DISEÑO**

### **Colores (CSS Variables)**

CSS custom properties define light and dark themes with variables for primary/secondary backgrounds, text colors, accent color, borders, and code block backgrounds.

### **Componentes Principales Actualizados**

#### **SidebarItem.tsx - Navegación Recursiva** ✨ NUEVO

Componente React recursivo para renderizar árbol de carpetas con expansión/colapso ilimitado.

**Características**:

- Renderizado recursivo de niveles ilimitados
- Estado de expansión persistente (nanostores)
- Iconos emoji para categorías
- Links a documentos con slug

**Interface**: FolderNode with id, name, type (folder/file), optional icon, path, order, optional children array, and optional slug for files.

**Implementación**: Recursive React component that renders folders with expand/collapse buttons and files as links, with dynamic indentation based on nesting level.

**Store**: Nanostores atom managing Set of expanded folder IDs with toggleFolder function to add/remove folders from expanded state.

---

#### **ImageLightbox.tsx - Modal de Imágenes** ✨ NUEVO

Modal para imágenes con accesibilidad WCAG 2.2 AA usando shadcn Dialog.

**Características**:

- Lazy loading de imágenes
- Captions opcionales
- Keyboard navigation (Escape para cerrar)
- Focus trap automático
- Bridge vanilla→React (ImageLightboxController)

**Implementación**: React component using shadcn Dialog for image lightbox with lazy loading, optional captions, and accessible modal behavior.

**Bridge vanilla→React**: Controller component that listens for clicks on markdown images and opens the lightbox with image data (src, alt, caption from title attribute).

---

#### **shadcn/ui Components** ✨ NUEVO

13+ componentes instalados y customizados con Tailwind.

**Lista de componentes**:

| Componente    | Ubicación                         | Uso                                |
| ------------- | --------------------------------- | ---------------------------------- |
| Badge         | `src/components/ui/badge`         | Etiquetas de categorías            |
| Button        | `src/components/ui/button`        | Acciones (crear, editar, eliminar) |
| Card          | `src/components/ui/card`          | Cards de documentos                |
| Dialog        | `src/components/ui/dialog`        | Modales (nuevo doc, lightbox)      |
| Dropdown Menu | `src/components/ui/dropdown-menu` | Menús contextuales                 |
| Input         | `src/components/ui/input`         | Campos de formulario               |
| Label         | `src/components/ui/label`         | Labels accesibles                  |
| Select        | `src/components/ui/select`        | Selectores (categoría, estado)     |
| Separator     | `src/components/ui/separator`     | Separadores visuales               |
| Skeleton      | `src/components/ui/skeleton`      | Loading states                     |
| Tabs          | `src/components/ui/tabs`          | Pestañas de navegación             |
| Textarea      | `src/components/ui/textarea`      | Editor de texto                    |
| Tooltip       | `src/components/ui/tooltip`       | Tooltips informativos              |

**Ejemplo de uso**: Example NewDocumentForm component demonstrating Dialog trigger with Button and form content inside DialogContent.

**Temas**: CSS variables for light and dark mode themes using HSL color space for background, foreground, primary, and primary-foreground colors.

Ver más en [docs/DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)

---

### \*\*Componentes UI Base (Legados)

## 🔷 **SHARED LAYER**

### **shared/services/api.service.ts**

Axios-based HTTP client service with base URL configuration, 10-second timeout, request/response interceptors for auth and error handling, and wrapper methods for GET, POST, PUT, DELETE.`

### **shared/services/websocket.service.ts**

Socket.io client service with namespace support, automatic reconnection (5 attempts with 1-second delay), connection lifecycle logging, and disconnect management.

### **shared/services/storage.service.ts**

LocalStorage wrapper with type-safe get/set methods, JSON serialization, error handling, and remove/clear operations.

### **shared/stores/theme.store.ts**

Theme management store with Nanostores that persists theme preference to localStorage and updates DOM data-theme attribute, with toggleTheme and setTheme helper functions.

### **shared/utils/slug.util.ts**

Utilities for URL slug generation: slugify (converts text to lowercase URL-safe slug with accent removal) and isValidSlug (validates slug format).

### **shared/hooks/useDebounce.ts**

React hook that debounces function calls with configurable delay, clearing previous timeouts and cleaning up on unmount.

### **shared/components/ui/Button.astro**

Polymorphic button component that renders as button or anchor tag with variants (primary, secondary, ghost, danger), sizes (sm, md, lg), and disabled state styling.

---

### **4. Markdown Feature** (`markdown/`)

#### **markdown/services/markdown.service.ts**

Markdown parsing service using marked and Shiki for syntax highlighting, with custom renderers for code blocks (with copy buttons) and headings (with anchor links).

---

#### **markdown/components/MarkdownRenderer.astro**

Astro component that initializes markdown service, renders content to HTML with syntax highlighting, and adds client-side copy button functionality for code blocks.

---

## 📱 **RESPONSIVE DESIGN**

CSS Grid layout with three columns (sidebar, main, TOC) that collapses to single column on mobile (< 1024px) hiding sidebars.

---

## ⚡ **OPTIMIZACIONES**

### **1. Image Optimization**

Using Astro's Image component with lazy loading, WebP format, and specified dimensions for performance.

### **2. Code Splitting**

Lazy loading of editor component to reduce initial bundle size.

### **3. Prefetch**

Prefetching popular documents API endpoint to improve perceived performance.

---

## 🧪 **TESTING**

Using Vitest with Astro's experimental container API to test component rendering with props validation.

---

## 🚀 **DEPLOYMENT**

### **Build para Producción**

Run `npm run build` to generate dist/ with SSR server and static assets, then `npm run preview` to test the production build.

### **Variables de Entorno**

Configure PUBLIC_API_URL and PUBLIC_WS_URL for API and WebSocket endpoints.

---

**Siguiente**: Ver [Backend ARCHITECTURE](../docs-backend/ARCHITECTURE.md)
