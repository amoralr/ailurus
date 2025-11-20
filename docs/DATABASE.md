# 🗄️ Database Schema - SQLite + Prisma

**Proyecto**: Ailurus  
**Database**: SQLite 3  
**ORM**: Prisma 7.0.0  
**Normalization**: Third Normal Form (3NF)  
**Fecha**: 20 de noviembre, 2025

---

## 📋 **Visión General**

El schema de Ailurus está diseñado siguiendo principios de **Tercera Forma Normal (3NF)** para garantizar integridad de datos, escalabilidad y performance óptimo.

**¿Por qué SQLite?**

- ✅ **Portabilidad**: Un solo archivo `.db` fácil de respaldar
- ✅ **Docker-friendly**: Persistencia simple con volúmenes (`./database:/app/database`)
- ✅ **Zero-config**: Sin servidor de DB separado ni credenciales
- ✅ **Suficiente**: Soporta miles de documentos sin problemas
- ✅ **FTS5**: Full-text search integrado

**Características del schema**:

- ✅ **3NF compliant**: Sin dependencias transitivas
- ✅ **Integridad referencial**: Foreign keys con ON DELETE configuradas
- ✅ **Índices estratégicos**: Optimización de queries frecuentes
- ✅ **Enums tipados**: DocumentStatus, FolderType
- ✅ **Self-referential**: Jerarquía ilimitada de folders
- ✅ **Many-to-Many**: Documentos en múltiples folders

---

## 📊 **Diagrama de Entidades**

```
┌──────────────┐
│   Category   │ (4 fijas)
│──────────────│
│ id (PK)      │───┐
│ name         │   │
│ icon         │   │
│ order        │   │
└──────────────┘   │
                   │
                   │ FK
┌──────────────┐   │
│   Document   │◄──┘
│──────────────│
│ id (PK)      │───────┐
│ slug (UK)    │       │
│ title        │       │
│ content      │       │
│ excerpt      │       │  M:M
│ categoryId   │       ├────► FolderDocument
│ subcategory  │       │
│ path         │       │
│ status       │       │
│ createdAt    │       │
│ updatedAt    │       │
│ createdBy    │       │
└──────────────┘       │
                       │
┌──────────────┐       │
│    Folder    │◄──────┘
│──────────────│
│ id (PK)      │◄──┐ Self-ref
│ name         │   │
│ type         │   │
│ icon         │   │
│ path (UK)    │   │
│ order        │   │
│ parentId (FK)│───┘
└──────────────┘
       │
       │ M:M
       └────► FolderCategory ◄──── Category

┌──────────────┐
│ ActivityLog  │
│──────────────│
│ id (PK)      │
│ entityType   │
│ entityId     │
│ action       │
│ userId       │
│ changes      │
│ ipAddress    │
│ userAgent    │
│ createdAt    │
└──────────────┘

┌──────────────┐
│CategoryStats │
│──────────────│
│ categoryId   │
│ totalDocs    │
│ publishedDocs│
│ draftDocs    │
│ archivedDocs │
│ lastUpdated  │
└──────────────┘
```

---

## 📐 **Entidades Principales**

### **1. Document**

Documentos Markdown con jerarquía y categorización.

**Campos**:

| Campo         | Tipo     | Restricción          | Descripción                     |
| ------------- | -------- | -------------------- | ------------------------------- |
| `id`          | Int      | PK, AI               | Identificador único             |
| `slug`        | String   | UNIQUE               | URL-friendly ID (`instalacion`) |
| `title`       | String   | NOT NULL             | Título del documento            |
| `content`     | String   | NOT NULL             | Markdown completo               |
| `excerpt`     | String   | NULL                 | Resumen (max 500 chars)         |
| `categoryId`  | String   | FK → Category        | Categoría principal             |
| `subcategory` | String   | NULL                 | Subcategoría opcional           |
| `path`        | String   | NOT NULL             | Ruta jerárquica completa        |
| `status`      | Enum     | DEFAULT: DRAFT       | Estado del documento            |
| `createdAt`   | DateTime | DEFAULT: now()       | Fecha de creación               |
| `updatedAt`   | DateTime | AUTO                 | Última actualización            |
| `createdBy`   | String   | DEFAULT: 'anonymous' | Autor                           |

**Enums**:

- `DRAFT`: Borrador (no visible públicamente)
- `PUBLISHED`: Publicado (visible en /docs)
- `ARCHIVED`: Archivado (no visible, soft delete)

**Índices**:

- `idx_document_category`: Para queries `WHERE categoryId = ?`
- `idx_document_status`: Para filtrar por estado
- `idx_document_path`: Para búsquedas jerárquicas
- `idx_document_created`: Para ordenamiento temporal

**Ejemplo de estructura**:

Un documento típico contiene: ID=1, slug="instalacion", título="Guía de Instalación", contenido completo en Markdown, un extracto breve, categoryId="getting-started", subcategoría="Primeros Pasos", path jerárquico completo, status="PUBLISHED", timestamps de creación y actualización, y el autor.

---

### **2. Category**

Categorías de alto nivel (4 fijas).

**Campos**:

| Campo   | Tipo        | Descripción                        |
| ------- | ----------- | ---------------------------------- |
| `id`    | String (PK) | ID slug (`getting-started`)        |
| `name`  | String      | Nombre display (`Getting Started`) |
| `icon`  | String      | Emoji (`🚀`)                       |
| `order` | Int         | Orden en UI                        |

**Datos fijos**:

| ID                | Name            | Icon | Order |
| ----------------- | --------------- | ---- | ----- |
| `getting-started` | Getting Started | 🚀   | 1     |
| `architecture`    | Architecture    | 🏗️   | 2     |
| `api-reference`   | API Reference   | 📚   | 3     |
| `guides`          | Guides          | 📖   | 4     |

**Relaciones**:

- **1:N con Document**: Una categoría tiene múltiples documentos
- **M:N con Folder** (vía FolderCategory): Cross-referencing

**Restricciones**:

- `ON DELETE RESTRICT`: No se puede borrar categoría con documentos asociados

---

### **3. Folder**

Jerarquía de navegación tipo Obsidian (self-referential).

**Campos**:

| Campo      | Tipo   | Restricción | Descripción            |
| ---------- | ------ | ----------- | ---------------------- |
| `id`       | Int    | PK, AI      | Identificador único    |
| `name`     | String | NOT NULL    | Nombre del folder/file |
| `type`     | Enum   | NOT NULL    | FOLDER o FILE          |
| `icon`     | String | NULL        | Emoji opcional         |
| `path`     | String | UNIQUE      | Ruta completa única    |
| `order`    | Int    | DEFAULT: 0  | Orden de aparición     |
| `parentId` | Int    | FK → Folder | Padre (NULL = raíz)    |

**Enums**:

- `FOLDER`: Carpeta (contiene children)
- `FILE`: Archivo (link a documento)

**Índices**:

- `idx_folder_parent`: Para construir árbol desde padre
- `idx_folder_path`: Para lookup directo por ruta
- `idx_folder_type`: Para filtrar folders vs files

**Ejemplo de jerarquía**:

Un folder raíz típico tiene: id=1, name="Equipo", type="FOLDER", icon="👥", path="Equipo", order=1, parentId=null. Sus children contienen folders anidados como "Proyecto" con su propio path="Equipo/Proyecto" y parentId=1, permitiendo jerarquías ilimitadas.

**Restricciones**:

- `ON DELETE CASCADE`: Al borrar carpeta, borra todos sus hijos (recursivo)

---

## 🔗 **Tablas de Unión (M:M)**

### **FolderDocument**

Permite que un documento aparezca en múltiples folders (shortcuts, links).

**Campos**:

| Campo        | Tipo         | Descripción        |
| ------------ | ------------ | ------------------ |
| `folderId`   | Int (PK, FK) | ID del folder      |
| `documentId` | Int (PK, FK) | ID del documento   |
| `order`      | Int          | Orden en el folder |

**Composite PK**: `(folderId, documentId)`

**Caso de uso**:

```
📦 Getting Started
  └─ 📄 Instalación (documento original)

📦 Guides
  └─ 🔗 Instalación (shortcut al mismo documento)
```

**Restricciones**:

- `ON DELETE CASCADE`: Al borrar folder o documento, limpia automáticamente

---

### **FolderCategory**

Folders pueden pertenecer a múltiples categorías (cross-referencing).

**Campos**:

| Campo        | Tipo            | Descripción        |
| ------------ | --------------- | ------------------ |
| `folderId`   | Int (PK, FK)    | ID del folder      |
| `categoryId` | String (PK, FK) | ID de la categoría |

**Composite PK**: `(folderId, categoryId)`

---

## 📈 **Entidades Auxiliares**

### **ActivityLog**

Auditoría completa de acciones en el sistema.

**Campos**:

| Campo        | Tipo          | Descripción                                     |
| ------------ | ------------- | ----------------------------------------------- |
| `id`         | Int (PK, AI)  | ID del log                                      |
| `entityType` | String        | Tipo: 'document', 'folder', 'category'          |
| `entityId`   | Int           | ID de la entidad afectada                       |
| `action`     | String        | Acción: 'create', 'update', 'delete', 'publish' |
| `userId`     | String        | Usuario que ejecutó                             |
| `changes`    | String (JSON) | Delta de cambios (opcional)                     |
| `ipAddress`  | String        | IP del usuario                                  |
| `userAgent`  | String        | Browser/client                                  |
| `createdAt`  | DateTime      | Timestamp del evento                            |

**Índices**:

- `idx_activity_entity`: `(entityType, entityId)` para buscar por entidad
- `idx_activity_user`: `userId` para actividad por usuario
- `idx_activity_created`: `createdAt` para timeline

**Ejemplo de log**:

Un registro típico incluye: id=123, entityType="document", entityId=5, action="publish", userId="admin", changes mostrando el delta (ej: status cambió de DRAFT a PUBLISHED), ipAddress del usuario, userAgent del browser, y timestamp de creación.

---

### **CategoryStats**

Estadísticas pre-calculadas para evitar COUNT queries costosos.

**Campos**:

| Campo            | Tipo            | Descripción                   |
| ---------------- | --------------- | ----------------------------- |
| `categoryId`     | String (PK, FK) | ID de la categoría            |
| `totalDocuments` | Int             | Total de documentos           |
| `publishedDocs`  | Int             | Documentos publicados         |
| `draftDocs`      | Int             | Documentos en borrador        |
| `archivedDocs`   | Int             | Documentos archivados         |
| `lastUpdated`    | DateTime        | Última actualización de stats |

**Actualización**: Trigger o background job cada N minutos

**Ejemplo de stats**:

Una estadística típica muestra: categoryId="getting-started", totalDocuments=5, publishedDocs=3, draftDocs=2, archivedDocs=0, y lastUpdated con el timestamp de última actualización.

---

## 🔐 **Integridad Referencial**

### **Foreign Keys con ON DELETE**

**Configuraciones de integridad referencial**:

- **Document → Category (RESTRICT)**: No se puede borrar categoría con documentos asociados
- **Folder → Folder/parent (CASCADE)**: Al borrar carpeta, borra todos sus hijos recursivamente
- **FolderDocument → Folder (CASCADE)**: Al borrar folder, limpia automáticamente los links
- **FolderDocument → Document (CASCADE)**: Al borrar documento, limpia automáticamente los links

### **Unique Constraints**

- `Document.slug`: Garantiza URLs únicas
- `Folder.path`: Garantiza rutas únicas en árbol

---

## 🚀 **Queries Comunes**

### **1. Obtener todos los documentos publicados**

Buscar todos los documentos donde status="PUBLISHED", incluyendo su categoría relacionada, ordenados por fecha de creación descendente.

### **2. Obtener documentos por categoría**

Filtrar documentos por categoryId específico (ej: "getting-started") y status="PUBLISHED".

### **3. Obtener árbol de folders (con hijos)**

Buscar folders raíz (parentId=null) e incluir recursivamente sus children hasta 3 niveles de profundidad, ordenados por campo order.

### **4. Buscar folder por path**

Buscar folder único usando su path completo (ej: "Equipo/Proyecto/Getting Started"), incluyendo sus children.

### **5. Stats por categoría**

Obtener todas las estadísticas de categorías, ordenadas por categoryId.

### **6. Actividad reciente de un usuario**

Filtrar logs de actividad por userId específico, ordenados por fecha descendente, limitado a los 20 registros más recientes.

---

## 🌱 **Seed Data**

El seed (`backend/prisma/seed.ts`) inicializa:

- ✅ **4 categorías** con iconos y orden
- ✅ **20 documentos** basados en `frontend/src/mocks/documents.mock.ts`
- ✅ **11 folders** con jerarquía Obsidian-style
- ✅ **FolderDocument links** conectando documentos a folders
- ✅ **CategoryStats** con conteos iniciales

**Ejecutar seed**:

```bash
cd backend
pnpm prisma:seed
```

**Verificar datos**:

```bash
pnpm prisma:studio
# Abre http://localhost:5555
```

---

## ⚙️ **Comandos Prisma**

### **Generar Cliente TypeScript**

```bash
pnpm prisma:generate
```

Genera tipos en `node_modules/@prisma/client` basados en schema.

### **Crear Migración**

```bash
pnpm prisma:migrate
# o con nombre personalizado:
npx prisma migrate dev --name add_excerpt_field
```

Aplica cambios del schema y genera SQL migration.

### **Ver Migraciones Aplicadas**

```bash
npx prisma migrate status
```

### **Abrir Prisma Studio (GUI)**

```bash
pnpm prisma:studio
```

Interface visual para explorar/editar datos.

### **Reset Database** (⚠️ Destructivo)

```bash
pnpm db:reset
```

Borra DB, reaplica migrations, ejecuta seed.

---

## 📈 **Estrategia de Performance**

### **Índices Implementados**

| Tabla       | Columna(s)               | Tipo      | Justificación                          |
| ----------- | ------------------------ | --------- | -------------------------------------- |
| Document    | `categoryId`             | B-tree    | Filtrado por categoría (muy frecuente) |
| Document    | `status`                 | B-tree    | Filtrado publicados vs drafts          |
| Document    | `path`                   | B-tree    | Búsquedas jerárquicas                  |
| Document    | `createdAt`              | B-tree    | Ordenamiento temporal                  |
| Folder      | `parentId`               | B-tree    | Construcción de árbol                  |
| Folder      | `path`                   | B-tree    | Lookup directo por ruta                |
| ActivityLog | `(entityType, entityId)` | Composite | Auditoría por entidad                  |
| ActivityLog | `userId`                 | B-tree    | Actividad por usuario                  |

### **Optimizaciones Futuras**

1. **Full-Text Search**: SQLite FTS5 en `Document.content` para búsquedas
2. **Partitioning**: Particionar `ActivityLog` por mes (cuando > 1M rows)
3. **Materialized Views**: Pre-calcular joins complejos con triggers
4. **Backup**: `cp ./database/documents.db ./database/documents.backup.db`

---

## 🔄 **Evolución del Schema**

**Versión Inicial** (POC v0.1):

Schema simple con datasource SQLite apuntando a archivo local, y modelo Document básico con solo: id (autoincremental), slug (único), title, content, y status como String.

**Versión Actual** (Production v1.0):

Datasource con URL desde variable de entorno. Modelo Document expandido con campos adicionales: excerpt (opcional), categoryId, subcategory (opcional), path, y status ahora como enum DocumentStatus en lugar de String.

**Cambios clave**:

- 1 tabla → 7 tablas (normalización 3NF)
- Sin categorías → Sistema de categorías completo
- Sin jerarquía → Folders self-referential
- Sin búsqueda → FTS5 integrado en SQLite

---

## 🎯 **Próximos Pasos**

### **Backend**

1. ✅ Schema definido con 7 tablas
2. ⏳ Ejecutar `pnpm prisma:migrate` (crear tablas)
3. ⏳ Ejecutar `pnpm prisma:seed` (cargar datos)
4. ⏳ Implementar `DocumentsController`, `FoldersController`, `CategoriesController`

### **Testing**

1. Verificar integridad referencial (borrado en cascada)
2. Performance testing con 1000+ documentos
3. Validar índices con EXPLAIN ANALYZE

### **Features v2.0**

- 🔍 Full-text search con SQLite FTS5
- 📊 Dashboard de analytics usando ActivityLog
- 🔄 Versionado de documentos (history table)
- 🔒 Row-level security (RLS) con Prisma

---

## 📚 **Referencias**

- [Prisma Documentation](https://www.prisma.io/docs) - ORM oficial
- [SQLite 3NF](https://en.wikipedia.org/wiki/Third_normal_form) - Normalización
- [Prisma Self-Relations](https://www.prisma.io/docs/concepts/components/prisma-schema/relations/self-relations) - Folders hierarchy
- [ALIGNMENT_REPORT.md](./INTERNAL/ALIGNMENT_REPORT.md) - Decisiones de diseño
- [FOLDER_SYSTEM.md](./FOLDER_SYSTEM.md) - Detalle de sistema de carpetas

---

**Última actualización**: 20 de noviembre, 2025  
**Mantenedor**: Sistema de documentación Ailurus
