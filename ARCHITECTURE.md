# 🏗️ ARCHITECTURE.md - Ailurus

**Proyecto**: Ailurus  
**Fecha**: 17 de noviembre, 2025  
**Versión**: POC v0.1

---

## 📋 **VISIÓN GENERAL**

Sistema de documentación colaborativo con edición en tiempo real, inspirado en Obsidian, compuesto por dos aplicaciones independientes:

- **Frontend**: Astro SSR para renderizado dinámico de documentación
- **Backend**: NestJS API REST + WebSocket para gestión de contenido

**Características Principales:**

- ✍️ Edición inline estilo Obsidian con Markdown
- 👥 Colaboración con presencia en tiempo real (WebSocket)
- 🔍 Búsqueda full-text (SQLite FTS5)
- 📊 Analytics personalizado
- 🎨 Dark mode y UI inspirada en Vercel/NestJS Docs
- 📱 Responsive y optimizada para SEO

---

## 🎯 **ALCANCE DEL PROYECTO**

### **POC (v0.1) - 5-6 semanas**

#### Core Features:

- ✅ Editor inline básico (SimpleMDE/EasyMDE)
- ✅ Sistema de drafts con auto-save
- ✅ WebSocket para presencia de usuarios
- ✅ Búsqueda FTS5 básica
- ✅ Storage local de imágenes con optimización
- ✅ Navegación híbrida (scroll + tabs opcionales)
- ✅ Analytics simple (logs en DB)
- ✅ Dark mode
- ✅ Sidebar colapsable + TOC sticky

#### No incluido en POC:

- ❌ Sistema de Review
- ❌ Roles y permisos (RBAC)
- ❌ Versionado de documentos
- ❌ Real-time text collaboration
- ❌ Búsqueda semántica con embeddings
- ❌ Dashboard de analytics

### **v0.5 - +2-3 semanas**

- Editor inline mejorado
- Sistema de Review con roles básicos
- Versionado de documentos
- Búsqueda con sugerencias
- Dashboard de analytics

### **v1.0 - +3-4 semanas**

- Editor avanzado (TipTap/ProseMirror)
- Real-time text collaboration
- RBAC completo
- Performance optimizations
- Cache strategy avanzada

### **v2.0 - Futuro**

- Multi-idioma (i18n)
- Búsqueda semántica
- Integración con proveedores OAuth
- CDN para assets
- Multi-proyecto

---

## 🏛️ **ARQUITECTURA DE ALTO NIVEL**

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENTE                              │
│  Browser (Chrome, Firefox, Safari, Edge)                    │
└────────────┬────────────────────────────────────────────────┘
             │ HTTP/HTTPS + WebSocket
             │
┌────────────▼────────────────────────────────────────────────┐
│                    FRONTEND LAYER                            │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           Astro SSR Server (Port 4321)               │  │
│  │                                                       │  │
│  │  • Pages: /docs/[...slug]                           │  │
│  │  • Components: SimpleMDE, Sidebar, TOC, Search      │  │
│  │  • Markdown rendering con marked.js                 │  │
│  │  • Mermaid.js para diagramas                        │  │
│  │  • Prism/Shiki para syntax highlighting            │  │
│  │                                                       │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────┬────────────────────────────────────────────────┘
             │ REST API (HTTP) + WebSocket
             │
┌────────────▼────────────────────────────────────────────────┐
│                     BACKEND LAYER                            │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           NestJS API Server (Port 3000)              │  │
│  │                                                       │  │
│  │  • REST Controllers: /documents, /search            │  │
│  │  • WebSocket Gateway: /ws (presencia)               │  │
│  │  • Services: Document, Search, Upload, Analytics    │  │
│  │  • Guards: Rate limiting                            │  │
│  │                                                       │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────┬────────────────────────────────────────────────┘
             │
┌────────────▼────────────────────────────────────────────────┐
│                    STORAGE LAYER                             │
│                                                              │
│  ┌─────────────────────┐      ┌─────────────────────────┐  │
│  │   SQLite Database   │      │   File System           │  │
│  │   (documents.db)    │      │   (/uploads/images/)    │  │
│  │                     │      │                         │  │
│  │  • documents        │      │  • Imágenes optimizadas │  │
│  │  • documents_fts    │      │  • WebP + JPEG fallback │  │
│  │  • users (futuro)   │      │                         │  │
│  │  • analytics_events │      │                         │  │
│  │  • search_logs      │      │                         │  │
│  └─────────────────────┘      └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 **FLUJO DE DATOS PRINCIPAL**

### **Lectura de Documentación (SSR)**

```
Usuario → Astro SSR → NestJS API → SQLite → NestJS → Astro → HTML → Usuario
         /docs/slug    GET /docs/:slug   SELECT   JSON    Render
```

### **Edición de Documento**

```
Usuario → Astro (Editor) → NestJS API → SQLite
         SimpleMDE         PUT /docs/:id/draft
                          ↓
                    WebSocket broadcast
                          ↓
                    Otros usuarios ven presencia
```

### **Búsqueda**

```
Usuario → Astro (Search) → NestJS API → SQLite FTS5 → Resultados
         Query input       GET /search?q=...
                                                 ↓
                                          Log en search_logs
```

---

## 🗂️ **ESTRUCTURA DE DIRECTORIOS**

### **Estructura General**

```
ailurus/
├── apps/
│   ├── web/                # Frontend Astro SSR
│   │   ├── src/
│   │   ├── public/
│   │   └── package.json
│   │
│   └── api/                # Backend NestJS
│       ├── src/
│       ├── uploads/
│       └── package.json
│
└── analisis/               # Documentación de análisis
    ├── brainstorm-framework-documentacion.md
    ├── decisiones-pendientes.md
    ├── validacion-final.md
    └── flujos-sistema.md
```

---

## 🎨 **PRINCIPIOS DE DISEÑO**

### **1. Separación de Responsabilidades**

- **Astro**: Solo presentación y UX
- **NestJS**: Solo lógica de negocio y datos
- **Sin código compartido**: Comunicación solo vía API

### **2. Progresive Enhancement**

- Funciona sin JavaScript (SSR)
- JavaScript mejora experiencia (editor, WebSocket)
- Fallbacks para features avanzadas

### **3. Performance First**

- SSR para SEO y carga inicial rápida
- Lazy loading de imágenes
- Code splitting automático
- Cache en headers HTTP

### **4. Simplicity over Complexity**

- SQLite sobre PostgreSQL (POC)
- Storage local sobre S3 (POC)
- REST sobre GraphQL (más simple)
- No microservicios (aún)

### **5. Developer Experience**

- Hot reload en desarrollo
- TypeScript en ambos proyectos
- Linting y formatting automático
- Documentación inline

---

## 🔐 **SEGURIDAD**

### **POC (Básico)**

```typescript
// Rate limiting
@UseGuards(ThrottlerGuard)
@Throttle(100, 60) // 100 req/min

// CORS básico
app.enableCors({
  origin: [process.env.FRONTEND_URL || 'http://localhost:4321'],
  credentials: true
});

// Validación de inputs
@IsString()
@MaxLength(10000)
content: string;
```

### **v0.5 (Con autenticación)**

```typescript
// JWT authentication
@UseGuards(JwtAuthGuard)
@Post('publish')

// RBAC básico
@UseGuards(RolesGuard)
@Roles('editor', 'admin')
```

### **v1.0 (Producción)**

- Helmet.js para headers de seguridad
- CSRF protection
- Content Security Policy
- Input sanitization completo
- Audit logs

---

## 📊 **MODELO DE DATOS**

### **Esquema Simplificado (POC)**

**ORM:** Prisma ^5.7.0

```prisma
model Document {
  id        Int            @id @default(autoincrement())
  slug      String         @unique
  title     String
  content   String
  status    DocumentStatus @default(DRAFT)
  createdAt DateTime       @default(now())
  updatedAt DateTime       @updatedAt
  createdBy String         @default("anonymous")
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
}

model SearchLog {
  id           Int      @id @default(autoincrement())
  query        String
  resultsCount Int      @default(0)
  searchedAt   DateTime @default(now())
}
```

**Búsqueda Full-Text:** SQLite FTS5 (triggers sincronizados con Prisma)

Ver esquema completo en [Prisma Schema](./docs/PRISMA_SCHEMA.md)

---

## 🚀 **DEPLOYMENT**

### **POC (Desarrollo)**

```bash
# Terminal 1: Backend
cd apps/api
npm run dev # Puerto 3000

# Terminal 2: Frontend
cd apps/web
npm run dev # Puerto 4321
```

### **v0.5 (Staging con Docker)**

```yaml
# docker-compose.yml
version: "3.8"
services:
  api:
    build: ./apps/api
    ports: ["3000:3000"]
    volumes: ["./uploads:/app/uploads"]
    container_name: ailurus-api

  web:
    build: ./apps/web
    ports: ["4321:4321"]
    environment:
      API_URL: http://api:3000
    container_name: ailurus-web
```

### **v1.0 (Producción K8s)**

```yaml
# kubernetes/
├── backend-deployment.yaml
├── backend-service.yaml
├── frontend-deployment.yaml
├── frontend-service.yaml
└── ingress.yaml
```

---

## 🔄 **INTEGRACIÓN CONTINUA**

### **Validaciones Pre-commit**

```json
{
  "scripts": {
    "lint": "eslint . --ext .ts,.astro",
    "format": "prettier --write .",
    "type-check": "tsc --noEmit",
    "test": "vitest run"
  }
}
```

### **CI/CD (Futuro)**

- GitHub Actions para tests automáticos
- Deploy preview en PRs
- Semantic versioning automático
- Rollback automático si falla health check

---

## 📈 **MÉTRICAS Y MONITOREO**

### **POC**

- Logs en consola
- SQLite queries con timestamps
- Analytics básico en tabla

### **v0.5**

- Dashboard interno de analytics
- Términos de búsqueda más comunes
- Páginas más visitadas
- Usuarios activos editando

### **v1.0**

- APM (Application Performance Monitoring)
- Error tracking (Sentry)
- Uptime monitoring
- Real User Monitoring (RUM)

---

## 🧪 **TESTING**

### **POC (Mínimo)**

```typescript
// Unit tests básicos
describe('DocumentService', () => {
  it('should create draft document', async () => {
    const doc = await service.createDraft({...});
    expect(doc.status).toBe('draft');
  });
});
```

### **v0.5 (Completo)**

- Unit tests (80% coverage)
- Integration tests (API endpoints)
- Component tests (Astro components)

### **v1.0 (E2E)**

- Playwright E2E tests
- Visual regression tests
- Performance tests
- Load testing

---

## 🔧 **TECNOLOGÍAS CORE**

| Categoría          | Tecnología | Versión  | Justificación                                |
| ------------------ | ---------- | -------- | -------------------------------------------- |
| Frontend Framework | Astro      | ^4.0.0   | SSR flexible, Islands Architecture           |
| Backend Framework  | NestJS     | ^10.0.0  | TypeScript, modular, enterprise-ready        |
| Database           | SQLite     | ^3.45.0  | Simple, sin servidor, perfecto para POC      |
| ORM                | Prisma     | ^5.7.0   | Type-safe, migraciones, developer experience |
| Search             | FTS5       | Built-in | Full-text search nativo en SQLite            |
| Editor             | SimpleMDE  | ^2.18.0  | Markdown editor simple y probado             |
| WebSocket          | Socket.io  | ^4.7.0   | Real-time bidireccional confiable            |
| Image Processing   | Sharp      | ^0.33.0  | Rápido, soporte WebP/AVIF                    |
| Markdown Parser    | marked     | ^11.0.0  | Parser rápido y extensible                   |
| Syntax Highlight   | Shiki      | ^1.0.0   | Highlighting preciso con temas VS Code       |
| Diagrams           | Mermaid.js | ^10.6.0  | Diagramas desde código                       |

---

## 📚 **DOCUMENTACIÓN TÉCNICA**

### **Para Desarrolladores**

- [Frontend ARCHITECTURE](./docs/FRONTEND_ARCHITECTURE.md)
- [Backend ARCHITECTURE](./docs/BACKEND_ARCHITECTURE.md)
- [API Contracts](./docs/API_CONTRACTS.md)
- [Prisma Schema](./docs/PRISMA_SCHEMA.md)
- [Setup Guide](./docs/SETUP_GUIDE.md)
- [Roadmap](./docs/ROADMAP.md)

### **Para Usuarios**

- [Guía de Escritura](./docs/writing-guide.md) (futuro)
- [Markdown Syntax](./docs/markdown-syntax.md) (futuro)
- [FAQ](./docs/faq.md) (futuro)

---

## 🎯 **DECISIONES DE ARQUITECTURA**

### **1. ¿Por qué Astro y no Next.js?**

✅ **Astro**:

- Mejor performance (menos JS por defecto)
- Islands Architecture (componentes interactivos solo donde se necesitan)
- Agnóstico a frameworks (puedes usar React, Vue, Svelte)
- SSR flexible y SSG cuando convenga

❌ **Next.js**: Más complejo, más JS en cliente, más opinado

### **2. ¿Por qué NestJS y no Express?**

✅ **NestJS**:

- TypeScript first
- Arquitectura modular y testeable
- Decoradores y DI integrados
- WebSocket support nativo
- Más estructura para proyectos que crecen

❌ **Express**: Menos estructura, más decisiones manuales

### **3. ¿Por qué SQLite y no PostgreSQL?**

✅ **SQLite para POC**:

- Sin servidor adicional
- Setup instantáneo
- FTS5 integrado
- Suficiente para 1000+ documentos
- Migración a Postgres simple después

❌ **PostgreSQL**: Overhead innecesario para POC

### **4. ¿Por qué SimpleMDE y no TipTap?**

✅ **SimpleMDE para POC**:

- Setup en minutos
- UI probada y estable
- Menos configuración
- Migración a TipTap después

❌ **TipTap**: 3-4 semanas de configuración

### **5. ¿Por qué WebSocket presencia y no real-time text?**

✅ **Presencia para POC**:

- 1 semana vs 3-4 semanas
- Funcionalidad útil sin complejidad
- Prepara para real-time después

❌ **Real-time text**: CRDT/OT muy complejo para POC

### **6. ¿Por qué Prisma y no SQL directo?**

✅ **Prisma para POC**:

- Type-safety completo (TypeScript)
- Migraciones automáticas versionadas
- Developer experience excepcional
- Prisma Studio para debugging visual
- Fácil migración a PostgreSQL después
- Raw SQL disponible para FTS5

❌ **SQL directo**: Más propenso a errores, sin types, sin migraciones estructuradas

---

## 🚦 **ROADMAP**

### **Sprint 1 (Semana 1-2): Fundamentos**

- Setup proyectos Astro + NestJS
- Esquema DB y migrations
- API CRUD básico de documentos
- Astro páginas de lectura
- Markdown rendering

### **Sprint 2 (Semana 3-4): Edición**

- SimpleMDE integrado
- Auto-save drafts
- WebSocket presencia
- Publish documents
- Búsqueda FTS5 básica

### **Sprint 3 (Semana 5-6): Polish**

- UI completo (Sidebar, TOC, Dark mode)
- Upload de imágenes con optimización
- Analytics básico
- Navegación con tabs
- Testing básico
- Documentación

---

## 📞 **SOPORTE Y CONTRIBUCIÓN**

### **Para el equipo**

- Issues en GitHub
- Documentación inline en código
- Comentarios descriptivos en decisiones no obvias

### **Contacto**

- Project Lead: [Tu nombre]
- Repositorio: [GitHub URL]
- Slack/Discord: [Channel]

---

**Última actualización**: 17 de noviembre, 2025  
**Versión del documento**: 1.0.0
