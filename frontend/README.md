# 🎨 Ailurus Frontend

> Modern documentation framework built with Astro, React, and shadcn/ui

Frontend application for Ailurus documentation system featuring server-side rendering, markdown editing, and real-time search with a focus on accessibility and performance.

---

## 📋 Table of Contents

- [Tech Stack](#-tech-stack)
- [Features](#-features)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Development Guide](#-development-guide)
- [Available Scripts](#-available-scripts)
- [Design System](#-design-system)
- [Mock Data](#-mock-data)
- [Contributing](#-contributing)
- [Documentation](#-documentation)

---

## 🚀 Tech Stack

| Technology       | Version | Purpose                                 |
| ---------------- | ------- | --------------------------------------- |
| **Astro**        | 5.15.9  | SSR framework with Islands Architecture |
| **React**        | 19.2.0  | Interactive UI components               |
| **TypeScript**   | Latest  | Type-safe development                   |
| **Tailwind CSS** | 3.4.18  | Utility-first styling                   |
| **shadcn/ui**    | Latest  | Accessible component library            |
| **Nanostores**   | 1.0.1   | Lightweight state management            |
| **Shiki**        | 3.15.0  | Syntax highlighting                     |
| **Marked**       | 17.0.0  | Markdown parsing                        |
| **Lucide React** | 0.554.0 | Icon library                            |

---

## ✨ Features

### Core Functionality

- ✅ **Markdown Editor**: Real-time WYSIWYG editing with toolbar
- ✅ **Search System**: Client-side full-text search with debouncing
- ✅ **Document Management**: List, view, create, and edit documents
- ✅ **Syntax Highlighting**: Code blocks with Shiki (multiple languages)
- ✅ **Auto-save**: Draft persistence with localStorage

### UI/UX

- ✅ **Responsive Design**: Mobile-first approach
- ✅ **Dark Mode**: Theme toggle with system preference detection
- ✅ **Accessibility**: WCAG 2.2 AA compliant
- ✅ **Loading States**: Skeleton components for better UX
- ✅ **Animations**: Smooth transitions respecting `prefers-reduced-motion`

### SEO & Performance

- ✅ **SEO Optimized**: Open Graph, Twitter Cards, structured data (JSON-LD)
- ✅ **Static Generation**: 49+ pages pre-rendered at build time
- ✅ **Code Splitting**: Automatic chunking for optimal performance

---

## 🏃 Getting Started

### Prerequisites

- **Node.js**: >= 18.x
- **pnpm**: >= 8.x (recommended package manager)

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd documetation/frontend

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env

# Start development server
pnpm run dev
```

The application will be available at `http://localhost:4321`

### Environment Setup

The frontend can run in two modes:

#### Mock Mode (Development)

Uses static data from `src/mocks/`.

```bash
# In .env
PUBLIC_USE_MOCKS=true
pnpm dev
```

#### API Mode (Production)

Connects to NestJS backend.

```bash
# In .env
PUBLIC_USE_MOCKS=false
pnpm dev
```

**Environment Variables**:

| Variable                   | Description        | Default                      |
| -------------------------- | ------------------ | ---------------------------- |
| `PUBLIC_API_URL`           | Backend API URL    | `http://localhost:3000`      |
| `PUBLIC_WS_URL`            | WebSocket URL      | `ws://localhost:3000`        |
| `PUBLIC_USE_MOCKS`         | Use mock data      | `true` (dev), `false` (prod) |
| `PUBLIC_ENABLE_SEARCH_API` | Use backend search | `false`                      |

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/        # shadcn/ui components
│   │   └── ui/            # Button, Card, Dialog, Skeleton, etc.
│   ├── documents/         # Document management feature
│   │   ├── components/    # DocumentList
│   │   └── types/         # TypeScript types
│   ├── editor/            # Markdown editor feature
│   │   ├── components/    # MarkdownEditor.tsx
│   │   ├── services/      # editor.service.ts
│   │   └── stores/        # editor.store.ts (auto-save)
│   ├── markdown/          # Markdown rendering
│   │   ├── components/    # MarkdownRenderer.astro
│   │   └── services/      # markdown.service.ts (Shiki)
│   ├── search/            # Search system
│   │   ├── components/    # SearchBar, SearchResults
│   │   ├── services/      # search.service.ts
│   │   └── stores/        # search.store.ts
│   ├── shared/            # Shared utilities
│   │   ├── components/    # Header, Footer, Sidebar, TOC, ThemeToggle
│   │   ├── stores/        # theme.store.ts
│   │   └── utils/         # date.util.ts, slug.util.ts
│   ├── layouts/           # Page layouts
│   │   ├── Layout.astro        # Base layout with SEO
│   │   ├── DocsLayout.astro    # Documentation layout
│   │   └── EditorLayout.astro  # Editor layout
│   ├── pages/             # Astro pages (routes)
│   │   ├── index.astro         # Homepage
│   │   ├── 404.astro           # Error page
│   │   ├── docs/               # Documentation pages
│   │   │   ├── index.astro     # Docs listing
│   │   │   ├── [...slug].astro # Dynamic doc pages
│   │   │   └── new.astro       # Create new doc
│   │   └── search/
│   │       └── index.astro     # Search page
│   ├── styles/            # Global styles
│   │   ├── global.css          # Tailwind + shadcn/ui variables
│   │   └── themes/             # light.css, dark.css
│   └── mocks/             # Mock data (POC only)
│       └── documents.mock.ts
├── public/                # Static assets
├── astro.config.mjs       # Astro configuration
├── tailwind.config.mjs    # Tailwind configuration
├── components.json        # shadcn/ui configuration
└── package.json
```

---

## 💻 Development Guide

### Adding a New Component

1. **shadcn/ui components**:

```bash
npx shadcn@latest add [component-name]
```

2. **Custom components**:

```tsx
// src/components/MyComponent.tsx
import { Button } from "@/components/ui/button";

export function MyComponent() {
  return <Button>Click me</Button>;
}
```

### Using State Management

```tsx
// Use Nanostores in React components
import { useStore } from "@nanostores/react";
import { searchStore } from "@/search/stores/search.store";

export function SearchBar() {
  const state = useStore(searchStore);
  return <input value={state.query} />;
}
```

### Styling Guidelines

- Use **Tailwind CSS** utility classes
- Use **shadcn/ui** design tokens (e.g., `bg-background`, `text-foreground`)
- Avoid hardcoded colors - use CSS variables from `global.css`
- Responsive: Mobile-first (`md:`, `lg:` breakpoints)

---

## 🎨 Design System

### Brand Colors (Ailurus Red Panda Theme)

```css
/* Defined in src/styles/global.css */
--ailurus-red: #e63946; /* Primary red */
--ailurus-orange: #f77f00; /* Accent orange */
```

### shadcn/ui Tokens

All components use CSS variables for theming:

```css
/* Light mode */
--background: 0 0% 100%;
--foreground: 240 10% 3.9%;
--primary: 346 77% 57%; /* Ailurus red */
--secondary: 25 95% 53%; /* Ailurus orange */

/* Dark mode */
.dark {
  --background: 240 10% 3.9%;
  --foreground: 0 0% 98%;
}
```

### Accessibility

- **WCAG 2.2 AA** compliance achieved
- All interactive elements have proper focus states
- Aria-labels on toolbar buttons and form controls
- Keyboard navigation supported
- Respects `prefers-reduced-motion`

---

## 📜 Available Scripts

```bash
# Development
pnpm dev              # Start dev server at localhost:4321

# Build
pnpm build            # Build for production (static site)
pnpm preview          # Preview production build

# Astro CLI
pnpm astro --help     # View all Astro commands
```

---

## 🗂️ Mock Data

The frontend currently uses **mock data** (`src/mocks/documents.mock.ts`) to simulate backend responses.

### Modifying Mock Data

1. Edit `src/mocks/documents.mock.ts`
2. Add/remove documents
3. Run `pnpm build` to regenerate static pages

**Note**: When backend is ready, replace mock services with API calls.

---

## 🤝 Contributing

### Development Workflow

1. Create a branch: `git checkout -b feature/my-feature`
2. Make changes following code style
3. Test locally: `pnpm dev`
4. Build: `pnpm build` (verify no errors)
5. Commit with descriptive messages
6. Open Pull Request

### Code Style

- **TypeScript**: Strict mode enabled
- **Formatting**: Prettier (automatic)
- **Components**: Functional with TypeScript
- **Naming**: PascalCase for components, camelCase for utilities

### File Naming Conventions

- `.astro` - SSR/static components
- `.tsx` - React interactive components
- `.ts` - Business logic, stores, utilities
- `.store.ts` - Nanostores state
- `.service.ts` - API/data services
- `.util.ts` - Utility functions

---

## 📚 Documentation

### Internal Documentation

- **Architecture**: `ARCHITECTURE.md` (root)
- **Frontend Architecture**: `docs/FRONTEND_ARCHITECTURE.md`
- **Workplan**: `docs/WORKPLAN_FRONTEND_MOCK.md`
- **Style Audit**: `frontend/STYLE_AUDIT.md`

### External Resources

- [Astro Documentation](https://docs.astro.build)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Nanostores](https://github.com/nanostores/nanostores)

---

## 🐛 Known Issues

- ⚠️ **Vite Warning**: Large chunks from Shiki grammars (expected, heavily gzipped)
- ⚠️ **Mock Data**: Limited to 15+ documents, no pagination
- ⚠️ **No Backend**: API calls return mock responses

---

## 📝 Roadmap

### Phase 6: Polish & Refinement ✅ (Completed)

- [x] Custom 404 page
- [x] Loading states (skeletons)
- [x] SEO meta tags (Open Graph, Twitter Cards, JSON-LD)
- [x] Page transitions and animations
- [x] Development README

### Phase 7: Backend Integration (Next)

- [ ] Replace mock services with API calls
- [ ] WebSocket for real-time presence
- [ ] Image upload to backend
- [ ] User authentication

### Phase 8: Advanced Features

- [ ] Server-side search
- [ ] Real-time collaborative editing
- [ ] Markdown editor upgrade (TipTap)
- [ ] Analytics dashboard

---

**Status**: ✅ POC Complete - Ready for Backend Integration  
**Version**: 0.1.0  
**Last Updated**: January 2025

---

**Happy coding! 🦝✨**
