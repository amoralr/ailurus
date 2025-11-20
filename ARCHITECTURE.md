# 🏗️ Arquitectura de Ailurus

**Fecha**: 20 de noviembre, 2025  
**Versión**: v0.5

---

## 📋 Visión General

Ailurus es una plataforma de documentación moderna con **navegación jerárquica estilo Obsidian**, construida con arquitectura desacoplada frontend/backend.

### Stack Principal

```
Frontend → Backend → Database
  Astro     NestJS    SQLite 3
  React     Prisma    (7 tablas, 3NF)
 shadcn/ui
```

### Diagrama de Arquitectura

```
┌──────────────────────────────────────────────────┐
│              CLIENTE (Browser)                    │
│  Chrome, Firefox, Safari, Edge                   │
└─────────────────┬────────────────────────────────┘
                  │ HTTP/HTTPS
                  │
┌─────────────────▼────────────────────────────────┐
│              FRONTEND LAYER                       │
│                                                   │
│  ┌─────────────────────────────────────────┐    │
│  │    Astro SSR Server (Port 4321)         │    │
│  │                                          │    │
│  │  • Pages: /docs/[...slug]               │    │
│  │  • Layouts: DocsLayout, EditorLayout    │    │
│  │  • Components:                          │    │
│  │    - SidebarItem (recursivo)            │    │
│  │    - MarkdownEditor                     │    │
│  │    - ImageLightbox (shadcn Dialog)      │    │
│  │    - 13+ shadcn/ui components           │    │
│  │  • Stores: nanostores (folder tree)     │    │
│  │  • Markdown: marked.js + Shiki          │    │
│  └─────────────────────────────────────────┘    │
└─────────────────┬────────────────────────────────┘
                  │ REST API (HTTP)
                  │
┌─────────────────▼────────────────────────────────┐
│              BACKEND LAYER                        │
│                                                   │
│  ┌─────────────────────────────────────────┐    │
│  │    NestJS API Server (Port 3000)        │    │
│  │                                          │    │
│  │  • Controllers:                         │    │
│  │    - DocumentsController                │    │
│  │    - FoldersController                  │    │
│  │    - CategoriesController               │    │
│  │    - SearchController                   │    │
│  │  • Services: Feature-based              │    │
│  │  • Repository: Prisma ORM               │    │
│  │  • Guards: Rate limiting                │    │
│  └─────────────────────────────────────────┘    │
└─────────────────┬────────────────────────────────┘
                  │
┌─────────────────▼────────────────────────────────┐
│            DATABASE LAYER                         │
│                                                   │
│  ┌─────────────────────────────────────────┐    │
│  │  SQLite 3 (documents.db)                │    │
│  │  file:./database/documents.db           │    │
│  │                                          │    │
│  │  7 tablas en Tercera Forma Normal:      │    │
│  │  • Document (11 campos)                 │    │
│  │  • Category (4 categorías fijas)        │    │
│  │  • Folder (self-referential)            │    │
│  │  • FolderDocument (M:M junction)        │    │
│  │  • FolderCategory (M:M junction)        │    │
│  │  • ActivityLog (auditoría)              │    │
│  │  • CategoryStats (pre-calculado)        │    │
│  └─────────────────────────────────────────┘    │
└──────────────────────────────────────────────────┘
```

---

## 🎨 Frontend - Astro + React

### Arquitectura

**Framework**: Astro 4.x (SSR)  
**UI Library**: React 18 (islands)  
**Styling**: Tailwind + shadcn/ui  
**State**: Nanostores  
**TypeScript**: 5.x

### Principios de Diseño

1. **Server-Side Rendering (SSR)**: Astro renderiza HTML en servidor para SEO y performance
2. **Islands Architecture**: Componentes React solo donde se necesita interactividad
3. **Progressive Enhancement**: Funciona sin JavaScript, se mejora con JS
4. **Component Isolation**: Cada feature tiene sus propios componentes y servicios

### Estructura de Directorios

```
frontend/src/
├── components/
│   └── ui/               # shadcn/ui components (13+)
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       └── ...
├── documents/
│   ├── components/
│   │   ├── DocumentList.astro
│   │   └── NewDocumentForm.tsx
│   ├── services/
│   └── types/
├── editor/
│   ├── components/
│   │   └── MarkdownEditor.tsx
│   ├── stores/
│   │   └── editor.store.ts
│   └── services/
├── markdown/
│   ├── components/
│   │   ├── MarkdownRenderer.astro
│   │   ├── ImageLightbox.tsx
│   │   ├── ImageWithLightbox.tsx
│   │   └── ImageLightboxController.tsx
│   ├── services/
│   │   └── markdown.service.ts
│   └── styles/
│       └── markdown.css
├── layouts/
│   ├── Layout.astro
│   ├── DocsLayout.astro
│   └── EditorLayout.astro
├── pages/
│   ├── index.astro
│   ├── docs/
│   │   ├── index.astro
│   │   ├── [...slug].astro
│   │   ├── new.astro
│   │   └── [slug]/edit/
│   └── architecture/
│       ├── index.astro
│       ├── backend.astro
│       ├── frontend.astro
│       └── database.astro
└── shared/
    ├── components/
    ├── stores/
    ├── types/
    └── utils/
```

### Componentes Clave

#### SidebarItem (Recursivo)

Componente React que renderiza árbol de carpetas con expansión/colapso ilimitado.

**Interface**: Defines the structure for folder nodes with id, name, type (folder/file), optional icon, path, order, optional children array, and optional slug.

**Funcionalidad**:

- Renderizado recursivo de niveles ilimitados
- Estado de expansión persistente (nanostores)
- Iconos emoji para categorías
- Links a documentos con slug

#### ImageLightbox (shadcn Dialog)

Modal para imágenes con accesibilidad WCAG 2.2 AA.

**Features**:

- Lazy loading de imágenes
- Captions opcionales
- Keyboard navigation (Escape para cerrar)
- Focus trap
- Bridge vanilla→React (ImageLightboxController)

#### MarkdownEditor

Editor con auto-save cada 3 segundos.

**Features**:

- Preview en tiempo real
- Syntax highlighting (Shiki)
- Toolbar personalizado
- Draft system

### Stores (Nanostores)

**folder-tree.store.ts**: Estado de expansión de folders
**editor.store.ts**: Contenido del editor + estado de guardado
**theme.store.ts**: Dark mode con persistencia localStorage

### shadcn/ui Components (13+)

| Componente    | Uso                                 |
| ------------- | ----------------------------------- |
| Badge         | Etiquetas de categorías             |
| Button        | Acciones (crear, editar, eliminar)  |
| Card          | Cards de documentos                 |
| Dialog        | Modales (nuevo documento, lightbox) |
| Dropdown Menu | Menús contextuales                  |
| Input         | Campos de formulario                |
| Label         | Labels accesibles                   |
| Select        | Selectores (categoría, estado)      |
| Separator     | Separadores visuales                |
| Skeleton      | Loading states                      |
| Tabs          | Pestañas de navegación              |
| Textarea      | Editor de texto                     |
| Tooltip       | Tooltips informativos               |

### Routing (Astro)

```
/                           → index.astro (landing)
/docs                       → docs/index.astro (lista)
/docs/instalacion           → docs/[...slug].astro (lectura)
/docs/new                   → docs/new.astro (crear)
/docs/instalacion/edit      → docs/[slug]/edit/index.astro
/architecture               → architecture/index.astro
/architecture/backend       → architecture/backend.astro
/search                     → search/index.astro
```

---

## ⚙️ Backend - NestJS + Prisma

### Arquitectura

**Framework**: NestJS 10.x  
**ORM**: Prisma 7.0.0  
**Database**: SQLite 3  
**Architecture**: Feature-Based + Clean Architecture

### Principios de Diseño

1. **Feature-Based Organization**: Cada feature es autocontenida
2. **Clean Architecture**: Separación en capas (API, Application, Domain, Infrastructure)
3. **Dependency Injection**: NestJS DI container
4. **Repository Pattern**: Abstracción del acceso a datos con Prisma

### Estructura de Directorios

```
backend/src/
├── documents/
│   ├── api/
│   │   └── documents.controller.ts
│   ├── application/
│   │   └── documents.service.ts
│   ├── domain/
│   │   ├── document.entity.ts
│   │   └── document-status.enum.ts
│   ├── infrastructure/
│   │   └── document.repository.ts
│   ├── dto/
│   │   ├── create-document.dto.ts
│   │   └── document.response.ts
│   └── documents.module.ts
├── folders/
│   ├── api/
│   │   └── folders.controller.ts
│   ├── application/
│   │   └── folders.service.ts
│   ├── infrastructure/
│   │   └── folder.repository.ts
│   └── folders.module.ts
├── categories/
│   ├── api/
│   │   └── categories.controller.ts
│   ├── application/
│   │   └── categories.service.ts
│   └── categories.module.ts
├── search/
│   ├── api/
│   │   └── search.controller.ts
│   ├── application/
│   │   └── search.service.ts
│   └── search.module.ts
├── shared/
│   ├── database/
│   │   ├── prisma.module.ts
│   │   └── prisma.service.ts
│   └── utils/
│       └── slug.util.ts
├── infrastructure/
│   ├── config/
│   ├── guards/
│   ├── interceptors/
│   └── filters/
├── app.module.ts
└── main.ts
```

### Capas de Arquitectura

#### 1. API Layer (Controllers)

Endpoints REST con validación y rate limiting.

**Ejemplo**: DocumentsController with throttler guard implementing GET endpoints for listing all documents and finding by slug, plus POST endpoint for document creation.

#### 2. Application Layer (Services)

Lógica de negocio y casos de uso.

**Ejemplo**: DocumentsService with dependency injection of DocumentRepository, implementing business logic for finding all documents, finding by slug, and creating documents.

#### 3. Infrastructure Layer (Repositories)

Acceso a datos con Prisma ORM.

**Ejemplo**: DocumentRepository extending BaseRepository with methods for finding documents by slug, fetching all published documents, and creating new documents using Prisma types.

### Módulos (NestJS)

AppModule imports: ConfigModule (global), ThrottlerModule with short (10 req/sec) and long (100 req/min) limits, PrismaModule, DocumentsModule, FoldersModule, CategoriesModule, and SearchModule.

### Configuración Global

**main.ts**:

- CORS: origin frontend
- Validation: class-validator automático
- Exception filter: formato de error consistente
- Logging interceptor: todas las requests

---

## 🗄️ Base de Datos - SQLite + Prisma

### Schema (7 tablas, 3NF)

#### Document (tabla principal - 11 campos)

Contains: id (autoincrement primary key), slug (unique), title, content (text), optional excerpt (text), category relation via categoryId, optional subcategory, optional path, status (defaults to DRAFT), createdAt (auto), updatedAt (auto), createdBy (defaults to "anonymous"), and relations to FolderDocument and ActivityLog.

#### Category (4 categorías fijas)

Contains: id (string primary key), name, icon (emoji), order (int), and relations to Document, FolderCategory, and optional CategoryStats.

**Categorías**:

- 🚀 `getting-started` - Getting Started
- 🏗️ `architecture` - Architecture
- 📚 `api-reference` - API Reference
- 📖 `guides` - Guides

#### Folder (jerarquía self-referential)

Contains: id (autoincrement primary key), name, type (enum: FOLDER/FILE), optional icon, unique path, order, optional parentId, self-referential parent and children relations with cascade delete, relations to FolderDocument and FolderCategory, and createdAt timestamp.

**Características**:

- Self-referential con `parentId`
- Niveles ilimitados de anidación
- Path completo para navegación breadcrumb
- ON DELETE CASCADE para mantener integridad

#### FolderDocument (M:M junction)

Relaciona carpetas con documentos.

Contains: id (autoincrement primary key), folderId, documentId, order, relations to Folder and Document with cascade delete, and unique constraint on folderId-documentId pair.

#### FolderCategory (M:M junction)

Relaciona carpetas con categorías.

Contains: id (autoincrement primary key), folderId, categoryId (string), relations to Folder (cascade delete) and Category (restrict delete), and unique constraint on folderId-categoryId pair.

#### ActivityLog (auditoría)

Contains: id (autoincrement primary key), documentId, action (string: "created", "updated", "published"), userId (string), timestamp (auto default now), and relation to Document with cascade delete.

#### CategoryStats (pre-calculado)

Contains: categoryId (string primary key), documentCount (int, defaults to 0), updatedAt (auto), and relation to Category with cascade delete.

### Relaciones

```
Document ─┬─ N:1 ─→ Category (categoryId)
          └─ 1:N ─→ FolderDocument ─→ Folder

Folder ─┬─ 1:N ─→ Folder (self-referential)
        ├─ 1:N ─→ FolderDocument ─→ Document
        └─ 1:N ─→ FolderCategory ─→ Category

Category ─┬─ 1:N ─→ Document
          ├─ 1:N ─→ FolderCategory
          └─ 1:1 ─→ CategoryStats
```

### Índices de Performance

Five strategic indices:

- idx_document_category: on Document(categoryId)
- idx_document_status: on Document(status)
- idx_folder_parent: on Folder(parentId)
- idx_folder_path: on Folder(path)
- idx_activity_log_document: on ActivityLog(documentId)

### Seed Data

- **4 categorías fijas** con iconos emoji
- **20 documentos** distribuidos en categorías
- **11 folders** en jerarquía (Equipo → Proyecto → categorías)
- **29 nodos** en árbol de navegación total

Ver detalles completos en [docs/DATABASE.md](./docs/DATABASE.md)

---

## 🔄 Flujo de Datos

### Lectura de Documento

```
Usuario → Astro → NestJS → Prisma → SQLite
         /docs/:slug
                  GET /documents/:slug
                         SELECT * FROM Document
                         JOIN Category
                         JOIN FolderDocument
                  ← JSON
         ← HTML (SSR)
```

### Creación de Documento

```
Usuario → React Form → NestJS → Prisma → SQLite
         NewDocumentForm
                  POST /documents { title, content, categoryId }
                         INSERT INTO Document
                  ← { id, slug, ... }
         → Redirect /docs/:slug/edit
```

### Navegación Jerárquica

```
Usuario → Astro Sidebar → NestJS → Prisma → SQLite
         Component Mount
                  GET /folders
                         SELECT * FROM Folder
                         ORDER BY path, order
                         + Recursive children
                  ← JSON (árbol completo: 29 nodos)
         ← Render SidebarItem recursivo con expansión
```

### Búsqueda Full-text

```
Usuario → Search Input → NestJS → SQLite FTS5
         Typing query
                  GET /search?q=instalacion
                         SELECT * FROM Document
                         WHERE to_tsvector('spanish', content) @@ plainto_tsquery('spanish', 'instalacion')
                  ← JSON (resultados ordenados por rank)
         ← Render lista con highlights
```

---

## 🔒 Seguridad

### Rate Limiting

ThrottlerModule configuration with three tiers:

- Short: 10 requests per second (ttl: 1000ms)
- Medium: 50 requests per 10 seconds (ttl: 10000ms)
- Long: 100 requests per minute (ttl: 60000ms)

### CORS

CORS enabled with origin from FRONTEND_URL environment variable (defaults to http://localhost:4321), credentials enabled, and methods allowed: GET, POST, PUT, DELETE.

### Validación de Inputs

CreateDocumentDto uses class-validator decorators: title must be a non-empty string with max 200 characters, content must be a string with max 100000 characters.

### Headers de Seguridad

Helmet middleware applied for security headers including X-Frame-Options, Content Security Policy (CSP), and other protections.

---

## ⚡ Performance

### Frontend

- **SSR**: HTML generado en servidor reduce TTFB
- **Islands**: JavaScript solo en componentes interactivos
- **Lazy Loading**: Imágenes con `loading="lazy"`
- **Code Splitting**: Astro divide código automáticamente
- **Prefetching**: Links prefetch on hover

### Backend

- **Connection Pooling**: Prisma optimiza conexiones DB
- **Índices Estratégicos**: categoryId, status, parentId, path
- **Query Optimization**: SELECT específicos, no `SELECT *`
- **Response Caching**: HTTP headers Cache-Control (pendiente)

### Database

- **Índices**: 5 índices en tablas principales
- **Stats Pre-calculadas**: CategoryStats evita COUNT(\*)
- **Full-text Search**: SQLite FTS5 integrado (pendiente)
- **Joins Optimizados**: Relaciones con índices

---

## 🧪 Testing

### Frontend (Pendiente)

Component tests using Vitest + Testing Library for SidebarItem: tests should verify folder rendering with children and expansion behavior on click.

### Backend (Pendiente)

Unit tests using Jest for DocumentsService: should verify draft document creation with correct status and slug generation.

E2E tests for Documents API: should verify GET /documents returns 200 status with array of published documents.

---

## 📊 Monitoreo

### Logging

LoggingInterceptor implementation: captures HTTP method and URL, measures request duration, and logs the information with timestamp.

**Logs**:

- Todas las requests HTTP con duración
- Errores con stack trace
- Queries Prisma en modo debug

### Error Tracking

HttpExceptionFilter implementation: catches all exceptions, determines HTTP status code (defaults to 500), and returns JSON response with success flag, status code, error message, timestamp, and request path.

### Métricas (Pendiente)

- Request duration histogram
- Error rate counter
- Database query duration
- Memory usage gauge

---

## 🚀 Deployment

### Development

```bash
# Terminal 1: Backend
cd backend
pnpm dev  # http://localhost:3000

# Terminal 2: Frontend
cd frontend
pnpm dev  # http://localhost:4321

# Terminal 3: Database UI
cd backend
pnpm prisma:studio  # http://localhost:5555
```

### Production (Pendiente)

#### Docker Compose

Configuration includes:

- Backend service: builds from ./backend, exposes port 3000, mounts sqlite_data volume to /app/database, sets DATABASE_URL and NODE_ENV=production
- Frontend service: builds from ./frontend, exposes port 4321, sets API_URL to backend service and NODE_ENV=production, depends on backend
- Named volume: sqlite_data for database persistence

#### Kubernetes (v1.0)

Kubernetes configuration files:

- backend-deployment.yaml: deployment with SQLite volume mount
- backend-service.yaml: service for backend
- backend-pvc.yaml: PersistentVolumeClaim for database persistence
- frontend-deployment.yaml: deployment for frontend
- frontend-service.yaml: service for frontend
- ingress.yaml: ingress rules

---

## 🔧 Decisiones de Arquitectura

### ¿Por qué Astro y no Next.js?

✅ **Astro**:

- Menos JavaScript en cliente por defecto (mejor performance)
- Islands Architecture (componentes interactivos solo donde se necesitan)
- Agnóstico a frameworks (React, Vue, Svelte)
- SSR flexible y SSG cuando convenga

❌ **Next.js**: Más JS en cliente, más complejo, más opinado

### ¿Por qué NestJS y no Express?

✅ **NestJS**:

- TypeScript first
- Arquitectura modular y testeable
- Decoradores y Dependency Injection integrados
- Estructura escalable para equipos

❌ **Express**: Menos estructura, más decisiones manuales, no escalable

### ¿Por qué SQLite y no PostgreSQL?

✅ **SQLite**:

- Portabilidad: un solo archivo .db (fácil de respaldar)
- Docker-friendly: volume único persiste todo el estado
- Zero-config: no requiere servidor separado
- Suficiente: soporta miles de documentos sin problemas
- FTS5 integrado: full-text search nativo y performante
- Perfecto para aplicaciones documentales con escritura moderada

❌ **SQLite**: No full-text search avanzado, limitado en concurrencia, no escalable

### ¿Por qué Prisma y no SQL directo?

✅ **Prisma**:

- Type-safety completo (TypeScript)
- Migraciones versionadas automáticas
- Prisma Studio para debugging visual
- Developer experience excepcional
- Raw SQL disponible cuando se necesita

❌ **SQL directo**: Propenso a errores, sin types, sin migraciones estructuradas

### ¿Por qué shadcn/ui y no Material-UI?

✅ **shadcn/ui**:

- Components copiables (no librería externa)
- Customizable 100% con Tailwind
- Accesibilidad WCAG 2.2 AA por defecto
- Temas integrados (light/dark)
- Bundle size mínimo

❌ **Material-UI**: Librería pesada (300KB+), menos customizable, estilo opinado

### ¿Por qué Feature-Based y no Layered?

✅ **Feature-Based**:

- Cada feature es autocontenida
- Fácil agregar/eliminar features
- Mejor organización en equipos
- Evita god services

❌ **Layered**: Todo mezclado en /controllers, /services, /repositories

---

## 📚 Documentación Adicional

### Documentación Técnica

- [🗄️ Database](./docs/DATABASE.md) - Schema SQLite completo (7 tablas, 3NF)
- [🗂️ Folder System](./docs/FOLDER_SYSTEM.md) - Navegación jerárquica Obsidian-style
- [🎨 Design System](./docs/DESIGN_SYSTEM.md) - shadcn/ui, iconos, colores, accesibilidad
- [📡 API](./docs/API.md) - Endpoints REST (pendiente actualizar)
- [🖥️ Frontend](./docs/FRONTEND.md) - Componentes Astro + React (pendiente actualizar)
- [⚙️ Setup](./docs/SETUP.md) - Guía de instalación paso a paso (pendiente actualizar)
- [🗺️ Roadmap](./docs/ROADMAP.md) - Prioridades y timeline

### Documentación Interna

- [📊 Alignment Report](./docs/INTERNAL/ALIGNMENT_REPORT.md) - Estado de implementación
- [🔄 Flujos Sistema](./docs/INTERNAL/FLUJOS_SISTEMA.md) - Diagramas de flujo
- [📝 Resumen Decisiones](./docs/INTERNAL/RESUMEN_DECISIONES.md) - Decisiones de arquitectura

---

**Última actualización**: 20 de noviembre, 2025  
**Versión**: v0.5
