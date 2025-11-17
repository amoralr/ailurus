# 🚀 Setup Guide

**Proyecto**: Documentation Framework  
**Stack**: Astro + NestJS + Prisma + SQLite  
**Fecha**: 17 de noviembre, 2025

---

## 📋 **REQUISITOS**

### **Software Requerido**

| Herramienta | Versión Mínima | Verificar        |
| ----------- | -------------- | ---------------- |
| Node.js     | 20.x           | `node --version` |
| npm         | 10.x           | `npm --version`  |
| Git         | 2.x            | `git --version`  |

### **Sistema Operativo**

- ✅ Windows 10/11
- ✅ macOS 12+
- ✅ Linux (Ubuntu 20.04+)

### **Editor Recomendado**

- VS Code con extensiones:
  - Prisma
  - Astro
  - ESLint
  - Prettier

---

## 🏗️ **ESTRUCTURA DEL PROYECTO**

```
documentation-framework/
├── docs-backend/          # Backend NestJS
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── migrations/
│   │   └── seed.ts
│   ├── src/
│   ├── database/
│   ├── uploads/
│   ├── .env
│   └── package.json
│
├── docs-frontend/         # Frontend Astro
│   ├── src/
│   ├── public/
│   ├── .env
│   └── package.json
│
└── docs/                  # Documentación
    ├── ARCHITECTURE.md
    ├── BACKEND_ARCHITECTURE.md
    ├── FRONTEND_ARCHITECTURE.md
    ├── API_CONTRACTS.md
    ├── PRISMA_SCHEMA.md
    └── SETUP_GUIDE.md
```

---

## 📦 **INSTALACIÓN - BACKEND**

### **1. Crear proyecto NestJS**

```bash
# Crear carpeta del backend
mkdir docs-backend
cd docs-backend

# Inicializar proyecto NestJS
npm init -y
npm install @nestjs/common@^10.3.0 @nestjs/core@^10.3.0 @nestjs/platform-express@^10.3.0 reflect-metadata@^0.1.14 rxjs@^7.8.1

# Instalar NestJS CLI (opcional)
npm install -g @nestjs/cli
```

### **2. Instalar dependencias principales**

```bash
npm install @nestjs/config@^3.1.1 \
  @nestjs/platform-socket.io@^10.3.0 \
  @nestjs/websockets@^10.3.0 \
  @nestjs/throttler@^5.1.1 \
  @prisma/client@^5.7.0 \
  socket.io@^4.6.1 \
  sharp@^0.33.1 \
  multer@^1.4.5-lts.1 \
  class-validator@^0.14.0 \
  class-transformer@^0.5.1 \
  helmet@^7.1.0 \
  compression@^1.7.4
```

### **3. Instalar dependencias de desarrollo**

```bash
npm install -D @nestjs/cli@^10.3.0 \
  @nestjs/testing@^10.3.0 \
  @types/node@^20.10.6 \
  @types/express@^4.17.21 \
  @types/multer@^1.4.11 \
  prisma@^5.7.0 \
  typescript@^5.3.3 \
  ts-node@^10.9.2 \
  jest@^29.7.0 \
  @types/jest@^29.5.11 \
  eslint@^8.56.0 \
  prettier@^3.1.0
```

### **4. Configurar Prisma**

```bash
# Inicializar Prisma con SQLite
npx prisma init --datasource-provider sqlite
```

Esto crea:

- `prisma/schema.prisma`
- `.env` con `DATABASE_URL`

### **5. Configurar schema de Prisma**

Editar `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

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

model AnalyticsEvent {
  id        Int      @id @default(autoincrement())
  eventType String
  metadata  String?
  timestamp DateTime @default(now())

  @@map("analytics_events")
}

model SearchLog {
  id           Int      @id @default(autoincrement())
  query        String
  resultsCount Int      @default(0)
  searchedAt   DateTime @default(now())

  @@map("search_logs")
}

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

### **6. Configurar variables de entorno**

Editar `.env`:

```env
# Database
DATABASE_URL="file:./database/documents.db"

# App
NODE_ENV="development"
PORT=3000
FRONTEND_URL="http://localhost:4321"

# Upload
MAX_FILE_SIZE=5242880
UPLOAD_DIR="./uploads"

# Logs (opcional)
DB_LOG="false"
```

### **7. Crear migración inicial**

```bash
# Generar migración y aplicarla
npx prisma migrate dev --name init

# Esto crea:
# - prisma/migrations/20251117_init/migration.sql
# - Genera el cliente de Prisma
# - Crea database/documents.db
```

### **8. Crear migración FTS5**

Crear `prisma/migrations/20251117_add_fts5/migration.sql`:

```sql
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

Aplicar:

```bash
npx prisma migrate dev --name add_fts5
```

### **9. Crear seed de datos**

Crear `prisma/seed.ts`:

```typescript
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  await prisma.document.createMany({
    data: [
      {
        slug: "guia-de-inicio",
        title: "Guía de Inicio",
        content:
          "# Bienvenido\n\nEsta es una guía de inicio para el sistema de documentación.",
        status: "PUBLISHED",
        createdBy: "admin",
      },
      {
        slug: "arquitectura",
        title: "Arquitectura del Sistema",
        content:
          "# Arquitectura\n\nEl sistema utiliza Astro para el frontend y NestJS para el backend.",
        status: "PUBLISHED",
        createdBy: "admin",
      },
      {
        slug: "draft-ejemplo",
        title: "Borrador de Ejemplo",
        content: "# En progreso...\n\nEste es un documento en borrador.",
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

Configurar en `package.json`:

```json
{
  "prisma": {
    "seed": "ts-node prisma/seed.ts"
  },
  "scripts": {
    "dev": "nest start --watch",
    "build": "nest build",
    "start": "node dist/main",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:seed": "prisma db seed",
    "prisma:studio": "prisma studio"
  }
}
```

Ejecutar seed:

```bash
npm run prisma:seed
```

### **10. Crear estructura de carpetas**

```bash
mkdir -p src/documents/{api,application,domain,infrastructure,dto}
mkdir -p src/search/{api,application,domain,infrastructure,dto}
mkdir -p src/upload/{api,application,domain,infrastructure,dto}
mkdir -p src/analytics/{api,application,domain,infrastructure,dto}
mkdir -p src/shared/{database,websocket,types,utils}
mkdir -p src/infrastructure/{config,guards,filters,interceptors,pipes,decorators}
mkdir -p database
mkdir -p uploads/images/{original,optimized}
```

### **11. Verificar instalación**

```bash
# Generar cliente Prisma
npx prisma generate

# Ver datos en Prisma Studio
npx prisma studio
# Abre en http://localhost:5555

# Compilar TypeScript
npm run build

# Iniciar servidor
npm run dev
# Escucha en http://localhost:3000
```

---

## 📦 **INSTALACIÓN - FRONTEND**

### **1. Crear proyecto Astro**

```bash
# Crear carpeta del frontend
mkdir docs-frontend
cd docs-frontend

# Inicializar proyecto Astro
npm create astro@latest . -- --template minimal --install --git --typescript strict
```

### **2. Instalar dependencias principales**

```bash
npm install @astrojs/react@^3.0.0 \
  @astrojs/tailwind@^5.0.0 \
  react@^18.2.0 \
  react-dom@^18.2.0 \
  simplemde@^1.11.2 \
  marked@^11.0.0 \
  shiki@^1.0.0 \
  mermaid@^10.6.0 \
  socket.io-client@^4.7.0 \
  nanostores@^0.10.0 \
  @nanostores/react@^0.7.0 \
  axios@^1.6.0 \
  date-fns@^3.0.0
```

### **3. Instalar dependencias de desarrollo**

```bash
npm install -D typescript@^5.3.0 \
  tailwindcss@^3.4.0 \
  @types/react@^18.2.0 \
  prettier@^3.1.0 \
  prettier-plugin-astro@^0.12.0
```

### **4. Configurar Astro**

Editar `astro.config.mjs`:

```javascript
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  output: "server",

  integrations: [react(), tailwind({ applyBaseStyles: false })],

  vite: {
    ssr: {
      noExternal: ["nanostores", "socket.io-client"],
    },
  },

  server: {
    port: 4321,
    host: true,
  },
});
```

### **5. Configurar variables de entorno**

Crear `.env`:

```env
PUBLIC_API_URL=http://localhost:3000
PUBLIC_WS_URL=http://localhost:3000
```

### **6. Configurar Tailwind**

Crear `tailwind.config.mjs`:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

### **7. Crear estructura de carpetas**

```bash
mkdir -p src/documents/{components,pages,services,types}
mkdir -p src/editor/{components,services,stores,types,utils}
mkdir -p src/search/{components,pages,services,stores,types}
mkdir -p src/markdown/{components,services,styles}
mkdir -p src/shared/{components/ui,components/layout,services,stores,types,utils,hooks}
mkdir -p src/layouts
mkdir -p src/pages
mkdir -p src/styles/themes
```

### **8. Configurar scripts**

Editar `package.json`:

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "astro": "astro"
  }
}
```

### **9. Verificar instalación**

```bash
# Iniciar servidor de desarrollo
npm run dev
# Escucha en http://localhost:4321
```

---

## 🔄 **DESARROLLO DIARIO**

### **Workflow típico**

```bash
# Terminal 1: Backend
cd docs-backend
npm run dev

# Terminal 2: Frontend
cd docs-frontend
npm run dev

# Terminal 3: Prisma Studio (opcional)
cd docs-backend
npx prisma studio
```

### **URLs de desarrollo**

- Frontend: http://localhost:4321
- Backend API: http://localhost:3000
- WebSocket: ws://localhost:3000/presence
- Prisma Studio: http://localhost:5555

---

## 🛠️ **COMANDOS ÚTILES**

### **Backend**

```bash
# Desarrollo
npm run dev

# Build producción
npm run build
npm run start

# Prisma
npx prisma generate           # Regenerar cliente
npx prisma migrate dev        # Crear migración
npx prisma migrate deploy     # Aplicar en producción
npx prisma db seed            # Ejecutar seed
npx prisma studio             # UI visual
npx prisma migrate reset      # ⚠️ Resetear DB (solo dev)

# Linting
npm run lint
npm run format
```

### **Frontend**

```bash
# Desarrollo
npm run dev

# Build producción
npm run build

# Preview build
npm run preview

# Linting
npm run lint
npm run format
```

---

## 🧪 **VERIFICACIÓN DE INSTALACIÓN**

### **Backend**

```bash
# 1. Verificar que Prisma está funcionando
npx prisma studio

# 2. Probar endpoint de health
curl http://localhost:3000/health

# 3. Listar documentos
curl http://localhost:3000/documents
```

### **Frontend**

```bash
# 1. Abrir en navegador
open http://localhost:4321

# 2. Verificar build
npm run build

# 3. Preview producción
npm run preview
```

---

## 🐛 **TROUBLESHOOTING**

### **Error: Prisma Client no generado**

```bash
cd docs-backend
npx prisma generate
```

### **Error: Puerto en uso**

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9
```

### **Error: Database locked**

```bash
# Cerrar Prisma Studio y reintentar
# O verificar conexiones:
cd docs-backend
rm database/documents.db-journal
```

### **Error: CORS**

Verificar en `docs-backend/src/main.ts`:

```typescript
app.enableCors({
  origin: process.env.FRONTEND_URL || "http://localhost:4321",
  credentials: true,
});
```

### **Error: WebSocket no conecta**

Verificar en frontend que `PUBLIC_WS_URL` esté correcto en `.env`

---

## 📋 **CHECKLIST DE INSTALACIÓN**

### **Backend ✓**

- [ ] Node.js 20+ instalado
- [ ] Dependencias instaladas (`npm install`)
- [ ] Prisma configurado (`npx prisma init`)
- [ ] Schema de Prisma creado
- [ ] Migraciones aplicadas (`npx prisma migrate dev`)
- [ ] Base de datos seeded (`npm run prisma:seed`)
- [ ] Variables de entorno configuradas (`.env`)
- [ ] Carpetas creadas (`src/`, `uploads/`)
- [ ] Servidor inicia correctamente (`npm run dev`)
- [ ] Prisma Studio funciona (`npx prisma studio`)

### **Frontend ✓**

- [ ] Node.js 20+ instalado
- [ ] Proyecto Astro creado
- [ ] Dependencias instaladas (`npm install`)
- [ ] Astro configurado (`astro.config.mjs`)
- [ ] Tailwind configurado
- [ ] Variables de entorno configuradas (`.env`)
- [ ] Carpetas creadas (`src/`)
- [ ] Servidor inicia correctamente (`npm run dev`)
- [ ] Acceso a http://localhost:4321 funciona

---

## 🚀 **PRÓXIMOS PASOS**

1. **Backend**: Implementar features siguiendo [Backend Architecture](./BACKEND_ARCHITECTURE.md)
2. **Frontend**: Implementar componentes siguiendo [Frontend Architecture](./FRONTEND_ARCHITECTURE.md)
3. **Integración**: Conectar frontend con backend usando [API Contracts](./API_CONTRACTS.md)
4. **Testing**: Agregar tests unitarios y E2E
5. **Deployment**: Configurar para producción

---

## 📚 **RECURSOS**

- [NestJS Docs](https://docs.nestjs.com)
- [Prisma Docs](https://www.prisma.io/docs)
- [Astro Docs](https://docs.astro.build)
- [Tailwind Docs](https://tailwindcss.com/docs)
- [Socket.io Docs](https://socket.io/docs/v4)

---

## 💡 **TIPS**

### **Performance**

- Usar `npm ci` en CI/CD en lugar de `npm install`
- Habilitar cache de Prisma: `PRISMA_QUERY_ENGINE_BINARY_CACHE=./cache`

### **VSCode Extensions**

Instalar:

- Prisma (Prisma.prisma)
- Astro (astro-build.astro-vscode)
- ESLint (dbaeumer.vscode-eslint)
- Prettier (esbenp.prettier-vscode)
- Tailwind CSS IntelliSense (bradlc.vscode-tailwindcss)

### **Git**

Agregar a `.gitignore`:

```gitignore
# Dependencies
node_modules/

# Build
dist/
build/

# Database
database/*.db
database/*.db-journal

# Uploads
uploads/images/

# Environment
.env
.env.local

# Prisma
prisma/migrations/**/*.sql
!prisma/migrations/**/migration.sql
```

---

**¡Instalación completa!** 🎉

Siguiente: Ver [Backend Architecture](./BACKEND_ARCHITECTURE.md) para comenzar a desarrollar.
