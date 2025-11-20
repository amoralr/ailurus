# 📊 Prisma Database Schema - Ailurus

**Version**: 1.0.0  
**Database**: PostgreSQL  
**ORM**: Prisma 7.0.0  
**Normalization**: Third Normal Form (3NF)

---

## 📐 **Schema Overview**

El schema de Ailurus está diseñado siguiendo la **Tercera Forma Normal (3NF)** para garantizar:

- ✅ **Sin dependencias transitivas**: Todos los atributos no-clave dependen únicamente de la clave primaria
- ✅ **Integridad referencial**: Foreign keys con restricciones ON DELETE apropiadas
- ✅ **Optimización de consultas**: Índices estratégicos en columnas frecuentemente consultadas
- ✅ **Escalabilidad**: Estructura que soporta crecimiento sin re-diseño

---

## 📁 **Entidades Principales**

### **1. Document**

Documentos son la entidad central del sistema.

```prisma
model Document {
  id          Int            @id @default(autoincrement())
  slug        String         @unique
  title       String
  content     String         // Markdown
  excerpt     String?        // Resumen corto
  categoryId  String         // FK a Category
  subcategory String?
  path        String         // Ruta jerárquica Obsidian-style
  status      DocumentStatus // DRAFT | PUBLISHED | ARCHIVED
  createdAt   DateTime
  updatedAt   DateTime
  createdBy   String
}
```

**Campos clave**:

- `slug`: Identificador único para URLs (`/docs/instalacion`)
- `path`: Ruta completa jerárquica (`Equipo/Proyecto/Getting Started/...`)
- `excerpt`: Resumen para cards y previews (max 500 chars)
- `categoryId`: Relación con Category (normalizado)

**Índices**:

- `idx_document_category`: Filtrado por categoría
- `idx_document_status`: Filtrado por estado
- `idx_document_path`: Búsquedas jerárquicas
- `idx_document_created`: Ordenamiento temporal

---

### **2. Category**

Categorías definen la organización de alto nivel.

```prisma
model Category {
  id      String  @id         // 'getting-started', 'architecture'
  name    String              // 'Getting Started', 'Architecture'
  icon    String              // Emoji '🚀', '🏗️'
  order   Int                 // Orden en UI
}
```

**Datos fijos** (4 categorías):

1. `getting-started` - 🚀 Getting Started
2. `architecture` - 🏗️ Architecture
3. `api-reference` - 📚 API Reference
4. `guides` - 📖 Guides

**Justificación 3NF**: Información de categoría no depende de documentos (tabla separada).

---

### **3. Folder**

Carpetas representan la jerarquía de navegación tipo Obsidian.

```prisma
model Folder {
  id        Int        @id
  name      String
  type      FolderType // FOLDER | FILE
  icon      String?    // Emoji opcional
  path      String     @unique
  order     Int
  parentId  Int?       // Self-referential
  parent    Folder?
  children  Folder[]
}
```

**Características**:

- **Self-referential**: Jerarquía ilimitada con `parentId`
- **Type discrimination**: FOLDER (carpeta) vs FILE (link a documento)
- **Path único**: Garantiza unicidad de rutas completas
- **Order**: Control de ordenamiento en UI

**Ejemplo de jerarquía**:

```
Equipo (folder)
└─ Proyecto (folder)
   └─ Getting Started (folder)
      └─ Guía de Instalación (file → documento)
```

---

## 🔗 **Tablas de Unión (Many-to-Many)**

### **FolderDocument**

Permite que un documento aparezca en múltiples folders.

```prisma
model FolderDocument {
  folderId   Int
  documentId Int
  order      Int
  @@id([folderId, documentId])
}
```

**Caso de uso**: Shortcuts, links, documentos relacionados en múltiples categorías.

---

### **FolderCategory**

Permite que folders pertenezcan a múltiples categorías (cross-referencing).

```prisma
model FolderCategory {
  folderId   Int
  categoryId String
  @@id([folderId, categoryId])
}
```

---

## 📊 **Entidades Auxiliares**

### **ActivityLog**

Auditoría de acciones sobre documentos/folders.

```prisma
model ActivityLog {
  id          Int
  entityType  String    // 'document', 'folder', 'category'
  entityId    Int
  action      String    // 'create', 'update', 'delete', 'publish'
  userId      String
  changes     String?   // JSON de cambios
  ipAddress   String?
  userAgent   String?
  createdAt   DateTime
}
```

---

### **CategoryStats**

Estadísticas pre-calculadas por categoría.

```prisma
model CategoryStats {
  categoryId      String
  totalDocuments  Int
  publishedDocs   Int
  draftDocs       Int
  archivedDocs    Int
  lastUpdated     DateTime
}
```

**Optimización**: Evita COUNT queries costosos en tiempo real.

---

## 🚀 **Comandos Prisma**

### **Generar Cliente**

```bash
pnpm prisma:generate
```

### **Crear Migración**

```bash
pnpm prisma:migrate
# o con nombre específico:
npx prisma migrate dev --name add_new_feature
```

### **Ejecutar Seed**

```bash
pnpm prisma:seed
```

### **Abrir Prisma Studio**

```bash
pnpm prisma:studio
```

### **Reset Completo** (⚠️ Borra todo)

```bash
pnpm db:reset
```

---

## 🌱 **Seed Data**

El seed (`prisma/seed.ts`) carga:

- ✅ **4 categorías** (getting-started, architecture, api-reference, guides)
- ✅ **5+ documentos** de ejemplo con contenido real
- ✅ **11+ folders** con jerarquía Obsidian-style
- ✅ **FolderDocument links** conectando folders a documentos
- ✅ **CategoryStats** inicializadas con conteos reales

**Ejecutar**:

```bash
pnpm prisma:seed
```

---

## 📈 **Estrategia de Índices**

| Tabla          | Índice                   | Justificación                         |
| -------------- | ------------------------ | ------------------------------------- |
| Document       | `categoryId`             | Filtrado frecuente por categoría      |
| Document       | `status`                 | Queries: publicados vs drafts         |
| Document       | `path`                   | Búsquedas jerárquicas tipo breadcrumb |
| Document       | `createdAt`              | Ordenamiento cronológico              |
| Folder         | `parentId`               | Construcción de árbol jerárquico      |
| Folder         | `path`                   | Lookup directo de nodos               |
| Folder         | `type`                   | Filtrado folders vs files             |
| Category       | `order`                  | Ordenamiento en UI                    |
| FolderDocument | `folderId`, `documentId` | Lookup bidireccional rápido           |
| ActivityLog    | `entityType + entityId`  | Auditoría por entidad                 |
| ActivityLog    | `userId`                 | Actividad por usuario                 |

---

## 🔐 **Constraints & Rules**

### **ON DELETE Behaviors**

```prisma
// Category → Document: RESTRICT (no borrar categoría con docs)
category  Category  @relation(onDelete: Restrict)

// Folder hierarchy: CASCADE (borrar hijos al borrar padre)
parent    Folder?   @relation(onDelete: Cascade)

// FolderDocument: CASCADE (limpiar al borrar folder/documento)
folder    Folder    @relation(onDelete: Cascade)
document  Document  @relation(onDelete: Cascade)
```

### **Unique Constraints**

- `Document.slug`: URLs únicas
- `Folder.path`: Rutas únicas en árbol

### **Default Values**

- `Document.status`: `DRAFT`
- `Document.createdBy`: `"anonymous"`
- `Folder.order`: `0`
- Timestamps: Auto-managed por Prisma

---

## 🧪 **Testing con Seed Data**

Después de ejecutar seed:

```typescript
// Obtener todos los documentos publicados
const published = await prisma.document.findMany({
  where: { status: 'PUBLISHED' },
  include: { category: true },
});

// Obtener árbol de folders
const rootFolders = await prisma.folder.findMany({
  where: { parentId: null },
  include: {
    children: {
      include: {
        children: true, // Nivel 2
      },
    },
  },
});

// Stats por categoría
const stats = await prisma.categoryStats.findMany({
  orderBy: { categoryId: 'asc' },
});
```

---

## 📚 **Recursos**

- [Prisma Docs](https://www.prisma.io/docs)
- [Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [3NF Database Design](https://en.wikipedia.org/wiki/Third_normal_form)
- [ALIGNMENT_REPORT.md](../docs/ALIGNMENT_REPORT.md) - Decisiones de diseño

---

## 🎯 **Próximos Pasos**

1. Ejecutar `pnpm prisma:migrate` para crear tablas
2. Ejecutar `pnpm prisma:seed` para cargar datos iniciales
3. Verificar con `pnpm prisma:studio`
4. Implementar endpoints en backend (DocumentsController, FoldersController, etc.)
