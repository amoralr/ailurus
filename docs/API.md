# 📡 API Reference

**Base URL**: `http://localhost:3000`  
**Fecha**: 20 de noviembre, 2025  
**Versión**: v0.5

---

## 🔧 **CONFIGURACIÓN**

### **Variables de Entorno**

**Backend (.env)**

- API_HOST: localhost:3000
- API_BASE_URL: http://localhost:3000
- UPLOAD_BASE_URL: /uploads
- FRONTEND_URL: http://localhost:4321

**Producción**

- API_HOST: api.ailurus.dev
- API_BASE_URL: https://api.ailurus.dev
- UPLOAD_BASE_URL: https://cdn.ailurus.dev
- FRONTEND_URL: https://ailurus.dev

---

## 📋 **VISIÓN GENERAL**

Documentación completa de endpoints REST del backend NestJS.

**Características:**

- ✅ Sin prefijo `/api` (endpoints directos)
- ✅ Rate limiting aplicado globalmente
- ✅ Validación de DTOs con `class-validator`
- ✅ Respuestas estandarizadas con `TransformInterceptor`
- ✅ CORS habilitado para `http://localhost:4321`

---

## 🔧 **FORMATO DE RESPUESTA**

### **Respuesta Exitosa**

Structure includes:

- success: true
- data: (object containing response data)
- timestamp: ISO 8601 datetime

### **Respuesta de Error**

Structure includes:

- success: false
- statusCode: HTTP status code
- message: Error message or validation errors array
- timestamp: ISO 8601 datetime
- path: Request path
- method: HTTP method

---

## 📄 **DOCUMENTS ENDPOINTS**

### **1. GET /docs**

Obtener todos los documentos publicados.

#### **Request**

- Method: GET
- Path: /docs
- Host: ${API_HOST}

#### **Response 200**

Returns array of document objects with fields:

- id: Document ID (number)
- slug: URL-friendly identifier (string)
- title: Document title (string)
- content: Markdown content (string)
- status: "published"
- createdAt: ISO 8601 timestamp
- updatedAt: ISO 8601 timestamp
- createdBy: Creator identifier (string)

#### **Notas**

- Solo devuelve documentos con `status: "published"`
- Ordenados por fecha de creación (más reciente primero)
- Sin paginación en POC v0.1

---

### **2. GET /docs/:slug**

Obtener un documento específico por slug.

#### **Request**

- Method: GET
- Path: /docs/:slug
- Host: ${API_HOST}
- Parameters: slug (URL parameter)

#### **Response 200**

Returns single document object with fields:

- id: Document ID
- slug: URL identifier
- title: Document title
- content: Full Markdown content
- status: "published"
- createdAt: Creation timestamp
- updatedAt: Last update timestamp
- createdBy: Creator identifier

#### **Response 404**

Error response with:

- statusCode: 404
- message: "Document with slug '{slug}' not found"

#### **Notas**

- Solo devuelve documentos publicados
- Documentos en draft o archivados retornan 404

---

### **3. POST /docs**

Crear un nuevo documento (en estado draft).

#### **Request**

- Method: POST
- Path: /docs
- Host: ${API_HOST}
- Content-Type: application/json

Request body structure:

- title: Document title (string, required)
- content: Markdown content (string, optional)
- createdBy: Creator identifier (string, optional, defaults to "anonymous")

#### **Validación**

| Campo       | Tipo   | Requerido | Validación             |
| ----------- | ------ | --------- | ---------------------- |
| `title`     | string | ✅ Sí     | Max 200 caracteres     |
| `content`   | string | ❌ No     | Max 100,000 caracteres |
| `createdBy` | string | ❌ No     | Default: "anonymous"   |

#### **Response 201**

Returns created document object with:

- id: New document ID
- slug: Auto-generated from title
- title: Document title
- content: Markdown content
- status: "draft"
- createdAt: Creation timestamp
- updatedAt: Update timestamp
- createdBy: Creator identifier

#### **Response 400 (Slug duplicado)**

Error response:

- statusCode: 400
- message: "Document with slug '{slug}' already exists"

#### **Response 400 (Validación)**

Validation error response:

- statusCode: 400
- message: Array of validation error messages

#### **Notas**

- El slug se genera automáticamente desde el título
- Slug normalizado: lowercase, sin acentos, guiones en lugar de espacios
- Documento se crea en estado `draft`

---

### **4. PUT /docs/:id/draft**

Guardar cambios en un draft (auto-save).

#### **Request**

- Method: PUT
- Path: /docs/:id/draft
- Host: ${API_HOST}
- Content-Type: application/json

Request body structure:

- title: Document title (string, required)
- content: Markdown content (string, required)

#### **Validación**

| Campo     | Tipo   | Requerido | Validación             |
| --------- | ------ | --------- | ---------------------- |
| `title`   | string | ✅ Sí     | Max 200 caracteres     |
| `content` | string | ✅ Sí     | Max 100,000 caracteres |

#### **Response 200**

Returns updated document object with:

- id: Document ID
- slug: Unchanged slug
- title: Updated title
- content: Updated content
- status: "draft" (unchanged)
- createdAt: Original creation timestamp
- updatedAt: New update timestamp
- createdBy: Creator identifier

#### **Response 404**

Error response:

- statusCode: 404
- message: "Document with id {id} not found"

#### **Notas**

- Actualiza `updated_at` automáticamente
- No cambia el slug ni el estado
- Usado por auto-save del editor (cada 5 segundos)

---

### **5. PUT /docs/:id/publish**

Publicar un documento (cambiar de draft a published).

#### **Request**

- Method: PUT
- Path: /docs/:id/publish
- Host: ${API_HOST}

#### **Response 200**

Returns published document object with:

- id: Document ID
- slug: Document slug
- title: Document title
- content: Full content
- status: "published" (updated)
- createdAt: Creation timestamp
- updatedAt: New update timestamp
- createdBy: Creator identifier

#### **Response 400 (Contenido vacío)**

Error response:

- statusCode: 400
- message: "Cannot publish empty document"

#### **Response 404**

Error response:

- statusCode: 404
- message: "Document with id {id} not found"

#### **Notas**

- Solo se puede publicar si `content` no está vacío
- Actualiza `status` a `published`
- Actualiza `updated_at`

---

### **6. DELETE /docs/:id**

Archivar un documento (soft delete).

#### **Request**

- Method: DELETE
- Path: /docs/:id
- Host: ${API_HOST}

#### **Response 204**

No content returned (successful deletion)

#### **Response 404**

Error response:

- statusCode: 404
- message: "Document with id {id} not found"

#### **Notas**

- No elimina físicamente, cambia `status` a `archived`
- Documentos archivados no aparecen en listados ni búsquedas
- POC v0.1: No hay endpoint para restaurar (v0.5+)

---

## 🗂️ **FOLDERS ENDPOINTS**

### **7. GET /folders**

Obtener árbol completo de carpetas jerárquicas.

#### **Request**

- Method: GET
- Path: /folders
- Host: ${API_HOST}

#### **Response 200**

Returns hierarchical tree structure with folder/file objects:

**Folder object fields:**

- id: Unique identifier
- name: Folder name
- type: "folder"
- icon: Emoji icon
- path: Full path (slash-separated)
- order: Display order
- parentId: Parent folder ID (null for root)
- children: Array of nested folders/files

**File object fields:**

- id: Unique identifier
- name: File name
- type: "file"
- icon: Emoji icon
- path: Full path
- order: Display order
- parentId: Parent folder ID
- slug: URL identifier (only for files)

#### **Notas**

- Devuelve árbol completo con recursividad ilimitada
- `type: "folder"` para carpetas, `type: "file"` para documentos
- `slug` solo presente en `type: "file"`
- Ordenado por `order` field
- Total: 29 nodos (9 folders + 20 files)

---

### **8. GET /folders/:path**

Obtener un nodo específico por path.

#### **Request**

- Method: GET
- Path: /folders/:path (URL encoded)
- Host: ${API_HOST}
- Example: /folders/Equipo/Proyecto/Getting%20Started

#### **Response 200**

Returns folder object with:

- id: Folder ID
- name: Folder name
- type: "folder"
- icon: Emoji icon
- path: Full path
- order: Display order
- parentId: Parent folder ID
- children: Array of immediate children (1 level deep)

Children include same fields, with files having additional "slug" field.

#### **Response 404**

Error response:

- statusCode: 404
- message: "Folder with path '{path}' not found"

#### **Notas**

- Path debe estar URL encoded
- Devuelve nodo con sus children inmediatos (1 nivel)

---

## 📚 **CATEGORIES ENDPOINTS**

### **9. GET /categories**

Obtener lista de 4 categorías fijas con estadísticas.

#### **Request**

- Method: GET
- Path: /categories
- Host: ${API_HOST}

#### **Response 200**

Returns array of category objects with:

- id: Category identifier (string)
- name: Display name
- icon: Emoji icon
- order: Display order
- documentCount: Number of documents in category

**Fixed categories (4 total):**

1. getting-started (Getting Started, 🚀)
2. architecture (Architecture, 🏗️)
3. api-reference (API Reference, 📚)
4. guides (Guides, 📖)

#### **Notas**

- 4 categorías fijas (no se pueden crear más)
- `documentCount` pre-calculado desde CategoryStats
- Ordenadas por `order` field

---

### **10. GET /docs?category=:id**

Filtrar documentos por categoría.

#### **Request**

- Method: GET
- Path: /docs?category=:id
- Host: ${API_HOST}
- Query parameter: category (category ID)

#### **Response 200**

Returns array of document objects with:

- id: Document ID
- slug: URL identifier
- title: Document title
- content: Full Markdown content
- category: Category ID (v0.5+)
- subcategory: Subcategory name (v0.5+)
- path: Folder path (v0.5+)
- excerpt: Preview text (v0.5+)
- status: "published"
- createdAt: Creation timestamp
- updatedAt: Update timestamp
- createdBy: Creator identifier

#### **Notas**

- `category` field agregado en v0.5 (antes no existía)
- `subcategory` y `path` también son nuevos campos
- `excerpt` para preview en cards

---

## 🔍 **SEARCH ENDPOINTS**

### **11. GET /search**

Búsqueda full-text en documentos.

#### **Request**

- Method: GET
- Path: /search
- Host: ${API_HOST}
- Query parameters:
  - q: Search term (required)
  - limit: Results per page (optional)

#### **Query Parameters**

| Parámetro | Tipo   | Requerido | Descripción                                   |
| --------- | ------ | --------- | --------------------------------------------- |
| `q`       | string | ✅ Sí     | Término de búsqueda (min 2 caracteres)        |
| `limit`   | number | ❌ No     | Resultados por página (default: 20, max: 100) |

#### **Response 200**

Returns array of search result objects with:

- id: Document ID
- slug: URL identifier
- title: Document title
- excerpt: Text fragment with highlighted search term
- rank: Relevance score (0.0 to 1.0)
- updatedAt: Last update timestamp

#### **Response 200 (Sin resultados)**

Returns empty data array when no matches found.

#### **Response 400 (Query inválido)**

Error response:

- statusCode: 400
- message: "Search query must be at least 2 characters"

#### **Notas**

- Usa SQLite FTS5 para búsqueda full-text
- Solo busca en documentos publicados
- Búsquedas sin resultados se registran en `search_logs`
- `rank` indica relevancia (0.0 - 1.0)
- `excerpt` contiene fragmento con palabra clave resaltada

---

## 📤 **UPLOAD ENDPOINTS**

### **12. POST /upload/image**

Subir una imagen y obtener URL optimizada.

#### **Request**

- Method: POST
- Path: /upload/image
- Host: ${API_HOST}
- Content-Type: multipart/form-data

Form data field:

- image: File upload (binary data)

#### **Validación**

| Campo   | Tipo | Validación                              |
| ------- | ---- | --------------------------------------- |
| `image` | file | Max 5MB, formatos: jpeg, png, gif, webp |

#### **Response 200**

Returns uploaded image data:

- url: Optimized image URL (WebP format)
- originalUrl: Original format URL (fallback)
- width: Image width in pixels
- height: Image height in pixels
- size: File size in bytes
- format: Output format ("webp")

#### **Response 400 (Archivo muy grande)**

Error response:

- statusCode: 400
- message: "File size exceeds 5MB limit"

#### **Response 400 (Formato inválido)**

Error response:

- statusCode: 400
- message: "Invalid file format. Allowed: jpeg, png, gif, webp"

#### **Notas**

- Optimiza automáticamente a WebP (85% calidad)
- Mantiene original como fallback
- Nombres con timestamp para evitar conflictos
- Redimensiona si excede 2000x2000px

---

## 📊 **ANALYTICS ENDPOINTS**

### **13. POST /analytics/track**

Registrar evento de analytics.

#### **Request**

- Method: POST
- Path: /analytics/track
- Host: ${API_HOST}
- Content-Type: application/json

Request body structure:

- eventType: Event type string (required, see allowed values below)
- metadata: Object with event-specific data (optional)

#### **Validación**

| Campo       | Tipo   | Requerido | Validación                                            |
| ----------- | ------ | --------- | ----------------------------------------------------- |
| `eventType` | string | ✅ Sí     | Valores: `page_view`, `search_query`, `document_edit` |
| `metadata`  | object | ❌ No     | JSON válido                                           |

#### **Response 204**

No content returned (successful tracking)

#### **Response 400**

Error response:

- statusCode: 400
- message: "Invalid event type"

#### **Notas**

- Eventos disponibles en POC:
  - `page_view`: Vista de página
  - `search_query`: Búsqueda realizada
  - `document_edit`: Documento editado
- v0.5+: Dashboard para visualizar analytics

---

## 🌐 **WEBSOCKET EVENTS**

### **Namespace: /presence**

#### **Event: editing-start**

Cliente notifica que comenzó a editar.

**Client → Server payload:**

- documentId: Document ID (number)
- userId: User identifier (string)
- username: Display name (string)

**Server → Other Clients payload:**

- userId: User identifier
- username: Display name
- documentId: Document ID

---

#### **Event: editing-stop**

Cliente notifica que dejó de editar.

**Client → Server payload:**

- Empty object

**Server → Other Clients payload:**

- userId: User identifier
- username: Display name
- documentId: Document ID

---

#### **Event: get-active-users**

Cliente solicita usuarios activos en documento.

**Client → Server payload:**

- documentId: Document ID (number)

**Server → Client payload:**

- users: Array of active user objects
  - userId: User identifier
  - username: Display name
  - documentId: Document ID
  - connectedAt: Connection timestamp

---

#### **Event: user-left**

Usuario desconectado (automático).

**Server → All Clients payload:**

- userId: User identifier
- username: Display name
- documentId: Document ID

---

## ⚡ **RATE LIMITING**

### **Límites Globales**

| Ventana     | Límite       | Descripción      |
| ----------- | ------------ | ---------------- |
| 1 segundo   | 10 requests  | Burst protection |
| 10 segundos | 50 requests  | Uso normal       |
| 1 minuto    | 100 requests | Límite general   |

### **Response 429 (Too Many Requests)**

Error response:

- statusCode: 429
- message: "Too many requests. Please try again later."

---

## 🔐 **AUTENTICACIÓN (v0.5+)**

POC v0.1 no tiene autenticación. Endpoints son públicos.

**v0.5:** JWT authentication with Authorization header:

- Format: Bearer {token}

---

## 📝 **EJEMPLOS DE USO**

### **Flujo: Crear y Publicar Documento**

1. **Crear draft**: POST to /docs with title, content, and createdBy

   - Response includes new document ID with status "draft"

2. **Guardar cambios (auto-save)**: PUT to /docs/{id}/draft with updated title and content

   - Updates document without changing status

3. **Publicar**: PUT to /docs/{id}/publish

   - Changes status from "draft" to "published"

4. **Ver publicado**: GET /docs/{slug}
   - Retrieves published document by slug

### **Flujo: Búsqueda**

- GET request to /search with query parameter q
- Returns array of matching documents with relevance ranking

### **Flujo: Upload de Imagen**

- POST multipart/form-data to /upload/image with image file
- Returns optimized WebP URL and original format URL

---

**Siguiente:** Ver [Backend Architecture](./BACKEND_ARCHITECTURE.md) para implementación completa.
