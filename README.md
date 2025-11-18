# 🐼 Ailurus

<div align="center">

![Ailurus Logo](./logo.png)

**Documentation that evolves with your code**

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![NestJS](https://img.shields.io/badge/Backend-NestJS-E0234E?logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Astro](https://img.shields.io/badge/Frontend-Astro-FF5D01?logo=astro&logoColor=white)](https://astro.build/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![SQLite](https://img.shields.io/badge/Database-SQLite-003B57?logo=sqlite&logoColor=white)](https://www.sqlite.org/)

</div>

---

## 🚀 About Ailurus

**Ailurus** is a modern, real-time documentation framework built with Astro and NestJS. It combines the simplicity of Markdown with powerful features like live collaboration, full-text search, and an elegant developer experience.

Named after the scientific genus of the red panda (_Ailurus fulgens_), this project brings the same charm and agility to your documentation workflow.

### ✨ Key Features

- **📝 Inline Editing**: Obsidian-style Markdown editor with live preview
- **👥 Real-time Collaboration**: See who's viewing and editing with WebSocket presence
- **🔍 Powerful Search**: Full-text search powered by SQLite FTS5
- **💾 Auto-save & Drafts**: Never lose your work with automatic draft system
- **🎨 Beautiful UI**: Dark mode, responsive design inspired by Vercel and NestJS docs
- **⚡ Fast & Lightweight**: Optimized performance with Astro SSR
- **🖼️ Image Upload**: Local storage with automatic optimization
- **📊 Analytics**: Track document views and usage (basic)

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────┐
│          Frontend (Astro SSR)               │
│  - Server-Side Rendering                    │
│  - Markdown rendering                       │
│  - SimpleMDE editor                         │
│  - Mermaid diagrams                         │
│  - Syntax highlighting                      │
└─────────────┬───────────────────────────────┘
              │ REST API + WebSocket
              │
┌─────────────▼───────────────────────────────┐
│          Backend (NestJS)                   │
│  - REST API endpoints                       │
│  - WebSocket Gateway (presence)             │
│  - Prisma ORM                               │
│  - File upload handling                     │
└─────────────┬───────────────────────────────┘
              │
┌─────────────▼───────────────────────────────┐
│        Database (SQLite)                    │
│  - Document storage                         │
│  - FTS5 full-text search                    │
│  - Analytics logs                           │
└─────────────────────────────────────────────┘
```

### Tech Stack

| Layer    | Technology                       |
| -------- | -------------------------------- |
| Frontend | Astro 4.x, TypeScript, SimpleMDE |
| Backend  | NestJS, Prisma, WebSocket        |
| Database | SQLite with FTS5                 |
| Styling  | CSS Modules, Dark mode support   |
| Tools    | pnpm, ESLint, Prettier, Git      |

---

## 🎯 Project Status

**Current Version**: POC v0.1 (In Development)

### POC Features ✅

- ✅ Basic inline editor
- ✅ Draft system with auto-save
- ✅ WebSocket user presence
- ✅ FTS5 search
- ✅ Image upload & optimization
- ✅ Hybrid navigation (scroll + tabs)
- ✅ Basic analytics
- ✅ Dark mode
- ✅ Collapsible sidebar + sticky TOC

### Roadmap 🗺️

**v0.5** (Coming Soon)

- Enhanced editor
- Review system with basic roles
- Document versioning
- Search suggestions
- Analytics dashboard

**v1.0** (Future)

- Advanced editor (TipTap/ProseMirror)
- Real-time text collaboration
- Full RBAC
- Performance optimizations
- Advanced caching

**v2.0** (Vision)

- Multi-language (i18n)
- Semantic search
- OAuth integrations
- CDN for assets
- Multi-project support

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and pnpm
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/amoralr/ailurus.git
cd ailurus

# Install backend dependencies
cd backend
pnpm install

# Setup database
pnpm prisma migrate dev
pnpm prisma db seed

# Start backend (port 3000)
pnpm start:dev

# In another terminal, install frontend dependencies
cd ../frontend
pnpm install

# Start frontend (port 4321)
pnpm dev
```

### Access

- **Frontend**: http://localhost:4321
- **Backend API**: http://localhost:3000
- **API Docs**: http://localhost:3000/api
- **Prisma Studio**: `pnpm prisma studio` (port 5555)

---

## 📚 Documentation

Comprehensive documentation is available in the `/docs` folder:

- [**ARCHITECTURE.md**](./ARCHITECTURE.md) - System architecture overview
- [**SETUP_GUIDE.md**](./docs/SETUP_GUIDE.md) - Detailed setup instructions
- [**API_CONTRACTS.md**](./docs/API_CONTRACTS.md) - REST API documentation
- [**ROADMAP.md**](./docs/ROADMAP.md) - Feature priorities and timeline
- [**BRANDING.md**](./BRANDING.md) - Brand identity and design system
- [**BACKEND_ARCHITECTURE.md**](./docs/BACKEND_ARCHITECTURE.md) - Backend structure
- [**FRONTEND_ARCHITECTURE.md**](./docs/FRONTEND_ARCHITECTURE.md) - Frontend structure
- [**PRISMA_SCHEMA.md**](./docs/PRISMA_SCHEMA.md) - Database schema documentation

---

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Follow existing code patterns
- Run ESLint and Prettier before committing
- Write meaningful commit messages
- Add tests for new features

---

## 📦 Package Structure

```
ailurus/
├── backend/          # NestJS API
│   ├── src/
│   ├── prisma/
│   └── package.json
├── frontend/         # Astro SSR
│   ├── src/
│   ├── public/
│   └── package.json
├── docs/            # Documentation
├── .github/         # GitHub workflows
├── logo.png         # Pixel art logo
└── README.md
```

---

## 🎨 Branding

Ailurus features a unique **pixel art red panda mascot** that reflects our retro-modern aesthetic.

- **Color Palette**: Red (#E63946), Orange (#F77F00), Brown (#774936)
- **Style**: 16-bit pixel art, nostalgic gaming vibes
- **Philosophy**: Professional yet approachable, technical yet friendly

See [BRANDING.md](./BRANDING.md) for complete brand guidelines.

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](./LICENSE) file for details.

```
MIT License

Copyright (c) 2025 Ailurus

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

---

## 🌟 Acknowledgments

- **Astro** - For the amazing SSR framework
- **NestJS** - For the elegant backend architecture
- **Prisma** - For the type-safe ORM
- **SimpleMDE** - For the Markdown editor
- **Red Pandas** - For being awesome 🐼

---

## 📞 Contact & Links

- **Website**: [ailurus.dev](https://ailurus.dev) (coming soon)
- **GitHub**: [@amoralr/ailurus](https://github.com/amoralr/ailurus)
- **Issues**: [GitHub Issues](https://github.com/amoralr/ailurus/issues)
- **Discussions**: [GitHub Discussions](https://github.com/amoralr/ailurus/discussions)

---

<div align="center">

**Built with ❤️ and pixel art**

⭐ Star us on GitHub if you like this project!

</div>
