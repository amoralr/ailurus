# 📡 API Reference

**Base URL**: `http://localhost:3000`  
**Versión**: v0.5  
**Última actualización**: Noviembre 2025

---

## 🔧 CONFIGURACIÓN

### Variables de Entorno

**Backend (.env)**
- `API_HOST`: localhost:3000
- `API_BASE_URL`: http://localhost:3000
- `UPLOAD_BASE_URL`: /uploads
- `FRONTEND_URL`: http://localhost:4321

**Producción**
- `API_HOST`: api.ailurus.dev
- `API_BASE_URL`: https://api.ailurus.dev
- `UPLOAD_BASE_URL`: https://cdn.ailurus.dev
- `FRONTEND_URL`: https://ailurus.dev

---

## 📋 VISIÓN GENERAL

Documentación completa de endpoints REST del backend NestJS.

**Características:**
- ✅ Sin prefijo `/api` (endpoints directos)
- ✅ Rate limiting aplicado globalmente
- ✅ Validación de DTOs con `class-validator`
- ✅ Respuestas estandarizadas con `TransformInterceptor`
- ✅ CORS habilitado para `http://localhost:4321`

**Arquitectura:**
- 5 módulos NestJS: Documents, Folders, Categories, Search, Prisma
- 21 endpoints implementados
- SQLite 3 con FTS5 para búsqueda full-text

---

## 🔧 FORMATO DE RESPUESTA

### Respuesta Exitosa

```json
{
  "success": true,
  "data": { },
  "timestamp": "2025-11-21T19:00:00.000Z"
}
```

### Respuesta de Error

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Error message or validation errors array",
  "timestamp": "2025-11-21T19:00:00.000Z",
  "path": "/docs",
  "method": "POST"
}
```

---

## 📄 DOCUMENTS MODULE

**Implementación**: `backend/src/modules/documents/`
- Controller: `documents.controller.ts`
- Service: `documents.service.ts` (150 líneas)
- DTOs: `dto/create-document.dto.ts`, `dto/update-document.dto.ts`

### Endpoints Disponibles

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/documents` | Listar documentos publicados |
| GET | `/documents/:slug` | Obtener documento por slug |
| GET | `/documents?category=:id` | Filtrar por categoría |
| POST | `/documents` | Crear documento (draft) |
| PUT | `/documents/:id/draft` | Actualizar draft (auto-save) |
| PUT | `/documents/:id/publish` | Publicar documento |
| DELETE | `/documents/:id` | Archivar documento (soft delete) |

### Flujo de Request

```mermaid
sequenceDiagram
    Cliente->>API: GET /documents/instalacion
    API->>DocumentsController: @Get(':slug')
    DocumentsController->>DocumentsService: findBySlug('instalacion')
    DocumentsService->>PrismaService: findUnique({ where: { slug } })
    PrismaService->>SQLite: SELECT * FROM documents WHERE slug = ?
    SQLite-->>PrismaService: Document row
    PrismaService-->>DocumentsService: Document entity
    DocumentsService->>DocumentsService: Include category relation
    DocumentsService-->>DocumentsController: Document + Category
    DocumentsController-->>API: TransformInterceptor
    API-->>Cliente: JSON response
```

### Estructura de Datos

```mermaid
graph LR
    subgraph "CreateDocumentDto"
        R1[title: string]
        R2[content: string]
        R3[categoryId: string]
        R4[path: string]
        R5[createdBy: string]
    end
    
    subgraph "DocumentResponse"
        S1[id: number]
        S2[slug: string auto-generated]
        S3[title: string]
        S4[content: string]
        S5[category: Category]
        S6[status: DRAFT/PUBLISHED/ARCHIVED]
        S7[createdAt: DateTime]
        S8[updatedAt: DateTime]
        S9[createdBy: string]
    end
    
    R1 --> S3
    R2 --> S4
    R3 --> S5
```

### Manejo de Errores

**400 Bad Request**
- Datos inválidos (validación de class-validator)
- Slug duplicado al crear documento
- Contenido vacío al intentar publicar

**404 Not Found**
- Documento no encontrado por slug o ID
- Documento en estado draft/archived al buscar por slug

**500 Internal Server Error**
- Error de base de datos
- Error inesperado del servidor

---

## 🗂️ FOLDERS MODULE

**Implementación**: `backend/src/modules/folders/`
- Controller: `folders.controller.ts`
- Service: `folders.service.ts` (244 líneas)
- DTOs: `dto/folder-node-response.dto.ts`

### Endpoints Disponibles

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/folders` | Obtener árbol completo (recursivo) |
| GET | `/folders/:path` | Obtener nodo por path con children |
| POST | `/folders` | Crear folder (valida path único) |
| PUT | `/folders/:id` | Actualizar folder |
| DELETE | `/folders/:id` | Eliminar folder (valida sin children) |

### Algoritmo BuildTree

```mermaid
flowchart TD
    A[Obtener todos los folders de DB] --> B[Llamar buildTree parentId=null]
    B --> C{Filtrar folders con parentId=null}
    C --> D[Ordenar por campo order]
    D --> E{Para cada folder raíz}
    E --> F[Llamar buildTree recursivo con parentId=folder.id]
    F --> G[Asignar children al folder]
    G --> H{¿Más folders raíz?}
    H -->|Sí| E
    H -->|No| I[Retornar árbol completo]
```

### Estructura de Datos

```mermaid
graph TD
    subgraph "FolderNode Recursivo"
        N1[id: string]
        N2[name: string]
        N3[type: folder/file]
        N4[icon: emoji]
        N5[path: string]
        N6[order: number]
        N7[slug?: string solo files]
        N8[count?: number solo folders]
        N9[children?: FolderNode array]
    end
    
    N9 -.->|recursivo| N1
```

**Características:**
- Árbol jerárquico con recursividad ilimitada
- 29 nodos totales: 9 folders + 20 files
- Paths estilo Obsidian: `"Equipo/Proyecto/Getting Started/Instalación"`

---

## 📚 CATEGORIES MODULE

**Implementación**: `backend/src/modules/categories/`
- Controller: `categories.controller.ts`
- Service: `categories.service.ts` (~80 líneas)

### Endpoints Disponibles

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/categories` | Listar 4 categorías fijas con stats |
| GET | `/categories/:id` | Obtener categoría con estadísticas |

### Categorías Fijas

```mermaid
graph LR
    C1[🚀 Getting Started<br/>getting-started]
    C2[🏗️ Architecture<br/>architecture]
    C3[📚 API Reference<br/>api-reference]
    C4[📖 Guides<br/>guides]
    
    C1 -.->|documentCount| D1[CategoryStats]
    C2 -.->|documentCount| D1
    C3 -.->|documentCount| D1
    C4 -.->|documentCount| D1
```

**Características:**
- 4 categorías fijas (no se pueden crear más)
- `documentCount` pre-calculado desde tabla `CategoryStats`
- Ordenadas por campo `order`

---

## 🔍 SEARCH MODULE

**Implementación**: `backend/src/modules/search/`
- Controller: `search.controller.ts`
- Service: `search.service.ts` (99 líneas)

### Endpoints Disponibles

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/search?q=:query&limit=:limit&offset=:offset` | Búsqueda FTS5 con ranking |

### Flujo de Búsqueda FTS5

```mermaid
flowchart TD
    A[Query de usuario] --> B[Sanitizar query<br/>remover caracteres especiales]
    B --> C{¿Query válido?<br/>min 2 caracteres}
    C -->|No| D[Retornar array vacío]
    C -->|Sí| E[FTS5 MATCH en documents_fts]
    E --> F[JOIN con tabla documents]
    F --> G[Filtrar status=PUBLISHED]
    G --> H[Ordenar por rank descendente]
    H --> I[Aplicar LIMIT/OFFSET<br/>paginación]
    I --> J[Retornar resultados]
    J --> K[Registrar en ActivityLog]
```

### Estructura de Datos

```mermaid
graph LR
    subgraph "SearchQuery"
        Q1[q: string min 2 chars]
        Q2[limit: number default 10]
        Q3[offset: number default 0]
    end
    
    subgraph "SearchResult"
        R1[id: number]
        R2[slug: string]
        R3[title: string]
        R4[excerpt: string con highlight]
        R5[categoryId: string]
        R6[path: string]
        R7[rank: number relevancia]
    end
```

**Características:**
- SQLite FTS5 con tokenizer unicode61
- Sanitización de queries para prevenir errores FTS5
- Ranking por relevancia (campo `rank`)
- Solo busca en documentos PUBLISHED
- Logging de búsquedas en `ActivityLog`

---

## 📊 ARQUITECTURA DE MÓDULOS

```mermaid
graph TB
    subgraph "API Layer - Controllers"
        DC[DocumentsController<br/>7 endpoints]
        FC[FoldersController<br/>5 endpoints]
        CC[CategoriesController<br/>2 endpoints]
        SC[SearchController<br/>1 endpoint]
    end
    
    subgraph "Service Layer - Business Logic"
        DS[DocumentsService<br/>150 líneas]
        FS[FoldersService<br/>244 líneas]
        CS[CategoriesService<br/>80 líneas]
        SS[SearchService<br/>99 líneas]
    end
    
    subgraph "Data Layer"
        PS[PrismaService<br/>ORM]
        DB[(SQLite 3<br/>7 tablas en 3NF)]
    end
    
    DC --> DS
    FC --> FS
    CC --> CS
    SC --> SS
    
    DS --> PS
    FS --> PS
    CS --> PS
    SS --> PS
    
    PS --> DB
```

---

## ⚡ RATE LIMITING

### Límites Globales

| Ventana | Límite | Descripción |
|---------|--------|-------------|
| 1 segundo | 10 requests | Burst protection |
| 10 segundos | 50 requests | Uso normal |
| 1 minuto | 100 requests | Límite general |

**Response 429 (Too Many Requests)**
```json
{
  "statusCode": 429,
  "message": "Too many requests. Please try again later."
}
```

---

## 🔐 AUTENTICACIÓN

**POC v0.1**: Sin autenticación, endpoints públicos

**v0.5+**: JWT authentication con header `Authorization: Bearer {token}`

---

## 📝 EJEMPLOS DE FLUJOS

### Flujo: Crear y Publicar Documento

```mermaid
sequenceDiagram
    participant U as Usuario
    participant F as Frontend
    participant A as API
    participant D as DB
    
    U->>F: Clic en "Nuevo Documento"
    F->>A: POST /documents {title, content}
    A->>D: INSERT con status=DRAFT
    D-->>A: Document {id, slug, status=DRAFT}
    A-->>F: Response 201
    F-->>U: Mostrar editor
    
    loop Auto-save cada 5s
        U->>F: Editar contenido
        F->>A: PUT /documents/:id/draft
        A->>D: UPDATE content
        D-->>A: Updated document
        A-->>F: Response 200
    end
    
    U->>F: Clic en "Publicar"
    F->>A: PUT /documents/:id/publish
    A->>D: UPDATE status=PUBLISHED
    D-->>A: Published document
    A-->>F: Response 200
    F-->>U: Redirigir a /docs/:slug
```

### Flujo: Búsqueda

```mermaid
sequenceDiagram
    participant U as Usuario
    participant F as Frontend
    participant A as API
    participant FTS as FTS5 Engine
    participant D as DB
    
    U->>F: Escribir "instalación"
    F->>A: GET /search?q=instalación
    A->>A: Sanitizar query
    A->>FTS: MATCH documents_fts
    FTS->>D: SELECT con ranking
    D-->>FTS: Resultados ordenados
    FTS-->>A: Documents con rank
    A->>D: INSERT ActivityLog
    A-->>F: SearchResults[]
    F-->>U: Mostrar resultados
```

---

## 📚 REFERENCIAS

- **Implementación completa**: `backend/src/modules/`
- **Schema Prisma**: `backend/prisma/schema.prisma`
- **DTOs**: `backend/src/modules/*/dto/`
- **Tests**: `backend/src/modules/*/*.spec.ts`

**Siguiente**: Ver [Backend Architecture](./BACKEND_ARCHITECTURE.md) para detalles de implementación.
