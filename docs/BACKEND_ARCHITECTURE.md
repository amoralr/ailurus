# 🔧 Backend Architecture - Feature-Based Structure

**Proyecto**: docs-backend  
**Framework**: NestJS ^10.0.0  
**Arquitectura**: Feature-Based + Clean Architecture  
**Fecha**: 17 de noviembre, 2025

---

## 📋 **FILOSOFÍA DE ARQUITECTURA**

### **Feature-Based Organization**

Cada **feature** es autocontenida y sigue principios de Clean Architecture:

```
feature/
├── api/              → HTTP Controllers + WebSocket Gateways
├── application/      → Services + Use Cases (Business Logic)
├── domain/           → Entities + Enums + Interfaces
├── infrastructure/   → Repositories + External Adapters
├── dto/              → Data Transfer Objects (API Contracts)
└── feature.module.ts → NestJS Module Definition
```

### **Extensiones por Uso**

| Extensión         | Capa           | Propósito                | Ejemplos                       |
| ----------------- | -------------- | ------------------------ | ------------------------------ |
| `.controller.ts`  | API            | REST endpoints           | `documents.controller.ts`      |
| `.gateway.ts`     | API            | WebSocket handlers       | `presence.gateway.ts`          |
| `.service.ts`     | Application    | Lógica de negocio        | `documents.service.ts`         |
| `.use-case.ts`    | Application    | Casos de uso específicos | `publish-document.use-case.ts` |
| `.repository.ts`  | Infrastructure | Acceso a datos           | `document.repository.ts`       |
| `.adapter.ts`     | Infrastructure | Integraciones externas   | `storage.adapter.ts`           |
| `.entity.ts`      | Domain         | Modelos de dominio       | `document.entity.ts`           |
| `.enum.ts`        | Domain         | Enumeraciones            | `document-status.enum.ts`      |
| `.interface.ts`   | Domain         | Contratos de dominio     | `repository.interface.ts`      |
| `.dto.ts`         | DTO            | Request DTOs             | `create-document.dto.ts`       |
| `.response.ts`    | DTO            | Response DTOs            | `document.response.ts`         |
| `.guard.ts`       | Infrastructure | Guards globales          | `auth.guard.ts`                |
| `.interceptor.ts` | Infrastructure | Interceptors globales    | `logging.interceptor.ts`       |
| `.filter.ts`      | Infrastructure | Exception filters        | `http-exception.filter.ts`     |
| `.pipe.ts`        | Infrastructure | Pipes globales           | `validation.pipe.ts`           |
| `.decorator.ts`   | Infrastructure | Custom decorators        | `current-user.decorator.ts`    |
| `.config.ts`      | Infrastructure | Configuraciones          | `database.config.ts`           |
| `.util.ts`        | Shared         | Utilidades               | `slug.util.ts`                 |
| `.type.ts`        | Shared         | TypeScript types         | `api-response.type.ts`         |

---

## 📁 **ESTRUCTURA COMPLETA**

```
docs-backend/
├── src/
│   ├── documents/
│   │   ├── api/
│   │   │   ├── documents.controller.ts
│   │   │   └── presence.gateway.ts
│   │   ├── application/
│   │   │   ├── documents.service.ts
│   │   │   └── use-cases/
│   │   │       ├── create-document.use-case.ts
│   │   │       ├── update-draft.use-case.ts
│   │   │       ├── publish-document.use-case.ts
│   │   │       └── archive-document.use-case.ts
│   │   ├── domain/
│   │   │   ├── document.entity.ts
│   │   │   ├── document-status.enum.ts
│   │   │   └── document-repository.interface.ts
│   │   ├── infrastructure/
│   │   │   └── document.repository.ts
│   │   ├── dto/
│   │   │   ├── create-document.dto.ts
│   │   │   ├── update-document.dto.ts
│   │   │   ├── document.response.ts
│   │   │   └── active-user.response.ts
│   │   └── documents.module.ts
│   │
│   ├── search/
│   │   ├── api/
│   │   │   └── search.controller.ts
│   │   ├── application/
│   │   │   ├── search.service.ts
│   │   │   └── search-analytics.service.ts
│   │   ├── domain/
│   │   │   └── search-result.entity.ts
│   │   ├── infrastructure/
│   │   │   ├── fts5.repository.ts
│   │   │   └── search-log.repository.ts
│   │   ├── dto/
│   │   │   ├── search-query.dto.ts
│   │   │   └── search-result.response.ts
│   │   └── search.module.ts
│   │
│   ├── upload/
│   │   ├── api/
│   │   │   └── upload.controller.ts
│   │   ├── application/
│   │   │   ├── upload.service.ts
│   │   │   ├── image-processor.service.ts
│   │   │   └── storage.service.ts
│   │   ├── domain/
│   │   │   ├── upload.entity.ts
│   │   │   └── image-format.enum.ts
│   │   ├── infrastructure/
│   │   │   └── local-storage.adapter.ts
│   │   ├── dto/
│   │   │   └── upload.response.ts
│   │   └── upload.module.ts
│   │
│   ├── analytics/
│   │   ├── api/
│   │   │   └── analytics.controller.ts
│   │   ├── application/
│   │   │   └── analytics.service.ts
│   │   ├── domain/
│   │   │   ├── event.entity.ts
│   │   │   └── event-type.enum.ts
│   │   ├── infrastructure/
│   │   │   └── analytics.repository.ts
│   │   ├── dto/
│   │   │   └── track-event.dto.ts
│   │   └── analytics.module.ts
│   │
│   ├── shared/                             # Código compartido entre features
│   │   ├── database/
│   │   │   ├── prisma.module.ts
│   │   │   ├── prisma.service.ts
│   │   │   └── base.repository.ts
│   │   ├── websocket/
│   │   │   ├── websocket.module.ts
│   │   │   └── websocket.adapter.ts
│   │   ├── types/
│   │   │   ├── api-response.type.ts
│   │   │   ├── paginated-response.type.ts
│   │   │   └── database-schema.type.ts
│   │   └── utils/
│   │       ├── slug.util.ts
│   │       ├── date.util.ts
│   │       └── string.util.ts
│   │
│   ├── infrastructure/                     # Configuración global
│   │   ├── config/
│   │   │   ├── app.config.ts
│   │   │   ├── database.config.ts
│   │   │   ├── cors.config.ts
│   │   │   └── upload.config.ts
│   │   ├── guards/
│   │   │   ├── throttle.guard.ts
│   │   │   └── auth.guard.ts              # v0.5
│   │   ├── interceptors/
│   │   │   ├── logging.interceptor.ts
│   │   │   ├── transform.interceptor.ts
│   │   │   └── timeout.interceptor.ts
│   │   ├── filters/
│   │   │   ├── http-exception.filter.ts
│   │   │   └── all-exceptions.filter.ts
│   │   ├── pipes/
│   │   │   └── validation.pipe.ts
│   │   └── decorators/
│   │       ├── api-response.decorator.ts
│   │       └── current-user.decorator.ts  # v0.5
│   │
│   ├── app.module.ts
│   └── main.ts
│
├── uploads/                                # File storage
│   └── images/
│       ├── original/
│       └── optimized/
│
├── database/
│   └── documents.db                        # SQLite
│
├── test/
│   ├── e2e/
│   │   └── documents.e2e-spec.ts
│   └── fixtures/
│       └── test-documents.fixture.ts
│
├── nest-cli.json
├── tsconfig.json
├── package.json
└── .env
```

---

## ⚙️ **CONFIGURACIÓN INICIAL**

### **main.ts**

```typescript
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import helmet from "helmet";
import { HttpExceptionFilter } from "./infrastructure/filters/http-exception.filter";
import { LoggingInterceptor } from "./infrastructure/interceptors/logging.interceptor";
import { TransformInterceptor } from "./infrastructure/interceptors/transform.interceptor";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ["error", "warn", "log", "debug"],
  });

  // Security headers
  app.use(helmet());

  // CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || "http://localhost:4321",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  });

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  );

  // Global filters
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global interceptors
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TransformInterceptor()
  );

  // API prefix
  app.setGlobalPrefix("api");

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🚀 API running on http://localhost:${port}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`);
}

bootstrap();
```

### **app.module.ts**

```typescript
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerModule } from "@nestjs/throttler";

// Shared modules
import { PrismaModule } from "./shared/database/prisma.module";
import { WebSocketModule } from "./shared/websocket/websocket.module";

// Feature modules
import { DocumentsModule } from "./documents/documents.module";
import { SearchModule } from "./search/search.module";
import { UploadModule } from "./upload/upload.module";
import { AnalyticsModule } from "./analytics/analytics.module";

// Config
import appConfig from "./infrastructure/config/app.config";
import databaseConfig from "./infrastructure/config/database.config";
import corsConfig from "./infrastructure/config/cors.config";
import uploadConfig from "./infrastructure/config/upload.config";

@Module({
  imports: [
    // Global configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, corsConfig, uploadConfig],
      envFilePath: [".env.local", ".env"],
      cache: true,
    }),

    // Rate limiting
    ThrottlerModule.forRoot([
      {
        name: "short",
        ttl: 1000, // 1 second
        limit: 10,
      },
      {
        name: "medium",
        ttl: 10000, // 10 seconds
        limit: 50,
      },
      {
        name: "long",
        ttl: 60000, // 1 minute
        limit: 100,
      },
    ]),

    // Shared modules
    PrismaModule,
    WebSocketModule,

    // Feature modules
    DocumentsModule,
    SearchModule,
    UploadModule,
    AnalyticsModule,
  ],
})
export class AppModule {}
```

---

## 🏗️ **INFRASTRUCTURE LAYER**

### **Config** (`infrastructure/config/`)

#### **app.config.ts**

```typescript
import { registerAs } from "@nestjs/config";

export default registerAs("app", () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  apiPrefix: "api",
  isDevelopment: process.env.NODE_ENV !== "production",
  isProduction: process.env.NODE_ENV === "production",
}));
```

#### **database.config.ts**

```typescript
import { registerAs } from "@nestjs/config";

export default registerAs("database", () => ({
  url: process.env.DATABASE_URL || "file:./database/documents.db",
  log:
    process.env.DB_LOG === "true"
      ? ["query", "info", "warn", "error"]
      : ["error"],
}));
```

#### **cors.config.ts**

```typescript
import { registerAs } from "@nestjs/config";

export default registerAs("cors", () => ({
  origin: process.env.CORS_ORIGIN || "http://localhost:4321",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
}));
```

#### **upload.config.ts**

```typescript
import { registerAs } from "@nestjs/config";

export default registerAs("upload", () => ({
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE, 10) || 5242880, // 5MB
  allowedFormats: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  uploadDir: process.env.UPLOAD_DIR || "./uploads",
  optimizedQuality: 85,
}));
```

---

### **Guards** (`infrastructure/guards/`)

#### **throttle.guard.ts**

```typescript
import { Injectable, ExecutionContext } from "@nestjs/common";
import { ThrottlerGuard } from "@nestjs/throttler";

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  protected async getTracker(req: Record<string, any>): Promise<string> {
    // POC: Rate limit por IP
    // v0.5: Rate limit por user_id
    return req.headers["x-forwarded-for"] || req.ip || "unknown";
  }

  protected getErrorMessage(): string {
    return "Too many requests. Please try again later.";
  }
}
```

---

### **Filters** (`infrastructure/filters/`)

#### **http-exception.filter.ts**

```typescript
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { Request, Response } from "express";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : "Internal server error";

    // Log error
    this.logger.error(
      `${request.method} ${request.url}`,
      exception instanceof Error ? exception.stack : JSON.stringify(exception)
    );

    // Response format
    response.status(status).json({
      success: false,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: typeof message === "string" ? message : (message as any).message,
    });
  }
}
```

---

### **Interceptors** (`infrastructure/interceptors/`)

#### **logging.interceptor.ts**

```typescript
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger("HTTP");

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, ip } = request;
    const userAgent = request.get("user-agent") || "";
    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const response = context.switchToHttp().getResponse();
          const { statusCode } = response;
          const duration = Date.now() - startTime;

          this.logger.log(
            `${method} ${url} ${statusCode} - ${duration}ms - ${ip} - ${userAgent}`
          );
        },
        error: (error) => {
          const duration = Date.now() - startTime;
          this.logger.error(
            `${method} ${url} ERROR - ${duration}ms - ${error.message}`
          );
        },
      })
    );
  }
}
```

#### **transform.interceptor.ts**

```typescript
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

export interface Response<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => ({
        success: true,
        data,
        timestamp: new Date().toISOString(),
      }))
    );
  }
}
```

---

## 🔷 **SHARED LAYER**

### **Database** (`shared/database/`)

#### **prisma.module.ts**

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

#### **prisma.service.ts**

```typescript
import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor(private configService: ConfigService) {
    const databaseUrl = configService.get<string>("database.url");
    const log = configService.get<string[]>("database.log");

    super({
      datasources: {
        db: {
          url: databaseUrl,
        },
      },
      log: log || ["error"],
    });

    this.logger.log(`Connecting to database: ${databaseUrl}`);
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log("✅ Database connected");
    } catch (error) {
      this.logger.error("❌ Database connection failed:", error);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log("Database disconnected");
  }

  async cleanDatabase() {
    // Útil para tests
    if (process.env.NODE_ENV === "production") {
      throw new Error("Cannot clean database in production");
    }

    const tables = await this.$queryRaw<Array<{ name: string }>>(
      `SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_prisma%';`
    );

    for (const { name } of tables) {
      await this.$executeRawUnsafe(`DELETE FROM "${name}";`);
    }
  }
}
```

#### **base.repository.ts**

```typescript
import { Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma.service";

@Injectable()
export abstract class BaseRepository {
  constructor(protected prisma: PrismaService) {}

  // Métodos comunes pueden ser agregados aquí
  // Por ahora cada repository implementa sus propios métodos
  // usando el PrismaService inyectado
}
```

---

### **Types** (`shared/types/`)

#### **database-schema.type.ts**

```typescript
export interface DatabaseSchema {
  documents: {
    id: number;
    slug: string;
    title: string;
    content: string;
    status: "draft" | "published" | "archived";
    created_at: string;
    updated_at: string;
    created_by: string;
  };
  analytics_events: {
    id: number;
    event_type: string;
    metadata: string;
    timestamp: string;
  };
  search_logs: {
    id: number;
    query: string;
    results_count: number;
    searched_at: string;
  };
}
```

#### **api-response.type.ts**

```typescript
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  timestamp: string;
}

export interface ErrorResponse {
  success: false;
  statusCode: number;
  message: string;
  timestamp: string;
  path: string;
}
```

---

### **Utils** (`shared/utils/`)

#### **slug.util.ts**

```typescript
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD") // Normalize to NFD Unicode form
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^a-z0-9\s-]/g, "") // Remove special chars
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/-+/g, "-") // Remove consecutive -
    .replace(/^-+|-+$/g, "") // Trim - from start/end
    .trim();
}

export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}
```

---

## 📦 **FEATURES**

### **1. Documents Feature** (`documents/`)

#### **Estructura**

```
documents/
├── api/
│   ├── documents.controller.ts
│   └── presence.gateway.ts
├── application/
│   ├── documents.service.ts
│   └── use-cases/
│       ├── create-document.use-case.ts
│       ├── update-draft.use-case.ts
│       ├── publish-document.use-case.ts
│       └── archive-document.use-case.ts
├── domain/
│   ├── document.entity.ts
│   ├── document-status.enum.ts
│   └── document-repository.interface.ts
├── infrastructure/
│   └── document.repository.ts
├── dto/
│   ├── create-document.dto.ts
│   ├── update-document.dto.ts
│   ├── document.response.ts
│   └── active-user.response.ts
└── documents.module.ts
```

#### **domain/document.entity.ts**

```typescript
import { DocumentStatus } from "./document-status.enum";

export interface DocumentEntity {
  id: number;
  slug: string;
  title: string;
  content: string;
  status: DocumentStatus;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export class Document implements DocumentEntity {
  constructor(
    public id: number,
    public slug: string,
    public title: string,
    public content: string,
    public status: DocumentStatus,
    public created_at: string,
    public updated_at: string,
    public created_by: string
  ) {}

  isPublished(): boolean {
    return this.status === DocumentStatus.PUBLISHED;
  }

  isDraft(): boolean {
    return this.status === DocumentStatus.DRAFT;
  }

  isArchived(): boolean {
    return this.status === DocumentStatus.ARCHIVED;
  }

  canBePublished(): boolean {
    return this.isDraft() && this.content.length > 0;
  }
}
```

#### **domain/document-status.enum.ts**

```typescript
export enum DocumentStatus {
  DRAFT = "draft",
  PUBLISHED = "published",
  ARCHIVED = "archived",
}
```

#### **infrastructure/document.repository.ts**

```typescript
import { Injectable } from "@nestjs/common";
import { BaseRepository } from "../../../shared/database/base.repository";
import { PrismaService } from "../../../shared/database/prisma.service";
import { DocumentStatus } from "../domain/document-status.enum";
import { Document, Prisma } from "@prisma/client";

@Injectable()
export class DocumentRepository extends BaseRepository {
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  async findById(id: number): Promise<Document | null> {
    return this.prisma.document.findUnique({
      where: { id },
    });
  }

  async findBySlug(slug: string): Promise<Document | null> {
    return this.prisma.document.findUnique({
      where: { slug },
    });
  }

  async findAllByStatus(status: DocumentStatus): Promise<Document[]> {
    return this.prisma.document.findMany({
      where: { status },
      orderBy: { createdAt: "desc" },
    });
  }

  async findAllPublished(): Promise<Document[]> {
    return this.findAllByStatus(DocumentStatus.PUBLISHED);
  }

  async create(data: Prisma.DocumentCreateInput): Promise<Document> {
    return this.prisma.document.create({
      data,
    });
  }

  async update(
    id: number,
    data: Prisma.DocumentUpdateInput
  ): Promise<Document> {
    return this.prisma.document.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  }

  async updateStatus(id: number, status: DocumentStatus): Promise<Document> {
    return this.update(id, { status });
  }

  async deleteById(id: number): Promise<Document> {
    return this.prisma.document.delete({
      where: { id },
    });
  }

  async slugExists(slug: string): Promise<boolean> {
    const count = await this.prisma.document.count({
      where: { slug },
    });
    return count > 0;
  }
}
```

#### **application/documents.service.ts**

```typescript
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { DocumentRepository } from "../infrastructure/document.repository";
import { CreateDocumentDto } from "../dto/create-document.dto";
import { UpdateDocumentDto } from "../dto/update-document.dto";
import { DocumentResponse } from "../dto/document.response";
import { DocumentStatus } from "../domain/document-status.enum";
import { generateSlug } from "../../../shared/utils/slug.util";

@Injectable()
export class DocumentsService {
  constructor(private readonly documentRepo: DocumentRepository) {}

  async findAll(): Promise<DocumentResponse[]> {
    const documents = await this.documentRepo.findAllPublished();
    return documents.map((doc) => this.toResponse(doc));
  }

  async findBySlug(slug: string): Promise<DocumentResponse> {
    const doc = await this.documentRepo.findBySlug(slug);

    if (!doc) {
      throw new NotFoundException(`Document with slug '${slug}' not found`);
    }

    if (doc.status !== DocumentStatus.PUBLISHED) {
      throw new NotFoundException(`Document '${slug}' is not published`);
    }

    return this.toResponse(doc);
  }

  async create(dto: CreateDocumentDto): Promise<DocumentResponse> {
    const slug = generateSlug(dto.title);

    // Check if slug exists
    const exists = await this.documentRepo.slugExists(slug);
    if (exists) {
      throw new BadRequestException(
        `Document with slug '${slug}' already exists`
      );
    }

    const doc = await this.documentRepo.create({
      slug,
      title: dto.title,
      content: dto.content || "",
      status: DocumentStatus.DRAFT,
      createdBy: dto.created_by || "anonymous",
    });

    return this.toResponse(doc);
  }

  async saveDraft(
    id: number,
    dto: UpdateDocumentDto
  ): Promise<DocumentResponse> {
    const doc = await this.documentRepo.findById(id);

    if (!doc) {
      throw new NotFoundException(`Document with id ${id} not found`);
    }

    await this.documentRepo.update(id, {
      title: dto.title,
      content: dto.content,
    });

    const updated = await this.documentRepo.findById(id);
    return this.toResponse(updated);
  }

  async publish(id: number): Promise<DocumentResponse> {
    const doc = await this.documentRepo.findById(id);

    if (!doc) {
      throw new NotFoundException(`Document with id ${id} not found`);
    }

    if (!doc.content || doc.content.trim().length === 0) {
      throw new BadRequestException("Cannot publish empty document");
    }

    await this.documentRepo.updateStatus(id, DocumentStatus.PUBLISHED);

    const published = await this.documentRepo.findById(id);
    return this.toResponse(published);
  }

  async archive(id: number): Promise<void> {
    const doc = await this.documentRepo.findById(id);

    if (!doc) {
      throw new NotFoundException(`Document with id ${id} not found`);
    }

    await this.documentRepo.updateStatus(id, DocumentStatus.ARCHIVED);
  }

  private toResponse(doc: any): DocumentResponse {
    return {
      id: doc.id,
      slug: doc.slug,
      title: doc.title,
      content: doc.content,
      status: doc.status,
      createdAt: doc.created_at,
      updatedAt: doc.updated_at,
      createdBy: doc.created_by,
    };
  }
}
```

#### **api/documents.controller.ts**

```typescript
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ThrottlerGuard } from "@nestjs/throttler";
import { DocumentsService } from "../application/documents.service";
import { CreateDocumentDto } from "../dto/create-document.dto";
import { UpdateDocumentDto } from "../dto/update-document.dto";
import { DocumentResponse } from "../dto/document.response";

@Controller("documents")
@UseGuards(ThrottlerGuard)
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get()
  async findAll(): Promise<DocumentResponse[]> {
    return this.documentsService.findAll();
  }

  @Get(":slug")
  async findBySlug(@Param("slug") slug: string): Promise<DocumentResponse> {
    return this.documentsService.findBySlug(slug);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateDocumentDto): Promise<DocumentResponse> {
    return this.documentsService.create(dto);
  }

  @Put(":id/draft")
  async saveDraft(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateDocumentDto
  ): Promise<DocumentResponse> {
    return this.documentsService.saveDraft(id, dto);
  }

  @Put(":id/publish")
  async publish(
    @Param("id", ParseIntPipe) id: number
  ): Promise<DocumentResponse> {
    return this.documentsService.publish(id);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async archive(@Param("id", ParseIntPipe) id: number): Promise<void> {
    return this.documentsService.archive(id);
  }
}
```

#### **api/presence.gateway.ts**

```typescript
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Logger } from "@nestjs/common";

interface ActiveUser {
  userId: string;
  username: string;
  documentId: number;
  connectedAt: string;
}

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:4321",
    credentials: true,
  },
  namespace: "/presence",
})
export class PresenceGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(PresenceGateway.name);
  private activeUsers = new Map<string, ActiveUser>();

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    const user = this.activeUsers.get(client.id);
    if (user) {
      this.server.to(`doc-${user.documentId}`).emit("user-left", {
        userId: user.userId,
        username: user.username,
        documentId: user.documentId,
      });
      this.activeUsers.delete(client.id);
      this.logger.log(
        `User ${user.username} disconnected from doc ${user.documentId}`
      );
    }
  }

  @SubscribeMessage("editing-start")
  handleEditingStart(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    payload: { documentId: number; userId: string; username: string }
  ) {
    const { documentId, userId, username } = payload;

    // Save user info
    this.activeUsers.set(client.id, {
      userId,
      username,
      documentId,
      connectedAt: new Date().toISOString(),
    });

    // Join document room
    client.join(`doc-${documentId}`);

    // Notify others
    client.to(`doc-${documentId}`).emit("user-editing", {
      userId,
      username,
      documentId,
    });

    this.logger.log(`User ${username} started editing doc ${documentId}`);
  }

  @SubscribeMessage("editing-stop")
  handleEditingStop(@ConnectedSocket() client: Socket) {
    const user = this.activeUsers.get(client.id);
    if (user) {
      client.to(`doc-${user.documentId}`).emit("user-stopped-editing", {
        userId: user.userId,
        username: user.username,
        documentId: user.documentId,
      });
      client.leave(`doc-${user.documentId}`);
      this.activeUsers.delete(client.id);
      this.logger.log(
        `User ${user.username} stopped editing doc ${user.documentId}`
      );
    }
  }

  @SubscribeMessage("get-active-users")
  handleGetActiveUsers(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { documentId: number }
  ) {
    const usersInDocument = Array.from(this.activeUsers.values()).filter(
      (user) => user.documentId === payload.documentId
    );

    client.emit("active-users", usersInDocument);
  }
}
```

#### **dto/create-document.dto.ts**

```typescript
import { IsString, IsNotEmpty, MaxLength, IsOptional } from "class-validator";

export class CreateDocumentDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @IsString()
  @IsOptional()
  @MaxLength(100000)
  content?: string;

  @IsString()
  @IsOptional()
  created_by?: string;
}
```

#### **dto/update-document.dto.ts**

```typescript
import { IsString, IsNotEmpty, MaxLength } from "class-validator";

export class UpdateDocumentDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100000)
  content: string;
}
```

#### **dto/document.response.ts**

```typescript
export class DocumentResponse {
  id: number;
  slug: string;
  title: string;
  content: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}
```

#### **documents.module.ts**

```typescript
import { Module } from "@nestjs/common";
import { DocumentsController } from "./api/documents.controller";
import { PresenceGateway } from "./api/presence.gateway";
import { DocumentsService } from "./application/documents.service";
import { DocumentRepository } from "./infrastructure/document.repository";

@Module({
  controllers: [DocumentsController],
  providers: [DocumentsService, DocumentRepository, PresenceGateway],
  exports: [DocumentsService],
})
export class DocumentsModule {}
```

---

## 📦 **Package.json**

```json
{
  "name": "docs-backend",
  "version": "0.1.0",
  "scripts": {
    "dev": "nest start --watch",
    "build": "nest build",
    "start": "node dist/main",
    "test": "jest",
    "test:e2e": "jest --config ./test/jest-e2e.json"
  },
  "dependencies": {
    "@nestjs/common": "^10.3.0",
    "@nestjs/core": "^10.3.0",
    "@nestjs/config": "^3.1.1",
    "@nestjs/platform-express": "^10.3.0",
    "@nestjs/platform-socket.io": "^10.3.0",
    "@nestjs/websockets": "^10.3.0",
    "@nestjs/throttler": "^5.1.1",
    "@prisma/client": "^5.7.0",
    "socket.io": "^4.6.1",
    "sharp": "^0.33.1",
    "multer": "^1.4.5-lts.1",
    "class-validator": "^0.14.0",
    "class-transformer": "^0.5.1",
    "helmet": "^7.1.0",
    "compression": "^1.7.4",
    "rxjs": "^7.8.1",
    "reflect-metadata": "^0.1.14"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.3.0",
    "@nestjs/testing": "^10.3.0",
    "@types/node": "^20.10.6",
    "@types/express": "^4.17.21",
    "@types/multer": "^1.4.11",
    "prisma": "^5.7.0",
    "typescript": "^5.3.3",
    "ts-node": "^10.9.2",
    "jest": "^29.7.0",
    "@types/jest": "^29.5.11"
  }
}
```

---

**Siguiente**: Implementar Search, Upload, y Analytics features siguiendo el mismo patrón.

¿Quieres que continúe con los otros features (Search, Upload, Analytics)?
