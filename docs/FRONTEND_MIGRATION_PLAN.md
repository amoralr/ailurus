# 🚀 Plan de Migración Frontend → Backend API

**Proyecto**: Ailurus Documentation Platform  
**Objetivo**: Migrar frontend de mocks estáticos a backend NestJS  
**Fecha**: 20 de noviembre, 2025  
**Estado**: Plan de ejecución - FASE 5

---

## 📊 **ESTADO ACTUAL**

**Última actualización**: 20 de noviembre, 2025 - 17:00
**Estado actual**: FASE 5.5 completada ✅ - API FTS5 funcionando

### ✅ **Backend Completado (FASE 0-4)**

**Base de Datos**:

- ✅ SQLite con Prisma + BetterSQLite3 adapter
- ✅ 3 migrations ejecutadas (init_schema, empty, FTS5)
- ✅ 7 tablas operacionales (Document, Category, Folder, etc.)
- ✅ Virtual table FTS5 con 4 triggers (insert, update, delete, hard-delete)
- ✅ Seed poblado con 5 documentos reales

**API REST - 21 Endpoints Operacionales**:

1. **Documents** (6 endpoints):

   - `GET /docs` - Lista documentos publicados
   - `GET /docs/:slug` - Obtiene documento por slug
   - `GET /docs?category=:id` - Filtra por categoría
   - `POST /docs` - Crea documento (draft)
   - `PUT /docs/:id/draft` - Actualiza draft
   - `PUT /docs/:id/publish` - Publica documento
   - `DELETE /docs/:id` - Archiva documento

2. **Folders** (5 endpoints):

   - `GET /folders` - Árbol jerárquico completo
   - `GET /folders/:path` - Nodo específico con hijos
   - `POST /folders` - Crea folder
   - `PUT /folders/:id` - Actualiza folder
   - `DELETE /folders/:id` - Elimina folder

3. **Categories** (5 endpoints):

   - `GET /categories` - Lista con stats
   - `GET /categories/:id` - Categoría específica
   - `POST /categories` - Crea categoría
   - `PUT /categories/:id` - Actualiza categoría
   - `DELETE /categories/:id` - Elimina categoría

4. **Search** (1 endpoint):

   - `GET /search?q=query&limit=10&offset=0` - Búsqueda FTS5

5. **Health** (4 endpoints adicionales):
   - `GET /` - Health check
   - `GET /health` - Status
   - `GET /metrics` - Métricas
   - `GET /ready` - Readiness probe

**Infraestructura**:

- ✅ CORS configurado para `http://localhost:4321`
- ✅ ValidationPipe global (class-validator + class-transformer)
- ✅ PrismaModule global (@Global decorator)
- ✅ BigInt serialization fix (toJSON override)
- ✅ TypeScript import type fix (isolatedModules)

**Features Técnicas**:

- ✅ FTS5 full-text search con diacritic removal ("instalacion" → "Instalación")
- ✅ Recursive tree building para folders (buildTree)
- ✅ Stats aggregation con fallback manual (groupBy + aggregate)
- ✅ ActivityLog para búsquedas (registra query + results_count)
- ✅ Slug generation automático desde title

### 🟡 **Frontend con Mocks (Pendiente de Migración)**

**Estructura Actual**:

```
frontend/src/
├── mocks/
│   ├── documents.mock.ts  ← 20 documentos estáticos (2176 líneas)
│   ├── folders.mock.ts    ← 29 nodos jerárquicos (11 folders + 18 files)
│   └── index.ts           ← Exports centralizados
├── documents/
│   ├── components/
│   │   ├── DocumentList.astro     ← Usa MOCK_DOCUMENTS
│   │   └── NewDocumentForm.tsx    ← Usa MOCK_FOLDERS
├── search/
│   ├── components/
│   │   ├── SearchBar.tsx          ← Sin backend aún
│   │   └── SearchResults.tsx      ← Sin backend aún
│   └── services/
│       └── search.service.ts      ← Búsqueda client-side en mocks
├── shared/
│   └── components/layout/
│       └── Sidebar.astro          ← Usa MOCK_FOLDERS
└── pages/
    └── docs/
        ├── [...slug].astro        ← Usa MOCK_DOCUMENTS (getStaticPaths)
        ├── index.astro            ← Usa MOCK_DOCUMENTS
        └── [slug]/edit.astro      ← Usa MOCK_DOCUMENTS
```

**Archivos que Usan Mocks** (18 ocurrencias):

1. `pages/docs/[...slug].astro` (5 usos de MOCK_DOCUMENTS)
2. `pages/docs/index.astro` (2 usos)
3. `pages/docs/edit/[...slug].astro` (2 usos)
4. `pages/docs/[slug]/edit.astro` (2 usos)
5. `documents/components/NewDocumentForm.tsx` (2 usos de MOCK_FOLDERS)
6. `shared/components/layout/Sidebar.astro` (2 usos de MOCK_FOLDERS)
7. `search/services/search.service.ts` (1 uso de MOCK_DOCUMENTS)

**Características del Frontend Actual**:

- ✅ Astro SSR con Islands Architecture
- ✅ 13 componentes shadcn/ui instalados (button, card, dialog, etc.)
- ✅ Sistema de navegación jerárquica (SidebarItem recursivo)
- ✅ Sistema de imágenes con lightbox (ImageLightbox + lazy loading)
- ✅ Tema light/dark con nanostores
- ✅ Búsqueda client-side (SearchService.search)
- ✅ Markdown rendering (MarkdownRenderer.astro)
- ⚠️ **TODO**: Sin servicios de API implementados

---

## 🎯 **OBJETIVOS DE LA MIGRACIÓN**

### **Objetivo Principal**

Reemplazar mocks estáticos con llamadas a API REST del backend NestJS, manteniendo la misma UX y funcionalidad.

### **Objetivos Específicos**

1. ✅ Crear servicios API en frontend (`src/services/api/`)
2. ✅ Configurar variables de entorno para URLs del backend
3. ✅ Migrar páginas Astro de `getStaticPaths()` a fetch dinámico
4. ✅ Actualizar componentes React para usar API
5. ✅ Implementar búsqueda con backend FTS5
6. ✅ Testing A/B (mocks vs API) para validar paridad
7. ✅ Eliminar mocks cuando migración esté completa

### **Non-Goals (Fuera de Alcance)**

- ❌ Autenticación y autorización (v0.5+)
- ❌ Edición colaborativa en tiempo real (v2.0)
- ❌ Upload de imágenes (se implementará en siguiente fase)
- ❌ Analytics y logging avanzado

---

## 📋 **PLAN DE MIGRACIÓN - FASE 5**

### ✅ **FASE 5.1: Configuración de Variables de Entorno** (COMPLETADA)

**Objetivo**: Habilitar flag para cambiar entre mocks y API

#### **Tareas**:

1. **Crear archivo `.env`** en `frontend/`:

```env
# Backend API
PUBLIC_API_URL=http://localhost:3000
PUBLIC_WS_URL=ws://localhost:3000

# Feature flags
PUBLIC_USE_MOCKS=false  # true = mocks | false = API real
PUBLIC_ENABLE_SEARCH_API=false  # Activar cuando search esté listo
```

2. **Crear archivo `.env.example`**:

```env
PUBLIC_API_URL=http://localhost:3000
PUBLIC_WS_URL=ws://localhost:3000
PUBLIC_USE_MOCKS=true
PUBLIC_ENABLE_SEARCH_API=false
```

3. **Actualizar `.gitignore`**:

```gitignore
# Environment variables
.env
.env.local
.env.production
```

4. **Documentar en README.md**:

```markdown
## Environment Setup

Copy `.env.example` to `.env`:

\`\`\`bash
cp .env.example .env
\`\`\`

Toggle between mocks and API:

- `PUBLIC_USE_MOCKS=true` → Static mocks (development)
- `PUBLIC_USE_MOCKS=false` → Backend API (production)
```

#### **Validación**:

- [x] Variables accesibles via `import.meta.env.PUBLIC_API_URL`
- [x] Hot reload funciona al cambiar `.env`
- [x] `.env` creado con `PUBLIC_USE_MOCKS=false`
- [x] `.env.example` disponible

---

### ✅ **FASE 5.2: Crear Servicios API Base** (COMPLETADA)

**Objetivo**: Implementar clases de servicio para llamar al backend

**Archivos creados**:

- ✅ `services/api/base.service.ts`
- ✅ `services/api/documents.service.ts`
- ✅ `services/api/folders.service.ts`
- ✅ `services/api/categories.service.ts`
- ✅ `services/api/search.service.ts`

#### **Estructura a Crear**:

```
frontend/src/services/
└── api/
    ├── base.service.ts         # Cliente HTTP base
    ├── documents.service.ts    # Documents API
    ├── folders.service.ts      # Folders API
    ├── categories.service.ts   # Categories API
    └── search.service.ts       # Search API
```

#### **1. Base Service** (`services/api/base.service.ts`)

```typescript
/**
 * Base HTTP client for API calls
 * Handles common configuration, error handling, and retry logic
 */
export class BaseApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = import.meta.env.PUBLIC_API_URL || "http://localhost:3000";
  }

  /**
   * Generic GET request
   */
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const url = new URL(endpoint, this.baseURL);

    if (params) {
      Object.keys(params).forEach((key) => {
        if (params[key] !== undefined && params[key] !== null) {
          url.searchParams.append(key, String(params[key]));
        }
      });
    }

    try {
      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`[API] GET ${endpoint} failed:`, error);
      throw error;
    }
  }

  /**
   * Generic POST request
   */
  async post<T>(endpoint: string, body: any): Promise<T> {
    const url = new URL(endpoint, this.baseURL);

    try {
      const response = await fetch(url.toString(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`[API] POST ${endpoint} failed:`, error);
      throw error;
    }
  }

  /**
   * Generic PUT request
   */
  async put<T>(endpoint: string, body: any): Promise<T> {
    const url = new URL(endpoint, this.baseURL);

    try {
      const response = await fetch(url.toString(), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`[API] PUT ${endpoint} failed:`, error);
      throw error;
    }
  }

  /**
   * Generic DELETE request
   */
  async delete<T>(endpoint: string): Promise<T> {
    const url = new URL(endpoint, this.baseURL);

    try {
      const response = await fetch(url.toString(), {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`[API] DELETE ${endpoint} failed:`, error);
      throw error;
    }
  }
}
```

#### **2. Documents Service** (`services/api/documents.service.ts`)

```typescript
import { BaseApiService } from "./base.service";

export interface Document {
  id: number;
  slug: string;
  title: string;
  content: string;
  excerpt: string | null;
  categoryId: string;
  subcategory: string | null;
  path: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface CreateDocumentDto {
  title: string;
  content: string;
  excerpt?: string;
  categoryId: string;
  subcategory?: string;
  path: string;
  status?: "DRAFT" | "PUBLISHED";
}

export interface UpdateDocumentDto {
  title?: string;
  content?: string;
  excerpt?: string;
  categoryId?: string;
  subcategory?: string;
  path?: string;
}

export class DocumentsApiService extends BaseApiService {
  /**
   * GET /docs - Lista todos los documentos publicados
   */
  async getDocuments(params?: {
    category?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<Document[]> {
    return this.get<Document[]>("/docs", params);
  }

  /**
   * GET /docs/:slug - Obtiene un documento por slug
   */
  async getDocumentBySlug(slug: string): Promise<Document> {
    return this.get<Document>(`/docs/${slug}`);
  }

  /**
   * POST /docs - Crea un nuevo documento (draft)
   */
  async createDocument(data: CreateDocumentDto): Promise<Document> {
    return this.post<Document>("/docs", data);
  }

  /**
   * PUT /docs/:id/draft - Actualiza un draft
   */
  async updateDraft(id: number, data: UpdateDocumentDto): Promise<Document> {
    return this.put<Document>(`/docs/${id}/draft`, data);
  }

  /**
   * PUT /docs/:id/publish - Publica un documento
   */
  async publishDocument(id: number): Promise<Document> {
    return this.put<Document>(`/docs/${id}/publish`, {});
  }

  /**
   * DELETE /docs/:id - Archiva un documento (soft delete)
   */
  async archiveDocument(id: number): Promise<{ success: boolean }> {
    return this.delete<{ success: boolean }>(`/docs/${id}`);
  }
}

// Singleton instance
export const documentsApi = new DocumentsApiService();
```

#### **3. Folders Service** (`services/api/folders.service.ts`)

```typescript
import { BaseApiService } from "./base.service";
import type { FolderNode } from "@/shared/types/folder-tree.types";

export class FoldersApiService extends BaseApiService {
  /**
   * GET /folders - Obtiene el árbol jerárquico completo
   */
  async getFolderTree(): Promise<FolderNode[]> {
    return this.get<FolderNode[]>("/folders");
  }

  /**
   * GET /folders/:path - Obtiene un nodo específico con sus hijos
   */
  async getFolderByPath(path: string): Promise<FolderNode> {
    return this.get<FolderNode>(`/folders/${encodeURIComponent(path)}`);
  }
}

// Singleton instance
export const foldersApi = new FoldersApiService();
```

#### **4. Categories Service** (`services/api/categories.service.ts`)

```typescript
import { BaseApiService } from "./base.service";

export interface Category {
  id: string;
  name: string;
  icon: string;
  order: number;
  stats: {
    published: number;
    draft: number;
    archived: number;
    total: number;
  };
}

export class CategoriesApiService extends BaseApiService {
  /**
   * GET /categories - Lista todas las categorías con stats
   */
  async getCategories(): Promise<Category[]> {
    return this.get<Category[]>("/categories");
  }

  /**
   * GET /categories/:id - Obtiene una categoría específica
   */
  async getCategoryById(id: string): Promise<Category> {
    return this.get<Category>(`/categories/${id}`);
  }
}

// Singleton instance
export const categoriesApi = new CategoriesApiService();
```

#### **5. Search Service** (`services/api/search.service.ts`)

```typescript
import { BaseApiService } from "./base.service";

export interface SearchResult {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  path: string;
  rank: number;
  updatedAt: string;
}

export class SearchApiService extends BaseApiService {
  /**
   * GET /search?q=query - Búsqueda full-text con FTS5
   */
  async search(params: {
    q: string;
    limit?: number;
    offset?: number;
    category?: string;
  }): Promise<{
    data: SearchResult[];
    total: number;
    query: string;
    searchTime: string;
  }> {
    return this.get<{
      data: SearchResult[];
      total: number;
      query: string;
      searchTime: string;
    }>("/search", params);
  }
}

// Singleton instance
export const searchApi = new SearchApiService();
```

#### **Validación**:

- [x] Servicios compilan sin errores TypeScript
- [x] `documentsApi.getDocuments()` retorna datos desde backend
- [x] `foldersApi.getFolderTree()` retorna estructura jerárquica
- [x] Error handling funciona (backend apagado → error en consola)

---

### ✅ **FASE 5.3: Migrar Página de Documentos** (COMPLETADA)

**Objetivo**: Reemplazar mocks en páginas principales de documentos

**Archivos migrados**:

- ✅ `pages/docs/index.astro` - Lista de documentos con API
- ✅ `pages/docs/[...slug].astro` - Documento individual con API
- ✅ `pages/docs/edit/[...slug].astro` - Editor con API
- ✅ `astro.config.mjs` - Cambiado a SSR mode (`output: 'server'`)

#### **1. Migrar `pages/docs/index.astro`**

**Antes** (con mocks):

```astro
---
import { MOCK_DOCUMENTS } from "@/mocks";

const publishedDocs = MOCK_DOCUMENTS.filter(
  (doc) => doc.status === "published"
);
---
```

**Después** (con API):

```astro
---
import { documentsApi } from "@/services/api/documents.service";
import { MOCK_DOCUMENTS } from "@/mocks";

const USE_MOCKS = import.meta.env.PUBLIC_USE_MOCKS === 'true';

let publishedDocs;

if (USE_MOCKS) {
  publishedDocs = MOCK_DOCUMENTS.filter((doc) => doc.status === "published");
} else {
  try {
    publishedDocs = await documentsApi.getDocuments({ status: 'PUBLISHED' });
  } catch (error) {
    console.error('[docs/index] Failed to fetch documents:', error);
    // Fallback to mocks on error
    publishedDocs = MOCK_DOCUMENTS.filter((doc) => doc.status === "published");
  }
}
---

<!-- Resto del template igual -->
```

#### **2. Migrar `pages/docs/[...slug].astro`**

**Antes** (con `getStaticPaths`):

```astro
---
export async function getStaticPaths() {
  return MOCK_DOCUMENTS.filter((doc) => doc.status === "published").map(
    (doc) => ({
      params: { slug: doc.slug },
      props: { doc },
    })
  );
}
---
```

**Después** (con fetch dinámico):

```astro
---
import { documentsApi } from "@/services/api/documents.service";
import { MOCK_DOCUMENTS } from "@/mocks";

// Remove getStaticPaths (dynamic rendering)

const { slug } = Astro.params;

if (!slug) {
  return Astro.redirect("/404");
}

const USE_MOCKS = import.meta.env.PUBLIC_USE_MOCKS === 'true';

let document;

if (USE_MOCKS) {
  document = MOCK_DOCUMENTS.find(
    (doc) => doc.slug === slug && doc.status === "published"
  );
} else {
  try {
    document = await documentsApi.getDocumentBySlug(slug);
  } catch (error) {
    console.error(`[docs/${slug}] Failed to fetch document:`, error);
    // Fallback to mocks
    document = MOCK_DOCUMENTS.find(
      (doc) => doc.slug === slug && doc.status === "published"
    );
  }
}

if (!document) {
  return Astro.redirect("/404");
}

// Resto del código igual
---
```

**IMPORTANTE**: Cambiar configuración de Astro a SSR:

**`astro.config.mjs`**:

```javascript
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  output: "server", // ← Cambiar de 'static' a 'server'
  integrations: [react(), tailwind({ applyBaseStyles: false })],
  vite: {
    ssr: {
      noExternal: ["nanostores", "socket.io-client"],
    },
  },
});
```

#### **Validación**:

- [x] `/docs` muestra lista de documentos desde API
- [x] `/docs/instalacion` carga documento individual desde API
- [x] Cambiar `PUBLIC_USE_MOCKS=true` vuelve a mocks
- [x] Error en backend muestra fallback a mocks
- [x] `/docs/edit/instalacion` funciona correctamente

---

### ✅ **FASE 5.4: Migrar Sidebar con Folders** (COMPLETADA)

**Objetivo**: Cargar árbol de folders desde backend

**Archivos migrados**:

- ✅ `shared/components/layout/Sidebar.astro` - Árbol jerárquico con API
- ✅ Backend devuelve formato correcto con `FolderNodeResponseDto`
- ✅ IDs transformados a string, types a lowercase
- ✅ Nodos FILE incluyen slug desde documentos vinculados

#### **Migrar `shared/components/layout/Sidebar.astro`**

**Antes**:

```astro
---
import { MOCK_FOLDERS } from "@/mocks/folders.mock";
---

<nav>
  {MOCK_FOLDERS.map((rootNode) => (
    <SidebarItem node={rootNode} ... />
  ))}
</nav>
```

**Después**:

```astro
---
import { foldersApi } from "@/services/api/folders.service";
import { MOCK_FOLDERS } from "@/mocks/folders.mock";

const USE_MOCKS = import.meta.env.PUBLIC_USE_MOCKS === 'true';

let folders;

if (USE_MOCKS) {
  folders = MOCK_FOLDERS;
} else {
  try {
    folders = await foldersApi.getFolderTree();
  } catch (error) {
    console.error('[Sidebar] Failed to fetch folders:', error);
    folders = MOCK_FOLDERS;
  }
}
---

<nav>
  {folders.map((rootNode) => (
    <SidebarItem node={rootNode} ... />
  ))}
</nav>
```

#### **Validación**:

- [x] Sidebar carga estructura jerárquica desde API
- [x] Expansión/colapso sigue funcionando
- [x] Badges con count se actualizan correctamente
- [x] Problema de hidratación resuelto con `isHydrated` state

---

### ✅ **FASE 5.5: Migrar Búsqueda** (COMPLETADA)

**Objetivo**: Reemplazar búsqueda client-side con API FTS5

**Archivos migrados**:

- ✅ `search/services/search.service.ts` - Método async con API y fallback a mocks
- ✅ `search/components/SearchBar.tsx` - Manejo async/await con error handling
- ✅ `.env` - `PUBLIC_ENABLE_SEARCH_API=true` activado

#### **1. Actualizar `search/services/search.service.ts`**

**Antes** (búsqueda en mocks):

```typescript
export class SearchService {
  static search(query: string): SearchResult[] {
    return MOCK_DOCUMENTS.filter((doc) => {
      /* ... */
    });
  }
}
```

**Después** (con API flag):

```typescript
import { searchApi } from "@/services/api/search.service";
import { MOCK_DOCUMENTS } from "@/mocks";

export class SearchService {
  /**
   * Busca documentos usando backend FTS5 o mocks
   */
  static async search(query: string): Promise<SearchResult[]> {
    const USE_MOCKS = import.meta.env.PUBLIC_USE_MOCKS === "true";
    const ENABLE_SEARCH_API =
      import.meta.env.PUBLIC_ENABLE_SEARCH_API === "true";

    // Si mocks está activado o search API desactivado, usar búsqueda local
    if (USE_MOCKS || !ENABLE_SEARCH_API) {
      return this.searchInMocks(query);
    }

    // Usar backend FTS5
    try {
      const response = await searchApi.search({
        q: query,
        limit: 20,
        offset: 0,
      });

      return response.data.map((result) => ({
        id: result.id,
        slug: result.slug,
        title: result.title,
        excerpt: result.excerpt,
        category: result.category,
        highlights: [], // FTS5 ya retorna excerpts con <mark>
      }));
    } catch (error) {
      console.error("[Search] API failed, falling back to mocks:", error);
      return this.searchInMocks(query);
    }
  }

  /**
   * Búsqueda client-side en mocks (fallback)
   */
  private static searchInMocks(query: string): SearchResult[] {
    if (!query || query.trim().length < 2) return [];

    const lowerQuery = query.toLowerCase().trim();
    const queryWords = lowerQuery.split(/\s+/);

    return MOCK_DOCUMENTS.filter((doc) => {
      if (doc.status !== "published") return false;
      const titleMatch = doc.title.toLowerCase().includes(lowerQuery);
      const contentMatch = doc.content.toLowerCase().includes(lowerQuery);
      const excerptMatch = doc.excerpt?.toLowerCase().includes(lowerQuery);
      return titleMatch || contentMatch || excerptMatch;
    })
      .map((doc) => {
        const excerpt = this.findBestExcerpt(doc.content, queryWords);
        const highlights = this.findHighlights(doc, queryWords);

        return {
          id: doc.id,
          slug: doc.slug,
          title: this.highlightText(doc.title, queryWords),
          excerpt: this.highlightText(excerpt, queryWords),
          category: doc.category,
          highlights,
        };
      })
      .sort((a, b) => {
        const aInTitle = a.title.includes("<mark>");
        const bInTitle = b.title.includes("<mark>");
        if (aInTitle && !bInTitle) return -1;
        if (!aInTitle && bInTitle) return 1;
        return 0;
      });
  }

  // Resto de métodos helper (findBestExcerpt, highlightText, etc.)
}
```

#### **2. Actualizar `search/components/SearchBar.tsx`**

Cambiar método `search()` de síncrono a asíncrono:

```typescript
const handleSearch = async (e: React.FormEvent) => {
  e.preventDefault();

  if (query.trim().length < 2) {
    searchStore.set({ query: "", results: [], isLoading: false, error: null });
    return;
  }

  searchStore.set({ query, results: [], isLoading: true, error: null });

  try {
    const results = await SearchService.search(query);
    searchStore.set({ query, results, isLoading: false, error: null });
  } catch (error) {
    searchStore.set({
      query,
      results: [],
      isLoading: false,
      error: "Error al realizar la búsqueda. Intenta nuevamente.",
    });
  }
};
```

#### **Validación**:

- [x] Búsqueda funciona con API (`PUBLIC_ENABLE_SEARCH_API=true`)
- [x] Método search() convertido a async/await
- [x] Error handling con try/catch implementado
- [x] Fallback a mocks funciona si backend está caído
- [x] Testing manual: Query "instalacion" encuentra "Guía de Instalación" ✅
- [x] API retorna rank, excerpt, path, categoryId correctamente

---

### 🔄 **FASE 5.6: Testing A/B (Mocks vs API)** (PARCIAL)

**Objetivo**: Validar paridad funcional entre mocks y API

**Estado**: Testing manual en progreso

#### **Checklist de Validación**:

**Documentos**:

- [x] `/docs` lista documentos (API: 5 documentos desde seed)
- [x] `/docs/instalacion` muestra contenido completo
- [x] Badges de categoría muestran correctamente
- [x] Fecha de actualización formatea correctamente
- [x] Links prev/next funcionan
- [x] Botón editar navega correctamente a `/docs/edit/:slug`

**Sidebar**:

- [x] Árbol de folders se renderiza completo
- [x] Expansión/colapso funciona en ambos modos
- [x] Badges con count se actualizan
- [x] Click en documento navega correctamente
- [x] Estado persiste en localStorage (nanostores)
- [x] Problemas de hidratación resueltos (SidebarItem, ThemeToggle)
      **Búsqueda**:

- [x] SearchService migrado a async con API
- [x] SearchBar actualizado con async/await
- [x] Error handling implementado
- [x] Query "instalacion" retorna resultados correctos (1 resultado)
- [x] FTS5 encuentra "Instalación" con query "instalacion" (diacritics removal)
- [x] Resultados incluyen rank, excerpt, category, path
- [x] Paginación soportada (limit/offset en API)os)
- [ ] Error handling muestra mensaje apropiado

**Issues resueltos**:

- [x] TOC scroll spy con IDs numéricos (usar `getElementById`)
- [x] Hidratación de ThemeToggle con `isHydrated`
- [x] Hidratación de SidebarItem con `isHydrated`
- [x] Ruta de edición corregida (`/docs/edit/:slug`)

**Performance**:

- [ ] Time to First Byte < 200ms (mocks)
- [ ] API response time < 100ms (local backend)
- [ ] Lighthouse score > 90 (Performance)
- [ ] No memory leaks en devtools

#### **Script de Testing**:

```bash
# 1. Iniciar backend
cd backend
pnpm start:dev

# 2. En otra terminal, iniciar frontend con mocks
cd frontend
echo "PUBLIC_USE_MOCKS=true" > .env
pnpm dev

# 3. Validar funcionalidad con mocks
# → Abrir http://localhost:4321/docs
# → Verificar que todo funciona

# 4. Cambiar a API
echo "PUBLIC_USE_MOCKS=false" > .env
echo "PUBLIC_ENABLE_SEARCH_API=true" >> .env
# → Recargar browser

# 5. Comparar respuestas
# → Verificar misma funcionalidad
# → Comparar performance en devtools

# 6. Testing de error (apagar backend)
# → Ctrl+C en terminal del backend
# → Verificar fallback a mocks funciona
```

---

### ⏳ **FASE 5.7: Limpieza y Optimización** (PENDIENTE)

**Objetivo**: Preparar para producción

**Estado**: No iniciado

#### **Tareas**:

1. **Eliminar imports de mocks en archivos migrados**:

```typescript
// ANTES
import { MOCK_DOCUMENTS } from "@/mocks";
import { documentsApi } from "@/services/api/documents.service";

// DESPUÉS (si USE_MOCKS=false definitivo)
import { documentsApi } from "@/services/api/documents.service";
```

2. **Agregar loading states**:

```astro
---
const { data, error } = await documentsApi.getDocuments();

if (error) {
  return <ErrorBoundary message="No se pudieron cargar los documentos" />;
}
---

{data ? (
  <DocumentList documents={data} />
) : (
  <SkeletonLoader />
)}
```

3. **Optimizar requests con caché**:

```typescript
// En BaseApiService
private cache = new Map<string, { data: any; timestamp: number }>();
private CACHE_TTL = 5 * 60 * 1000; // 5 minutos

async get<T>(endpoint: string): Promise<T> {
  const cached = this.cache.get(endpoint);

  if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
    return cached.data;
  }

  const data = await fetch(...);
  this.cache.set(endpoint, { data, timestamp: Date.now() });

  return data;
}
```

4. **Actualizar documentación**:

**`frontend/README.md`**:

```markdown
## API Integration

The frontend can run in two modes:

### Mock Mode (Development)

Uses static data from `src/mocks/`.

\`\`\`bash
PUBLIC_USE_MOCKS=true pnpm dev
\`\`\`

### API Mode (Production)

Connects to NestJS backend.

\`\`\`bash
PUBLIC_USE_MOCKS=false pnpm dev
\`\`\`

### Backend API URL

Set backend URL in `.env`:

\`\`\`env
PUBLIC_API_URL=http://localhost:3000
\`\`\`

For production:

\`\`\`env
PUBLIC_API_URL=https://api.ailurus.dev
\`\`\`
```

5. **Configurar para producción**:

**`.env.production`**:

```env
PUBLIC_API_URL=https://api.ailurus.dev
PUBLIC_WS_URL=wss://api.ailurus.dev
PUBLIC_USE_MOCKS=false
PUBLIC_ENABLE_SEARCH_API=true
```

---

## 📊 **MÉTRICAS DE ÉXITO**

### **Funcionalidad**

- [ ] ✅ 100% paridad con mocks (mismas features)
- [ ] ✅ 0 errores en consola (modo API)
- [ ] ✅ Fallback a mocks funciona automáticamente
- [ ] ✅ Búsqueda FTS5 retorna resultados correctos

### **Performance**

- [ ] ✅ API response time < 100ms (local)
- [ ] ✅ Time to First Byte < 200ms (API mode)
- [ ] ✅ Lighthouse Performance > 90
- [ ] ✅ No memory leaks en nanostores

### **Developer Experience**

- [ ] ✅ Hot reload funciona con cambios en `.env`
- [ ] ✅ TypeScript sin errores
- [ ] ✅ Documentación actualizada
- [ ] ✅ Testing manual completado

---

## 🚀 **PRÓXIMOS PASOS** (Post FASE 5)

### **FASE 6: Editor en Tiempo Real** (4-6 horas)

- WebSocket Gateway (Socket.io)
- Presencia de usuarios editando
- Auto-save cada 5 segundos
- Conflicto de versiones (last-write-wins)

### **FASE 7: Upload de Imágenes** (3-4 horas)

- Multer para file uploads
- Sharp para compresión + WebP conversion
- Drag & drop en editor
- Lightbox con previews

### **FASE 8: Autenticación** (6-8 horas)

- JWT authentication
- User roles (admin, editor, viewer)
- Protected routes en frontend
- API guards en backend

### **FASE 9: Testing E2E** (4-6 horas)

- Playwright para E2E tests
- Testing de flujos críticos
- CI/CD con GitHub Actions
- Coverage > 80%

---

## 📚 **REFERENCIAS**

- [BACKEND_IMPLEMENTATION_PLAN.md](./BACKEND_IMPLEMENTATION_PLAN.md) - Plan completo del backend
- [API_CONTRACTS.md](./API_CONTRACTS.md) - Especificación de endpoints
- [ROADMAP.md](./ROADMAP.md) - Roadmap general del proyecto
- [FRONTEND_ARCHITECTURE.md](./FRONTEND_ARCHITECTURE.md) - Arquitectura del frontend
- [Astro Docs - SSR](https://docs.astro.build/en/guides/server-side-rendering/)
- [Nanostores Docs](https://github.com/nanostores/nanostores)

---

**Última actualización**: 20 de noviembre, 2025  
**Versión**: 1.0.0  
**Estado**: ✅ Plan completo listo para ejecución  
**Duración estimada**: 6-8 horas de implementación
