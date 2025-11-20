# 🐼 Ailurus

**Documentation platform with hierarchical navigation**

Sistema de documentación moderno con Astro + NestJS + SQLite, diseñado para equipos que necesitan organizar conocimiento técnico con navegación jerárquica estilo Obsidian.

## ✨ Features

- 🗂️ **Navegación Jerárquica**: Folders anidados ilimitados estilo Obsidian
- 📝 **Editor Markdown**: Auto-save, preview en tiempo real
- 🔍 **Búsqueda Full-text**: SQLite FTS5 integrado
- 🖼️ **Lightbox para Imágenes**: Viewer con captions y accesibilidad
- 🎨 **shadcn/ui Components**: Sistema de diseño moderno con 13+ componentes
- 🌙 **Dark Mode**: Persistencia automática con localStorage
- 📊 **4 Categorías**: Getting Started, Architecture, API Reference, Guides
- ♿ **Accesibilidad**: WCAG 2.2 AA compliant

---

## 📊 Project Status

**Version**: v0.5 (In Development)  
**Frontend**: 85% complete  
**Backend**: Schema 100% defined, API endpoints pending  
**Database**: SQLite con 7 tablas en 3NF

---

## 🚀 Quick Start

### Requisitos

- Node.js 20+
- pnpm 10+

### Instalación

```bash
# 1. Clonar repositorio
git clone https://github.com/amoralr/ailurus.git
cd ailurus

# 2. Backend
cd backend
pnpm install

# Configurar SQLite
cp .env.example .env
# DATABASE_URL ya configurado: file:./database/documents.db

# Migrations y seed
pnpm prisma:migrate
pnpm prisma:seed

# Iniciar backend
pnpm dev  # http://localhost:3000

# 3. Frontend (en otra terminal)
cd ../frontend
pnpm install
pnpm dev  # http://localhost:4321
```

### Verificación

```bash
# Backend API
curl http://localhost:3000/docs

# Frontend
open http://localhost:4321

# Prisma Studio
pnpm prisma:studio  # http://localhost:5555
```

---

## 📚 Documentación

### Arquitectura

- [🏗️ ARCHITECTURE.md](./ARCHITECTURE.md) - Visión completa del sistema (backend + frontend + DB)

### Documentación Técnica

- [🗄️ Database](./docs/DATABASE.md) - Schema SQLite + Prisma (7 tablas, 3NF)
- [🗂️ Folder System](./docs/FOLDER_SYSTEM.md) - Navegación jerárquica Obsidian-style
- [🎨 Design System](./docs/DESIGN_SYSTEM.md) - shadcn/ui, iconos, colores, accesibilidad
- [📡 API](./docs/API.md) - Endpoints REST (pendiente actualizar)
- [🖥️ Frontend](./docs/FRONTEND.md) - Astro + React (pendiente actualizar)
- [⚙️ Setup](./docs/SETUP.md) - Guía de instalación (pendiente actualizar)
- [🗺️ Roadmap](./docs/ROADMAP.md) - Prioridades y timeline

---

## 📦 Tech Stack

| Capa     | Tecnología                              |
| -------- | --------------------------------------- |
| Frontend | Astro 4.x + React 18 + TypeScript 5.x   |
| UI       | shadcn/ui + Tailwind CSS + lucide-react |
| State    | Nanostores                              |
| Backend  | NestJS 10.x + Prisma 7.0.0              |
| Database | SQLite 3 (7 tablas, 3NF)                |
| Tools    | pnpm, ESLint, Prettier                  |

## 📄 License

MIT License - Copyright (c) 2025 Ailurus

## 🔗 Links

- **Repository**: [github.com/amoralr/ailurus](https://github.com/amoralr/ailurus)
- **Issues**: [GitHub Issues](https://github.com/amoralr/ailurus/issues)
