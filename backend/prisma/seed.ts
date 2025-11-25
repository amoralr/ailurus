import { PrismaClient, DocumentStatus, FolderType } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || 'file:./prisma/dev.db',
});
const prisma = new PrismaClient({ adapter });

// Categories from mocks
const CATEGORIES = [
  { id: 'getting-started', name: 'Getting Started', icon: '🚀', order: 1 },
  { id: 'architecture', name: 'Architecture', icon: '🏗️', order: 2 },
  { id: 'api-reference', name: 'API Reference', icon: '📚', order: 3 },
  { id: 'guides', name: 'Guides', icon: '📖', order: 4 },
] as const;

// Comprehensive document set from mocks
const MOCK_DOCUMENTS = [
  // Equipo Level Documents
  {
    id: 16,
    slug: 'equipo-overview',
    title: 'Información del Equipo',
    excerpt: 'Conoce al equipo detrás de Ailurus.',
    category: 'getting-started',
    subcategory: null,
    path: 'Equipo/Información del Equipo',
    status: 'PUBLISHED' as const,
    createdBy: 'Antonio Moral',
    content: `# Información del Equipo

Bienvenido a la sección del equipo Ailurus. Aquí encontrarás información sobre el equipo de desarrollo.

## Misión

Crear una plataforma de documentación moderna, accesible y fácil de usar.

## Equipo Core

- **Antonio Moral** - Lead Developer
- **Equipo Frontend** - Desarrollo de UI/UX
- **Equipo Backend** - Arquitectura y API

## Contacto

Para preguntas o sugerencias, contáctanos en team@ailurus.dev`,
  },
  // Proyecto Level Documents
  {
    id: 17,
    slug: 'proyecto-overview',
    title: 'Resumen del Proyecto',
    excerpt: 'Visión general del proyecto Ailurus.',
    category: 'getting-started',
    subcategory: null,
    path: 'Equipo/Proyecto/Resumen del Proyecto',
    status: 'PUBLISHED' as const,
    createdBy: 'Antonio Moral',
    content: `# Resumen del Proyecto

Ailurus es una plataforma de documentación moderna construida con Astro y NestJS.

## Objetivos

1. **Simplicidad** - Fácil de usar y configurar
2. **Performance** - Rápido y optimizado
3. **Accesibilidad** - WCAG 2.2 AA compliant
4. **Escalabilidad** - Preparado para crecer

## Tecnologías

- **Frontend**: Astro + React
- **Backend**: NestJS + SQLite
- **Real-time**: Socket.io

## Roadmap

Ver [ROADMAP.md](/docs/roadmap) para más detalles.`,
  },
  {
    id: 18,
    slug: 'getting-started-intro',
    title: 'Introducción',
    excerpt: 'Primeros pasos con Ailurus.',
    category: 'getting-started',
    subcategory: null,
    path: 'Equipo/Proyecto/Getting Started/Introducción',
    status: 'PUBLISHED' as const,
    createdBy: 'Antonio Moral',
    content: `# Introducción a Ailurus

Bienvenido a la documentación de Ailurus, tu plataforma de documentación moderna.

## ¿Qué es Ailurus?

Ailurus es un framework de documentación que combina:

- 🚀 **Velocidad**: SSR con Astro
- 🎨 **Diseño**: UI moderna con Tailwind
- 🔍 **Búsqueda**: Full-text search con SQLite FTS5
- ✏️ **Editor**: Markdown con preview en tiempo real

## Próximos Pasos

1. [Instalación](/docs/instalacion)
2. [Inicio Rápido](/docs/quick-start)
3. [Configuración](/docs/configuracion)`,
  },
  // Getting Started - Primeros Pasos
  {
    id: 1,
    slug: 'instalacion',
    title: 'Guía de Instalación',
    excerpt: 'Aprende a instalar Ailurus en tu proyecto paso a paso.',
    category: 'getting-started',
    subcategory: 'Primeros Pasos',
    path: 'Equipo/Proyecto/Getting Started/Primeros Pasos/Guía de Instalación',
    status: 'PUBLISHED' as const,
    createdBy: 'Antonio Moral',
    content: `# Guía de Instalación

Ailurus es un framework de documentación moderno que combina la potencia de Astro y NestJS.

## Requisitos Previos

Antes de instalar Ailurus, asegúrate de tener:

- **Node.js** v18 o superior
- **pnpm** v8 o superior (recomendado)
- **Git** para clonar el repositorio

## Instalación con CLI

La forma más rápida de empezar es usar el CLI de Ailurus:

\`\`\`bash
# Instalar CLI globalmente
npm install -g ailurus-cli

# Crear nuevo proyecto
ailurus init my-docs

# Navegar al directorio
cd my-docs

# Instalar dependencias
pnpm install

# Iniciar servidor de desarrollo
pnpm dev
\`\`\`

## Instalación Manual

Si prefieres configurar manualmente:

\`\`\`bash
# Clonar repositorio
git clone https://github.com/amoralr/ailurus.git
cd ailurus

# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.example .env

# Iniciar servicios
pnpm dev
\`\`\`

## Verificación

Abre tu navegador en \`http://localhost:4321\` para verificar que todo funciona correctamente.`,
  },
  {
    id: 2,
    slug: 'quick-start',
    title: 'Inicio Rápido',
    excerpt: 'Crea tu primer documento en menos de 5 minutos.',
    category: 'getting-started',
    subcategory: 'Primeros Pasos',
    path: 'Equipo/Proyecto/Getting Started/Primeros Pasos/Inicio Rápido',
    status: 'PUBLISHED' as const,
    createdBy: 'Antonio Moral',
    content: `# Inicio Rápido

Esta guía te llevará desde cero hasta tu primer documento publicado en **menos de 5 minutos**.

## Crear un Documento

1. Navega a la sección de documentos
2. Haz clic en "Nuevo Documento"
3. Escribe tu contenido en Markdown

### Ejemplo de Contenido

\`\`\`markdown
# Mi Primer Documento

Este es un **ejemplo** de contenido con:

- Listas
- **Negrita**
- *Cursiva*
- [Links](https://example.com)
\`\`\`

## Publicar el Documento

Cuando estés listo:

1. Haz clic en "Guardar"
2. Revisa el preview
3. Haz clic en "Publicar"

¡Tu documento estará visible inmediatamente!`,
  },
  // Getting Started - Configuración
  {
    id: 3,
    slug: 'configuracion',
    title: 'Configuración Avanzada',
    excerpt: 'Configura Ailurus para adaptarlo a tus necesidades.',
    category: 'getting-started',
    subcategory: 'Configuración',
    path: 'Equipo/Proyecto/Getting Started/Configuración/Configuración Avanzada',
    status: 'PUBLISHED' as const,
    createdBy: 'Antonio Moral',
    content: `# Configuración Avanzada

Personaliza Ailurus según las necesidades de tu proyecto.

## Variables de Entorno

Crea un archivo \`.env\` en la raíz del proyecto:

\`\`\`env
# Frontend
PUBLIC_API_URL=http://localhost:3000
PUBLIC_WS_URL=ws://localhost:3000

# Backend
DATABASE_URL=file:./dev.db
JWT_SECRET=your-secret-key-here
PORT=3000
\`\`\`

## Configuración del Frontend

### Tailwind CSS

Edita \`tailwind.config.mjs\`:

\`\`\`javascript
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'ailurus-red': '#E74C3C',
        'ailurus-orange': '#FF9800',
      },
    },
  },
};
\`\`\``,
  },
  // Architecture Documents
  {
    id: 4,
    slug: 'arquitectura',
    title: 'Arquitectura del Sistema',
    excerpt: 'Entiende la arquitectura completa de Ailurus.',
    category: 'architecture',
    subcategory: null,
    path: 'Equipo/Proyecto/Architecture/Arquitectura del Sistema',
    status: 'PUBLISHED' as const,
    createdBy: 'Antonio Moral',
    content: `# Arquitectura del Sistema

Ailurus está construido con una arquitectura moderna y escalable.

## Stack Tecnológico

### Frontend
- **Astro** ^4.0.0 - SSR y generación estática
- **React** ^18.2.0 - Componentes interactivos (Islands)
- **Tailwind CSS** - Estilos utility-first
- **Nanostores** - Estado global ligero

### Backend
- **NestJS** ^10.0.0 - Framework Node.js
- **SQLite** con FTS5 - Base de datos
- **Socket.io** - WebSocket para tiempo real
- **TypeScript** - Type safety

## Diagrama de Arquitectura

\`\`\`
┌─────────────────┐         ┌─────────────────┐
│  Astro Frontend │◄───────►│  NestJS Backend │
│   (Port 4321)   │   REST  │   (Port 3000)   │
└────────┬────────┘         └────────┬────────┘
         │                           │
         │                           │
    ┌────▼────┐                 ┌────▼────┐
    │ Browser │                 │ SQLite  │
    │ Client  │                 │   DB    │
    └─────────┘                 └─────────┘
\`\`\``,
  },
  {
    id: 5,
    slug: 'frontend-architecture',
    title: 'Arquitectura del Frontend',
    excerpt: 'Detalles de la arquitectura del frontend con Astro.',
    category: 'architecture',
    subcategory: null,
    path: 'Equipo/Proyecto/Architecture/Arquitectura del Frontend',
    status: 'PUBLISHED' as const,
    createdBy: 'Antonio Moral',
    content: `# Arquitectura del Frontend

El frontend de Ailurus está construido con **Astro** usando Islands Architecture.

## Feature-Based Structure

Organización por features/dominios:

\`\`\`
src/
├── documents/        # Feature: Docs
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── types/
├── editor/          # Feature: Editor
├── search/          # Feature: Search
└── shared/          # Código compartido
\`\`\`

## Islands Architecture

Solo los componentes que necesitan interactividad usan React:

\`\`\`astro
---
import { SearchBar } from './SearchBar';
---

<!-- Componente estático -->
<header>
  <h1>Documentación</h1>
  
  <!-- Island interactivo -->
  <SearchBar client:load />
</header>
\`\`\``,
  },
  {
    id: 6,
    slug: 'backend-architecture',
    title: 'Arquitectura del Backend',
    excerpt: 'Estructura y patrones del backend NestJS.',
    category: 'architecture',
    subcategory: null,
    path: 'Equipo/Proyecto/Architecture/Arquitectura del Backend',
    status: 'PUBLISHED' as const,
    createdBy: 'Antonio Moral',
    content: `# Arquitectura del Backend

Backend construido con **NestJS** siguiendo principios SOLID.

## Estructura de Módulos

\`\`\`
src/
├── documents/
│   ├── documents.controller.ts
│   ├── documents.service.ts
│   ├── documents.module.ts
│   └── dto/
├── search/
├── upload/
└── websocket/
\`\`\`

## Patrón Repository

\`\`\`typescript
@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private documentsRepository: Repository<Document>,
  ) {}

  async findBySlug(slug: string): Promise<Document> {
    return this.documentsRepository.findOne({
      where: { slug },
    });
  }
}
\`\`\``,
  },
  {
    id: 7,
    slug: 'database-schema',
    title: 'Database Schema',
    excerpt: 'Esquema completo de la base de datos SQLite.',
    category: 'architecture',
    subcategory: null,
    path: 'Equipo/Proyecto/Architecture/Database Schema',
    status: 'PUBLISHED' as const,
    createdBy: 'Antonio Moral',
    content: `# Database Schema

Ailurus usa **SQLite** con extensión **FTS5** para búsqueda full-text.

## Tabla: documents

\`\`\`sql
CREATE TABLE documents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT CHECK(status IN ('draft', 'published', 'archived')) DEFAULT 'draft',
  category TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_by TEXT
);
\`\`\`

## Tabla FTS5: documents_fts

Para búsqueda full-text:

\`\`\`sql
CREATE VIRTUAL TABLE documents_fts USING fts5(
  title,
  content,
  content=documents,
  content_rowid=id
);
\`\`\``,
  },
  // API Reference Documents
  {
    id: 8,
    slug: 'api-overview',
    title: 'API Overview',
    excerpt: 'Descripción general de la API REST de Ailurus.',
    category: 'api-reference',
    subcategory: null,
    path: 'Equipo/Proyecto/API Reference/API Overview',
    status: 'PUBLISHED' as const,
    createdBy: 'Antonio Moral',
    content: `# API Overview

API REST completa para interactuar con Ailurus.

## Base URL

\`\`\`
http://localhost:3000/api
\`\`\`

## Endpoints Disponibles

### Documents

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | \`/documents\` | Lista todos los documentos |
| GET | \`/documents/:slug\` | Obtiene un documento |
| POST | \`/documents\` | Crea documento |
| PUT | \`/documents/:id/draft\` | Guarda draft |
| PUT | \`/documents/:id/publish\` | Publica documento |
| DELETE | \`/documents/:id\` | Elimina documento |`,
  },
  {
    id: 9,
    slug: 'api-documents',
    title: 'Documents API',
    excerpt: 'Endpoints para gestionar documentos.',
    category: 'api-reference',
    subcategory: null,
    path: 'Equipo/Proyecto/API Reference/Documents API',
    status: 'PUBLISHED' as const,
    createdBy: 'Antonio Moral',
    content: `# Documents API

CRUD completo para documentos.

## GET /documents

Lista todos los documentos publicados.

### Query Parameters

\`\`\`
?category=Architecture
?status=published
?limit=20
?offset=0
\`\`\`

## POST /documents

Crea un nuevo documento.

### Request Body

\`\`\`json
{
  "title": "Mi Nuevo Documento",
  "content": "# Contenido\\n\\nTexto...",
  "category": "Guides"
}
\`\`\``,
  },
  {
    id: 10,
    slug: 'api-search',
    title: 'Search API',
    excerpt: 'API de búsqueda full-text con SQLite FTS5.',
    category: 'api-reference',
    subcategory: null,
    path: 'Equipo/Proyecto/API Reference/Search API',
    status: 'PUBLISHED' as const,
    createdBy: 'Antonio Moral',
    content: `# Search API

Búsqueda full-text optimizada con FTS5.

## GET /search

Busca en títulos y contenido de documentos.

### Query Parameters

\`\`\`
?q=instalacion          # Query obligatorio
?limit=20               # Resultados por página
?offset=0               # Paginación
?category=Architecture  # Filtro por categoría
\`\`\``,
  },
  {
    id: 11,
    slug: 'api-upload',
    title: 'Upload API',
    excerpt: 'Subida y optimización de imágenes.',
    category: 'api-reference',
    subcategory: null,
    path: 'Equipo/Proyecto/API Reference/Upload API',
    status: 'PUBLISHED' as const,
    createdBy: 'Antonio Moral',
    content: `# Upload API

Sube imágenes con compresión y conversión a WebP.

## POST /upload/image

Sube una imagen y retorna la URL.

### Restricciones

- **Tamaño máximo**: 5 MB
- **Formatos**: JPEG, PNG, GIF, WebP
- **Dimensiones máximas**: 4096x4096`,
  },
  {
    id: 12,
    slug: 'api-websocket',
    title: 'WebSocket API',
    excerpt: 'WebSocket para presencia en tiempo real.',
    category: 'api-reference',
    subcategory: null,
    path: 'Equipo/Proyecto/API Reference/WebSocket API',
    status: 'PUBLISHED' as const,
    createdBy: 'Antonio Moral',
    content: `# WebSocket API

Comunicación en tiempo real con Socket.io.

## Conexión

\`\`\`typescript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000/presence', {
  transports: ['websocket'],
});
\`\`\`

## Eventos: Cliente → Servidor

### editing-start

Usuario empieza a editar:

\`\`\`typescript
socket.emit('editing-start', {
  documentId: 1,
  userId: 'user-123',
  username: 'Antonio'
});
\`\`\``,
  },
  // Guides Documents
  {
    id: 13,
    slug: 'editor-guide',
    title: 'Guía del Editor',
    excerpt: 'Aprende a usar el editor Markdown de Ailurus.',
    category: 'guides',
    subcategory: null,
    path: 'Equipo/Proyecto/Guides/Guía del Editor',
    status: 'PUBLISHED' as const,
    createdBy: 'Antonio Moral',
    content: `# Guía del Editor

El editor de Ailurus ofrece una experiencia fluida para escribir documentación.

## Características

✅ **Markdown WYSIWYG** con SimpleMDE  
✅ **Auto-save** cada 5 segundos  
✅ **Preview** en tiempo real  
✅ **Syntax highlighting** para código  
✅ **Drag & drop** de imágenes  
✅ **Presencia** de otros usuarios

## Auto-save

El editor guarda automáticamente:

- Cada 5 segundos si hay cambios
- Al hacer blur del editor
- Antes de cerrar pestaña`,
  },
  {
    id: 14,
    slug: 'markdown-syntax',
    title: 'Markdown Syntax',
    excerpt: 'Sintaxis Markdown completa soportada por Ailurus.',
    category: 'guides',
    subcategory: null,
    path: 'Equipo/Proyecto/Guides/Markdown Syntax',
    status: 'PUBLISHED' as const,
    createdBy: 'Antonio Moral',
    content: `# Markdown Syntax

Ailurus soporta Markdown estándar más extensiones.

## Headings

\`\`\`markdown
# Heading 1
## Heading 2
### Heading 3
\`\`\`

## Text Formatting

\`\`\`markdown
**Negrita**
*Cursiva*
~~Tachado~~
\`code inline\`
\`\`\`

## Code Blocks

\`\`\`typescript
const greeting: string = "Hello, World!";
console.log(greeting);
\`\`\``,
  },
  {
    id: 20,
    slug: 'images-guide',
    title: 'Guía de Imágenes',
    excerpt: 'Aprende a usar imágenes con lightbox y lazy loading.',
    category: 'guides',
    subcategory: null,
    path: 'Equipo/Proyecto/Guides/Guía de Imágenes',
    status: 'PUBLISHED' as const,
    createdBy: 'Antonio Moral',
    content: `# Guía de Imágenes

Sistema completo de renderizado de imágenes con lightbox.

## Sintaxis

\`\`\`markdown
![Descripción](url.jpg "Caption opcional")
\`\`\`

## Características

- ✅ Lazy loading automático
- ✅ Lightbox con shadcn/ui
- ✅ Captions desde atributo title
- ✅ Accesibilidad WCAG 2.2 AA`,
  },
  {
    id: 15,
    slug: 'deployment',
    title: 'Deployment Guide',
    excerpt: 'Despliega Ailurus en producción.',
    category: 'guides',
    subcategory: null,
    path: 'Equipo/Proyecto/Guides/Deployment Guide',
    status: 'PUBLISHED' as const,
    createdBy: 'Antonio Moral',
    content: `# Deployment Guide

Opciones para desplegar Ailurus en producción.

## Opción 1: Docker Compose (Recomendado)

\`\`\`yaml
version: '3.8'

services:
  frontend:
    build: ./frontend
    ports:
      - "4321:4321"
\`\`\`

## Variables de Entorno

### Frontend

\`\`\`env
PUBLIC_API_URL=https://api.yourdomain.com
PUBLIC_WS_URL=wss://api.yourdomain.com
\`\`\``,
  },
  // Recursos Level Documents
  {
    id: 19,
    slug: 'recursos-overview',
    title: 'Información de Recursos',
    excerpt: 'Recursos adicionales y enlaces útiles.',
    category: 'guides',
    subcategory: null,
    path: 'Recursos/Información de Recursos',
    status: 'PUBLISHED' as const,
    createdBy: 'Antonio Moral',
    content: `# Recursos

Recursos adicionales para ayudarte con Ailurus.

## Comunidad

- [GitHub](https://github.com/ailurus/ailurus)
- [Discord](https://discord.gg/ailurus)
- [Twitter](https://twitter.com/ailurusdev)

## Tutoriales

- [Video Tutorials](https://youtube.com/ailurus)
- [Blog Posts](https://ailurus.dev/blog)`,
  },
];

// Comprehensive folder structure matching all documents
const FOLDER_STRUCTURE = [
  // Root: Equipo
  {
    id: 1,
    name: 'Equipo',
    type: FolderType.FOLDER,
    icon: '👥',
    path: 'Equipo',
    order: 1,
    parentId: null,
  },
  // Equipo > File: Información del Equipo
  {
    id: 2,
    name: 'Información del Equipo',
    type: FolderType.FILE,
    icon: null,
    path: 'Equipo/Información del Equipo',
    order: 1,
    parentId: 1,
    documentSlug: 'equipo-overview',
  },
  // Equipo > Proyecto Folder
  {
    id: 3,
    name: 'Proyecto',
    type: FolderType.FOLDER,
    icon: '📦',
    path: 'Equipo/Proyecto',
    order: 2,
    parentId: 1,
  },
  // Proyecto > File: Resumen del Proyecto
  {
    id: 4,
    name: 'Resumen del Proyecto',
    type: FolderType.FILE,
    icon: null,
    path: 'Equipo/Proyecto/Resumen del Proyecto',
    order: 1,
    parentId: 3,
    documentSlug: 'proyecto-overview',
  },
  // Proyecto > Getting Started Folder
  {
    id: 5,
    name: 'Getting Started',
    type: FolderType.FOLDER,
    icon: '🚀',
    path: 'Equipo/Proyecto/Getting Started',
    order: 2,
    parentId: 3,
  },
  // Getting Started > File: Introducción
  {
    id: 6,
    name: 'Introducción',
    type: FolderType.FILE,
    icon: null,
    path: 'Equipo/Proyecto/Getting Started/Introducción',
    order: 1,
    parentId: 5,
    documentSlug: 'getting-started-intro',
  },
  // Getting Started > Primeros Pasos Folder
  {
    id: 7,
    name: 'Primeros Pasos',
    type: FolderType.FOLDER,
    icon: '👣',
    path: 'Equipo/Proyecto/Getting Started/Primeros Pasos',
    order: 2,
    parentId: 5,
  },
  // Primeros Pasos > Files
  {
    id: 8,
    name: 'Guía de Instalación',
    type: FolderType.FILE,
    icon: null,
    path: 'Equipo/Proyecto/Getting Started/Primeros Pasos/Guía de Instalación',
    order: 1,
    parentId: 7,
    documentSlug: 'instalacion',
  },
  {
    id: 9,
    name: 'Inicio Rápido',
    type: FolderType.FILE,
    icon: null,
    path: 'Equipo/Proyecto/Getting Started/Primeros Pasos/Inicio Rápido',
    order: 2,
    parentId: 7,
    documentSlug: 'quick-start',
  },
  // Getting Started > Configuración Folder
  {
    id: 10,
    name: 'Configuración',
    type: FolderType.FOLDER,
    icon: '⚙️',
    path: 'Equipo/Proyecto/Getting Started/Configuración',
    order: 3,
    parentId: 5,
  },
  // Configuración > File
  {
    id: 11,
    name: 'Configuración Avanzada',
    type: FolderType.FILE,
    icon: null,
    path: 'Equipo/Proyecto/Getting Started/Configuración/Configuración Avanzada',
    order: 1,
    parentId: 10,
    documentSlug: 'configuracion',
  },
  // Proyecto > Architecture Folder
  {
    id: 12,
    name: 'Architecture',
    type: FolderType.FOLDER,
    icon: '🏗️',
    path: 'Equipo/Proyecto/Architecture',
    order: 3,
    parentId: 3,
  },
  // Architecture > Files
  {
    id: 13,
    name: 'Arquitectura del Sistema',
    type: FolderType.FILE,
    icon: null,
    path: 'Equipo/Proyecto/Architecture/Arquitectura del Sistema',
    order: 1,
    parentId: 12,
    documentSlug: 'arquitectura',
  },
  {
    id: 14,
    name: 'Arquitectura del Frontend',
    type: FolderType.FILE,
    icon: null,
    path: 'Equipo/Proyecto/Architecture/Arquitectura del Frontend',
    order: 2,
    parentId: 12,
    documentSlug: 'frontend-architecture',
  },
  {
    id: 15,
    name: 'Arquitectura del Backend',
    type: FolderType.FILE,
    icon: null,
    path: 'Equipo/Proyecto/Architecture/Arquitectura del Backend',
    order: 3,
    parentId: 12,
    documentSlug: 'backend-architecture',
  },
  {
    id: 16,
    name: 'Database Schema',
    type: FolderType.FILE,
    icon: null,
    path: 'Equipo/Proyecto/Architecture/Database Schema',
    order: 4,
    parentId: 12,
    documentSlug: 'database-schema',
  },
  // Proyecto > API Reference Folder
  {
    id: 17,
    name: 'API Reference',
    type: FolderType.FOLDER,
    icon: '📚',
    path: 'Equipo/Proyecto/API Reference',
    order: 4,
    parentId: 3,
  },
  // API Reference > Files
  {
    id: 18,
    name: 'API Overview',
    type: FolderType.FILE,
    icon: null,
    path: 'Equipo/Proyecto/API Reference/API Overview',
    order: 1,
    parentId: 17,
    documentSlug: 'api-overview',
  },
  {
    id: 19,
    name: 'Documents API',
    type: FolderType.FILE,
    icon: null,
    path: 'Equipo/Proyecto/API Reference/Documents API',
    order: 2,
    parentId: 17,
    documentSlug: 'api-documents',
  },
  {
    id: 20,
    name: 'Search API',
    type: FolderType.FILE,
    icon: null,
    path: 'Equipo/Proyecto/API Reference/Search API',
    order: 3,
    parentId: 17,
    documentSlug: 'api-search',
  },
  {
    id: 21,
    name: 'Upload API',
    type: FolderType.FILE,
    icon: null,
    path: 'Equipo/Proyecto/API Reference/Upload API',
    order: 4,
    parentId: 17,
    documentSlug: 'api-upload',
  },
  {
    id: 22,
    name: 'WebSocket API',
    type: FolderType.FILE,
    icon: null,
    path: 'Equipo/Proyecto/API Reference/WebSocket API',
    order: 5,
    parentId: 17,
    documentSlug: 'api-websocket',
  },
  // Proyecto > Guides Folder
  {
    id: 23,
    name: 'Guides',
    type: FolderType.FOLDER,
    icon: '📖',
    path: 'Equipo/Proyecto/Guides',
    order: 5,
    parentId: 3,
  },
  // Guides > Files
  {
    id: 24,
    name: 'Guía del Editor',
    type: FolderType.FILE,
    icon: null,
    path: 'Equipo/Proyecto/Guides/Guía del Editor',
    order: 1,
    parentId: 23,
    documentSlug: 'editor-guide',
  },
  {
    id: 25,
    name: 'Markdown Syntax',
    type: FolderType.FILE,
    icon: null,
    path: 'Equipo/Proyecto/Guides/Markdown Syntax',
    order: 2,
    parentId: 23,
    documentSlug: 'markdown-syntax',
  },
  {
    id: 26,
    name: 'Guía de Imágenes',
    type: FolderType.FILE,
    icon: null,
    path: 'Equipo/Proyecto/Guides/Guía de Imágenes',
    order: 3,
    parentId: 23,
    documentSlug: 'images-guide',
  },
  {
    id: 27,
    name: 'Deployment Guide',
    type: FolderType.FILE,
    icon: null,
    path: 'Equipo/Proyecto/Guides/Deployment Guide',
    order: 4,
    parentId: 23,
    documentSlug: 'deployment',
  },
  // Root: Recursos
  {
    id: 28,
    name: 'Recursos',
    type: FolderType.FOLDER,
    icon: '📦',
    path: 'Recursos',
    order: 2,
    parentId: null,
  },
  // Recursos > File
  {
    id: 29,
    name: 'Información de Recursos',
    type: FolderType.FILE,
    icon: null,
    path: 'Recursos/Información de Recursos',
    order: 1,
    parentId: 28,
    documentSlug: 'recursos-overview',
  },
];

async function main() {
  console.log('🌱 Starting seed...');

  // Clean existing data
  console.log('🧹 Cleaning existing data...');
  await prisma.folderDocument.deleteMany();
  await prisma.folderCategory.deleteMany();
  await prisma.folder.deleteMany();
  await prisma.document.deleteMany();
  await prisma.category.deleteMany();
  await prisma.categoryStats.deleteMany();
  await prisma.activityLog.deleteMany();

  // Seed Categories
  console.log('📚 Seeding categories...');
  for (const category of CATEGORIES) {
    await prisma.category.create({
      data: category,
    });
  }
  console.log(`✅ Created ${CATEGORIES.length} categories`);

  // Seed Documents
  console.log('📄 Seeding documents...');
  for (const doc of MOCK_DOCUMENTS) {
    await prisma.document.create({
      data: {
        id: doc.id,
        slug: doc.slug,
        title: doc.title,
        content: doc.content,
        excerpt: doc.excerpt,
        categoryId: doc.category,
        subcategory: doc.subcategory,
        path: doc.path,
        status: doc.status as DocumentStatus,
        createdBy: doc.createdBy,
      },
    });
  }
  console.log(`✅ Created ${MOCK_DOCUMENTS.length} documents`);

  // Seed Folders
  console.log('📁 Seeding folders...');
  for (const folder of FOLDER_STRUCTURE) {
    await prisma.folder.create({
      data: {
        id: folder.id,
        name: folder.name,
        type: folder.type,
        icon: folder.icon,
        path: folder.path,
        order: folder.order,
        parentId: folder.parentId,
      },
    });
  }
  console.log(`✅ Created ${FOLDER_STRUCTURE.length} folders`);

  // Link Folders to Documents (FolderDocument junction table)
  console.log('🔗 Linking folders to documents...');
  const folderDocumentLinks = FOLDER_STRUCTURE.filter(
    (f) => f.type === FolderType.FILE && f.documentSlug,
  )
    .map((f) => {
      const doc = MOCK_DOCUMENTS.find((d) => d.slug === f.documentSlug);
      if (!doc) {
        console.warn(`⚠️  Document not found for slug: ${f.documentSlug}`);
        return null;
      }
      return {
        folderId: f.id,
        documentId: doc.id,
        order: f.order,
      };
    })
    .filter(Boolean);

  for (const link of folderDocumentLinks) {
    if (link) {
      await prisma.folderDocument.create({
        data: link,
      });
    }
  }
  console.log(`✅ Created ${folderDocumentLinks.length} folder-document links`);

  // Initialize CategoryStats
  console.log('📊 Initializing category stats...');
  for (const category of CATEGORIES) {
    const totalDocuments = await prisma.document.count({
      where: { categoryId: category.id },
    });
    const publishedDocs = await prisma.document.count({
      where: { categoryId: category.id, status: DocumentStatus.PUBLISHED },
    });
    const draftDocs = await prisma.document.count({
      where: { categoryId: category.id, status: DocumentStatus.DRAFT },
    });
    const archivedDocs = await prisma.document.count({
      where: { categoryId: category.id, status: DocumentStatus.ARCHIVED },
    });

    await prisma.categoryStats.create({
      data: {
        categoryId: category.id,
        totalDocuments,
        publishedDocs,
        draftDocs,
        archivedDocs,
      },
    });
  }
  console.log(`✅ Created stats for ${CATEGORIES.length} categories`);

  console.log('🎉 Seed completed successfully!');
  console.log('');
  console.log('📊 Summary:');
  console.log(`   - Categories: ${CATEGORIES.length}`);
  console.log(`   - Documents: ${MOCK_DOCUMENTS.length}`);
  console.log(`   - Folders: ${FOLDER_STRUCTURE.length}`);
  console.log(`   - Folder-Document Links: ${folderDocumentLinks.length}`);
  console.log('');
  console.log('📁 Folder Structure:');
  console.log('   - Equipo (with documents and Proyecto subfolder)');
  console.log('   - Proyecto (with 5 category folders)');
  console.log('   - Recursos (with documents)');
  console.log('');
  console.log('📄 Documents by Category:');
  console.log(`   - getting-started: ${MOCK_DOCUMENTS.filter((d) => d.category === 'getting-started').length}`);
  console.log(`   - architecture: ${MOCK_DOCUMENTS.filter((d) => d.category === 'architecture').length}`);
  console.log(`   - api-reference: ${MOCK_DOCUMENTS.filter((d) => d.category === 'api-reference').length}`);
  console.log(`   - guides: ${MOCK_DOCUMENTS.filter((d) => d.category === 'guides').length}`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
