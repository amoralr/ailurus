# 🎨 Frontend ARCHITECTURE - Astro SSR

**Proyecto**: docs-frontend  
**Framework**: Astro ^4.0.0  
**Fecha**: 17 de noviembre, 2025

---

## 📋 **VISIÓN GENERAL**

Aplicación de documentación renderizada por servidor (SSR) con Astro, optimizada para SEO y performance. Consume API REST de NestJS para contenido dinámico.

**Características**:

- 🚀 SSR para carga inicial rápida y SEO
- 🏝️ Islands Architecture para interactividad selectiva
- 📝 Editor Markdown inline con SimpleMDE
- 🔍 Búsqueda en tiempo real
- 🎨 Dark mode con persistencia
- 📱 Responsive design mobile-first

---

## 📋 **FILOSOFÍA DE ARQUITECTURA**

### **Feature-Based Organization**

Cada **feature** agrupa componentes, lógica y estilos relacionados:

```
feature/
├── components/       → Componentes específicos del feature
├── services/         → Lógica de negocio y API calls
├── stores/           → Estado del feature (Nanostores)
├── types/            → Tipos TypeScript del feature
└── utils/            → Utilidades específicas
```

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

```javascript
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  output: "server", // SSR habilitado
  adapter: node(), // Para deployment Node.js

  integrations: [
    react(), // Para componentes interactivos
    tailwind({ applyBaseStyles: false }), // Tailwind custom
  ],

  vite: {
    ssr: {
      noExternal: ["nanostores", "socket.io-client"],
    },
  },

  server: {
    port: 4321,
    host: true,
  },
});
```

### **package.json (Dependencias principales)**

```json
{
  "dependencies": {
    "astro": "^4.0.0",
    "@astrojs/react": "^3.0.0",
    "@astrojs/tailwind": "^5.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",

    "simplemde": "^1.11.2",
    "marked": "^11.0.0",
    "shiki": "^1.0.0",
    "mermaid": "^10.6.0",

    "socket.io-client": "^4.7.0",
    "nanostores": "^0.10.0",
    "@nanostores/react": "^0.7.0",

    "axios": "^1.6.0",
    "date-fns": "^3.0.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "tailwindcss": "^3.4.0",
    "@types/react": "^18.2.0",
    "prettier": "^3.1.0",
    "prettier-plugin-astro": "^0.12.0"
  }
}
```

---

---

## 📦 **FEATURES**

### **1. Documents Feature** (`documents/`)

#### **documents/services/documents.service.ts**

```typescript
import { apiService } from "@/shared/services/api.service";
import type { Document, DocumentListItem } from "../types/document.type";

export const documentsService = {
  async getDocument(slug: string): Promise<Document> {
    const { data } = await apiService.get<Document>(`/documents/${slug}`);
    return data;
  },

  async getDocuments(): Promise<DocumentListItem[]> {
    const { data } = await apiService.get<DocumentListItem[]>("/documents");
    return data;
  },

  async getDocumentsByCategory(category: string): Promise<DocumentListItem[]> {
    const { data } = await apiService.get<DocumentListItem[]>("/documents", {
      params: { category },
    });
    return data;
  },
};
```

#### **documents/types/document.type.ts**

```typescript
export interface Document {
  id: number;
  slug: string;
  title: string;
  content: string;
  status: "draft" | "published" | "archived";
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface DocumentListItem {
  slug: string;
  title: string;
  excerpt?: string;
  category?: string;
  updatedAt: string;
}
```

#### **documents/pages/[...slug].astro**

```astro
---
import DocsLayout from '@/layouts/DocsLayout.astro';
import DocumentViewer from '../components/DocumentViewer.astro';
import Sidebar from '@/shared/components/layout/Sidebar.astro';
import TOC from '@/shared/components/layout/TOC.astro';
import { documentsService } from '../services/documents.service';

const { slug } = Astro.params;

try {
  const document = await documentsService.getDocument(slug);

  if (!document) {
    return Astro.redirect('/404');
  }
} catch (error) {
  return Astro.redirect('/404');
}

const document = await documentsService.getDocument(slug);
---

<DocsLayout title={document.title}>
  <Sidebar slot="sidebar" currentSlug={slug} />

  <main>
    <DocumentViewer document={document} />
  </main>

  <TOC slot="toc" content={document.content} />
</DocsLayout>
```

#### **documents/components/DocumentViewer.astro**

```astro
---
import MarkdownRenderer from '@/markdown/components/MarkdownRenderer.astro';
import DocumentMeta from './DocumentMeta.astro';
import type { Document } from '../types/document.type';

interface Props {
  document: Document;
}

const { document } = Astro.props;
---

<article class="document-viewer">
  <header>
    <h1>{document.title}</h1>
    <DocumentMeta document={document} />
  </header>

  <div class="content">
    <MarkdownRenderer content={document.content} />
  </div>
</article>

<style>
  .document-viewer {
    max-width: 800px;
    margin: 0 auto;
  }

  header h1 {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: var(--color-text-primary);
  }

  .content {
    margin-top: 2rem;
  }
</style>
```

---

### **2. Editor Feature** (`editor/`)

#### **editor/stores/editor.store.ts**

```typescript
import { atom, map } from "nanostores";

export interface EditorState {
  isEditing: boolean;
  isSaving: boolean;
  lastSaved: Date | null;
  hasUnsavedChanges: boolean;
  otherUsers: Array<{
    userId: string;
    username: string;
  }>;
}

export const editorStore = map<EditorState>({
  isEditing: false,
  isSaving: false,
  lastSaved: null,
  hasUnsavedChanges: false,
  otherUsers: [],
});

export const setEditing = (value: boolean) => {
  editorStore.setKey("isEditing", value);
};

export const setSaving = (value: boolean) => {
  editorStore.setKey("isSaving", value);
};

export const setLastSaved = (date: Date) => {
  editorStore.setKey("lastSaved", date);
  editorStore.setKey("hasUnsavedChanges", false);
};

export const addUser = (user: { userId: string; username: string }) => {
  const users = editorStore.get().otherUsers;
  if (!users.find((u) => u.userId === user.userId)) {
    editorStore.setKey("otherUsers", [...users, user]);
  }
};

export const removeUser = (userId: string) => {
  const users = editorStore.get().otherUsers.filter((u) => u.userId !== userId);
  editorStore.setKey("otherUsers", users);
};
```

#### **editor/services/editor.service.ts**

```typescript
import { apiService } from "@/shared/services/api.service";
import { setSaving, setLastSaved } from "../stores/editor.store";

export const editorService = {
  async saveDraft(documentId: number, content: string): Promise<void> {
    setSaving(true);
    try {
      await apiService.put(`/documents/${documentId}/draft`, {
        content,
      });
      setLastSaved(new Date());
    } finally {
      setSaving(false);
    }
  },

  async publishDocument(documentId: number): Promise<void> {
    await apiService.put(`/documents/${documentId}/publish`);
  },

  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("image", file);

    const { data } = await apiService.post<{ url: string }>(
      "/upload/image",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    return data.url;
  },
};
```

#### **editor/components/SimpleMDEditor.tsx**

```typescript
import { useEffect, useRef } from "react";
import SimpleMDE from "simplemde";
import { useStore } from "@nanostores/react";
import { editorStore, setEditing } from "../stores/editor.store";
import { editorService } from "../services/editor.service";
import { presenceService } from "../services/presence.service";
import PresenceIndicator from "./PresenceIndicator";
import "simplemde/dist/simplemde.min.css";

interface Props {
  documentId: number;
  initialContent: string;
}

export function SimpleMDEditor({ documentId, initialContent }: Props) {
  const editorRef = useRef<SimpleMDE | null>(null);
  const state = useStore(editorStore);
  let autoSaveTimeout: NodeJS.Timeout;

  useEffect(() => {
    // Inicializar SimpleMDE
    editorRef.current = new SimpleMDE({
      element: document.getElementById("editor") as HTMLTextAreaElement,
      initialValue: initialContent,
      spellChecker: false,
      toolbar: [
        "bold",
        "italic",
        "heading",
        "|",
        "quote",
        "code",
        "link",
        "image",
        "|",
        "preview",
        "side-by-side",
        "fullscreen",
      ],
      status: ["lines", "words", "cursor"],
    });

    // Conectar WebSocket
    presenceService.connect(documentId);
    setEditing(true);

    // Auto-save
    editorRef.current.codemirror.on("change", () => {
      clearTimeout(autoSaveTimeout);
      autoSaveTimeout = setTimeout(() => {
        const content = editorRef.current?.value() || "";
        editorService.saveDraft(documentId, content);
      }, 5000);
    });

    // Cleanup
    return () => {
      presenceService.disconnect();
      setEditing(false);
      editorRef.current?.toTextArea();
    };
  }, [documentId]);

  const handlePublish = async () => {
    await editorService.publishDocument(documentId);
    window.location.href = `/docs/${documentId}`;
  };

  return (
    <div className="editor-container">
      <div className="editor-header">
        <PresenceIndicator users={state.otherUsers} />

        <div className="editor-actions">
          {state.isSaving && (
            <span className="saving-indicator">Guardando...</span>
          )}
          {state.lastSaved && (
            <span className="last-saved">
              Último guardado: {state.lastSaved.toLocaleTimeString()}
            </span>
          )}
          <button onClick={handlePublish} className="btn-publish">
            Publicar
          </button>
        </div>
      </div>

      <textarea id="editor" />
    </div>
  );
}
```

#### **editor/components/PresenceIndicator.tsx**

```typescript
interface Props {
  users: Array<{ userId: string; username: string }>;
}

export default function PresenceIndicator({ users }: Props) {
  if (users.length === 0) return null;

  return (
    <div className="presence-indicator">
      <span className="presence-dot"></span>
      <span>
        {users.length === 1
          ? `${users[0].username} está editando`
          : `${users.length} usuarios editando`}
      </span>
    </div>
  );
}
```

#### **editor/services/presence.service.ts**

```typescript
import { websocketService } from "@/shared/services/websocket.service";
import { addUser, removeUser } from "../stores/editor.store";

export const presenceService = {
  connect(documentId: number) {
    const socket = websocketService.connect("/presence");

    socket.emit("editing-start", {
      documentId,
      userId: "user-1", // TODO: Get from auth
      username: "Usuario",
    });

    socket.on("user-editing", (user) => {
      addUser(user);
    });

    socket.on("user-stopped-editing", ({ userId }) => {
      removeUser(userId);
    });

    socket.on("user-left", ({ userId }) => {
      removeUser(userId);
    });
  },

  disconnect() {
    websocketService.disconnect();
  },
};
```

---

### **3. Search Feature** (`search/`)

#### **search/stores/search.store.ts**

```typescript
import { atom, map } from "nanostores";
import type { SearchResult } from "../types/search.type";

export const searchStore = map({
  query: "",
  results: [] as SearchResult[],
  isSearching: false,
  hasSearched: false,
});

export const setQuery = (query: string) => {
  searchStore.setKey("query", query);
};

export const setResults = (results: SearchResult[]) => {
  searchStore.setKey("results", results);
  searchStore.setKey("hasSearched", true);
};

export const setSearching = (value: boolean) => {
  searchStore.setKey("isSearching", value);
};
```

#### **search/services/search.service.ts**

```typescript
import { apiService } from "@/shared/services/api.service";
import { setResults, setSearching } from "../stores/search.store";
import type { SearchResult } from "../types/search.type";

export const searchService = {
  async search(query: string): Promise<SearchResult[]> {
    if (!query.trim()) {
      setResults([]);
      return [];
    }

    setSearching(true);
    try {
      const { data } = await apiService.get<SearchResult[]>("/search", {
        params: { q: query },
      });
      setResults(data);
      return data;
    } finally {
      setSearching(false);
    }
  },
};
```

#### **search/components/SearchBar.tsx**

```typescript
import { useState } from "react";
import { useStore } from "@nanostores/react";
import { searchStore, setQuery } from "../stores/search.store";
import { searchService } from "../services/search.service";
import { useDebounce } from "@/shared/hooks/useDebounce";

export function SearchBar() {
  const [input, setInput] = useState("");
  const state = useStore(searchStore);
  const debouncedSearch = useDebounce((value: string) => {
    setQuery(value);
    searchService.search(value);
  }, 300);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);
    debouncedSearch(value);
  };

  return (
    <div className="search-bar">
      <input
        type="search"
        placeholder="Buscar documentación..."
        value={input}
        onChange={handleChange}
        className="search-input"
      />
      {state.isSearching && <span className="search-loader">Buscando...</span>}
    </div>
  );
}
```

---

## 🎨 **SISTEMA DE DISEÑO**

### **Colores (CSS Variables)**

```css
/* styles/themes/light.css */
:root {
  --color-bg-primary: #ffffff;
  --color-bg-secondary: #f5f5f5;
  --color-text-primary: #1a1a1a;
  --color-text-secondary: #666666;
  --color-accent: #0070f3;
  --color-border: #e5e5e5;
  --color-code-bg: #fafafa;
}

/* styles/themes/dark.css */
[data-theme="dark"] {
  --color-bg-primary: #0a0a0a;
  --color-bg-secondary: #1a1a1a;
  --color-text-primary: #e5e5e5;
  --color-text-secondary: #a0a0a0;
  --color-accent: #0070f3;
  --color-border: #333333;
  --color-code-bg: #161616;
}
```

### **Componentes UI Base**

```astro
---
// src/components/ui/Button.astro
interface Props {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
}

const { variant = 'primary', size = 'md', href } = Astro.props;
const Tag = href ? 'a' : 'button';
---

<Tag
  class:list={[
    'button',
    `button--${variant}`,
    `button--${size}`
  ]}
  href={href}
>
  <slot />
</Tag>

<style>
  .button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.5rem;
    font-weight: 500;
    transition: all 0.2s;
  }

  .button--primary {
    background: var(--color-accent);
    color: white;
  }

  .button--md {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  }
</style>
```

---

---

## 🔷 **SHARED LAYER**

### **shared/services/api.service.ts**

```typescript
import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";

class ApiService {
  private client: AxiosInstance;

  constructor() {
    const API_URL = import.meta.env.PUBLIC_API_URL || "http://localhost:3000";

    this.client = axios.create({
      baseURL: `${API_URL}/api`,
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 10000,
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // TODO: Add auth token
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error("API Error:", error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig) {
    return this.client.get<T>(url, config);
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.client.post<T>(url, data, config);
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.client.put<T>(url, data, config);
  }

  async delete<T>(url: string, config?: AxiosRequestConfig) {
    return this.client.delete<T>(url, config);
  }
}

export const apiService = new ApiService();
```

### **shared/services/websocket.service.ts**

```typescript
import { io, type Socket } from "socket.io-client";

class WebSocketService {
  private socket: Socket | null = null;
  private readonly WS_URL =
    import.meta.env.PUBLIC_WS_URL || "http://localhost:3000";

  connect(namespace: string = "/"): Socket {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io(`${this.WS_URL}${namespace}`, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on("connect", () => {
      console.log("WebSocket connected");
    });

    this.socket.on("disconnect", () => {
      console.log("WebSocket disconnected");
    });

    this.socket.on("error", (error) => {
      console.error("WebSocket error:", error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }
}

export const websocketService = new WebSocketService();
```

### **shared/services/storage.service.ts**

```typescript
class StorageService {
  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return null;
    }
  }

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Error writing to localStorage:", error);
    }
  }

  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error("Error removing from localStorage:", error);
    }
  }

  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error("Error clearing localStorage:", error);
    }
  }
}

export const storageService = new StorageService();
```

### **shared/stores/theme.store.ts**

```typescript
import { atom } from "nanostores";
import { storageService } from "../services/storage.service";

type Theme = "light" | "dark";

const THEME_KEY = "theme";

export const themeStore = atom<Theme>(
  storageService.get<Theme>(THEME_KEY) || "light"
);

export const toggleTheme = () => {
  const current = themeStore.get();
  const next = current === "light" ? "dark" : "light";
  themeStore.set(next);
  storageService.set(THEME_KEY, next);
  document.documentElement.setAttribute("data-theme", next);
};

export const setTheme = (theme: Theme) => {
  themeStore.set(theme);
  storageService.set(THEME_KEY, theme);
  document.documentElement.setAttribute("data-theme", theme);
};

// Initialize theme on load
if (typeof window !== "undefined") {
  const savedTheme = storageService.get<Theme>(THEME_KEY) || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);
}
```

### **shared/utils/slug.util.ts**

```typescript
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .trim();
}

export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}
```

### **shared/hooks/useDebounce.ts**

```typescript
import { useEffect, useState, useRef } from "react";

export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return ((...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }) as T;
}
```

### **shared/components/ui/Button.astro**

```astro
---
interface Props {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

const {
  variant = 'primary',
  size = 'md',
  href,
  type = 'button',
  disabled = false,
} = Astro.props;

const Tag = href ? 'a' : 'button';
---

<Tag
  class:list={['button', `button--${variant}`, `button--${size}`, { 'button--disabled': disabled }]}
  href={href}
  type={!href ? type : undefined}
  disabled={!href ? disabled : undefined}
>
  <slot />
</Tag>

<style>
  .button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    border: none;
    border-radius: 0.5rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    text-decoration: none;
  }

  .button--primary {
    background: var(--color-accent);
    color: white;
  }

  .button--primary:hover {
    background: var(--color-accent-hover);
  }

  .button--secondary {
    background: var(--color-bg-secondary);
    color: var(--color-text-primary);
    border: 1px solid var(--color-border);
  }

  .button--ghost {
    background: transparent;
    color: var(--color-text-secondary);
  }

  .button--danger {
    background: var(--color-danger);
    color: white;
  }

  .button--sm {
    padding: 0.375rem 0.75rem;
    font-size: 0.875rem;
  }

  .button--md {
    padding: 0.5rem 1rem;
    font-size: 1rem;
  }

  .button--lg {
    padding: 0.75rem 1.5rem;
    font-size: 1.125rem;
  }

  .button--disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
```

---

### **4. Markdown Feature** (`markdown/`)

#### **markdown/services/markdown.service.ts**

```typescript
import { marked } from "marked";
import { getHighlighter, type Highlighter } from "shiki";

class MarkdownService {
  private highlighter: Highlighter | null = null;

  async initialize() {
    this.highlighter = await getHighlighter({
      themes: ["github-dark", "github-light"],
      langs: [
        "javascript",
        "typescript",
        "python",
        "bash",
        "json",
        "html",
        "css",
      ],
    });

    this.setupRenderer();
  }

  private setupRenderer() {
    marked.use({
      renderer: {
        code: (code, lang) => {
          if (!this.highlighter) return `<pre><code>${code}</code></pre>`;

          const highlighted = this.highlighter.codeToHtml(code, {
            lang: lang || "text",
            theme: "github-dark",
          });

          return `
            <div class="code-block">
              <div class="code-header">
                <span class="code-lang">${lang || "text"}</span>
                <button class="copy-button" data-code="${this.encodeCode(
                  code
                )}">
                  Copy
                </button>
              </div>
              ${highlighted}
            </div>
          `;
        },
        heading: (text, level) => {
          const slug = this.slugify(text);
          return `
            <h${level} id="${slug}">
              <a href="#${slug}" class="heading-link">#</a>
              ${text}
            </h${level}>
          `;
        },
      },
    });
  }

  render(content: string): string {
    return marked.parse(content) as string;
  }

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
  }

  private encodeCode(code: string): string {
    return encodeURIComponent(code);
  }
}

export const markdownService = new MarkdownService();
```

---

#### **markdown/components/MarkdownRenderer.astro**

```astro
---
import { markdownService } from '../services/markdown.service';

interface Props {
  content: string;
}

const { content } = Astro.props;

// Initialize markdown service
await markdownService.initialize();

const html = markdownService.render(content);
---

<div class="markdown-content" set:html={html} />

<script>
  // Copy button functionality
  document.querySelectorAll('.copy-button').forEach((button) => {
    button.addEventListener('click', async (e) => {
      const btn = e.target as HTMLButtonElement;
      const code = decodeURIComponent(btn.dataset.code || '');

      await navigator.clipboard.writeText(code);

      btn.textContent = 'Copied!';
      setTimeout(() => {
        btn.textContent = 'Copy';
      }, 2000);
    });
  });
</script>

<style>
  .markdown-content {
    line-height: 1.7;
    color: var(--color-text-primary);
  }

  .markdown-content :global(h1),
  .markdown-content :global(h2),
  .markdown-content :global(h3) {
    margin-top: 2rem;
    margin-bottom: 1rem;
    font-weight: 600;
  }

  .markdown-content :global(h1) {
    font-size: 2.25rem;
  }

  .markdown-content :global(h2) {
    font-size: 1.875rem;
  }

  .markdown-content :global(h3) {
    font-size: 1.5rem;
  }

  .markdown-content :global(p) {
    margin-bottom: 1rem;
  }

  .markdown-content :global(code) {
    background: var(--color-code-bg);
    padding: 0.2rem 0.4rem;
    border-radius: 0.25rem;
    font-size: 0.875em;
    font-family: 'Fira Code', monospace;
  }

  .markdown-content :global(.code-block) {
    position: relative;
    margin: 1.5rem 0;
  }

  .markdown-content :global(.code-header) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 1rem;
    background: var(--color-bg-secondary);
    border-bottom: 1px solid var(--color-border);
  }

  .markdown-content :global(.copy-button) {
    padding: 0.25rem 0.75rem;
    font-size: 0.875rem;
    background: var(--color-accent);
    color: white;
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;
  }
</style>
```

---

## 📱 **RESPONSIVE DESIGN**

```css
/* styles/global.css */
.docs-layout {
  display: grid;
  grid-template-areas:
    "header header header"
    "sidebar main toc";
  grid-template-columns: 250px 1fr 250px;
  gap: 2rem;
}

@media (max-width: 1024px) {
  .docs-layout {
    grid-template-areas:
      "header"
      "main";
    grid-template-columns: 1fr;
  }

  aside {
    display: none;
  }
}
```

---

## ⚡ **OPTIMIZACIONES**

### **1. Image Optimization**

```astro
---
import { Image } from 'astro:assets';
---

<Image
  src={imageUrl}
  alt={alt}
  width={800}
  height={600}
  loading="lazy"
  format="webp"
/>
```

### **2. Code Splitting**

```typescript
// Carga diferida de editor
const SimpleMDEditor = lazy(() => import("@/components/editor/SimpleMDEditor"));
```

### **3. Prefetch**

```astro
<link rel="prefetch" href="/api/documents/popular" />
```

---

## 🧪 **TESTING**

```typescript
// tests/components/Button.test.ts
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { expect, test } from "vitest";
import Button from "@/components/ui/Button.astro";

test("Button renders correctly", async () => {
  const container = await AstroContainer.create();
  const result = await container.renderToString(Button, {
    props: { variant: "primary" },
  });

  expect(result).toContain("button--primary");
});
```

---

## 🚀 **DEPLOYMENT**

### **Build para Producción**

```bash
npm run build
# Output: dist/ (SSR server + static assets)

npm run preview # Test production build
```

### **Variables de Entorno**

```env
PUBLIC_API_URL=https://api.docs.example.com
PUBLIC_WS_URL=wss://api.docs.example.com
```

---

**Siguiente**: Ver [Backend ARCHITECTURE](../docs-backend/ARCHITECTURE.md)
