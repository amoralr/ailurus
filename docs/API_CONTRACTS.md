# 📡 API Contracts

**Proyecto**: Ailurus API  
**Base URL**: `${API_BASE_URL}` (default: `http://localhost:3000`)  
**Fecha**: 17 de noviembre, 2025

---

## 🔧 **CONFIGURACIÓN**

### **Variables de Entorno**

```bash
# Backend (.env)
API_HOST=localhost:3000
API_BASE_URL=http://localhost:3000
UPLOAD_BASE_URL=/uploads
FRONTEND_URL=http://localhost:4321

# Producción
API_HOST=api.ailurus.dev
API_BASE_URL=https://api.ailurus.dev
UPLOAD_BASE_URL=https://cdn.ailurus.dev
FRONTEND_URL=https://ailurus.dev
```

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

```json
{
  "success": true,
  "data": { ... },
  "timestamp": "2025-11-17T10:30:00.000Z"
}
```

### **Respuesta de Error**

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation failed",
  "timestamp": "2025-11-17T10:30:00.000Z",
  "path": "/documents",
  "method": "POST"
}
```

---

## 📄 **DOCUMENTS ENDPOINTS**

### **1. GET /docs**

Obtener todos los documentos publicados.

#### **Request**

```http
GET /docs HTTP/1.1
Host: ${API_HOST}
```

#### **Response 200**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "slug": "guia-de-inicio",
      "title": "Guía de Inicio",
      "content": "# Bienvenido\n\nEsta es una guía...",
      "status": "published",
      "createdAt": "2025-11-15T10:00:00.000Z",
      "updatedAt": "2025-11-17T09:30:00.000Z",
      "createdBy": "admin"
    },
    {
      "id": 2,
      "slug": "arquitectura",
      "title": "Arquitectura del Sistema",
      "content": "# Arquitectura\n\n...",
      "status": "published",
      "createdAt": "2025-11-16T14:20:00.000Z",
      "updatedAt": "2025-11-16T16:45:00.000Z",
      "createdBy": "admin"
    }
  ],
  "timestamp": "2025-11-17T10:30:00.000Z"
}
```

#### **Notas**

- Solo devuelve documentos con `status: "published"`
- Ordenados por fecha de creación (más reciente primero)
- Sin paginación en POC v0.1

---

### **2. GET /docs/:slug**

Obtener un documento específico por slug.

#### **Request**

```http
GET /docs/guia-de-inicio HTTP/1.1
Host: ${API_HOST}
```

#### **Response 200**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "slug": "guia-de-inicio",
    "title": "Guía de Inicio",
    "content": "# Bienvenido\n\nEsta es una guía de inicio para el sistema...",
    "status": "published",
    "createdAt": "2025-11-15T10:00:00.000Z",
    "updatedAt": "2025-11-17T09:30:00.000Z",
    "createdBy": "admin"
  },
  "timestamp": "2025-11-17T10:30:00.000Z"
}
```

#### **Response 404**

```json
{
  "success": false,
  "statusCode": 404,
  "message": "Document with slug 'guia-de-inicio' not found",
  "timestamp": "2025-11-17T10:30:00.000Z",
  "path": "/docs/guia-de-inicio",
  "method": "GET"
}
```

#### **Notas**

- Solo devuelve documentos publicados
- Documentos en draft o archivados retornan 404

---

### **3. POST /docs**

Crear un nuevo documento (en estado draft).

#### **Request**

```http
POST /docs HTTP/1.1
Host: ${API_HOST}
Content-Type: application/json

{
  "title": "Nueva Guía de API",
  "content": "# Introducción\n\nEsta guía explica...",
  "createdBy": "admin"
}
```

#### **Validación**

| Campo       | Tipo   | Requerido | Validación             |
| ----------- | ------ | --------- | ---------------------- |
| `title`     | string | ✅ Sí     | Max 200 caracteres     |
| `content`   | string | ❌ No     | Max 100,000 caracteres |
| `createdBy` | string | ❌ No     | Default: "anonymous"   |

#### **Response 201**

```json
{
  "success": true,
  "data": {
    "id": 5,
    "slug": "nueva-guia-de-api",
    "title": "Nueva Guía de API",
    "content": "# Introducción\n\nEsta guía explica...",
    "status": "draft",
    "createdAt": "2025-11-17T10:35:00.000Z",
    "updatedAt": "2025-11-17T10:35:00.000Z",
    "createdBy": "admin"
  },
  "timestamp": "2025-11-17T10:35:00.000Z"
}
```

#### **Response 400 (Slug duplicado)**

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Document with slug 'nueva-guia-de-api' already exists",
  "timestamp": "2025-11-17T10:35:00.000Z",
  "path": "/docs",
  "method": "POST"
}
```

#### **Response 400 (Validación)**

```json
{
  "success": false,
  "statusCode": 400,
  "message": [
    "title should not be empty",
    "title must be shorter than or equal to 200 characters"
  ],
  "timestamp": "2025-11-17T10:35:00.000Z",
  "path": "/docs",
  "method": "POST"
}
```

#### **Notas**

- El slug se genera automáticamente desde el título
- Slug normalizado: lowercase, sin acentos, guiones en lugar de espacios
- Documento se crea en estado `draft`

---

### **4. PUT /docs/:id/draft**

Guardar cambios en un draft (auto-save).

#### **Request**

```http
PUT /docs/5/draft HTTP/1.1
Host: ${API_HOST}
Content-Type: application/json

{
  "title": "Nueva Guía de API (Actualizada)",
  "content": "# Introducción\n\nEsta guía explica cómo usar la API..."
}
```

#### **Validación**

| Campo     | Tipo   | Requerido | Validación             |
| --------- | ------ | --------- | ---------------------- |
| `title`   | string | ✅ Sí     | Max 200 caracteres     |
| `content` | string | ✅ Sí     | Max 100,000 caracteres |

#### **Response 200**

```json
{
  "success": true,
  "data": {
    "id": 5,
    "slug": "nueva-guia-de-api",
    "title": "Nueva Guía de API (Actualizada)",
    "content": "# Introducción\n\nEsta guía explica cómo usar la API...",
    "status": "draft",
    "createdAt": "2025-11-17T10:35:00.000Z",
    "updatedAt": "2025-11-17T10:40:00.000Z",
    "createdBy": "admin"
  },
  "timestamp": "2025-11-17T10:40:00.000Z"
}
```

#### **Response 404**

```json
{
  "success": false,
  "statusCode": 404,
  "message": "Document with id 5 not found",
  "timestamp": "2025-11-17T10:40:00.000Z",
  "path": "/docs/5/draft",
  "method": "PUT"
}
```

#### **Notas**

- Actualiza `updated_at` automáticamente
- No cambia el slug ni el estado
- Usado por auto-save del editor (cada 5 segundos)

---

### **5. PUT /docs/:id/publish**

Publicar un documento (cambiar de draft a published).

#### **Request**

```http
PUT /docs/5/publish HTTP/1.1
Host: ${API_HOST}
```

#### **Response 200**

```json
{
  "success": true,
  "data": {
    "id": 5,
    "slug": "nueva-guia-de-api",
    "title": "Nueva Guía de API (Actualizada)",
    "content": "# Introducción\n\nEsta guía explica cómo usar la API...",
    "status": "published",
    "createdAt": "2025-11-17T10:35:00.000Z",
    "updatedAt": "2025-11-17T10:45:00.000Z",
    "createdBy": "admin"
  },
  "timestamp": "2025-11-17T10:45:00.000Z"
}
```

#### **Response 400 (Contenido vacío)**

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Cannot publish empty document",
  "timestamp": "2025-11-17T10:45:00.000Z",
  "path": "/docs/5/publish",
  "method": "PUT"
}
```

#### **Response 404**

```json
{
  "success": false,
  "statusCode": 404,
  "message": "Document with id 5 not found",
  "timestamp": "2025-11-17T10:45:00.000Z",
  "path": "/docs/5/publish",
  "method": "PUT"
}
```

#### **Notas**

- Solo se puede publicar si `content` no está vacío
- Actualiza `status` a `published`
- Actualiza `updated_at`

---

### **6. DELETE /docs/:id**

Archivar un documento (soft delete).

#### **Request**

```http
DELETE /docs/5 HTTP/1.1
Host: ${API_HOST}
```

#### **Response 204**

```
(Sin contenido)
```

#### **Response 404**

```json
{
  "success": false,
  "statusCode": 404,
  "message": "Document with id 5 not found",
  "timestamp": "2025-11-17T10:50:00.000Z",
  "path": "/docs/5",
  "method": "DELETE"
}
```

#### **Notas**

- No elimina físicamente, cambia `status` a `archived`
- Documentos archivados no aparecen en listados ni búsquedas
- POC v0.1: No hay endpoint para restaurar (v0.5+)

---

## 🔍 **SEARCH ENDPOINTS**

### **7. GET /search**

Búsqueda full-text en documentos.

#### **Request**

```http
GET /search?q=arquitectura HTTP/1.1
Host: ${API_HOST}
```

#### **Query Parameters**

| Parámetro | Tipo   | Requerido | Descripción                                   |
| --------- | ------ | --------- | --------------------------------------------- |
| `q`       | string | ✅ Sí     | Término de búsqueda (min 2 caracteres)        |
| `limit`   | number | ❌ No     | Resultados por página (default: 20, max: 100) |

#### **Response 200**

```json
{
  "success": true,
  "data": [
    {
      "id": 2,
      "slug": "arquitectura",
      "title": "Arquitectura del Sistema",
      "excerpt": "...la **arquitectura** del sistema se basa en...",
      "rank": 0.95,
      "updatedAt": "2025-11-16T16:45:00.000Z"
    },
    {
      "id": 4,
      "slug": "guia-nestjs",
      "title": "Guía de NestJS",
      "excerpt": "...diseño de **arquitectura** modular en NestJS...",
      "rank": 0.72,
      "updatedAt": "2025-11-15T12:00:00.000Z"
    }
  ],
  "timestamp": "2025-11-17T11:00:00.000Z"
}
```

#### **Response 200 (Sin resultados)**

```json
{
  "success": true,
  "data": [],
  "timestamp": "2025-11-17T11:00:00.000Z"
}
```

#### **Response 400 (Query inválido)**

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Search query must be at least 2 characters",
  "timestamp": "2025-11-17T11:00:00.000Z",
  "path": "/search",
  "method": "GET"
}
```

#### **Notas**

- Usa SQLite FTS5 para búsqueda full-text
- Solo busca en documentos publicados
- Búsquedas sin resultados se registran en `search_logs`
- `rank` indica relevancia (0.0 - 1.0)
- `excerpt` contiene fragmento con palabra clave resaltada

---

## 📤 **UPLOAD ENDPOINTS**

### **8. POST /upload/image**

Subir una imagen y obtener URL optimizada.

#### **Request**

```http
POST /upload/image HTTP/1.1
Host: ${API_HOST}
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary

------WebKitFormBoundary
Content-Disposition: form-data; name="image"; filename="diagram.png"
Content-Type: image/png

[binary data]
------WebKitFormBoundary--
```

#### **Validación**

| Campo   | Tipo | Validación                              |
| ------- | ---- | --------------------------------------- |
| `image` | file | Max 5MB, formatos: jpeg, png, gif, webp |

#### **Response 200**

```json
{
  "success": true,
  "data": {
    "url": "${UPLOAD_BASE_URL}/images/optimized/diagram-1700220000000.webp",
    "originalUrl": "${UPLOAD_BASE_URL}/images/original/diagram-1700220000000.png",
    "width": 1200,
    "height": 800,
    "size": 145600,
    "format": "webp"
  },
  "timestamp": "2025-11-17T11:10:00.000Z"
}
```

#### **Response 400 (Archivo muy grande)**

```json
{
  "success": false,
  "statusCode": 400,
  "message": "File size exceeds 5MB limit",
  "timestamp": "2025-11-17T11:10:00.000Z",
  "path": "/upload/image",
  "method": "POST"
}
```

#### **Response 400 (Formato inválido)**

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Invalid file format. Allowed: jpeg, png, gif, webp",
  "timestamp": "2025-11-17T11:10:00.000Z",
  "path": "/upload/image",
  "method": "POST"
}
```

#### **Notas**

- Optimiza automáticamente a WebP (85% calidad)
- Mantiene original como fallback
- Nombres con timestamp para evitar conflictos
- Redimensiona si excede 2000x2000px

---

## 📊 **ANALYTICS ENDPOINTS**

### **9. POST /analytics/track**

Registrar evento de analytics.

#### **Request**

```http
POST /analytics/track HTTP/1.1
Host: ${API_HOST}
Content-Type: application/json

{
  "eventType": "page_view",
  "metadata": {
    "page": "/docs/arquitectura",
    "referrer": "/docs/guia-de-inicio",
    "userAgent": "Mozilla/5.0..."
  }
}
```

#### **Validación**

| Campo       | Tipo   | Requerido | Validación                                            |
| ----------- | ------ | --------- | ----------------------------------------------------- |
| `eventType` | string | ✅ Sí     | Valores: `page_view`, `search_query`, `document_edit` |
| `metadata`  | object | ❌ No     | JSON válido                                           |

#### **Response 204**

```
(Sin contenido)
```

#### **Response 400**

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Invalid event type",
  "timestamp": "2025-11-17T11:20:00.000Z",
  "path": "/analytics/track",
  "method": "POST"
}
```

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

**Client → Server:**

```json
{
  "documentId": 5,
  "userId": "user-123",
  "username": "Antonio"
}
```

**Server → Other Clients:**

```json
{
  "userId": "user-123",
  "username": "Antonio",
  "documentId": 5
}
```

---

#### **Event: editing-stop**

Cliente notifica que dejó de editar.

**Client → Server:**

```json
{}
```

**Server → Other Clients:**

```json
{
  "userId": "user-123",
  "username": "Antonio",
  "documentId": 5
}
```

---

#### **Event: get-active-users**

Cliente solicita usuarios activos en documento.

**Client → Server:**

```json
{
  "documentId": 5
}
```

**Server → Client:**

```json
{
  "users": [
    {
      "userId": "user-456",
      "username": "María",
      "documentId": 5,
      "connectedAt": "2025-11-17T11:00:00.000Z"
    }
  ]
}
```

---

#### **Event: user-left**

Usuario desconectado (automático).

**Server → All Clients:**

```json
{
  "userId": "user-123",
  "username": "Antonio",
  "documentId": 5
}
```

---

## ⚡ **RATE LIMITING**

### **Límites Globales**

| Ventana     | Límite       | Descripción      |
| ----------- | ------------ | ---------------- |
| 1 segundo   | 10 requests  | Burst protection |
| 10 segundos | 50 requests  | Uso normal       |
| 1 minuto    | 100 requests | Límite general   |

### **Response 429 (Too Many Requests)**

```json
{
  "success": false,
  "statusCode": 429,
  "message": "Too many requests. Please try again later.",
  "timestamp": "2025-11-17T11:30:00.000Z",
  "path": "/docs",
  "method": "GET"
}
```

---

## 🔐 **AUTENTICACIÓN (v0.5+)**

POC v0.1 no tiene autenticación. Endpoints son públicos.

**v0.5:** JWT authentication con header:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📝 **EJEMPLOS DE USO**

### **Flujo: Crear y Publicar Documento**

```bash
# 1. Crear draft
curl -X POST ${API_BASE_URL}/docs \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Mi Primer Documento",
    "content": "# Hola Mundo",
    "createdBy": "admin"
  }'

# Response: { "data": { "id": 10, "status": "draft", ... } }

# 2. Guardar cambios (auto-save)
curl -X PUT ${API_BASE_URL}/docs/10/draft \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Mi Primer Documento",
    "content": "# Hola Mundo\n\nEste es mi primer documento."
  }'

# 3. Publicar
curl -X PUT ${API_BASE_URL}/docs/10/publish

# Response: { "data": { "id": 10, "status": "published", ... } }

# 4. Ver publicado
curl ${API_BASE_URL}/docs/mi-primer-documento
```

### **Flujo: Búsqueda**

```bash
curl "${API_BASE_URL}/search?q=arquitectura"

# Response: { "data": [ { "slug": "arquitectura", ... } ] }
```

### **Flujo: Upload de Imagen**

```bash
curl -X POST ${API_BASE_URL}/upload/image \
  -F "image=@diagram.png"

# Response: { "data": { "url": "${UPLOAD_BASE_URL}/images/optimized/diagram-1700220000000.webp" } }
```

---

**Siguiente:** Ver [Backend Architecture](./BACKEND_ARCHITECTURE.md) para implementación completa.
