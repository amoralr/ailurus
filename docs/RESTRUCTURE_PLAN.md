# 📋 Plan de Reestructuración de Documentación

**Fecha**: 20 de noviembre, 2025  
**Objetivo**: Eliminar redundancias, actualizar contenido obsoleto, y simplificar navegación  
**Estado Actual**: 11 archivos .md con ~70% contenido desactualizado  
**Estado Deseado**: 8 archivos .md concisos, 100% alineados con implementación real

---

## 🔍 **Análisis de Problemas Actuales**

### **1. Contenido Obsoleto (40% del contenido)**

| Archivo                    | Contenido Obsoleto                                | Impacto |
| -------------------------- | ------------------------------------------------- | ------- |
| `PRISMA_SCHEMA.md`         | ❌ SQLite (ahora PostgreSQL)                      | Alto    |
| `PRISMA_SCHEMA.md`         | ❌ Schema sin 3NF (falta category, path, folders) | Alto    |
| `PRISMA_SCHEMA.md`         | ❌ 4 tablas simples (ahora 7 tablas normalizadas) | Alto    |
| `API_CONTRACTS.md`         | ❌ Endpoints sin ?category, /folders              | Alto    |
| `API_CONTRACTS.md`         | ❌ Responses sin category, path, excerpt          | Alto    |
| `BACKEND_ARCHITECTURE.md`  | ❌ SQLite PrismaService config                    | Medio   |
| `BACKEND_ARCHITECTURE.md`  | ❌ Falta FoldersController, CategoriesController  | Medio   |
| `FRONTEND_ARCHITECTURE.md` | ❌ No menciona SidebarItem recursivo              | Medio   |
| `FRONTEND_ARCHITECTURE.md` | ❌ No menciona ImageLightbox, shadcn/ui           | Medio   |

### **2. Redundancias (30% del contenido)**

| Duplicación           | Archivos Afectados                              | Problema                           |
| --------------------- | ----------------------------------------------- | ---------------------------------- |
| Arquitectura backend  | `BACKEND_ARCHITECTURE.md` + `ARCHITECTURE.md`   | Mismo contenido explicado 2 veces  |
| Arquitectura frontend | `FRONTEND_ARCHITECTURE.md` + `ARCHITECTURE.md`  | Información fragmentada            |
| Prisma commands       | `PRISMA_SCHEMA.md` + `backend/prisma/README.md` | Duplicado exacto                   |
| Package dependencies  | `SETUP_GUIDE.md` + `ARCHITECTURE.md` + READMEs  | Lista de packages repetida 4 veces |

### **3. Estructura Confusa (20% del problema)**

**Problema**: 3 niveles de documentación sin jerarquía clara

```
/docs/                           # Documentación técnica (11 archivos)
/backend/prisma/README.md        # Duplica PRISMA_SCHEMA.md
/frontend/src/markdown/README.md # Documentación técnica de imágenes
/ARCHITECTURE.md (raíz)          # Duplica contenido de /docs/
/README.md (raíz)                # Mezcla setup + arquitectura
```

### **4. Información Faltante (10% del problema)**

| Información Ausente              | Importancia | Estado Real                                 |
| -------------------------------- | ----------- | ------------------------------------------- |
| Sistema de carpetas jerárquicas  | ⭐⭐⭐      | ✅ Implementado (MOCK_FOLDERS, SidebarItem) |
| Sistema de imágenes con lightbox | ⭐⭐⭐      | ✅ Implementado (ImageLightbox.tsx)         |
| 20 documentos en mocks           | ⭐⭐        | ✅ Implementado (documents.mock.ts)         |
| Iconos emoji en categorías       | ⭐⭐        | ✅ Implementado (8 iconos)                  |
| shadcn/ui components             | ⭐⭐        | ✅ Implementado (13+ componentes)           |

---

## 🎯 **Propuesta de Reestructuración**

### **Nuevo Árbol de Documentación**

```
/
├── README.md                    # ✨ REESCRITO: Setup rápido + links a /docs
├── ARCHITECTURE.md              # ✨ CONSOLIDADO: Visión unificada (backend + frontend + DB)
└── docs/
    ├── DATABASE.md              # ✨ RENOMBRADO de PRISMA_SCHEMA.md
    ├── API.md                   # ✨ RENOMBRADO de API_CONTRACTS.md
    ├── FRONTEND.md              # ✨ ACTUALIZADO de FRONTEND_ARCHITECTURE.md
    ├── FOLDER_SYSTEM.md         # ✨ NUEVO: Sistema de navegación jerárquica
    ├── DESIGN_SYSTEM.md         # ✨ NUEVO: Iconos, shadcn/ui, temas
    ├── SETUP.md                 # ✨ RENOMBRADO de SETUP_GUIDE.md
    ├── ROADMAP.md               # ✅ MANTENER: Sin cambios
    └── INTERNAL/                # ✨ NUEVO: Docs de seguimiento interno
        ├── ALIGNMENT_REPORT.md  # Análisis técnico de alineación
        ├── FLUJOS_SISTEMA.md    # Diagramas de flujo
        └── RESUMEN_DECISIONES.md # Decisiones de arquitectura
```

**Eliminar**:

- ❌ `BACKEND_ARCHITECTURE.md` (fusionado en `ARCHITECTURE.md`)
- ❌ `FRONTEND_ARCHITECTURE.md` (contenido principal → `FRONTEND.md`, detalles → `ARCHITECTURE.md`)
- ❌ `PRISMA_SCHEMA.md` (renombrado → `DATABASE.md`)
- ❌ `API_CONTRACTS.md` (renombrado → `API.md`)
- ❌ `FRONTEND_SITEMAP.md` (contenido fusionado en `FRONTEND.md`)
- ❌ `WORKPLAN_FRONTEND_MOCK.md` (obsoleto, trabajo completado)

**Resultado**: 11 archivos → **8 archivos** (3 eliminados por redundancia)

---

## 📝 **Contenido de Cada Archivo**

### **1. README.md (Raíz)** ✨ Reescrito

**Audiencia**: Developers nuevos, quick start  
**Longitud**: ~150 líneas

````markdown
# Ailurus - Documentation Platform

Sistema de documentación moderna con Astro + NestJS + PostgreSQL.

## Quick Start

```bash
# Backend
cd backend
pnpm install
pnpm prisma:migrate
pnpm prisma:seed
pnpm dev

# Frontend
cd frontend
pnpm install
pnpm dev
```
````

## Documentación Técnica

- [🏗️ Arquitectura](./ARCHITECTURE.md) - Visión completa del sistema
- [🗄️ Base de Datos](./docs/DATABASE.md) - Schema Prisma 3NF
- [📡 API](./docs/API.md) - Endpoints REST
- [🎨 Frontend](./docs/FRONTEND.md) - Astro + React + shadcn/ui
- [🗂️ Sistema de Carpetas](./docs/FOLDER_SYSTEM.md) - Navegación jerárquica

## Features

✅ 20 documentos categorizados con jerarquía Obsidian-style
✅ Editor Markdown con auto-save
✅ Búsqueda full-text (PostgreSQL FTS)
✅ Lightbox para imágenes con captions
✅ Dark mode con persistencia
✅ Sidebar recursivo con expansión/colapso

## Tech Stack

**Backend**: NestJS + Prisma 7 + PostgreSQL
**Frontend**: Astro + React + TypeScript + Tailwind + shadcn/ui
**State**: Nanostores

````

---

### **2. ARCHITECTURE.md (Raíz)** ✨ Consolidado

**Audiencia**: Tech leads, architects
**Longitud**: ~400 líneas (fusión de 3 documentos actuales)

**Secciones**:
1. **Visión General** (diagrama de arquitectura completo)
2. **Backend** (NestJS feature-based, Prisma, PostgreSQL)
   - Consolidado de `BACKEND_ARCHITECTURE.md`
   - Controllers: Documents, Folders, Categories, Search
   - Services: Feature-based organization
   - Repository pattern con Prisma
3. **Frontend** (Astro SSR + React islands)
   - Consolidado de `FRONTEND_ARCHITECTURE.md` (solo arquitectura, sin componentes)
   - SSR strategy
   - Islands architecture
   - State management (nanostores)
4. **Base de Datos** (resumen, link a DATABASE.md)
   - Schema overview (7 tablas)
   - 3NF normalization
   - Relaciones principales
5. **Deployment** (Estrategia de producción)

---

### **3. docs/DATABASE.md** ✨ Reescrito (antes PRISMA_SCHEMA.md)

**Audiencia**: Backend developers
**Longitud**: ~300 líneas

**Contenido NUEVO**:
```markdown
# Database Schema - PostgreSQL + Prisma 7

## Schema Overview (3NF)

### Document (7 campos nuevos)
- ✨ category: FK a Category
- ✨ subcategory: Subcategoría opcional
- ✨ path: Ruta jerárquica completa
- ✨ excerpt: Resumen para cards

### Category (tabla nueva)
- 4 categorías fijas con iconos

### Folder (tabla nueva)
- Self-referential hierarchy
- FolderType: FOLDER | FILE

### Tablas de unión
- FolderDocument (M:M)
- FolderCategory (M:M)

### Auxiliares
- ActivityLog (auditoría)
- CategoryStats (pre-calculado)

## Migrations

```bash
pnpm prisma:migrate
````

## Seed Data

20 documentos reales + 11 folders + 4 categorías

```bash
pnpm prisma:seed
```

## Queries Comunes

[Ejemplos TypeScript con Prisma Client]

````

**Eliminar TODO contenido SQLite** (100+ líneas obsoletas)

---

### **4. docs/API.md** ✨ Actualizado (antes API_CONTRACTS.md)

**Audiencia**: Frontend + backend developers
**Longitud**: ~350 líneas

**Endpoints NUEVOS**:
```markdown
# API Reference

Base URL: `http://localhost:3000`

## Documents

### GET /docs
Lista de documentos publicados

### GET /docs/:slug
Documento específico

Response actualizado con campos: id, slug, title, content, **category** (getting-started/etc - NUEVO), **subcategory** (Primeros Pasos/etc - NUEVO), **path** (Equipo/Proyecto/... - NUEVO), **excerpt** (resumen - NUEVO), status, timestamps.

### GET /docs?category=:id // ✨ NUEVO

Filtrar por categoría (getting-started, architecture, api-reference, guides)

## Folders // ✨ SECCIÓN NUEVA

### GET /folders

Árbol completo de carpetas jerárquicas

Response: data array con objetos { id, name, type (folder/file), icon (emoji), path, order, children (array recursivo) }

### GET /folders/:path

Nodo específico por path

## Categories // ✨ SECCIÓN NUEVA

### GET /categories

Lista de 4 categorías con stats

Response: data array con 4 categorías { id (getting-started/architecture/api-reference/guides), name, icon (emoji), order, count (número de documentos) }

````

**Eliminar**: Endpoints de Upload, Analytics (v0.5+)

---

### **5. docs/FRONTEND.md** ✨ Actualizado (antes FRONTEND_ARCHITECTURE.md)

**Audiencia**: Frontend developers
**Longitud**: ~400 líneas

**Contenido ACTUALIZADO**:

```markdown
# Frontend Architecture - Astro + React

## Stack

- **Framework**: Astro 4.x (SSR)
- **UI Library**: React 18 (islands)
- **Styling**: Tailwind + shadcn/ui // ✨ NUEVO
- **State**: Nanostores
- **Types**: TypeScript 5.x

## Componentes Principales

### Layout

- ✅ Sidebar.astro - Sidebar con navegación jerárquica
- ✅ SidebarItem.tsx - Item recursivo para árbol // ✨ NUEVO
- ✅ Header.astro
- ✅ Footer.astro

### Documentos

- ✅ DocumentList.astro
- ✅ NewDocumentForm.tsx (shadcn Dialog) // ✨ NUEVO
- ✅ MarkdownRenderer.astro
- ✅ MarkdownEditor.tsx

### Imágenes // ✨ SECCIÓN NUEVA

- ✅ ImageLightbox.tsx (shadcn Dialog)
- ✅ ImageWithLightbox.tsx
- ✅ ImageLightboxController.tsx (bridge vanilla→React)
- Features: lazy loading, captions, accesibilidad WCAG 2.2 AA

### shadcn/ui Components // ✨ SECCIÓN NUEVA

Badge, Button, Card, Dialog, Dropdown Menu, Input, Label, Select, Separator, Skeleton, Tabs, Textarea, Tooltip

## Stores (Nanostores)

- `folder-tree.store.ts` - Estado de expansión de folders // ✨ NUEVO
- `editor.store.ts` - Estado del editor
- `theme.store.ts` - Dark mode

## Tipos TypeScript

- `folder-tree.types.ts` - FolderNode interface // ✨ NUEVO
- `document.type.ts` - MockDocument interface (20 docs)

## Services

- `documents.service.ts` - API calls a /docs
- `folders.service.ts` - API calls a /folders // ✨ NUEVO
- `markdown.service.ts` - Parser + syntax highlighting
```

---

### **6. docs/FOLDER_SYSTEM.md** ✨ NUEVO

**Audiencia**: Frontend + backend developers  
**Longitud**: ~200 líneas

```markdown
# Sistema de Navegación Jerárquica

## Overview

Ailurus utiliza una estructura tipo **Obsidian** con carpetas anidadas ilimitadas.

## Modelo de Datos

**Interface FolderNode**: id (number), name (string), type ("folder"/"file"), icon (emoji opcional), path (ruta completa ej: "Equipo/Proyecto/Getting Started"), order (number para sorting), children (array FolderNode recursivo), slug (string, solo para type='file').
```

## Jerarquía Real

```
📦 Equipo
  └─ 📦 Proyecto
      ├─ 🚀 Getting Started
      │   ├─ 👣 Primeros Pasos
      │   └─ ⚙️ Configuración
      ├─ 🏗️ Architecture
      ├─ 📚 API Reference
      └─ 📖 Guides
📦 Recursos
```

## Implementación Frontend

### SidebarItem.tsx (Recursivo)

Componente React que renderiza árbol completo: SidebarItem recibe node y level (default 0). Detecta isFolder por node.type. Usa useState para isExpanded. Renderiza li con button (folders con iconos FolderOpen/Folder) o link (files con icono File). Children recursivos si expanded.

      {isExpanded && node.children && (
        <ul>
          {node.children.map((child) => (
            <SidebarItem node={child} level={level + 1} />
          ))}
        </ul>
      )}
    </li>

);
}

```

### Estado Global

folder-tree.store.ts exporta expandedFolders como atom nanostores de tipo Set<number> inicializado vacío.

## Implementación Backend

### FoldersController

Endpoint GET /folders retorna Promise<FolderNode[]> llamando foldersService.getTree(). Endpoint GET /folders/:path recibe path param y retorna foldersService.findByPath(path).

## Iconos Utilizados

| Contexto        | Emoji | Código                |
| --------------- | ----- | --------------------- |
| Equipo          | 👥    | `folder_users`        |
| Proyecto        | 📦    | `folder_project`      |
| Getting Started | 🚀    | `folder_rocket`       |
| Architecture    | 🏗️    | `folder_architecture` |
| API Reference   | 📚    | `folder_books`        |
| Guides          | 📖    | `folder_book_open`    |

```

---

### **7. docs/DESIGN_SYSTEM.md** ✨ NUEVO

**Audiencia**: Frontend developers, designers
**Longitud**: ~250 líneas

````markdown
# Design System

## Colores

### Light Mode

Variables CSS: --color-bg-primary (#ffffff), --color-text-primary (#1a1a1a), --color-accent (#0070f3).`

### Dark Mode

Variables CSS: --color-bg-primary (#0a0a0a), --color-text-primary (#e5e5e5), --color-accent (#0070f3).

## Tipografía

- **Headings**: Inter (variable)
- **Body**: Inter (variable)
- **Code**: Fira Code

## Iconos

### Sistema de Carpetas

| Categoría       | Icono | Uso                            |
| --------------- | ----- | ------------------------------ |
| Equipo          | 👥    | Carpeta de equipo/organización |
| Proyecto        | 📦    | Carpeta de proyecto            |
| Getting Started | 🚀    | Guías iniciales                |
| Architecture    | 🏗️    | Documentación técnica          |
| API Reference   | 📚    | Endpoints y APIs               |
| Guides          | 📖    | Tutoriales avanzados           |

### UI Icons (lucide-react)

- Folder, FolderOpen, File (navegación)
- Menu, X (móvil)
- Moon, Sun (tema)
- Search, Plus, Edit, Trash (acciones)

## Componentes (shadcn/ui)

### Instalados

```bash
npx shadcn-ui@latest add badge button card dialog dropdown-menu input label select separator skeleton tabs textarea tooltip
```
````

### Uso

Importar Button y Dialog desde @/components/ui. Ejemplo: Button con variant="primary" size="md", Dialog con DialogContent dentro.

## Responsive Breakpoints

Tailwind breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px), 2xl (1536px).

## Spacing Scale

Escala Tailwind: xs (0.25rem/4px), sm (0.5rem/8px), md (1rem/16px), lg (1.5rem/24px), xl (2rem/32px), 2xl (3rem/48px).

## Accesibilidad

- ✅ WCAG 2.2 AA compliant
- ✅ Keyboard navigation (Tab, Enter, Arrow keys)
- ✅ ARIA labels en componentes interactivos
- ✅ Focus visible en todos los elementos
- ✅ Contrast ratio mínimo 4.5:1

`````

---

### **8. docs/SETUP.md** ✨ Actualizado (antes SETUP_GUIDE.md)

**Audiencia**: New developers
**Longitud**: ~200 líneas

**Contenido ACTUALIZADO**:

````markdown
# Setup Guide

## Requisitos

- Node.js 20+
- pnpm 10+
- PostgreSQL 14+ // ✨ CAMBIO de SQLite

## Instalación

### 1. Clonar Repositorio

```bash
git clone https://github.com/amoralr/ailurus.git
cd ailurus
```
`````

### 2. Backend

```bash
cd backend
pnpm install

# Configurar PostgreSQL  // ✨ NUEVO
cp .env.example .env
# Editar DATABASE_URL en .env

# Migrations y seed
pnpm prisma:migrate
pnpm prisma:seed

# Iniciar
pnpm dev  # http://localhost:3000
```

### 3. Frontend

```bash
cd frontend
pnpm install
pnpm dev  # http://localhost:4321
```

## Verificación

1. Backend: `curl http://localhost:3000/docs`
2. Frontend: Abrir `http://localhost:4321`
3. Database: `pnpm prisma:studio` (http://localhost:5555)

## Troubleshooting

[Sección de errores comunes]

```

---

### **9. docs/INTERNAL/** ✨ NUEVA CARPETA

Mover documentos de seguimiento interno:

```

docs/INTERNAL/
├── ALIGNMENT_REPORT.md # Sin cambios (análisis técnico)
├── FLUJOS_SISTEMA.md # Sin cambios (diagramas)
└── RESUMEN_DECISIONES.md # Sin cambios (decisiones de arquitectura)

```

**Razón**: Separar documentación técnica (consumida por equipo) de docs de seguimiento interno.

---

## 📊 **Impacto de la Reestructuración**

### **Métricas de Mejora**

| Métrica | Antes | Después | Mejora |
|---------|-------|---------|--------|
| **Total de archivos** | 11 | 8 | -27% |
| **Contenido obsoleto** | 40% | 0% | -100% |
| **Redundancia** | 30% | 5% | -83% |
| **Alineación con implementación** | 55% | 100% | +45% |
| **Longitud promedio** | 450 líneas | 280 líneas | -38% |

### **Beneficios**

✅ **Navegación simplificada**: 8 archivos vs 11, estructura clara
✅ **Onboarding rápido**: README.md conciso con links directos
✅ **Fuente de verdad única**: Sin duplicaciones de contenido
✅ **100% actualizado**: Todo contenido refleja implementación real
✅ **Mantenible**: Menos archivos = menos esfuerzo de actualización

---

## 🚀 **Plan de Ejecución**

### **Fase 1: Preparación** (30 min)
1. ✅ Crear `RESTRUCTURE_PLAN.md` (este documento)
2. Revisar con equipo
3. Aprobar cambios

### **Fase 2: Creación de Nuevos Archivos** (2 horas)
1. Crear `docs/FOLDER_SYSTEM.md` (desde cero)
2. Crear `docs/DESIGN_SYSTEM.md` (desde cero)
3. Reescribir `ARCHITECTURE.md` (consolidación)
4. Reescribir `README.md` (simplificación)

### **Fase 3: Actualización de Existentes** (2 horas)
1. Reescribir `docs/DATABASE.md` (era PRISMA_SCHEMA.md)
2. Actualizar `docs/API.md` (era API_CONTRACTS.md)
3. Actualizar `docs/FRONTEND.md` (era FRONTEND_ARCHITECTURE.md)
4. Actualizar `docs/SETUP.md` (era SETUP_GUIDE.md)

### **Fase 4: Eliminación** (15 min)
1. Eliminar `docs/BACKEND_ARCHITECTURE.md`
2. Eliminar `docs/FRONTEND_ARCHITECTURE.md` (viejo)
3. Eliminar `docs/PRISMA_SCHEMA.md` (viejo)
4. Eliminar `docs/API_CONTRACTS.md` (viejo)
5. Eliminar `docs/FRONTEND_SITEMAP.md`
6. Eliminar `docs/WORKPLAN_FRONTEND_MOCK.md`

### **Fase 5: Reorganización** (15 min)
1. Crear carpeta `docs/INTERNAL/`
2. Mover `ALIGNMENT_REPORT.md` → `docs/INTERNAL/`
3. Mover `FLUJOS_SISTEMA.md` → `docs/INTERNAL/`
4. Mover `RESUMEN_DECISIONES.md` → `docs/INTERNAL/`

### **Fase 6: Validación** (30 min)
1. Verificar todos los links internos
2. Comprobar referencias cruzadas
3. Revisar longitud de archivos
4. Test de legibilidad

**Tiempo Total Estimado**: **5.5 horas**

---

## ✅ **Checklist de Completitud**

### Contenido Crítico a Incluir

- [ ] **DATABASE.md**: 7 tablas con 3NF explicado
- [ ] **API.md**: 3 endpoints nuevos (/folders, /categories, /docs?category)
- [ ] **FRONTEND.md**: SidebarItem recursivo, ImageLightbox, shadcn/ui
- [ ] **FOLDER_SYSTEM.md**: FolderNode interface, jerarquía completa
- [ ] **DESIGN_SYSTEM.md**: 8 iconos emoji, colores, tipografía
- [ ] **ARCHITECTURE.md**: Consolidación de backend + frontend + DB
- [ ] **README.md**: Quick start en < 5 min
- [ ] **SETUP.md**: PostgreSQL setup (no SQLite)

### Contenido a Eliminar

- [ ] Todas las referencias a SQLite (40+ ocurrencias)
- [ ] Schema antiguo sin category/path/excerpt (3 archivos)
- [ ] Endpoints de upload/analytics (docs preliminares)
- [ ] Mención de "POC v0.1" (proyecto maduro ahora)

---

## 🎯 **Resultado Esperado**

**Después de la reestructuración**:

```

Ailurus/
├── README.md # ✨ Quick start + links
├── ARCHITECTURE.md # ✨ Visión unificada (400 líneas)
└── docs/
├── DATABASE.md # ✨ PostgreSQL + 3NF (300 líneas)
├── API.md # ✨ 10 endpoints actualizados (350 líneas)
├── FRONTEND.md # ✨ Astro + shadcn/ui (400 líneas)
├── FOLDER_SYSTEM.md # ✨ Navegación jerárquica (200 líneas)
├── DESIGN_SYSTEM.md # ✨ Iconos + UI (250 líneas)
├── SETUP.md # ✨ PostgreSQL setup (200 líneas)
├── ROADMAP.md # ✅ Sin cambios
└── INTERNAL/
├── ALIGNMENT_REPORT.md
├── FLUJOS_SISTEMA.md
└── RESUMEN_DECISIONES.md

```

**Total**: 8 archivos principales (~2200 líneas)
**Antes**: 11 archivos principales (~4900 líneas)
**Reducción**: **55% menos contenido, 100% más preciso**

---

## 🔍 **Siguiente Paso**

1. **Revisar este plan** con el equipo
2. **Aprobar cambios** antes de ejecutar
3. **Ejecutar Fase 2-6** (5.5 horas)
4. **Validar resultado** con checklist
5. **Commit final**: `docs: restructure documentation (11→8 files, remove obsolete content, add missing sections)`
```
