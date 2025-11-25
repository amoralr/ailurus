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

// Subset of documents from mocks (showing structure)
const MOCK_DOCUMENTS = [
  {
    id: 1,
    slug: 'instalacion',
    title: 'Guía de Instalación',
    excerpt: 'Pasos para instalar y configurar Ailurus en tu entorno local.',
    category: 'getting-started',
    subcategory: 'Primeros Pasos',
    path: 'Equipo/Proyecto/Getting Started/Primeros Pasos/Guía de Instalación',
    status: 'PUBLISHED' as const,
    createdBy: 'Antonio Moral',
    content: `# Guía de Instalación

Bienvenido a la guía de instalación de Ailurus.

## Requisitos Previos

- Node.js 18+
- pnpm 8+
- PostgreSQL 14+

## Instalación

\`\`\`bash
# Clonar repositorio
git clone https://github.com/amoralr/ailurus.git
cd ailurus

# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.example .env

# Ejecutar migraciones
pnpm prisma migrate dev

# Iniciar desarrollo
pnpm dev
\`\`\`

## Verificación

Abre tu navegador en \`http://localhost:4321\` para verificar que todo funciona correctamente.`,
  },
  {
    id: 2,
    slug: 'quick-start',
    title: 'Quick Start',
    excerpt: 'Inicia rápidamente con Ailurus en 5 minutos.',
    category: 'getting-started',
    subcategory: 'Primeros Pasos',
    path: 'Equipo/Proyecto/Getting Started/Primeros Pasos/Quick Start',
    status: 'PUBLISHED' as const,
    createdBy: 'Antonio Moral',
    content: `# Quick Start

Guía rápida para comenzar con Ailurus en 5 minutos.

## 1. Instalar

\`\`\`bash
pnpm install
\`\`\`

## 2. Configurar

\`\`\`bash
cp .env.example .env
\`\`\`

## 3. Ejecutar

\`\`\`bash
pnpm dev
\`\`\`

¡Listo! Ya puedes comenzar a crear documentos.`,
  },
  {
    id: 4,
    slug: 'arquitectura',
    title: 'Arquitectura del Sistema',
    excerpt: 'Visión general de la arquitectura de Ailurus.',
    category: 'architecture',
    subcategory: null,
    path: 'Equipo/Proyecto/Architecture/Arquitectura del Sistema',
    status: 'PUBLISHED' as const,
    createdBy: 'Antonio Moral',
    content: `# Arquitectura del Sistema

Ailurus sigue una arquitectura moderna de 3 capas:

## Capas

1. **Frontend**: Astro + React + TypeScript
2. **Backend**: NestJS + Prisma
3. **Database**: PostgreSQL

## Flujo de Datos

\`\`\`mermaid
graph LR
  A[Frontend] --> B[Backend API]
  B --> C[Database]
\`\`\``,
  },
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

Bienvenido a la sección del equipo Ailurus.

## Misión

Crear una plataforma de documentación moderna, accesible y fácil de usar.`,
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
];

// Folder structure (simplified from MOCK_FOLDERS)
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
  // Equipo > File
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
  // Equipo > Proyecto
  {
    id: 3,
    name: 'Proyecto',
    type: FolderType.FOLDER,
    icon: '📦',
    path: 'Equipo/Proyecto',
    order: 2,
    parentId: 1,
  },
  // Proyecto > Getting Started
  {
    id: 4,
    name: 'Getting Started',
    type: FolderType.FOLDER,
    icon: '🚀',
    path: 'Equipo/Proyecto/Getting Started',
    order: 1,
    parentId: 3,
  },
  // Getting Started > Primeros Pasos
  {
    id: 5,
    name: 'Primeros Pasos',
    type: FolderType.FOLDER,
    icon: '👣',
    path: 'Equipo/Proyecto/Getting Started/Primeros Pasos',
    order: 2,
    parentId: 4,
  },
  // Primeros Pasos > Files
  {
    id: 6,
    name: 'Guía de Instalación',
    type: FolderType.FILE,
    icon: null,
    path: 'Equipo/Proyecto/Getting Started/Primeros Pasos/Guía de Instalación',
    order: 1,
    parentId: 5,
    documentSlug: 'instalacion',
  },
  {
    id: 7,
    name: 'Quick Start',
    type: FolderType.FILE,
    icon: null,
    path: 'Equipo/Proyecto/Getting Started/Primeros Pasos/Quick Start',
    order: 2,
    parentId: 5,
    documentSlug: 'quick-start',
  },
  // Proyecto > Architecture
  {
    id: 8,
    name: 'Architecture',
    type: FolderType.FOLDER,
    icon: '🏗️',
    path: 'Equipo/Proyecto/Architecture',
    order: 2,
    parentId: 3,
  },
  // Architecture > File
  {
    id: 9,
    name: 'Arquitectura del Sistema',
    type: FolderType.FILE,
    icon: null,
    path: 'Equipo/Proyecto/Architecture/Arquitectura del Sistema',
    order: 1,
    parentId: 8,
    documentSlug: 'arquitectura',
  },
  // Proyecto > Guides
  {
    id: 10,
    name: 'Guides',
    type: FolderType.FOLDER,
    icon: '📖',
    path: 'Equipo/Proyecto/Guides',
    order: 4,
    parentId: 3,
  },
  // Guides > File
  {
    id: 11,
    name: 'Guía de Imágenes',
    type: FolderType.FILE,
    icon: null,
    path: 'Equipo/Proyecto/Guides/Guía de Imágenes',
    order: 3,
    parentId: 10,
    documentSlug: 'images-guide',
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
