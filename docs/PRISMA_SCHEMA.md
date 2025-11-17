# 🗄️ Prisma Schema

**Proyecto**: docs-backend  
**ORM**: Prisma ^5.7.0  
**Database**: SQLite  
**Fecha**: 17 de noviembre, 2025

---

## 📋 **SCHEMA COMPLETO**

### **prisma/schema.prisma**

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

// ============================================
// DOCUMENTS
// ============================================

model Document {
  id        Int            @id @default(autoincrement())
  slug      String         @unique
  title     String
  content   String
  status    DocumentStatus @default(DRAFT)
  createdAt DateTime       @default(now())
  updatedAt DateTime       @updatedAt
  createdBy String         @default("anonymous")

  @@map("documents")
}

enum DocumentStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}

// ============================================
// ANALYTICS
// ============================================

model AnalyticsEvent {
  id        Int      @id @default(autoincrement())
  eventType String   // 'page_view' | 'search_query' | 'document_edit'
  metadata  String?  // JSON string
  timestamp DateTime @default(now())

  @@map("analytics_events")
}

// ============================================
// SEARCH LOGS
// ============================================

model SearchLog {
  id           Int      @id @default(autoincrement())
  query        String
  resultsCount Int      @default(0)
  searchedAt   DateTime @default(now())

  @@map("search_logs")
}

// ============================================
// UPLOADS (v0.5+)
// ============================================

model Upload {
  id           Int      @id @default(autoincrement())
  filename     String
  originalName String
  mimeType     String
  size         Int
  url          String
  optimizedUrl String?
  uploadedAt   DateTime @default(now())
  uploadedBy   String   @default("anonymous")

  @@map("uploads")
}
```

---

## 🔧 **CONFIGURACIÓN**

### **.env**

```env
# Database
DATABASE_URL="file:./database/documents.db"

# Logs (opcional)
DB_LOG="false"

# App
NODE_ENV="development"
PORT=3000
FRONTEND_URL="http://localhost:4321"

# Upload
MAX_FILE_SIZE=5242880
UPLOAD_DIR="./uploads"
```

---

## 🚀 **COMANDOS PRISMA**

### **Inicializar Prisma**

```bash
npx prisma init --datasource-provider sqlite
```

### **Generar Cliente**

Genera el cliente de Prisma después de cambios en el schema:

```bash
npx prisma generate
```

### **Crear Migración**

```bash
npx prisma migrate dev --name init
```

### **Aplicar Migraciones**

```bash
npx prisma migrate deploy
```

### **Resetear Base de Datos (⚠️ Solo desarrollo)**

```bash
npx prisma migrate reset
```

### **Abrir Prisma Studio**

UI visual para explorar datos:

```bash
npx prisma studio
```

Abre en `http://localhost:5555`

---

## 📊 **MIGRACIONES**

### **prisma/migrations/20251117_init/migration.sql**

```sql
-- CreateTable
CREATE TABLE "documents" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdBy" TEXT NOT NULL DEFAULT 'anonymous'
);

-- CreateTable
CREATE TABLE "analytics_events" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "eventType" TEXT NOT NULL,
    "metadata" TEXT,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "search_logs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "query" TEXT NOT NULL,
    "resultsCount" INTEGER NOT NULL DEFAULT 0,
    "searchedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "uploads" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "filename" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "optimizedUrl" TEXT,
    "uploadedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uploadedBy" TEXT NOT NULL DEFAULT 'anonymous'
);

-- CreateIndex
CREATE UNIQUE INDEX "documents_slug_key" ON "documents"("slug");
```

### **Migración FTS5 (SQLite Full-Text Search)**

```sql
-- prisma/migrations/20251117_add_fts5/migration.sql

-- Enable FTS5 extension
PRAGMA foreign_keys=OFF;

-- Create FTS5 virtual table
CREATE VIRTUAL TABLE documents_fts USING fts5(
  title,
  content,
  content='documents',
  content_rowid='id'
);

-- Create triggers to keep FTS5 in sync
CREATE TRIGGER documents_ai AFTER INSERT ON documents BEGIN
  INSERT INTO documents_fts(rowid, title, content)
  VALUES (new.id, new.title, new.content);
END;

CREATE TRIGGER documents_ad AFTER DELETE ON documents BEGIN
  INSERT INTO documents_fts(documents_fts, rowid, title, content)
  VALUES ('delete', old.id, old.title, old.content);
END;

CREATE TRIGGER documents_au AFTER UPDATE ON documents BEGIN
  INSERT INTO documents_fts(documents_fts, rowid, title, content)
  VALUES ('delete', old.id, old.title, old.content);
  INSERT INTO documents_fts(rowid, title, content)
  VALUES (new.id, new.title, new.content);
END;

PRAGMA foreign_keys=ON;
```

**Aplicar con:**

```bash
npx prisma migrate dev --name add_fts5
```

---

## 🔍 **QUERIES CON PRISMA**

### **Búsqueda Full-Text con Raw SQL**

Prisma no soporta FTS5 nativamente, usa `$queryRaw`:

```typescript
// search/infrastructure/fts5.repository.ts
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../shared/database/prisma.service";

interface SearchResult {
  id: number;
  slug: string;
  title: string;
  content: string;
  rank: number;
}

@Injectable()
export class FTS5Repository {
  constructor(private prisma: PrismaService) {}

  async search(query: string, limit: number = 20): Promise<SearchResult[]> {
    const results = await this.prisma.$queryRaw<SearchResult[]>`
      SELECT 
        d.id,
        d.slug,
        d.title,
        snippet(documents_fts, 1, '**', '**', '...', 64) as content,
        rank
      FROM documents_fts
      JOIN documents d ON documents_fts.rowid = d.id
      WHERE documents_fts MATCH ${query}
        AND d.status = 'PUBLISHED'
      ORDER BY rank
      LIMIT ${limit}
    `;

    return results;
  }
}
```

### **Transacciones**

```typescript
await this.prisma.$transaction(async (tx) => {
  const doc = await tx.document.create({
    data: { title: "New Doc", slug: "new-doc", content: "" },
  });

  await tx.analyticsEvent.create({
    data: {
      eventType: "document_created",
      metadata: JSON.stringify({ documentId: doc.id }),
    },
  });
});
```

### **Soft Delete**

```typescript
// Archivar en lugar de eliminar
await this.prisma.document.update({
  where: { id },
  data: { status: "ARCHIVED" },
});
```

---

## 🧪 **SEEDING**

### **prisma/seed.ts**

```typescript
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Crear documentos de ejemplo
  await prisma.document.createMany({
    data: [
      {
        slug: "guia-de-inicio",
        title: "Guía de Inicio",
        content: "# Bienvenido\n\nEsta es una guía de inicio...",
        status: "PUBLISHED",
        createdBy: "admin",
      },
      {
        slug: "arquitectura",
        title: "Arquitectura del Sistema",
        content: "# Arquitectura\n\nEl sistema usa...",
        status: "PUBLISHED",
        createdBy: "admin",
      },
      {
        slug: "draft-ejemplo",
        title: "Borrador de Ejemplo",
        content: "# En progreso...",
        status: "DRAFT",
        createdBy: "admin",
      },
    ],
  });

  console.log("✅ Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

### **package.json**

```json
{
  "prisma": {
    "seed": "ts-node prisma/seed.ts"
  }
}
```

### **Ejecutar Seed**

```bash
npx prisma db seed
```

---

## 📦 **INTEGRACIÓN CON NESTJS**

### **Inyección en Repositories**

```typescript
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../shared/database/prisma.service";
import { Document, Prisma } from "@prisma/client";

@Injectable()
export class DocumentRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.DocumentCreateInput): Promise<Document> {
    return this.prisma.document.create({ data });
  }

  async findById(id: number): Promise<Document | null> {
    return this.prisma.document.findUnique({ where: { id } });
  }

  async findMany(where?: Prisma.DocumentWhereInput): Promise<Document[]> {
    return this.prisma.document.findMany({ where });
  }

  async update(
    id: number,
    data: Prisma.DocumentUpdateInput
  ): Promise<Document> {
    return this.prisma.document.update({ where: { id }, data });
  }

  async delete(id: number): Promise<Document> {
    return this.prisma.document.delete({ where: { id } });
  }
}
```

---

## 🔄 **WORKFLOW DE DESARROLLO**

### **1. Modificar Schema**

Edita `prisma/schema.prisma`

### **2. Crear Migración**

```bash
npx prisma migrate dev --name add_new_field
```

### **3. Generar Cliente**

Se ejecuta automáticamente con migrate, o manualmente:

```bash
npx prisma generate
```

### **4. Usar en Código**

```typescript
import { Document } from "@prisma/client";

// Tipos generados automáticamente
const doc: Document = await this.prisma.document.findUnique({
  where: { id: 1 },
});
```

---

## 🚀 **DEPLOYMENT**

### **Producción**

```bash
# 1. Generar cliente
npx prisma generate

# 2. Aplicar migraciones
npx prisma migrate deploy

# 3. Seed (opcional)
npx prisma db seed

# 4. Iniciar app
npm run start:prod
```

### **Docker**

```dockerfile
# Dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci
RUN npx prisma generate

COPY . .

RUN npm run build

CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:prod"]
```

---

## 📚 **RECURSOS**

- [Prisma Docs](https://www.prisma.io/docs)
- [Prisma + NestJS](https://docs.nestjs.com/recipes/prisma)
- [SQLite FTS5](https://www.sqlite.org/fts5.html)
- [Prisma Client API](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)

---

**Siguiente:** Ver [Backend Architecture](./BACKEND_ARCHITECTURE.md) para implementación completa.
