# 🚀 Plan de Implementación Backend - NestJS

**Proyecto**: Ailurus Documentation Platform  
**Framework**: NestJS 11.x + Prisma 7.0.0 + SQLite 3  
**Fecha**: 20 de noviembre, 2025  
**Estado**: Plan de ejecución

---

## 📊 **ESTADO ACTUAL**

### **✅ Completado**

- ✅ Proyecto NestJS inicializado
- ✅ Prisma configurado con SQLite
- ✅ Schema Prisma definido (7 tablas, 3NF)
- ✅ Scripts npm configurados
- ✅ Frontend con mocks funcionales (20 documentos)

### **⏳ Pendiente**

- ⏳ Ejecutar migration inicial
- ⏳ Implementar módulos feature-based
- ⏳ Crear controladores REST
- ⏳ Implementar servicios de negocio
- ⏳ Seed database con 20 documentos reales
- ⏳ Configurar infraestructura global (CORS, validation, etc.)

---

## 🎯 **OBJETIVOS DEL PLAN**

1. **Implementar backend NestJS** que sirva los mismos datos que actualmente están en mocks
2. **Migrar gradualmente** el frontend de mocks a API real
3. **Mantener funcionalidad** durante la transición
4. **Priorizar features** según impacto en usuario

---

## 📋 **ARQUITECTURA TARGET**

### **Estructura de Carpetas**

```
backend/
├── prisma/
│   ├── schema.prisma          ✅ Definido
│   ├── seed.ts                ⏳ Por crear
│   └── migrations/            ⏳ Por generar
├── src/
│   ├── main.ts                ✅ Base existente
│   ├── app.module.ts          ✅ Base existente
│   │
│   ├── common/                ⏳ CREAR
│   │   ├── decorators/
│   │   ├── filters/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   └── pipes/
│   │
│   ├── config/                ⏳ CREAR
│   │   ├── app.config.ts
│   │   ├── database.config.ts
│   │   └── cors.config.ts
│   │
│   ├── modules/               ⏳ CREAR
│   │   ├── documents/
│   │   │   ├── documents.module.ts
│   │   │   ├── documents.controller.ts
│   │   │   ├── documents.service.ts
│   │   │   ├── dto/
│   │   │   │   ├── create-document.dto.ts
│   │   │   │   ├── update-document.dto.ts
│   │   │   │   └── document-response.dto.ts
│   │   │   └── entities/
│   │   │       └── document.entity.ts
│   │   │
│   │   ├── folders/
│   │   │   ├── folders.module.ts
│   │   │   ├── folders.controller.ts
│   │   │   ├── folders.service.ts
│   │   │   └── dto/
│   │   │
│   │   ├── categories/
│   │   │   ├── categories.module.ts
│   │   │   ├── categories.controller.ts
│   │   │   └── categories.service.ts
│   │   │
│   │   ├── search/
│   │   │   ├── search.module.ts
│   │   │   ├── search.controller.ts
│   │   │   └── search.service.ts
│   │   │
│   │   └── prisma/
│   │       ├── prisma.module.ts
│   │       └── prisma.service.ts
│   │
│   └── shared/                ⏳ CREAR
│       ├── interfaces/
│       └── types/
│
└── test/
    └── e2e/
```

---

## 🔢 **FASES DE IMPLEMENTACIÓN**

### **FASE 0: Preparación (2-3 horas)** 🟢 CRÍTICO

**Objetivo**: Tener infraestructura base lista y database operacional

#### **0.1: Ejecutar Migration Inicial (30 min)**

**Tareas**:

1. Revisar `prisma/schema.prisma` (ya existe)
2. Ejecutar `pnpm prisma:migrate` para crear primera migration
3. Verificar tablas creadas con `pnpm prisma:studio`
4. Generar Prisma Client `pnpm prisma:generate`

**Comandos**:

```bash
cd backend
pnpm prisma:migrate
# Nombrar: "init_schema"
pnpm prisma:studio  # Verificar en http://localhost:5555
```

**Archivos generados**:

- `prisma/migrations/YYYYMMDDHHMMSS_init_schema/migration.sql`
- `node_modules/.prisma/client/` (Prisma Client generado)

---

#### **0.2: Crear PrismaModule Global (30 min)**

**Objetivo**: Service centralizado para acceso a DB

**Archivos a crear**:

**`src/modules/prisma/prisma.module.ts`**

```typescript
import { Global, Module } from "@nestjs/common";
import { PrismaService } from "./prisma.service";

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

**`src/modules/prisma/prisma.service.ts`**

```typescript
import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect();
    console.log("✅ Prisma connected to SQLite");
  }

  async onModuleDestroy() {
    await this.$disconnect();
    console.log("❌ Prisma disconnected");
  }
}
```

**Actualizar `src/app.module.ts`**:

```typescript
import { Module } from "@nestjs/common";
import { PrismaModule } from "./modules/prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
```

**Verificar**:

```bash
pnpm start:dev
# Debe mostrar: ✅ Prisma connected to SQLite
```

---

#### **0.3: Configurar Infraestructura Global (1 hora)**

**Objetivo**: CORS, validation pipes, rate limiting

**`src/main.ts`** (actualizar):

```typescript
import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS para frontend
  app.enableCors({
    origin: "http://localhost:4321",
    credentials: true,
  });

  // Validation global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    })
  );

  // Sin prefijo /api (endpoints directos)
  await app.listen(3000);
  console.log(`🚀 Backend running on http://localhost:3000`);
}
bootstrap();
```

**Instalar dependencias**:

```bash
pnpm add class-validator class-transformer
```

**Verificar**:

```bash
curl http://localhost:3000
# Debe responder (aunque sea con 404)
```

---

#### **0.4: Crear Seed con 20 Documentos (1 hora)**

**Objetivo**: Poblar database con datos reales desde mocks

**`prisma/seed.ts`** (crear):

```typescript
import { PrismaClient, DocumentStatus } from "@prisma/client";

const prisma = new PrismaClient();

// Importar datos de mocks del frontend
const CATEGORIES = [
  { id: "getting-started", name: "Getting Started", icon: "🚀", order: 1 },
  { id: "architecture", name: "Architecture", icon: "🏗️", order: 2 },
  { id: "api-reference", name: "API Reference", icon: "📚", order: 3 },
  { id: "guides", name: "Guides", icon: "📖", order: 4 },
];

const DOCUMENTS = [
  {
    slug: "instalacion",
    title: "Guía de Instalación",
    content: `# Guía de Instalación\n\n...`, // Contenido completo
    excerpt: "Aprende a instalar Ailurus paso a paso",
    categoryId: "getting-started",
    subcategory: "Primeros Pasos",
    path: "Equipo/Proyecto/Getting Started/Primeros Pasos/Guía de Instalación",
    status: DocumentStatus.PUBLISHED,
    createdBy: "admin",
  },
  // ... 19 documentos más
];

const FOLDERS = [
  {
    name: "Equipo",
    type: "FOLDER",
    icon: "👥",
    path: "Equipo",
    order: 1,
    parentId: null,
  },
  // ... resto de folders
];

async function main() {
  console.log("🌱 Seeding database...");

  // 1. Limpiar datos existentes
  await prisma.folderDocument.deleteMany();
  await prisma.folderCategory.deleteMany();
  await prisma.categoryStats.deleteMany();
  await prisma.activityLog.deleteMany();
  await prisma.document.deleteMany();
  await prisma.folder.deleteMany();
  await prisma.category.deleteMany();

  // 2. Crear categorías
  await prisma.category.createMany({ data: CATEGORIES });
  console.log("✅ Categories created");

  // 3. Crear documentos
  await prisma.document.createMany({ data: DOCUMENTS });
  console.log("✅ Documents created");

  // 4. Crear folders (recursivo)
  for (const folder of FOLDERS) {
    await prisma.folder.create({ data: folder });
  }
  console.log("✅ Folders created");

  // 5. Crear CategoryStats
  for (const category of CATEGORIES) {
    const stats = await prisma.document.groupBy({
      by: ["status"],
      where: { categoryId: category.id },
      _count: true,
    });

    await prisma.categoryStats.create({
      data: {
        categoryId: category.id,
        totalDocs: stats.reduce((sum, s) => sum + s._count, 0),
        publishedDocs: stats.find((s) => s.status === "PUBLISHED")?._count || 0,
        draftDocs: stats.find((s) => s.status === "DRAFT")?._count || 0,
        archivedDocs: stats.find((s) => s.status === "ARCHIVED")?._count || 0,
      },
    });
  }
  console.log("✅ Category stats created");

  console.log("🎉 Seed completed!");
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

**Ejecutar**:

```bash
pnpm prisma:seed
```

**Verificar**:

```bash
pnpm prisma:studio
# Revisar que hay 20 documentos, 4 categorías, folders
```

---

### **FASE 1: Módulo Documents (4-6 horas)** 🔥 ALTA PRIORIDAD

**Objetivo**: API REST completa para documentos (reemplaza mocks)

#### **1.1: Crear Estructura Base (1 hora)**

**Generar con CLI**:

```bash
cd backend/src
nest g module modules/documents
nest g controller modules/documents
nest g service modules/documents
```

**Estructura generada**:

```
src/modules/documents/
├── documents.module.ts
├── documents.controller.ts
├── documents.service.ts
└── documents.controller.spec.ts
```

---

#### **1.2: Crear DTOs (1 hora)**

**`src/modules/documents/dto/create-document.dto.ts`**

```typescript
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  IsEnum,
} from "class-validator";
import { DocumentStatus } from "@prisma/client";

export class CreateDocumentDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  excerpt?: string;

  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @IsString()
  @IsOptional()
  subcategory?: string;

  @IsString()
  @IsNotEmpty()
  path: string;

  @IsEnum(DocumentStatus)
  @IsOptional()
  status?: DocumentStatus;
}
```

**`src/modules/documents/dto/update-document.dto.ts`**

```typescript
import { PartialType } from "@nestjs/mapped-types";
import { CreateDocumentDto } from "./create-document.dto";

export class UpdateDocumentDto extends PartialType(CreateDocumentDto) {}
```

**`src/modules/documents/dto/document-response.dto.ts`**

```typescript
import { DocumentStatus } from "@prisma/client";

export class DocumentResponseDto {
  id: number;
  slug: string;
  title: string;
  content: string;
  excerpt: string | null;
  categoryId: string;
  subcategory: string | null;
  path: string;
  status: DocumentStatus;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}
```

---

#### **1.3: Implementar Service (2 horas)**

**`src/modules/documents/documents.service.ts`**

```typescript
import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateDocumentDto } from "./dto/create-document.dto";
import { UpdateDocumentDto } from "./dto/update-document.dto";
import { DocumentStatus } from "@prisma/client";

@Injectable()
export class DocumentsService {
  constructor(private prisma: PrismaService) {}

  // GET /docs - Listar documentos publicados
  async findAll() {
    return this.prisma.document.findMany({
      where: { status: DocumentStatus.PUBLISHED },
      orderBy: { createdAt: "desc" },
    });
  }

  // GET /docs/:slug - Obtener por slug
  async findBySlug(slug: string) {
    const document = await this.prisma.document.findUnique({
      where: { slug },
    });

    if (!document) {
      throw new NotFoundException(`Document with slug "${slug}" not found`);
    }

    return document;
  }

  // GET /docs?category=:id - Filtrar por categoría
  async findByCategory(categoryId: string) {
    return this.prisma.document.findMany({
      where: {
        categoryId,
        status: DocumentStatus.PUBLISHED,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  // POST /docs - Crear documento
  async create(createDto: CreateDocumentDto) {
    // Generar slug desde title
    const slug = this.generateSlug(createDto.title);

    return this.prisma.document.create({
      data: {
        ...createDto,
        slug,
        status: createDto.status || DocumentStatus.DRAFT,
      },
    });
  }

  // PUT /docs/:id/draft - Actualizar draft
  async updateDraft(id: number, updateDto: UpdateDocumentDto) {
    const document = await this.findById(id);

    return this.prisma.document.update({
      where: { id },
      data: updateDto,
    });
  }

  // PUT /docs/:id/publish - Publicar documento
  async publish(id: number) {
    const document = await this.findById(id);

    if (!document.content || document.content.trim().length === 0) {
      throw new BadRequestException(
        "Cannot publish document with empty content"
      );
    }

    return this.prisma.document.update({
      where: { id },
      data: { status: DocumentStatus.PUBLISHED },
    });
  }

  // DELETE /docs/:id - Archivar (soft delete)
  async archive(id: number) {
    await this.findById(id);

    return this.prisma.document.update({
      where: { id },
      data: { status: DocumentStatus.ARCHIVED },
    });
  }

  // Helper: Buscar por ID
  private async findById(id: number) {
    const document = await this.prisma.document.findUnique({
      where: { id },
    });

    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    return document;
  }

  // Helper: Generar slug
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Quitar acentos
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
}
```

---

#### **1.4: Implementar Controller (1-2 horas)**

**`src/modules/documents/documents.controller.ts`**

```typescript
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
} from "@nestjs/common";
import { DocumentsService } from "./documents.service";
import { CreateDocumentDto } from "./dto/create-document.dto";
import { UpdateDocumentDto } from "./dto/update-document.dto";

@Controller("docs")
export class DocumentsController {
  constructor(private documentsService: DocumentsService) {}

  @Get()
  findAll(@Query("category") category?: string) {
    if (category) {
      return this.documentsService.findByCategory(category);
    }
    return this.documentsService.findAll();
  }

  @Get(":slug")
  findBySlug(@Param("slug") slug: string) {
    return this.documentsService.findBySlug(slug);
  }

  @Post()
  create(@Body() createDto: CreateDocumentDto) {
    return this.documentsService.create(createDto);
  }

  @Put(":id/draft")
  updateDraft(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateDto: UpdateDocumentDto
  ) {
    return this.documentsService.updateDraft(id, updateDto);
  }

  @Put(":id/publish")
  publish(@Param("id", ParseIntPipe) id: number) {
    return this.documentsService.publish(id);
  }

  @Delete(":id")
  archive(@Param("id", ParseIntPipe) id: number) {
    return this.documentsService.archive(id);
  }
}
```

---

#### **1.5: Actualizar AppModule (5 min)**

**`src/app.module.ts`**

```typescript
import { Module } from "@nestjs/common";
import { PrismaModule } from "./modules/prisma/prisma.module";
import { DocumentsModule } from "./modules/documents/documents.module";

@Module({
  imports: [
    PrismaModule,
    DocumentsModule, // ✅ Agregar
  ],
})
export class AppModule {}
```

---

#### **1.6: Testing Manual (30 min)**

**Verificar endpoints**:

```bash
# 1. Listar documentos
curl http://localhost:3000/docs

# 2. Obtener documento por slug
curl http://localhost:3000/docs/instalacion

# 3. Filtrar por categoría
curl http://localhost:3000/docs?category=getting-started

# 4. Crear documento
curl -X POST http://localhost:3000/docs \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Doc",
    "content": "# Test\n\nContenido de prueba",
    "categoryId": "guides",
    "path": "Test/Path"
  }'

# 5. Publicar documento (id = 21, el recién creado)
curl -X PUT http://localhost:3000/docs/21/publish
```

**Resultado esperado**:

- ✅ GET /docs devuelve 20 documentos publicados
- ✅ GET /docs/instalacion devuelve documento completo
- ✅ POST /docs crea documento con status DRAFT
- ✅ PUT /docs/:id/publish cambia status a PUBLISHED

---

### **FASE 2: Módulo Folders (3-4 horas)** 🚀 ALTA PRIORIDAD

**Objetivo**: API para navegación jerárquica (reemplaza MOCK_FOLDERS)

#### **2.1: Generar Estructura (15 min)**

```bash
nest g module modules/folders
nest g controller modules/folders
nest g service modules/folders
```

---

#### **2.2: Implementar Service (2 horas)**

**`src/modules/folders/folders.service.ts`**

```typescript
import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

interface FolderNode {
  id: number;
  name: string;
  type: "FOLDER" | "FILE";
  icon: string | null;
  path: string;
  order: number;
  children?: FolderNode[];
  slug?: string;
}

@Injectable()
export class FoldersService {
  constructor(private prisma: PrismaService) {}

  // GET /folders - Obtener árbol completo
  async getTree(): Promise<FolderNode[]> {
    const allFolders = await this.prisma.folder.findMany({
      orderBy: { order: "asc" },
    });

    return this.buildTree(allFolders);
  }

  // GET /folders/:path - Obtener nodo por path
  async findByPath(path: string): Promise<FolderNode> {
    const folder = await this.prisma.folder.findUnique({
      where: { path },
    });

    if (!folder) {
      throw new NotFoundException(`Folder with path "${path}" not found`);
    }

    // Obtener hijos
    const children = await this.prisma.folder.findMany({
      where: { parentId: folder.id },
      orderBy: { order: "asc" },
    });

    return {
      ...folder,
      children: children.length > 0 ? children : undefined,
    };
  }

  // Helper: Construir árbol recursivo
  private buildTree(
    folders: any[],
    parentId: number | null = null
  ): FolderNode[] {
    const tree: FolderNode[] = [];

    for (const folder of folders) {
      if (folder.parentId === parentId) {
        const node: FolderNode = {
          id: folder.id,
          name: folder.name,
          type: folder.type,
          icon: folder.icon,
          path: folder.path,
          order: folder.order,
          slug: folder.slug,
        };

        const children = this.buildTree(folders, folder.id);
        if (children.length > 0) {
          node.children = children;
        }

        tree.push(node);
      }
    }

    return tree;
  }
}
```

---

#### **2.3: Implementar Controller (30 min)**

**`src/modules/folders/folders.controller.ts`**

```typescript
import { Controller, Get, Param } from "@nestjs/common";
import { FoldersService } from "./folders.service";

@Controller("folders")
export class FoldersController {
  constructor(private foldersService: FoldersService) {}

  @Get()
  getTree() {
    return this.foldersService.getTree();
  }

  @Get(":path(*)")
  findByPath(@Param("path") path: string) {
    return this.foldersService.findByPath(path);
  }
}
```

---

#### **2.4: Testing (30 min)**

```bash
# 1. Obtener árbol completo
curl http://localhost:3000/folders

# 2. Obtener nodo específico
curl http://localhost:3000/folders/Equipo/Proyecto/Getting%20Started
```

---

### **FASE 3: Módulo Categories (1-2 horas)** 🟡 MEDIA PRIORIDAD

**Objetivo**: API para categorías con estadísticas

#### **3.1: Generar Estructura (15 min)**

```bash
nest g module modules/categories
nest g controller modules/categories
nest g service modules/categories
```

---

#### **3.2: Implementar Service (45 min)**

**`src/modules/categories/categories.service.ts`**

```typescript
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const categories = await this.prisma.category.findMany({
      orderBy: { order: "asc" },
    });

    // Enriquecer con stats
    const categoriesWithStats = await Promise.all(
      categories.map(async (category) => {
        const stats = await this.prisma.categoryStats.findUnique({
          where: { categoryId: category.id },
        });

        return {
          ...category,
          count: stats?.totalDocs || 0,
          publishedCount: stats?.publishedDocs || 0,
        };
      })
    );

    return categoriesWithStats;
  }
}
```

---

#### **3.3: Implementar Controller (15 min)**

**`src/modules/categories/categories.controller.ts`**

```typescript
import { Controller, Get } from "@nestjs/common";
import { CategoriesService } from "./categories.service";

@Controller("categories")
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }
}
```

---

### **FASE 4: Módulo Search (3-4 horas)** 🔍 ALTA PRIORIDAD

**Objetivo**: Búsqueda full-text con SQLite FTS5

#### **4.1: Crear Virtual Table FTS5 (1 hora)**

**Migration manual** `prisma/migrations/XXX_add_fts5/migration.sql`:

```sql
-- Crear virtual table para FTS5
CREATE VIRTUAL TABLE documents_fts USING fts5(
  slug,
  title,
  content,
  excerpt,
  path,
  content=Document,
  content_rowid=id
);

-- Triggers para mantener sincronizado
CREATE TRIGGER documents_fts_insert AFTER INSERT ON Document
BEGIN
  INSERT INTO documents_fts(rowid, slug, title, content, excerpt, path)
  VALUES (new.id, new.slug, new.title, new.content, new.excerpt, new.path);
END;

CREATE TRIGGER documents_fts_update AFTER UPDATE ON Document
BEGIN
  UPDATE documents_fts
  SET slug = new.slug,
      title = new.title,
      content = new.content,
      excerpt = new.excerpt,
      path = new.path
  WHERE rowid = old.id;
END;

CREATE TRIGGER documents_fts_delete AFTER DELETE ON Document
BEGIN
  DELETE FROM documents_fts WHERE rowid = old.id;
END;

-- Poblar con datos existentes
INSERT INTO documents_fts(rowid, slug, title, content, excerpt, path)
SELECT id, slug, title, content, excerpt, path FROM Document;
```

**Ejecutar**:

```bash
pnpm prisma:migrate
# Verificar en Prisma Studio
```

---

#### **4.2: Implementar Service (1-2 horas)**

**`src/modules/search/search.service.ts`**

```typescript
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

interface SearchResult {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  path: string;
  rank: number;
}

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  async search(query: string): Promise<SearchResult[]> {
    if (!query || query.trim().length < 2) {
      return [];
    }

    // FTS5 query
    const results = await this.prisma.$queryRawUnsafe<SearchResult[]>(
      `
      SELECT 
        d.id,
        d.slug,
        d.title,
        d.excerpt,
        d.path,
        fts.rank
      FROM documents_fts fts
      INNER JOIN Document d ON fts.rowid = d.id
      WHERE documents_fts MATCH ?
        AND d.status = 'PUBLISHED'
      ORDER BY rank
      LIMIT 20
    `,
      query
    );

    // Log búsqueda
    await this.logSearch(query, results.length);

    return results;
  }

  private async logSearch(query: string, resultsCount: number) {
    await this.prisma.$executeRaw`
      INSERT INTO ActivityLog (entityType, entityId, action, userId, changes)
      VALUES ('search', NULL, 'search_query', 'anonymous', ${JSON.stringify({
        query,
        resultsCount,
      })})
    `;
  }
}
```

---

#### **4.3: Implementar Controller (30 min)**

**`src/modules/search/search.controller.ts`**

```typescript
import { Controller, Get, Query } from "@nestjs/common";
import { SearchService } from "./search.service";

@Controller("search")
export class SearchController {
  constructor(private searchService: SearchService) {}

  @Get()
  search(@Query("q") query: string) {
    return this.searchService.search(query);
  }
}
```

---

## 🔄 **MIGRACIÓN FRONTEND → BACKEND**

### **Estrategia de Migración Gradual**

#### **Paso 1: Habilitar API en Paralelo**

**`frontend/src/documents/services/documents.service.ts`**

```typescript
const USE_MOCKS = import.meta.env.PUBLIC_USE_MOCKS === "true";
const API_URL = import.meta.env.PUBLIC_API_URL || "http://localhost:3000";

export async function getDocuments() {
  if (USE_MOCKS) {
    return MOCK_DOCUMENTS; // Actual
  }

  // Nueva lógica
  const response = await fetch(`${API_URL}/docs`);
  return response.json();
}
```

**`.env`** (frontend):

```env
PUBLIC_USE_MOCKS=false  # Cambiar a false cuando backend esté listo
PUBLIC_API_URL=http://localhost:3000
```

---

#### **Paso 2: Testing A/B**

1. **Con mocks** (`PUBLIC_USE_MOCKS=true`): Verificar que frontend funciona
2. **Con API** (`PUBLIC_USE_MOCKS=false`): Verificar que API responde correctamente
3. **Comparar respuestas**: Asegurar que estructura es idéntica

---

#### **Paso 3: Migración por Feature**

| Feature               | Orden | Complejidad | Duración |
| --------------------- | ----- | ----------- | -------- |
| GET /docs             | 1     | Baja        | 30 min   |
| GET /docs/:slug       | 2     | Baja        | 30 min   |
| GET /folders          | 3     | Media       | 1 hora   |
| GET /categories       | 4     | Baja        | 30 min   |
| GET /search           | 5     | Media       | 1 hora   |
| POST /docs (crear)    | 6     | Alta        | 2 horas  |
| PUT /docs/:id/draft   | 7     | Alta        | 2 horas  |
| PUT /docs/:id/publish | 8     | Media       | 1 hora   |

---

## 📊 **ESTIMACIONES TOTALES**

| Fase      | Descripción          | Horas Min | Horas Max | Prioridad    |
| --------- | -------------------- | --------- | --------- | ------------ |
| 0         | Preparación          | 2         | 3         | 🔴 Crítico   |
| 1         | Documents            | 4         | 6         | 🔥 Alta      |
| 2         | Folders              | 3         | 4         | 🔥 Alta      |
| 3         | Categories           | 1         | 2         | 🟡 Media     |
| 4         | Search               | 3         | 4         | 🔥 Alta      |
| 5         | Migración            | 3         | 5         | 🔥 Alta      |
| **TOTAL** | **Backend completo** | **16h**   | **24h**   | **2-3 días** |

---

## ✅ **CHECKLIST DE PROGRESO**

### **FASE 0: Preparación (🟡 Pendiente)**

- [ ] 0.1: Ejecutar migration inicial
- [ ] 0.2: Crear PrismaModule global
- [ ] 0.3: Configurar infraestructura (CORS, validation)
- [ ] 0.4: Crear seed con 20 documentos

### **FASE 1: Documents (🟡 Pendiente)**

- [ ] 1.1: Generar estructura con CLI
- [ ] 1.2: Crear DTOs (Create, Update, Response)
- [ ] 1.3: Implementar DocumentsService
- [ ] 1.4: Implementar DocumentsController
- [ ] 1.5: Actualizar AppModule
- [ ] 1.6: Testing manual de endpoints

### **FASE 2: Folders (🟡 Pendiente)**

- [ ] 2.1: Generar estructura con CLI
- [ ] 2.2: Implementar FoldersService con buildTree
- [ ] 2.3: Implementar FoldersController
- [ ] 2.4: Testing manual

### **FASE 3: Categories (🟡 Pendiente)**

- [ ] 3.1: Generar estructura con CLI
- [ ] 3.2: Implementar CategoriesService con stats
- [ ] 3.3: Implementar CategoriesController

### **FASE 4: Search (🟡 Pendiente)**

- [ ] 4.1: Crear virtual table FTS5 con triggers
- [ ] 4.2: Implementar SearchService con $queryRaw
- [ ] 4.3: Implementar SearchController

### **FASE 5: Migración Frontend (🟡 Pendiente)**

- [ ] 5.1: Agregar flag USE_MOCKS en .env
- [ ] 5.2: Actualizar services con condicional
- [ ] 5.3: Testing A/B (mocks vs API)
- [ ] 5.4: Migrar feature por feature
- [ ] 5.5: Eliminar mocks cuando todo funcione

---

## 🎯 **SIGUIENTE PASO**

**ACCIÓN INMEDIATA**: Ejecutar FASE 0 completa (2-3 horas)

```bash
# 1. Migration inicial
cd backend
pnpm prisma:migrate

# 2. Crear PrismaModule
# (seguir instrucciones de sección 0.2)

# 3. Actualizar main.ts
# (seguir instrucciones de sección 0.3)

# 4. Crear seed.ts
# (seguir instrucciones de sección 0.4)

# 5. Ejecutar seed
pnpm prisma:seed

# 6. Verificar
pnpm prisma:studio  # http://localhost:5555
```

**Una vez completada FASE 0**: Comenzar con FASE 1 (Documents) que es la base para todo lo demás.

---

## 📚 **RECURSOS**

- [ROADMAP.md](./ROADMAP.md) - Prioridades generales del proyecto
- [API.md](./API.md) - Especificación completa de endpoints
- [DATABASE.md](./DATABASE.md) - Schema Prisma detallado
- [FRONTEND.md](./FRONTEND.md) - Arquitectura del frontend
- [Prisma Docs](https://www.prisma.io/docs/) - Documentación oficial
- [NestJS Docs](https://docs.nestjs.com/) - Documentación oficial

---

**Última actualización**: 20 de noviembre, 2025  
**Versión**: 1.0.0  
**Estado**: Plan listo para ejecución
