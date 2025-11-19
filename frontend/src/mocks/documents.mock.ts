export interface MockDocument {
  id: number;
  slug: string;
  title: string;
  content: string;
  category: string;
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  excerpt?: string;
}

export interface MockCategory {
  id: number;
  name: string;
  count: number;
  icon?: string;
}

export const MOCK_CATEGORIES: MockCategory[] = [
  { id: 1, name: 'Getting Started', count: 3, icon: '🚀' },
  { id: 2, name: 'Architecture', count: 4, icon: '🏗️' },
  { id: 3, name: 'API Reference', count: 5, icon: '📚' },
  { id: 4, name: 'Guides', count: 3, icon: '📖' },
];

export const MOCK_DOCUMENTS: MockDocument[] = [
  // Getting Started
  {
    id: 1,
    slug: 'instalacion',
    title: 'Guía de Instalación',
    category: 'Getting Started',
    status: 'published',
    createdAt: '2025-11-01T10:00:00Z',
    updatedAt: '2025-11-18T14:30:00Z',
    createdBy: 'Antonio Moral',
    excerpt: 'Aprende a instalar Ailurus en tu proyecto paso a paso.',
    content: `# Guía de Instalación

Ailurus es un framework de documentación moderno que combina la potencia de Astro y NestJS.

## Requisitos Previos

Antes de instalar Ailurus, asegúrate de tener:

- **Node.js** v18 o superior
- **pnpm** v8 o superior (recomendado)
- **Git** para clonar el repositorio

## Instalación con CLI

La forma más rápida de empezar es usar el CLI de Ailurus:

\`\`\`bash
# Instalar CLI globalmente
npm install -g ailurus-cli

# Crear nuevo proyecto
ailurus init my-docs

# Navegar al directorio
cd my-docs

# Instalar dependencias
pnpm install

# Iniciar servidor de desarrollo
pnpm dev
\`\`\`

## Instalación Manual

Si prefieres configurar manualmente:

\`\`\`bash
# Clonar repositorio
git clone https://github.com/ailurus/ailurus.git
cd ailurus

# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.example .env

# Iniciar servicios
pnpm dev
\`\`\`

## Configuración Inicial

Edita el archivo \`astro.config.mjs\`:

\`\`\`javascript
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [react()],
  server: {
    port: 4321,
  },
});
\`\`\`

## Siguiente Paso

Una vez instalado, consulta la [Guía de Inicio Rápido](/docs/quick-start) para crear tu primer documento.
`
  },
  {
    id: 2,
    slug: 'quick-start',
    title: 'Inicio Rápido',
    category: 'Getting Started',
    status: 'published',
    createdAt: '2025-11-02T09:00:00Z',
    updatedAt: '2025-11-17T16:20:00Z',
    createdBy: 'Antonio Moral',
    excerpt: 'Crea tu primer documento en menos de 5 minutos.',
    content: `# Inicio Rápido

Esta guía te llevará desde cero hasta tu primer documento publicado en **menos de 5 minutos**.

## Crear un Documento

1. Navega a la sección de documentos
2. Haz clic en "Nuevo Documento"
3. Escribe tu contenido en Markdown

### Ejemplo de Contenido

\`\`\`markdown
# Mi Primer Documento

Este es un **ejemplo** de contenido con:

- Listas
- **Negrita**
- *Cursiva*
- [Links](https://example.com)
\`\`\`

## Sintaxis Markdown Soportada

Ailurus soporta Markdown estándar más extensiones:

### Code Blocks

\`\`\`typescript
interface User {
  id: number;
  name: string;
  email: string;
}

const user: User = {
  id: 1,
  name: 'Antonio',
  email: 'antonio@example.com'
};
\`\`\`

### Tablas

| Feature | Status |
|---------|--------|
| Markdown | ✅ |
| Code Syntax | ✅ |
| Mermaid | ✅ |

### Alertas

> **Nota:** Esta es una nota importante.

> **Advertencia:** Ten cuidado con este comando.

## Publicar el Documento

Cuando estés listo:

1. Haz clic en "Guardar"
2. Revisa el preview
3. Haz clic en "Publicar"

¡Tu documento estará visible inmediatamente!

## Próximos Pasos

- [Arquitectura del Sistema](/docs/arquitectura)
- [Guía del Editor](/docs/editor-guide)
- [API Reference](/docs/api-overview)
`
  },
  {
    id: 3,
    slug: 'configuracion',
    title: 'Configuración Avanzada',
    category: 'Getting Started',
    status: 'published',
    createdAt: '2025-11-03T11:00:00Z',
    updatedAt: '2025-11-16T10:00:00Z',
    createdBy: 'Antonio Moral',
    excerpt: 'Configura Ailurus para adaptarlo a tus necesidades.',
    content: `# Configuración Avanzada

Personaliza Ailurus según las necesidades de tu proyecto.

## Variables de Entorno

Crea un archivo \`.env\` en la raíz del proyecto:

\`\`\`env
# Frontend
PUBLIC_API_URL=http://localhost:3000
PUBLIC_WS_URL=ws://localhost:3000

# Backend
DATABASE_URL=file:./dev.db
JWT_SECRET=your-secret-key-here
PORT=3000
\`\`\`

## Configuración del Frontend

### Tailwind CSS

Edita \`tailwind.config.mjs\`:

\`\`\`javascript
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'ailurus-red': '#E74C3C',
        'ailurus-orange': '#FF9800',
      },
    },
  },
};
\`\`\`

### Astro Config

\`\`\`javascript
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  output: 'server',
  integrations: [
    react(),
    tailwind({ applyBaseStyles: false }),
  ],
  vite: {
    ssr: {
      noExternal: ['nanostores', 'socket.io-client'],
    },
  },
});
\`\`\`

## Configuración del Backend

### NestJS

Edita la configuración en \`backend/src/config/\`:

\`\`\`typescript
// config/database.config.ts
export default {
  type: 'sqlite',
  database: process.env.DATABASE_URL || './dev.db',
  synchronize: true, // Solo en desarrollo
  logging: true,
};
\`\`\`

## Temas Personalizados

Crea tu propio tema editando \`src/styles/themes/custom.css\`:

\`\`\`css
[data-theme="custom"] {
  --color-bg-primary: #ffffff;
  --color-text-primary: #1a1a1a;
  --color-accent: #your-color;
}
\`\`\`

## Próximos Pasos

- [Arquitectura del Backend](/docs/backend-architecture)
- [Despliegue en Producción](/docs/deployment)
`
  },

  // Architecture
  {
    id: 4,
    slug: 'arquitectura',
    title: 'Arquitectura del Sistema',
    category: 'Architecture',
    status: 'published',
    createdAt: '2025-11-04T14:00:00Z',
    updatedAt: '2025-11-18T09:00:00Z',
    createdBy: 'Antonio Moral',
    excerpt: 'Entiende la arquitectura completa de Ailurus.',
    content: `# Arquitectura del Sistema

Ailurus está construido con una arquitectura moderna y escalable.

## Stack Tecnológico

### Frontend
- **Astro** ^4.0.0 - SSR y generación estática
- **React** ^18.2.0 - Componentes interactivos (Islands)
- **Tailwind CSS** - Estilos utility-first
- **Nanostores** - Estado global ligero

### Backend
- **NestJS** ^10.0.0 - Framework Node.js
- **SQLite** con FTS5 - Base de datos
- **Socket.io** - WebSocket para tiempo real
- **TypeScript** - Type safety

## Diagrama de Arquitectura

\`\`\`
┌─────────────────┐         ┌─────────────────┐
│  Astro Frontend │◄───────►│  NestJS Backend │
│   (Port 4321)   │   REST  │   (Port 3000)   │
└────────┬────────┘         └────────┬────────┘
         │                           │
         │                           │
    ┌────▼────┐                 ┌────▼────┐
    │ Browser │                 │ SQLite  │
    │ Client  │                 │   DB    │
    └─────────┘                 └─────────┘
         │
    WebSocket
         │
    ┌────▼────────┐
    │   Socket.io │
    │   Gateway   │
    └─────────────┘
\`\`\`

## Separación de Responsabilidades

### Frontend (Astro)
- Renderizado SSR de páginas
- SEO y performance
- UI/UX e interacciones
- State management local

### Backend (NestJS)
- API REST endpoints
- Lógica de negocio
- Persistencia de datos
- WebSocket para presencia

## Flujo de Datos

1. **Usuario** accede a \`/docs/instalacion\`
2. **Astro SSR** hace fetch a \`GET /api/documents/instalacion\`
3. **NestJS** consulta SQLite y retorna JSON
4. **Astro** renderiza Markdown a HTML
5. **Browser** recibe HTML completo (SEO friendly)

## Comunicación REST

### Endpoints Principales

\`\`\`typescript
// Listar documentos
GET /api/documents
Response: Document[]

// Obtener documento
GET /api/documents/:slug
Response: Document

// Guardar draft
PUT /api/documents/:id/draft
Body: { content: string }

// Publicar
PUT /api/documents/:id/publish
\`\`\`

## WebSocket para Presencia

\`\`\`typescript
// Cliente conecta al namespace /presence
socket.emit('editing-start', {
  documentId: 1,
  userId: 'user-123',
  username: 'Antonio'
});

// Servidor broadcast a otros usuarios
socket.broadcast.emit('user-editing', {
  userId: 'user-123',
  username: 'Antonio'
});
\`\`\`

## Ventajas de esta Arquitectura

✅ **Separación clara** de concerns  
✅ **Escalable** - Deploy independiente  
✅ **SEO optimizado** - SSR completo  
✅ **Performance** - Islands Architecture  
✅ **Type-safe** - TypeScript end-to-end

## Próximos Pasos

- [Backend Architecture](/docs/backend-architecture)
- [Frontend Architecture](/docs/frontend-architecture)
- [Database Schema](/docs/database-schema)
`
  },
  {
    id: 5,
    slug: 'frontend-architecture',
    title: 'Arquitectura del Frontend',
    category: 'Architecture',
    status: 'published',
    createdAt: '2025-11-05T10:00:00Z',
    updatedAt: '2025-11-17T13:00:00Z',
    createdBy: 'Antonio Moral',
    excerpt: 'Detalles de la arquitectura del frontend con Astro.',
    content: `# Arquitectura del Frontend

El frontend de Ailurus está construido con **Astro** usando Islands Architecture.

## Feature-Based Structure

Organización por features/dominios:

\`\`\`
src/
├── documents/        # Feature: Docs
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── types/
├── editor/          # Feature: Editor
├── search/          # Feature: Search
└── shared/          # Código compartido
\`\`\`

## Islands Architecture

Solo los componentes que necesitan interactividad usan React:

\`\`\`astro
---
import { SearchBar } from './SearchBar';
---

<!-- Componente estático -->
<header>
  <h1>Documentación</h1>
  
  <!-- Island interactivo -->
  <SearchBar client:load />
</header>
\`\`\`

## Routing

Astro maneja el routing basado en archivos:

\`\`\`
pages/
├── index.astro           → /
└── docs/
    ├── index.astro       → /docs
    └── [...slug].astro   → /docs/:slug
\`\`\`

## State Management

Usamos **Nanostores** para estado global:

\`\`\`typescript
// stores/theme.store.ts
import { atom } from 'nanostores';

export const themeStore = atom<'light' | 'dark'>('light');

export function toggleTheme() {
  const current = themeStore.get();
  themeStore.set(current === 'light' ? 'dark' : 'light');
}
\`\`\`

## API Communication

Centralized API service:

\`\`\`typescript
// services/api.service.ts
class ApiService {
  private client = axios.create({
    baseURL: import.meta.env.PUBLIC_API_URL,
  });

  async get<T>(url: string) {
    return this.client.get<T>(url);
  }
}

export const apiService = new ApiService();
\`\`\`

## Optimizaciones

### SSR First
- HTML completo en primera carga
- SEO perfecto
- Time to First Byte bajo

### Code Splitting
- Chunks automáticos por ruta
- Lazy loading de componentes React

### Image Optimization
\`\`\`astro
<Image
  src={url}
  alt="Description"
  width={800}
  height={600}
  format="webp"
  loading="lazy"
/>
\`\`\`

## Próximos Pasos

- [Backend Architecture](/docs/backend-architecture)
- [Component Library](/docs/component-library)
`
  },
  {
    id: 6,
    slug: 'backend-architecture',
    title: 'Arquitectura del Backend',
    category: 'Architecture',
    status: 'published',
    createdAt: '2025-11-06T09:00:00Z',
    updatedAt: '2025-11-15T11:00:00Z',
    createdBy: 'Antonio Moral',
    excerpt: 'Estructura y patrones del backend NestJS.',
    content: `# Arquitectura del Backend

Backend construido con **NestJS** siguiendo principios SOLID.

## Estructura de Módulos

\`\`\`
src/
├── documents/
│   ├── documents.controller.ts
│   ├── documents.service.ts
│   ├── documents.module.ts
│   └── dto/
├── search/
├── upload/
└── websocket/
\`\`\`

## Patrón Repository

\`\`\`typescript
@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private documentsRepository: Repository<Document>,
  ) {}

  async findBySlug(slug: string): Promise<Document> {
    return this.documentsRepository.findOne({
      where: { slug },
    });
  }
}
\`\`\`

## DTOs y Validación

\`\`\`typescript
export class CreateDocumentDto {
  @IsString()
  @MinLength(3)
  title: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  category?: string;
}
\`\`\`

## WebSocket Gateway

\`\`\`typescript
@WebSocketGateway()
export class PresenceGateway {
  @SubscribeMessage('editing-start')
  handleEditingStart(
    @MessageBody() data: EditingStartDto,
    @ConnectedSocket() client: Socket,
  ) {
    client.broadcast.emit('user-editing', data);
  }
}
\`\`\`

## Database con TypeORM

\`\`\`typescript
@Entity()
export class Document {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  slug: string;

  @Column('text')
  content: string;

  @Column({ type: 'varchar', default: 'draft' })
  status: 'draft' | 'published' | 'archived';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
\`\`\`

## Próximos Pasos

- [API Reference](/docs/api-overview)
- [Database Schema](/docs/database-schema)
`
  },
  {
    id: 7,
    slug: 'database-schema',
    title: 'Database Schema',
    category: 'Architecture',
    status: 'published',
    createdAt: '2025-11-07T15:00:00Z',
    updatedAt: '2025-11-14T16:00:00Z',
    createdBy: 'Antonio Moral',
    excerpt: 'Esquema completo de la base de datos SQLite.',
    content: `# Database Schema

Ailurus usa **SQLite** con extensión **FTS5** para búsqueda full-text.

## Tabla: documents

\`\`\`sql
CREATE TABLE documents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT CHECK(status IN ('draft', 'published', 'archived')) DEFAULT 'draft',
  category TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_by TEXT
);
\`\`\`

## Tabla FTS5: documents_fts

Para búsqueda full-text:

\`\`\`sql
CREATE VIRTUAL TABLE documents_fts USING fts5(
  title,
  content,
  content=documents,
  content_rowid=id
);
\`\`\`

## Tabla: document_versions (Futuro v0.5)

\`\`\`sql
CREATE TABLE document_versions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  document_id INTEGER NOT NULL,
  version_number INTEGER NOT NULL,
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_by TEXT,
  FOREIGN KEY (document_id) REFERENCES documents(id)
);
\`\`\`

## Tabla: analytics_events

\`\`\`sql
CREATE TABLE analytics_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_type TEXT NOT NULL,
  event_data TEXT, -- JSON
  user_id TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

## Tabla: search_logs

\`\`\`sql
CREATE TABLE search_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  query TEXT NOT NULL,
  results_count INTEGER DEFAULT 0,
  user_id TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

## Índices

\`\`\`sql
CREATE INDEX idx_documents_slug ON documents(slug);
CREATE INDEX idx_documents_status ON documents(status);
CREATE INDEX idx_documents_category ON documents(category);
CREATE INDEX idx_analytics_event_type ON analytics_events(event_type);
\`\`\`

## Queries Comunes

### Búsqueda Full-Text

\`\`\`sql
SELECT 
  d.id,
  d.slug,
  d.title,
  snippet(documents_fts, 1, '<mark>', '</mark>', '...', 32) as excerpt,
  rank
FROM documents_fts
JOIN documents d ON documents_fts.rowid = d.id
WHERE documents_fts MATCH ?
ORDER BY rank
LIMIT 20;
\`\`\`

### Documentos por Categoría

\`\`\`sql
SELECT * FROM documents
WHERE category = ?
  AND status = 'published'
ORDER BY updated_at DESC;
\`\`\`

## Próximos Pasos

- [API Reference](/docs/api-overview)
- [Search Implementation](/docs/search-guide)
`
  },

  // API Reference
  {
    id: 8,
    slug: 'api-overview',
    title: 'API Overview',
    category: 'API Reference',
    status: 'published',
    createdAt: '2025-11-08T10:00:00Z',
    updatedAt: '2025-11-18T10:00:00Z',
    createdBy: 'Antonio Moral',
    excerpt: 'Descripción general de la API REST de Ailurus.',
    content: `# API Overview

API REST completa para interactuar con Ailurus.

## Base URL

\`\`\`
http://localhost:3000/api
\`\`\`

## Autenticación (v0.5+)

\`\`\`http
Authorization: Bearer {jwt_token}
\`\`\`

## Endpoints Disponibles

### Documents

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | \`/documents\` | Lista todos los documentos |
| GET | \`/documents/:slug\` | Obtiene un documento |
| POST | \`/documents\` | Crea documento |
| PUT | \`/documents/:id/draft\` | Guarda draft |
| PUT | \`/documents/:id/publish\` | Publica documento |
| DELETE | \`/documents/:id\` | Elimina documento |

### Search

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | \`/search?q={query}\` | Búsqueda full-text |

### Upload

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | \`/upload/image\` | Sube imagen |

## Response Format

### Success Response

\`\`\`json
{
  "success": true,
  "data": {
    "id": 1,
    "slug": "instalacion",
    "title": "Guía de Instalación"
  }
}
\`\`\`

### Error Response

\`\`\`json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Document not found",
    "statusCode": 404
  }
}
\`\`\`

## Rate Limiting (v0.5+)

- 100 requests / minuto por IP
- 1000 requests / hora por usuario autenticado

## Próximos Pasos

- [Documents API](/docs/api-documents)
- [Search API](/docs/api-search)
- [Upload API](/docs/api-upload)
`
  },
  {
    id: 9,
    slug: 'api-documents',
    title: 'Documents API',
    category: 'API Reference',
    status: 'published',
    createdAt: '2025-11-09T11:00:00Z',
    updatedAt: '2025-11-17T14:00:00Z',
    createdBy: 'Antonio Moral',
    excerpt: 'Endpoints para gestionar documentos.',
    content: `# Documents API

CRUD completo para documentos.

## GET /documents

Lista todos los documentos publicados.

### Query Parameters

\`\`\`
?category=Architecture
?status=published
?limit=20
?offset=0
\`\`\`

### Response

\`\`\`json
{
  "data": [
    {
      "id": 1,
      "slug": "instalacion",
      "title": "Guía de Instalación",
      "excerpt": "Aprende a instalar...",
      "category": "Getting Started",
      "updatedAt": "2025-11-18T14:30:00Z"
    }
  ],
  "total": 15,
  "limit": 20,
  "offset": 0
}
\`\`\`

## GET /documents/:slug

Obtiene un documento específico.

### Response

\`\`\`json
{
  "data": {
    "id": 1,
    "slug": "instalacion",
    "title": "Guía de Instalación",
    "content": "# Guía de Instalación\\n\\n...",
    "status": "published",
    "category": "Getting Started",
    "createdAt": "2025-11-01T10:00:00Z",
    "updatedAt": "2025-11-18T14:30:00Z",
    "createdBy": "Antonio Moral"
  }
}
\`\`\`

## POST /documents

Crea un nuevo documento.

### Request Body

\`\`\`json
{
  "title": "Mi Nuevo Documento",
  "content": "# Contenido\\n\\nTexto...",
  "category": "Guides"
}
\`\`\`

### Response

\`\`\`json
{
  "data": {
    "id": 16,
    "slug": "mi-nuevo-documento",
    "title": "Mi Nuevo Documento",
    "status": "draft"
  }
}
\`\`\`

## PUT /documents/:id/draft

Guarda un draft (auto-save).

### Request Body

\`\`\`json
{
  "content": "# Contenido actualizado\\n\\n..."
}
\`\`\`

### Response

\`\`\`json
{
  "success": true,
  "savedAt": "2025-11-18T15:45:00Z"
}
\`\`\`

## PUT /documents/:id/publish

Publica un documento.

### Response

\`\`\`json
{
  "success": true,
  "data": {
    "id": 1,
    "status": "published",
    "publishedAt": "2025-11-18T15:50:00Z"
  }
}
\`\`\`

## DELETE /documents/:id

Elimina un documento (soft delete).

### Response

\`\`\`json
{
  "success": true,
  "message": "Document archived"
}
\`\`\`

## Error Codes

| Code | Status | Description |
|------|--------|-------------|
| \`DOCUMENT_NOT_FOUND\` | 404 | Documento no existe |
| \`INVALID_SLUG\` | 400 | Slug inválido |
| \`UNAUTHORIZED\` | 401 | No autenticado |
| \`FORBIDDEN\` | 403 | Sin permisos |

## Próximos Pasos

- [Search API](/docs/api-search)
- [Upload API](/docs/api-upload)
`
  },
  {
    id: 10,
    slug: 'api-search',
    title: 'Search API',
    category: 'API Reference',
    status: 'published',
    createdAt: '2025-11-10T12:00:00Z',
    updatedAt: '2025-11-16T09:00:00Z',
    createdBy: 'Antonio Moral',
    excerpt: 'API de búsqueda full-text con SQLite FTS5.',
    content: `# Search API

Búsqueda full-text optimizada con FTS5.

## GET /search

Busca en títulos y contenido de documentos.

### Query Parameters

\`\`\`
?q=instalacion          # Query obligatorio
?limit=20               # Resultados por página
?offset=0               # Paginación
?category=Architecture  # Filtro por categoría
\`\`\`

### Request Example

\`\`\`http
GET /api/search?q=instalacion&limit=10
\`\`\`

### Response

\`\`\`json
{
  "data": [
    {
      "id": 1,
      "slug": "instalacion",
      "title": "Guía de Instalación",
      "excerpt": "Aprende a <mark>instalar</mark> Ailurus...",
      "category": "Getting Started",
      "rank": 0.95,
      "updatedAt": "2025-11-18T14:30:00Z"
    }
  ],
  "total": 3,
  "query": "instalacion",
  "searchTime": "12ms"
}
\`\`\`

## Highlighting

Los términos encontrados vienen wrapped con \`<mark>\`:

\`\`\`html
<mark>instalacion</mark>
\`\`\`

## Ranking

Los resultados se ordenan por relevancia (rank):
- 1.0 = Match perfecto en título
- 0.5-0.9 = Match en contenido
- <0.5 = Match parcial

## Operadores de Búsqueda

### Frase Exacta

\`\`\`
?q="guía de instalación"
\`\`\`

### OR Operator

\`\`\`
?q=instalacion OR configuracion
\`\`\`

### NOT Operator

\`\`\`
?q=instalacion NOT windows
\`\`\`

### Wildcard

\`\`\`
?q=instal*
\`\`\`

## Search Analytics

Todas las búsquedas se registran en \`search_logs\`:

\`\`\`sql
INSERT INTO search_logs (query, results_count, user_id)
VALUES (?, ?, ?);
\`\`\`

## Performance

- Promedio: 10-30ms
- Índice FTS5 optimizado
- Cache de queries frecuentes (v0.5+)

## Próximos Pasos

- [Documents API](/docs/api-documents)
- [Search Implementation](/docs/search-guide)
`
  },
  {
    id: 11,
    slug: 'api-upload',
    title: 'Upload API',
    category: 'API Reference',
    status: 'published',
    createdAt: '2025-11-11T13:00:00Z',
    updatedAt: '2025-11-15T10:00:00Z',
    createdBy: 'Antonio Moral',
    excerpt: 'Subida y optimización de imágenes.',
    content: `# Upload API

Sube imágenes con compresión y conversión a WebP.

## POST /upload/image

Sube una imagen y retorna la URL.

### Request

\`\`\`http
POST /api/upload/image
Content-Type: multipart/form-data

image: File
\`\`\`

### Restricciones

- **Tamaño máximo**: 5 MB
- **Formatos**: JPEG, PNG, GIF, WebP
- **Dimensiones máximas**: 4096x4096

### Response

\`\`\`json
{
  "success": true,
  "data": {
    "url": "/uploads/images/abc123-imagen.webp",
    "originalUrl": "/uploads/images/abc123-imagen.jpg",
    "width": 1920,
    "height": 1080,
    "size": 245678,
    "format": "webp"
  }
}
\`\`\`

## Procesamiento

1. Validar formato y tamaño
2. Comprimir con Sharp
3. Convertir a WebP
4. Guardar versión original (fallback)
5. Retornar URLs

### Ejemplo con Sharp

\`\`\`typescript
const processedImage = await sharp(buffer)
  .resize(2000, 2000, { fit: 'inside' })
  .webp({ quality: 85 })
  .toFile(outputPath);
\`\`\`

## Storage

Imágenes guardadas en:

\`\`\`
public/uploads/images/
├── abc123-imagen.webp
└── abc123-imagen.jpg  (fallback)
\`\`\`

## Inserción en Markdown

\`\`\`markdown
![Descripción](/uploads/images/abc123-imagen.webp)
\`\`\`

## Error Codes

| Code | Status | Description |
|------|--------|-------------|
| \`FILE_TOO_LARGE\` | 413 | Archivo > 5MB |
| \`INVALID_FORMAT\` | 400 | Formato no soportado |
| \`UPLOAD_FAILED\` | 500 | Error al guardar |

## Próximos Pasos

- [Editor Guide](/docs/editor-guide)
- [Markdown Syntax](/docs/markdown-syntax)
`
  },
  {
    id: 12,
    slug: 'api-websocket',
    title: 'WebSocket API',
    category: 'API Reference',
    status: 'published',
    createdAt: '2025-11-12T14:00:00Z',
    updatedAt: '2025-11-14T15:00:00Z',
    createdBy: 'Antonio Moral',
    excerpt: 'WebSocket para presencia en tiempo real.',
    content: `# WebSocket API

Comunicación en tiempo real con Socket.io.

## Conexión

\`\`\`typescript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000/presence', {
  transports: ['websocket'],
});
\`\`\`

## Eventos: Cliente → Servidor

### editing-start

Usuario empieza a editar:

\`\`\`typescript
socket.emit('editing-start', {
  documentId: 1,
  userId: 'user-123',
  username: 'Antonio'
});
\`\`\`

### editing-stop

Usuario deja de editar:

\`\`\`typescript
socket.emit('editing-stop', {
  documentId: 1,
  userId: 'user-123'
});
\`\`\`

## Eventos: Servidor → Cliente

### user-editing

Otro usuario está editando:

\`\`\`typescript
socket.on('user-editing', (data) => {
  console.log(\`\${data.username} está editando\`);
  // Mostrar indicador de presencia
});
\`\`\`

### user-stopped-editing

Usuario dejó de editar:

\`\`\`typescript
socket.on('user-stopped-editing', (data) => {
  console.log(\`\${data.username} dejó de editar\`);
  // Remover indicador
});
\`\`\`

### user-left

Usuario se desconectó:

\`\`\`typescript
socket.on('user-left', (data) => {
  console.log(\`\${data.username} se desconectó\`);
});
\`\`\`

## Namespaces

| Namespace | Purpose |
|-----------|---------|
| \`/presence\` | Presencia en editor |
| \`/notifications\` | Notificaciones (v0.5+) |
| \`/collaboration\` | Edición colaborativa (v2.0) |

## Autenticación (v0.5+)

\`\`\`typescript
const socket = io('http://localhost:3000/presence', {
  auth: {
    token: 'jwt_token_here'
  }
});
\`\`\`

## Reconnection

\`\`\`typescript
socket.on('connect', () => {
  console.log('Conectado');
});

socket.on('disconnect', () => {
  console.log('Desconectado');
  // Auto-reconnect activado por defecto
});
\`\`\`

## Próximos Pasos

- [Editor Guide](/docs/editor-guide)
- [Real-time Collaboration](/docs/collaboration-guide)
`
  },

  // Guides
  {
    id: 13,
    slug: 'editor-guide',
    title: 'Guía del Editor',
    category: 'Guides',
    status: 'published',
    createdAt: '2025-11-13T10:00:00Z',
    updatedAt: '2025-11-18T11:00:00Z',
    createdBy: 'Antonio Moral',
    excerpt: 'Aprende a usar el editor Markdown de Ailurus.',
    content: `# Guía del Editor

El editor de Ailurus ofrece una experiencia fluida para escribir documentación.

## Características

✅ **Markdown WYSIWYG** con SimpleMDE  
✅ **Auto-save** cada 5 segundos  
✅ **Preview** en tiempo real  
✅ **Syntax highlighting** para código  
✅ **Drag & drop** de imágenes  
✅ **Presencia** de otros usuarios

## Toolbar

| Botón | Acción | Atajo |
|-------|--------|-------|
| **B** | Negrita | Ctrl+B |
| *I* | Cursiva | Ctrl+I |
| H | Heading | Ctrl+H |
| " | Quote | Ctrl+' |
| \`\`\` | Code block | Ctrl+K |
| 🔗 | Link | Ctrl+L |
| 🖼️ | Imagen | Ctrl+Alt+I |

## Subir Imágenes

### Drag & Drop

1. Arrastra imagen al editor
2. Espera el upload
3. Se inserta automáticamente

### Ctrl+V

1. Copia imagen
2. Ctrl+V en el editor
3. Se sube automáticamente

### Botón Upload

1. Click en 🖼️
2. Selecciona archivo
3. Se inserta en cursor

## Auto-save

El editor guarda automáticamente:

- Cada 5 segundos si hay cambios
- Al hacer blur del editor
- Antes de cerrar pestaña

Estado visible en header:
- ⏳ **Guardando...**
- ✅ **Guardado** (timestamp)
- ❌ **Error al guardar**

## Preview

Toggle entre modos:

- **Edit only**: Solo editor
- **Preview only**: Solo preview
- **Side by side**: Ambos

## Presencia

Si otro usuario está editando verás:

> 🟢 **Antonio está editando**

⚠️ **Warning**: Last save wins (sin resolución de conflictos en POC)

## Shortcuts

| Atajo | Acción |
|-------|--------|
| Ctrl+S | Guardar draft |
| Ctrl+Shift+P | Publicar |
| Ctrl+Shift+E | Toggle preview |
| Esc | Salir |

## Publicar

1. Verifica contenido en preview
2. Click en **Publicar**
3. Confirma acción
4. Documento visible inmediatamente

## Próximos Pasos

- [Markdown Syntax](/docs/markdown-syntax)
- [Image Optimization](/docs/image-optimization)
`
  },
  {
    id: 14,
    slug: 'markdown-syntax',
    title: 'Markdown Syntax',
    category: 'Guides',
    status: 'published',
    createdAt: '2025-11-14T11:00:00Z',
    updatedAt: '2025-11-17T12:00:00Z',
    createdBy: 'Antonio Moral',
    excerpt: 'Sintaxis Markdown completa soportada por Ailurus.',
    content: `# Markdown Syntax

Ailurus soporta Markdown estándar más extensiones.

## Headings

\`\`\`markdown
# Heading 1
## Heading 2
### Heading 3
#### Heading 4
\`\`\`

## Text Formatting

\`\`\`markdown
**Negrita**
*Cursiva*
***Negrita y cursiva***
~~Tachado~~
\`code inline\`
\`\`\`

## Lists

### Unordered

\`\`\`markdown
- Item 1
- Item 2
  - Subitem 2.1
  - Subitem 2.2
- Item 3
\`\`\`

### Ordered

\`\`\`markdown
1. First
2. Second
3. Third
\`\`\`

## Links

\`\`\`markdown
[Text](https://example.com)
[Internal](/docs/instalacion)
[With title](https://example.com "Tooltip")
\`\`\`

## Images

\`\`\`markdown
![Alt text](/path/image.jpg)
![With title](/path/image.jpg "Image title")
\`\`\`

## Code Blocks

### With Language

\`\`\`markdown
\\\`\\\`\\\`typescript
const greeting: string = "Hello, World!";
console.log(greeting);
\\\`\\\`\\\`
\`\`\`

### With Filename

\`\`\`markdown
\\\`\\\`\\\`typescript:src/app.ts
export function greet(name: string) {
  return \`Hello, \${name}!\`;
}
\\\`\\\`\\\`
\`\`\`

## Tables

\`\`\`markdown
| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Value 1  | Value 2  | Value 3  |
| Value 4  | Value 5  | Value 6  |
\`\`\`

## Blockquotes

\`\`\`markdown
> Simple quote

> **Note:** Important information
> Multi-line quote
\`\`\`

## Horizontal Rule

\`\`\`markdown
---
\`\`\`

## Task Lists

\`\`\`markdown
- [x] Completed task
- [ ] Pending task
- [ ] Another task
\`\`\`

## Extensiones Ailurus

### Tabs (Multi-platform)

\`\`\`markdown
:::tabs

== Windows
\\\`\\\`\\\`bash
npm install ailurus
\\\`\\\`\\\`

== Linux/macOS
\\\`\\\`\\\`bash
sudo npm install -g ailurus
\\\`\\\`\\\`

:::
\`\`\`

### Mermaid Diagrams

\`\`\`markdown
\\\`\\\`\\\`mermaid
graph TD
  A[Start] --> B[Process]
  B --> C[End]
\\\`\\\`\\\`
\`\`\`

### Alerts

\`\`\`markdown
> **💡 Tip:** Useful suggestion

> **⚠️ Warning:** Be careful

> **❌ Error:** Something wrong

> **✅ Success:** All good
\`\`\`

## Próximos Pasos

- [Editor Guide](/docs/editor-guide)
- [Component Library](/docs/component-library)
`
  },
  {
    id: 15,
    slug: 'deployment',
    title: 'Deployment Guide',
    category: 'Guides',
    status: 'published',
    createdAt: '2025-11-15T12:00:00Z',
    updatedAt: '2025-11-16T14:00:00Z',
    createdBy: 'Antonio Moral',
    excerpt: 'Despliega Ailurus en producción.',
    content: `# Deployment Guide

Opciones para desplegar Ailurus en producción.

## Opción 1: Docker Compose (Recomendado)

### docker-compose.yml

\`\`\`yaml
version: '3.8'

services:
  frontend:
    build: ./frontend
    ports:
      - "4321:4321"
    environment:
      - PUBLIC_API_URL=http://backend:3000
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=file:./production.db
      - NODE_ENV=production
    volumes:
      - ./data:/app/data
      - ./uploads:/app/public/uploads

volumes:
  data:
  uploads:
\`\`\`

### Deploy

\`\`\`bash
# Build y start
docker-compose up -d

# Ver logs
docker-compose logs -f

# Stop
docker-compose down
\`\`\`

## Opción 2: Node.js + PM2

### Frontend

\`\`\`bash
cd frontend
pnpm build
pm2 start npm --name "ailurus-frontend" -- start
\`\`\`

### Backend

\`\`\`bash
cd backend
pnpm build
pm2 start dist/main.js --name "ailurus-backend"
\`\`\`

## Opción 3: Vercel + Railway

### Frontend en Vercel

\`\`\`bash
vercel --prod
\`\`\`

### Backend en Railway

1. Push a GitHub
2. Connect repository en Railway
3. Deploy automático

## Variables de Entorno

### Frontend

\`\`\`env
PUBLIC_API_URL=https://api.yourdomain.com
PUBLIC_WS_URL=wss://api.yourdomain.com
\`\`\`

### Backend

\`\`\`env
DATABASE_URL=file:./production.db
JWT_SECRET=your-production-secret
PORT=3000
NODE_ENV=production
CORS_ORIGIN=https://yourdomain.com
\`\`\`

## Nginx Reverse Proxy

\`\`\`nginx
server {
  listen 80;
  server_name docs.yourdomain.com;

  location / {
    proxy_pass http://localhost:4321;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
  }

  location /api {
    proxy_pass http://localhost:3000;
  }

  location /socket.io {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
  }
}
\`\`\`

## SSL con Let's Encrypt

\`\`\`bash
sudo certbot --nginx -d docs.yourdomain.com
\`\`\`

## Backups

### Database

\`\`\`bash
# Backup diario
0 2 * * * sqlite3 /path/to/production.db ".backup /backups/db-$(date +%Y%m%d).db"
\`\`\`

### Uploads

\`\`\`bash
# Backup semanal
0 3 * * 0 tar -czf /backups/uploads-$(date +%Y%m%d).tar.gz /path/to/uploads
\`\`\`

## Monitoring

### Health Checks

\`\`\`typescript
// backend/src/health/health.controller.ts
@Get('/health')
healthCheck() {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
  };
}
\`\`\`

### PM2 Monitoring

\`\`\`bash
pm2 monit
\`\`\`

## Performance

### Frontend

- Build con \`pnpm build\`
- Compression activada
- Cache headers largos para assets

### Backend

- Cluster mode con PM2
- Database connection pooling
- Rate limiting activado

## Próximos Pasos

- [Monitoring Guide](/docs/monitoring)
- [Backup Strategy](/docs/backup-strategy)
`
  },
];
