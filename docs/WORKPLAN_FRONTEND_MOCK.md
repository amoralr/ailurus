# 📋 Plan de Trabajo - Frontend Mock (Sin Backend)

**Proyecto**: Ailurus Frontend  
**Fecha inicio**: 18 de noviembre, 2025  
**Duración estimada**: 2-3 semanas  
**Enfoque**: Implementación con datos mock, sin WebSocket

---

## 🎯 **OBJETIVO**

Implementar todos los flujos del frontend con datos mock (simulados), permitiendo desarrollo y testing sin depender del backend. Excluye funcionalidades de WebSocket (presencia en tiempo real).

---

## 📦 **FASE 0: Setup y Dependencias** ✅ (COMPLETADO)

### **Tareas**

- [x] **0.1** Instalar dependencias necesarias
- [x] **0.2** Configurar Tailwind CSS
- [x] **0.3** Configurar integración de React
- [x] **0.4** Configurar shadcn/ui para Astro
- [x] **0.5** Configurar Nanostores
- [x] **0.6** Configurar TypeScript paths
- [x] **0.7** Crear estructura de carpetas completa
- [x] **0.8** Configurar tokens de diseño con branding Ailurus (colores red panda)
- [x] **0.9** Crear mock data centralizado
- [x] **0.10** Agregar logo pixel art del red panda

**Entregable**: ✅ Setup completo con shadcn/ui, dependencias instaladas, branding Ailurus y estructura base creada

---

## 🎨 **FASE 1: Sistema de Diseño Base** ✅ (COMPLETADO)

### **Tareas**

- [x] **1.1** Configurar tokens CSS con colores Ailurus (red panda)
- [x] **1.2** Implementar theme store (dark/light mode)
- [x] **1.3** Instalar componentes shadcn/ui base:
  - [x] Button (primario con ailurus-red)
  - [x] Card
  - [x] Input (para search bar)
  - [x] Dialog (para modales)
  - [x] Badge (para tags/categorías)
  - [x] Separator
- [x] **1.4** Crear utilidad cn() para clsx + tailwind-merge
- [x] **1.5** Implementar Header/Navbar global con:
  - [x] Logo pixel art del red panda (32x32 o 64x64)
  - [x] Navegación (Home, Docs) con estilo Ailurus
  - [x] Barra de búsqueda rápida (shadcn Input)
  - [x] Toggle dark mode (🌙/☀️) con animación
  - [x] Responsive con hamburger menu en mobile
- [x] **1.6** Crear layouts base
  - [x] BaseLayout.astro (incluye Header con branding)
  - [x] DocsLayout.astro
- [x] **1.7** Implementar Footer.astro con branding

### **Componentes Implementados**

- ✅ Button, Card, Input, Dialog, Badge, Separator (shadcn/ui)
- ✅ Header/Navbar con logo pixel art, navegación y dark mode toggle
- ✅ Footer con branding Ailurus
- ✅ ThemeToggle component con localStorage
- ✅ Layouts base (BaseLayout, DocsLayout)

```astro
---
// src/shared/components/layout/Header.astro
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import ThemeToggle from './ThemeToggle';
import { Menu } from 'lucide-react';
---

<header class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
  <div class="container flex h-16 items-center justify-between">
    <!-- Logo pixel art red panda + nombre -->
    <div class="flex items-center gap-3">
      <a href="/" class="flex items-center gap-2 transition-opacity hover:opacity-80">
        <img
          src="/logo-64x64.png"
          alt="Ailurus Logo"
          class="h-8 w-8"
          style="image-rendering: pixelated; image-rendering: crisp-edges;"
        />
        <span class="font-bold text-xl bg-gradient-to-r from-ailurus-red to-ailurus-orange bg-clip-text text-transparent">
          Ailurus
        </span>
      </a>
    </div>

    <!-- Navegación principal (desktop) -->
    <nav class="hidden md:flex items-center gap-6">
      <a
        href="/"
        class="text-sm font-medium transition-colors hover:text-ailurus-orange"
      >
        Inicio
      </a>
      <a
        href="/docs"
        class="text-sm font-medium transition-colors hover:text-ailurus-orange"
      >
        Documentación
      </a>
    </nav>

    <!-- Barra de búsqueda (desktop) -->
    <div class="hidden md:flex flex-1 max-w-md mx-6">
      <Input
        type="search"
        placeholder="Buscar documentación..."
        class="w-full"
      />
    </div>

    <!-- Acciones -->
    <div class="flex items-center gap-2">
      <ThemeToggle client:load />

      <!-- Mobile menu -->
      <Sheet client:load>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" class="md:hidden">
            <Menu className="h-5 w-5" />
            <span class="sr-only">Menú</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right">
          <nav class="flex flex-col gap-4 mt-8">
            <a href="/" class="text-lg font-medium hover:text-ailurus-orange transition-colors">
              Inicio
            </a>
            <a href="/docs" class="text-lg font-medium hover:text-ailurus-orange transition-colors">
              Documentación
            </a>
            <a href="/search" class="text-lg font-medium hover:text-ailurus-orange transition-colors">
              Buscar
            </a>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  </div>
</header>

<script>
  // Mobile menu toggle
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const mobileMenu = document.querySelector('[data-mobile-menu]');

  menuBtn?.addEventListener('click', () => {
    mobileMenu?.classList.toggle('open');
    menuBtn?.classList.toggle('active');
  });
</script>

<style>
  .header {
    position: sticky;
    top: 0;
    z-index: 100;
    background: var(--color-bg-primary);
    border-bottom: 1px solid var(--color-border);
    backdrop-filter: blur(10px);
  }

  .header-container {
    max-width: 1440px;
    margin: 0 auto;
    padding: 0 1rem;
    height: 64px;
    display: flex;
    align-items: center;
    gap: 2rem;
  }

  .header-brand {
    display: flex;
    align-items: center;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
    color: var(--color-text-primary);
    font-weight: 600;
    font-size: 1.25rem;
  }

  .logo-icon {
    font-size: 1.5rem;
  }

  .header-nav {
    display: flex;
    gap: 1.5rem;
  }

  .nav-link {
    color: var(--color-text-secondary);
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s;
  }

  .nav-link:hover {
    color: var(--color-accent);
  }

  .header-search {
    flex: 1;
    max-width: 400px;
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .mobile-menu-btn {
    display: none;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
  }

  .mobile-menu {
    display: none;
    background: var(--color-bg-primary);
    border-top: 1px solid var(--color-border);
    padding: 1rem;
  }

  .mobile-menu.open {
    display: block;
  }

  .mobile-nav {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .mobile-link {
    padding: 0.75rem 1rem;
    color: var(--color-text-primary);
    text-decoration: none;
    border-radius: 0.5rem;
  }

  .mobile-link:hover {
    background: var(--color-bg-secondary);
  }

  /* Responsive */
  @media (max-width: 768px) {
    .header-nav {
      display: none;
    }

    .header-search {
      display: none;
    }

    .mobile-menu-btn {
      display: block;
    }
  }
</style>
```

### **ThemeToggle Component**

```typescript
// src/shared/components/layout/ThemeToggle.tsx
import { useStore } from "@nanostores/react";
import { themeStore, toggleTheme } from "@/shared/stores/theme.store";

export default function ThemeToggle() {
  const theme = useStore(themeStore);

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label="Cambiar tema"
      title={theme === "light" ? "Modo oscuro" : "Modo claro"}
    >
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
}
```

```css
/* En global.css o Header styles */
.theme-toggle {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  transition: background 0.2s;
}

.theme-toggle:hover {
  background: var(--color-bg-secondary);
}
```

**Entregable**: ✅ Sistema de diseño funcional con componentes UI reutilizables y navbar completo

---

## 🏠 **FASE 2: Homepage** ✅ (COMPLETADO)

### **Tareas**

- [x] **2.1** Crear página index.astro
- [x] **2.2** Implementar Hero section
- [x] **2.3** Implementar Features section
- [x] **2.4** Implementar Quick links a documentos mock
- [x] **2.5** Integrar dark mode toggle
- [x] **2.6** Hacer responsive

### **Secciones Implementadas**

- ✅ Hero section con framework description, features bullets, code preview y CTAs
- ✅ Features grid con 6 tarjetas (Markdown, Búsqueda, Editor, Performance, Versionado, Colaboración)
- ✅ Popular Docs section con 3 cards de mock data
- ✅ Diseño responsive completo

**Entregable**: ✅ Homepage funcional con branding Ailurus, Hero section, Features grid, Popular Docs y diseño responsive

---

## 📚 **FASE 3: Sistema de Documentación** ✅ (COMPLETADO)

### **3.1 Lista de Documentos** `/docs` ✅ (COMPLETADO)

#### **Tareas**

- [x] **3.1.1** Crear página docs/index.astro
- [x] **3.1.2** Implementar Sidebar con categorías mock
- [x] **3.1.3** Implementar lista de documentos
- [x] **3.1.4** Agregar filtrado por categoría
- [x] **3.1.5** Hacer responsive (sidebar colapsable)

### **3.2 Vista de Documento** `/docs/:slug` ✅ (COMPLETADO)

#### **Tareas**

- [x] **3.2.1** Crear página docs/[...slug].astro con routing dinámico
- [x] **3.2.2** Implementar servicio de Markdown rendering
- [x] **3.2.3** Implementar CodeBlock.astro con syntax highlighting
- [x] **3.2.4** Implementar TOC (Table of Contents) auto-generado
- [x] **3.2.5** Implementar scroll spy para TOC
- [x] **3.2.6** Agregar botón "Editar" (link a /docs/:slug/edit)
- [x] **3.2.7** Agregar navegación prev/next

### **3.3 Componentes de Layout** ✅ (COMPLETADO)

#### **Tareas**

- [x] **3.3.1** Crear Sidebar.astro con categorías colapsables
- [x] **3.3.2** Crear TOC.astro auto-generado desde headings con scroll spy
- [x] **3.3.3** Hacer ambos componentes responsive (sidebar mobile con toggle)

**Entregable**: ✅ Sistema completo de documentación navegable con mock data, 15 documentos en 4 categorías

---

## 🔍 **FASE 4: Búsqueda** (2 días)

### **Tareas**

- [ ] **4.1** Crear página search/index.astro
- [ ] **4.2** Implementar SearchBar.tsx con debounce
- [ ] **4.3** Implementar búsqueda client-side en mock data
- [ ] **4.4** Implementar highlighting de términos
- [ ] **4.5** Crear store de búsqueda (search.store.ts)
- [ ] **4.6** Implementar "sin resultados" state
- [ ] **4.7** Agregar SearchBar en Header global

**Entregable**: Búsqueda funcional con filtrado client-side en mock data

---

## ✏️ **FASE 5: Editor Básico** (3-4 días)

### **Tareas**

- [ ] **5.1** Instalar SimpleMDE o alternativa ligera
- [ ] **5.2** Crear página docs/[slug]/edit.astro
- [ ] **5.3** Implementar EditorLayout.astro
- [ ] **5.4** Crear SimpleMDEditor.tsx
- [ ] **5.5** Implementar auto-save mock (localStorage)
- [ ] **5.6** Implementar preview side-by-side
- [ ] **5.7** Crear editor.store.ts para estado
- [ ] **5.8** Implementar botones Guardar/Publicar/Cancelar
- [ ] **5.9** Agregar confirmación al salir con cambios sin guardar

**Entregable**: Editor funcional con auto-save en localStorage y preview

---

## 🎨 **FASE 6: Polish y Refinamiento** (2-3 días)

### **Tareas**

- [ ] **6.1** Mejorar estilos responsive
- [ ] **6.2** Agregar transiciones y animaciones
- [ ] **6.3** Implementar loading states
- [ ] **6.4** Agregar página 404
- [ ] **6.5** Mejorar accesibilidad (a11y)
  - [ ] ARIA labels
  - [ ] Keyboard navigation
  - [ ] Focus management
- [ ] **6.6** Agregar meta tags para SEO
- [ ] **6.7** Testing manual de todos los flujos
- [ ] **6.8** Documentar componentes (comentarios)
- [ ] **6.9** Crear README con instrucciones de desarrollo

**Entregable**: Aplicación pulida y lista para integración con backend

---

## 📦 **ENTREGABLES FINALES**

### **Funcionalidades Implementadas**

✅ Homepage con hero y features  
✅ Lista de documentos con categorías  
✅ Vista de documento con TOC y navegación  
❌ Búsqueda funcional client-side  
❌ Editor básico con auto-save y preview  
✅ Dark mode con persistencia  
✅ Diseño responsive  
✅ Componentes UI reutilizables

### **Mock Data Incluido**

- 10-15 documentos de ejemplo
- 4-5 categorías
- Contenido Markdown variado (headers, lists, code, links)

### **Estructura de Archivos Final**

```
frontend/
├── src/
│   ├── documents/
│   │   ├── components/
│   │   │   ├── DocumentList.astro
│   │   │   └── DocumentMeta.astro
│   │   └── pages/
│   │       ├── index.astro
│   │       └── [...slug].astro
│   │
│   ├── editor/
│   │   ├── components/
│   │   │   └── MarkdownEditor.tsx
│   │   ├── services/
│   │   │   └── editor.service.ts
│   │   ├── stores/
│   │   │   └── editor.store.ts
│   │   └── pages/
│   │       └── [slug]/
│   │           └── edit.astro
│   │
│   ├── search/
│   │   ├── components/
│   │   │   ├── SearchBar.tsx
│   │   │   └── SearchResults.tsx
│   │   ├── services/
│   │   │   └── search.service.ts
│   │   ├── stores/
│   │   │   └── search.store.ts
│   │   └── pages/
│   │       └── index.astro
│   │
│   ├── markdown/
│   │   ├── components/
│   │   │   ├── MarkdownRenderer.astro
│   │   │   └── CodeBlock.astro
│   │   └── services/
│   │       └── markdown.service.ts
│   │
│   ├── shared/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Header.astro
│   │   │   │   ├── Footer.astro
│   │   │   │   ├── Sidebar.astro
│   │   │   │   └── TOC.astro
│   │   │   └── ui/
│   │   │       ├── Button.astro
│   │   │       ├── Card.astro
│   │   │       └── Modal.tsx
│   │   ├── stores/
│   │   │   └── theme.store.ts
│   │   └── utils/
│   │       ├── date.util.ts
│   │       └── string.util.ts
│   │
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   ├── DocsLayout.astro
│   │   └── EditorLayout.astro
│   │
│   ├── mocks/
│   │   ├── documents.mock.ts
│   │   ├── search.mock.ts
│   │   └── index.ts
│   │
│   ├── pages/
│   │   ├── index.astro
│   │   └── 404.astro
│   │
│   └── styles/
│       ├── global.css
│       ├── tokens.css
│       └── themes/
│           ├── light.css
│           └── dark.css
│
├── public/
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
└── package.json
```

---

## ⏱️ **CRONOGRAMA ESTIMADO**

| Fase                      | Duración | Días  | Estado |
| ------------------------- | -------- | ----- | ------ |
| Fase 0: Setup             | 1-2 días | 1-2   | ✅     |
| Fase 1: Sistema de Diseño | 2-3 días | 3-5   | ✅     |
| Fase 2: Homepage          | 1 día    | 6     | ✅     |
| Fase 3: Documentación     | 3-4 días | 7-10  | ✅     |
| Fase 4: Búsqueda          | 2 días   | 11-12 | ⏸️     |
| Fase 5: Editor            | 3-4 días | 13-16 | ⏸️     |
| Fase 6: Polish            | 2-3 días | 17-19 | ⏸️     |

**Total**: 14-19 días laborables (2-3 semanas)  
**Completado**: 7-10 días (Fases 0, 1, 2, 3) ✅

---

## 🚀 **SIGUIENTES PASOS POST-MOCK**

Una vez completado el frontend con mocks:

1. **Integración con Backend**

   - Reemplazar mock services con API calls reales
   - Implementar error handling
   - Agregar retry logic

2. **WebSocket**

   - Implementar presencia en tiempo real
   - Agregar PresenceIndicator.tsx
   - Conectar con WebSocket Gateway

3. **Features Avanzadas**
   - Upload de imágenes real
   - Autenticación JWT
   - Roles y permisos

---

## 📝 **NOTAS IMPORTANTES**

### **Exclusiones de este Plan**

❌ WebSocket y presencia en tiempo real  
❌ Upload real de imágenes (usar URLs mock)  
❌ Autenticación y autorización  
❌ Analytics tracking real  
❌ Backend API calls reales

### **Ventajas del Enfoque Mock**

✅ Desarrollo rápido sin depender del backend  
✅ Testing de UX y flujos sin latencia  
✅ Fácil transición a API real después  
✅ Permite iterar rápido en diseño

### **Testing Recomendado**

- [x] Navegación entre páginas
- [x] Dark mode toggle y persistencia
- [x] Sistema de documentación completo
- [x] Markdown rendering con syntax highlighting
- [x] TOC con scroll spy
- [ ] Búsqueda con diferentes queries
- [ ] Editor: escribir, guardar, cancelar
- [x] Responsive en mobile, tablet, desktop
- [ ] Accesibilidad básica (keyboard navigation)

---

**Última actualización**: 19 de noviembre, 2025  
**Versión**: 1.2.0 - Fases 0, 1, 2, 3 completadas

---

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Search, Users, Palette, Code, Smartphone } from 'lucide-react';
import { MOCK_DOCUMENTS } from '@/mocks';

const popularDocs = MOCK_DOCUMENTS.slice(0, 3);

const features = [
{
icon: FileText,
title: "Edición en tiempo real",
description: "Editor Markdown con preview instantáneo"
},
{
icon: Search,
title: "Búsqueda potente",
description: "Búsqueda full-text en toda la documentación"
},
{
icon: Users,
title: "Colaboración",
description: "Múltiples usuarios trabajando juntos"
},
{
icon: Palette,
title: "Dark mode",
description: "Interfaz adaptable a tus preferencias"
},
{
icon: Code,
title: "Markdown editor",
description: "Escribe en Markdown con preview"
},
{
icon: Smartphone,
title: "Responsive design",
description: "Funciona en mobile, tablet y desktop"
}
];

---

<BaseLayout title="Ailurus - Documentation that evolves with your code">
  <main class="flex flex-col">
    <!-- Hero Section - Framework Overview -->
    <section class="py-20 px-4 bg-gradient-to-br from-background via-background to-ailurus-cream/20 dark:to-ailurus-dark/20">
      <div class="container mx-auto max-w-6xl">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <!-- Left: Framework Info -->
          <div>
            <Badge variant="secondary" class="mb-4">
              Open Source Framework
            </Badge>

            <h1 class="text-4xl md:text-5xl font-bold mb-6">
              El framework de documentación que
              <span class="bg-gradient-to-r from-ailurus-red via-ailurus-orange to-ailurus-red bg-clip-text text-transparent">
                evoluciona con tu código
              </span>
            </h1>

            <p class="text-lg text-muted-foreground mb-6">
              Ailurus es un framework moderno construido con <strong>Astro</strong> y <strong>NestJS</strong>
              que combina la simplicidad de Markdown con la potencia de la colaboración en tiempo real.
            </p>

            <div class="flex flex-col gap-3 mb-8">
              <div class="flex items-center gap-2 text-muted-foreground">
                <div class="h-1.5 w-1.5 rounded-full bg-ailurus-orange"></div>
                <span>SSR ultrarrápido con Astro para SEO perfecto</span>
              </div>
              <div class="flex items-center gap-2 text-muted-foreground">
                <div class="h-1.5 w-1.5 rounded-full bg-ailurus-orange"></div>
                <span>Backend escalable con NestJS y TypeScript</span>
              </div>
              <div class="flex items-center gap-2 text-muted-foreground">
                <div class="h-1.5 w-1.5 rounded-full bg-ailurus-orange"></div>
                <span>Búsqueda full-text con SQLite FTS5</span>
              </div>
              <div class="flex items-center gap-2 text-muted-foreground">
                <div class="h-1.5 w-1.5 rounded-full bg-ailurus-orange"></div>
                <span>Deploy simple: Docker, Node.js o estático</span>
              </div>
            </div>

            <div class="flex gap-4 flex-wrap">
              <Button size="lg" class="bg-ailurus-red hover:bg-ailurus-red/90">
                <a href="/docs">Comenzar</a>
              </Button>
              <Button size="lg" variant="outline">
                <a href="/docs/architecture">Ver Arquitectura</a>
              </Button>
            </div>
          </div>

          <!-- Right: Code Preview -->
          <div class="relative">
            <Card class="bg-card/50 backdrop-blur">
              <CardHeader>
                <div class="flex items-center gap-2 text-sm text-muted-foreground">
                  <div class="flex gap-1.5">
                    <div class="h-3 w-3 rounded-full bg-red-500"></div>
                    <div class="h-3 w-3 rounded-full bg-yellow-500"></div>
                    <div class="h-3 w-3 rounded-full bg-green-500"></div>
                  </div>
                  <span>Quick Start</span>
                </div>
              </CardHeader>
              <CardContent>
                <pre class="text-sm overflow-x-auto"><code class="language-bash">{`# Instalar Ailurus CLI

npm install -g ailurus

# Crear nuevo proyecto

ailurus init my-docs

# Iniciar servidor de desarrollo

cd my-docs
ailurus dev

# ¡Listo! 🚀

# Abre http://localhost:4321`}</code></pre>

              </CardContent>
            </Card>

            <!-- Decorative elements -->
            <div class="absolute -z-10 top-10 -right-10 h-72 w-72 rounded-full bg-ailurus-orange/10 blur-3xl"></div>
            <div class="absolute -z-10 -bottom-10 -left-10 h-72 w-72 rounded-full bg-ailurus-red/10 blur-3xl"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20 px-4">
      <div class="container mx-auto max-w-6xl">
        <h2 class="text-3xl font-bold text-center mb-12">
          Características Principales
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Card class="hover:shadow-lg transition-all duration-200 border-ailurus-cream dark:border-border">
              <CardHeader>
                <div class="flex items-center gap-3">
                  <div class="p-2 rounded-lg bg-ailurus-orange/10">
                    <feature.icon className="h-6 w-6 text-ailurus-orange" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>

    <!-- Documentos Populares -->
    <section class="py-20 px-4 bg-muted/30">
      <div class="container mx-auto max-w-6xl">
        <h2 class="text-3xl font-bold text-center mb-12">
          Documentos Populares
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularDocs.map((doc) => (
            <a href={`/docs/${doc.slug}`} class="group">
              <Card class="h-full hover:shadow-xl transition-all duration-200 hover:border-ailurus-orange">
                <CardHeader>
                  <div class="flex items-center justify-between mb-2">
                    <Badge variant="secondary">{doc.category}</Badge>
                  </div>
                  <CardTitle className="group-hover:text-ailurus-orange transition-colors">
                    {doc.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p class="text-muted-foreground line-clamp-3">
                    {doc.content.slice(0, 150)}...
                  </p>
                  <p class="text-sm text-muted-foreground mt-4">
                    Actualizado: {new Date(doc.updatedAt).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      </div>
    </section>

  </main>
</BaseLayout>
```

**Entregable**: ✅ Homepage funcional con branding Ailurus, Hero section, Features grid, Popular Docs y diseño responsive

---

## 📚 **FASE 3: Sistema de Documentación** (3-4 días)

### **3.1 Lista de Documentos** `/docs` (1 día)

#### **Tareas**

- [ ] **3.1.1** Crear página docs/index.astro
- [ ] **3.1.2** Implementar Sidebar con categorías mock
- [ ] **3.1.3** Implementar lista de documentos
- [ ] **3.1.4** Agregar filtrado por categoría
- [ ] **3.1.5** Hacer responsive (sidebar colapsable)

#### **Archivos**

```astro
---
// src/documents/pages/index.astro
import DocsLayout from '@/layouts/DocsLayout.astro';
import Sidebar from '@/shared/components/layout/Sidebar.astro';
import DocumentList from '@/documents/components/DocumentList.astro';
import { MOCK_DOCUMENTS, MOCK_CATEGORIES } from '@/mocks';
---

<DocsLayout title="Documentación">
  <Sidebar slot="sidebar" categories={MOCK_CATEGORIES} />

  <main>
    <h1>Documentación</h1>
    <DocumentList documents={MOCK_DOCUMENTS} />
  </main>
</DocsLayout>
```

```astro
---
// src/documents/components/DocumentList.astro
interface Props {
  documents: typeof MOCK_DOCUMENTS;
}

const { documents } = Astro.props;
---

<div class="document-list">
  {documents.map(doc => (
    <article class="document-item">
      <a href={`/docs/${doc.slug}`}>
        <h2>{doc.title}</h2>
        <p class="excerpt">{doc.content.slice(0, 150)}...</p>
        <div class="meta">
          <span class="category">{doc.category}</span>
          <time>{new Date(doc.updatedAt).toLocaleDateString()}</time>
        </div>
      </a>
    </article>
  ))}
</div>
```

### **3.2 Vista de Documento** `/docs/:slug` (2 días)

#### **Tareas**

- [ ] **3.2.1** Crear página docs/[...slug].astro con routing dinámico
- [ ] **3.2.2** Implementar servicio de Markdown rendering
- [ ] **3.2.3** Implementar CodeBlock.astro con syntax highlighting
- [ ] **3.2.4** Implementar TOC (Table of Contents) auto-generado
- [ ] **3.2.5** Implementar scroll spy para TOC
- [ ] **3.2.6** Agregar botón "Editar" (link a /docs/:slug/edit)
- [ ] **3.2.7** Agregar navegación prev/next

#### **Markdown Service**

```typescript
// src/markdown/services/markdown.service.ts
import { marked } from "marked";
import { getHighlighter } from "shiki";

export class MarkdownService {
  private static highlighter: any;

  static async initialize() {
    this.highlighter = await getHighlighter({
      themes: ["github-dark", "github-light"],
      langs: ["javascript", "typescript", "python", "bash", "json"],
    });
  }

  static render(content: string): string {
    return marked.parse(content, {
      renderer: this.createRenderer(),
    });
  }

  static extractHeadings(content: string) {
    const headings: Array<{ id: string; text: string; level: number }> = [];
    const tokens = marked.lexer(content);

    tokens.forEach((token) => {
      if (token.type === "heading") {
        const text = token.text;
        const id = text.toLowerCase().replace(/\s+/g, "-");
        headings.push({ id, text, level: token.depth });
      }
    });

    return headings;
  }

  private static createRenderer() {
    const renderer = new marked.Renderer();

    // Headings con anchors
    renderer.heading = (text, level) => {
      const id = text.toLowerCase().replace(/\s+/g, "-");
      return `
        <h${level} id="${id}">
          <a href="#${id}" class="anchor">#</a>
          ${text}
        </h${level}>
      `;
    };

    // Code blocks con syntax highlighting
    renderer.code = (code, language) => {
      if (!this.highlighter) {
        return `<pre><code>${code}</code></pre>`;
      }

      const html = this.highlighter.codeToHtml(code, {
        lang: language || "text",
        theme: "github-dark",
      });

      return `
        <div class="code-block">
          <div class="code-header">
            <span class="language">${language || "text"}</span>
            <button class="copy-btn" data-code="${encodeURIComponent(code)}">
              Copy
            </button>
          </div>
          ${html}
        </div>
      `;
    };

    return renderer;
  }
}
```

#### **Página de Documento**

```astro
---
// src/documents/pages/[...slug].astro
import DocsLayout from '@/layouts/DocsLayout.astro';
import Sidebar from '@/shared/components/layout/Sidebar.astro';
import TOC from '@/shared/components/layout/TOC.astro';
import MarkdownRenderer from '@/markdown/components/MarkdownRenderer.astro';
import { MOCK_DOCUMENTS, MOCK_CATEGORIES } from '@/mocks';
import { MarkdownService } from '@/markdown/services/markdown.service';

const { slug } = Astro.params;

const document = MOCK_DOCUMENTS.find(doc => doc.slug === slug);

if (!document) {
  return Astro.redirect('/404');
}

await MarkdownService.initialize();
const headings = MarkdownService.extractHeadings(document.content);
---

<DocsLayout title={document.title}>
  <Sidebar slot="sidebar" categories={MOCK_CATEGORIES} currentSlug={slug} />

  <main class="document-view">
    <article>
      <header>
        <h1>{document.title}</h1>
        <div class="meta">
          <span>Actualizado: {new Date(document.updatedAt).toLocaleDateString()}</span>
          <a href={`/docs/${slug}/edit`} class="edit-link">Editar</a>
        </div>
      </header>

      <MarkdownRenderer content={document.content} />
    </article>
  </main>

  <TOC slot="toc" headings={headings} />
</DocsLayout>

<script>
  // Copy button functionality
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const target = e.target as HTMLButtonElement;
      const code = decodeURIComponent(target.dataset.code || '');
      await navigator.clipboard.writeText(code);
      target.textContent = 'Copied!';
      setTimeout(() => target.textContent = 'Copy', 2000);
    });
  });

  // Scroll spy for TOC
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = entry.target.getAttribute('id');
      const tocLink = document.querySelector(`a[href="#${id}"]`);

      if (entry.isIntersecting) {
        tocLink?.classList.add('active');
      } else {
        tocLink?.classList.remove('active');
      }
    });
  }, { rootMargin: '-100px 0px -80% 0px' });

  document.querySelectorAll('h2, h3, h4').forEach(heading => {
    observer.observe(heading);
  });
</script>
```

### **3.3 Componentes de Layout** (1 día)

#### **Sidebar.astro**

```astro
---
// src/shared/components/layout/Sidebar.astro
interface Props {
  categories: Array<{ id: string; name: string; count: number }>;
  currentSlug?: string;
}

const { categories, currentSlug } = Astro.props;
import { MOCK_DOCUMENTS } from '@/mocks';
---

<aside class="sidebar">
  <div class="sidebar-header">
    <a href="/" class="logo">Ailurus</a>
  </div>

  <nav class="sidebar-nav">
    {categories.map(category => {
      const docs = MOCK_DOCUMENTS.filter(d => d.category === category.name);

      return (
        <details open class="category">
          <summary>
            {category.name}
            <span class="count">{category.count}</span>
          </summary>
          <ul>
            {docs.map(doc => (
              <li>
                <a
                  href={`/docs/${doc.slug}`}
                  class:list={[
                    'doc-link',
                    { active: doc.slug === currentSlug }
                  ]}
                >
                  {doc.title}
                </a>
              </li>
            ))}
          </ul>
        </details>
      );
    })}
  </nav>
</aside>

<style>
  .sidebar {
    width: 280px;
    height: 100vh;
    position: sticky;
    top: 0;
    overflow-y: auto;
    border-right: 1px solid var(--color-border);
  }

  .category summary {
    cursor: pointer;
    font-weight: 600;
    padding: 0.75rem 1rem;
  }

  .doc-link {
    display: block;
    padding: 0.5rem 1rem 0.5rem 2rem;
    color: var(--color-text-secondary);
    text-decoration: none;
  }

  .doc-link:hover {
    background: var(--color-bg-secondary);
  }

  .doc-link.active {
    color: var(--color-accent);
    background: var(--color-bg-secondary);
    font-weight: 500;
  }

  @media (max-width: 768px) {
    .sidebar {
      position: fixed;
      left: -280px;
      transition: left 0.3s;
      z-index: 100;
      background: var(--color-bg-primary);
    }

    .sidebar.open {
      left: 0;
    }
  }
</style>
```

#### **TOC.astro**

```astro
---
// src/shared/components/layout/TOC.astro
interface Props {
  headings: Array<{ id: string; text: string; level: number }>;
}

const { headings } = Astro.props;
---

<aside class="toc">
  <h4>En esta página</h4>
  <nav>
    <ul>
      {headings.map(heading => (
        <li class={`toc-item toc-level-${heading.level}`}>
          <a href={`#${heading.id}`}>{heading.text}</a>
        </li>
      ))}
    </ul>
  </nav>
  <button class="back-to-top" onclick="window.scrollTo({top: 0, behavior: 'smooth'})">
    ↑ Volver arriba
  </button>
</aside>

<style>
  .toc {
    width: 250px;
    height: 100vh;
    position: sticky;
    top: 0;
    overflow-y: auto;
    padding: 2rem 1rem;
  }

  .toc-item {
    margin: 0.25rem 0;
  }

  .toc-level-2 { padding-left: 0; }
  .toc-level-3 { padding-left: 1rem; }
  .toc-level-4 { padding-left: 2rem; }

  .toc a {
    color: var(--color-text-secondary);
    text-decoration: none;
    font-size: 0.875rem;
    line-height: 1.5;
  }

  .toc a:hover {
    color: var(--color-accent);
  }

  .toc a.active {
    color: var(--color-accent);
    font-weight: 500;
  }

  @media (max-width: 1024px) {
    .toc {
      display: none;
    }
  }
</style>
```

**Entregable**: Sistema completo de documentación navegable con mock data

---

## 🔍 **FASE 4: Búsqueda** (2 días)

### **Tareas**

- [ ] **4.1** Crear página search/index.astro
- [ ] **4.2** Implementar SearchBar.tsx con debounce
- [ ] **4.3** Implementar búsqueda client-side en mock data
- [ ] **4.4** Implementar highlighting de términos
- [ ] **4.5** Crear store de búsqueda (search.store.ts)
- [ ] **4.6** Implementar "sin resultados" state
- [ ] **4.7** Agregar SearchBar en Header global

### **Search Store**

```typescript
// src/search/stores/search.store.ts
import { map } from "nanostores";

export interface SearchResult {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
}

export const searchStore = map<{
  query: string;
  results: SearchResult[];
  isSearching: boolean;
  hasSearched: boolean;
}>({
  query: "",
  results: [],
  isSearching: false,
  hasSearched: false,
});

export function setQuery(query: string) {
  searchStore.setKey("query", query);
}

export function setResults(results: SearchResult[]) {
  searchStore.setKey("results", results);
  searchStore.setKey("hasSearched", true);
}

export function setSearching(value: boolean) {
  searchStore.setKey("isSearching", value);
}
```

### **Search Service (Mock)**

```typescript
// src/search/services/search.service.ts
import { MOCK_DOCUMENTS } from "@/mocks";
import type { SearchResult } from "../stores/search.store";

export class SearchService {
  static search(query: string): SearchResult[] {
    if (!query || query.length < 2) return [];

    const lowerQuery = query.toLowerCase();

    return MOCK_DOCUMENTS.filter(
      (doc) =>
        doc.title.toLowerCase().includes(lowerQuery) ||
        doc.content.toLowerCase().includes(lowerQuery)
    ).map((doc) => {
      // Encontrar excerpt con término
      const index = doc.content.toLowerCase().indexOf(lowerQuery);
      const start = Math.max(0, index - 50);
      const end = Math.min(doc.content.length, index + 100);
      const excerpt = doc.content.slice(start, end);

      return {
        id: doc.id,
        slug: doc.slug,
        title: doc.title,
        excerpt: this.highlight(excerpt, query),
        category: doc.category,
      };
    });
  }

  private static highlight(text: string, query: string): string {
    const regex = new RegExp(`(${query})`, "gi");
    return text.replace(regex, "<mark>$1</mark>");
  }
}
```

### **SearchBar Component**

```typescript
// src/search/components/SearchBar.tsx
import { useStore } from "@nanostores/react";
import { useState, useEffect } from "react";
import {
  searchStore,
  setQuery,
  setResults,
  setSearching,
} from "../stores/search.store";
import { SearchService } from "../services/search.service";

interface SearchBarProps {
  placeholder?: string;
  autoFocus?: boolean;
}

export function SearchBar({
  placeholder = "Buscar...",
  autoFocus = false,
}: SearchBarProps) {
  const [input, setInput] = useState("");
  const state = useStore(searchStore);

  // Debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (input !== state.query) {
        performSearch(input);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [input]);

  const performSearch = (query: string) => {
    setQuery(query);
    setSearching(true);

    // Simular delay de API
    setTimeout(() => {
      const results = SearchService.search(query);
      setResults(results);
      setSearching(false);
    }, 200);
  };

  return (
    <div className="search-bar">
      <input
        type="search"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="search-input"
      />
      {state.isSearching && <span className="search-spinner">Buscando...</span>}
    </div>
  );
}
```

### **Página de Búsqueda**

```astro
---
// src/search/pages/index.astro
import BaseLayout from '@/layouts/BaseLayout.astro';
import { SearchBar } from '../components/SearchBar';
import { SearchResults } from '../components/SearchResults';

const { q } = Astro.url.searchParams;
---

<BaseLayout title="Buscar">
  <main class="search-page">
    <div class="search-header">
      <h1>Buscar en la documentación</h1>
      <SearchBar client:load placeholder="Escribe tu búsqueda..." autoFocus />
    </div>

    <SearchResults client:load initialQuery={q} />
  </main>
</BaseLayout>
```

**Entregable**: Búsqueda funcional con filtrado client-side en mock data

---

## ✏️ **FASE 5: Editor Básico** (3-4 días)

### **Tareas**

- [ ] **5.1** Instalar SimpleMDE o alternativa ligera
- [ ] **5.2** Crear página docs/[slug]/edit.astro
- [ ] **5.3** Implementar EditorLayout.astro
- [ ] **5.4** Crear SimpleMDEditor.tsx
- [ ] **5.5** Implementar auto-save mock (localStorage)
- [ ] **5.6** Implementar preview side-by-side
- [ ] **5.7** Crear editor.store.ts para estado
- [ ] **5.8** Implementar botones Guardar/Publicar/Cancelar
- [ ] **5.9** Agregar confirmación al salir con cambios sin guardar

### **Nota sobre SimpleMDE**

SimpleMDE está descontinuado. Alternativas ligeras:

- **EasyMDE** (fork mantenido de SimpleMDE)
- **Toast UI Editor** (más pesado pero completo)
- **Textarea simple + botones** (más control)

Para el mock, una textarea con preview es suficiente.

### **Editor Store**

```typescript
// src/editor/stores/editor.store.ts
import { map } from "nanostores";

export const editorStore = map<{
  isEditing: boolean;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  lastSaved: Date | null;
}>({
  isEditing: false,
  isSaving: false,
  hasUnsavedChanges: false,
  lastSaved: null,
});

export function setEditing(value: boolean) {
  editorStore.setKey("isEditing", value);
}

export function setSaving(value: boolean) {
  editorStore.setKey("isSaving", value);
}

export function setLastSaved(date: Date) {
  editorStore.setKey("lastSaved", date);
  editorStore.setKey("hasUnsavedChanges", false);
}

export function setHasChanges(value: boolean) {
  editorStore.setKey("hasUnsavedChanges", value);
}
```

### **Editor Service (Mock)**

```typescript
// src/editor/services/editor.service.ts
import { setSaving, setLastSaved } from "../stores/editor.store";

export class EditorService {
  static async saveDraft(slug: string, content: string): Promise<void> {
    setSaving(true);

    // Simular API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Guardar en localStorage
    const drafts = this.getDrafts();
    drafts[slug] = { content, savedAt: new Date().toISOString() };
    localStorage.setItem("ailurus_drafts", JSON.stringify(drafts));

    setSaving(false);
    setLastSaved(new Date());
  }

  static getDraft(slug: string): string | null {
    const drafts = this.getDrafts();
    return drafts[slug]?.content || null;
  }

  static getDrafts(): Record<string, { content: string; savedAt: string }> {
    const data = localStorage.getItem("ailurus_drafts");
    return data ? JSON.parse(data) : {};
  }

  static async publishDocument(slug: string, content: string): Promise<void> {
    // Simular publicación
    await new Promise((resolve) => setTimeout(resolve, 800));

    // En mock, solo removemos el draft
    const drafts = this.getDrafts();
    delete drafts[slug];
    localStorage.setItem("ailurus_drafts", JSON.stringify(drafts));
  }
}
```

### **Editor Component**

```typescript
// src/editor/components/MarkdownEditor.tsx
import { useState, useEffect } from "react";
import { useStore } from "@nanostores/react";
import { editorStore, setHasChanges, setEditing } from "../stores/editor.store";
import { EditorService } from "../services/editor.service";

interface MarkdownEditorProps {
  slug: string;
  initialContent: string;
}

export function MarkdownEditor({ slug, initialContent }: MarkdownEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [showPreview, setShowPreview] = useState(false);
  const state = useStore(editorStore);

  useEffect(() => {
    setEditing(true);

    // Cargar draft si existe
    const draft = EditorService.getDraft(slug);
    if (draft) {
      setContent(draft);
    }

    // Cleanup
    return () => setEditing(false);
  }, [slug]);

  // Auto-save cada 5 segundos
  useEffect(() => {
    if (!state.hasUnsavedChanges) return;

    const timer = setTimeout(() => {
      EditorService.saveDraft(slug, content);
    }, 5000);

    return () => clearTimeout(timer);
  }, [content, state.hasUnsavedChanges]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setHasChanges(true);
  };

  const handleSave = async () => {
    await EditorService.saveDraft(slug, content);
  };

  const handlePublish = async () => {
    if (!confirm("¿Publicar documento?")) return;

    await EditorService.publishDocument(slug, content);
    window.location.href = `/docs/${slug}`;
  };

  const handleCancel = () => {
    if (state.hasUnsavedChanges) {
      if (!confirm("Tienes cambios sin guardar. ¿Salir?")) return;
    }
    window.history.back();
  };

  // Warning al salir
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (state.hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [state.hasUnsavedChanges]);

  return (
    <div className="markdown-editor">
      <div className="editor-header">
        <div className="editor-info">
          {state.isSaving && <span>Guardando...</span>}
          {state.lastSaved && (
            <span>Guardado: {state.lastSaved.toLocaleTimeString()}</span>
          )}
        </div>

        <div className="editor-actions">
          <button onClick={() => setShowPreview(!showPreview)}>
            {showPreview ? "Ocultar" : "Mostrar"} Preview
          </button>
          <button onClick={handleSave} disabled={state.isSaving}>
            Guardar
          </button>
          <button onClick={handlePublish} className="btn-primary">
            Publicar
          </button>
          <button onClick={handleCancel} className="btn-ghost">
            Cancelar
          </button>
        </div>
      </div>

      <div className={`editor-content ${showPreview ? "split" : ""}`}>
        <textarea
          value={content}
          onChange={handleChange}
          className="editor-textarea"
          placeholder="Escribe tu contenido en Markdown..."
        />

        {showPreview && (
          <div
            className="editor-preview markdown-content"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
          />
        )}
      </div>
    </div>
  );
}

// Helper temporal para preview (mejorar después con marked)
function renderMarkdown(content: string): string {
  return content
    .replace(/^### (.*$)/gim, "<h3>$1</h3>")
    .replace(/^## (.*$)/gim, "<h2>$1</h2>")
    .replace(/^# (.*$)/gim, "<h1>$1</h1>")
    .replace(/\*\*(.*)\*\*/gim, "<strong>$1</strong>")
    .replace(/\*(.*)\*/gim, "<em>$1</em>")
    .replace(/\n/gim, "<br />");
}
```

### **Página del Editor**

```astro
---
// src/editor/pages/[slug]/edit.astro
import EditorLayout from '@/layouts/EditorLayout.astro';
import { MarkdownEditor } from '@/editor/components/MarkdownEditor';
import { MOCK_DOCUMENTS } from '@/mocks';

const { slug } = Astro.params;
const document = MOCK_DOCUMENTS.find(d => d.slug === slug);

if (!document) {
  return Astro.redirect('/404');
}
---

<EditorLayout title={`Editando: ${document.title}`}>
  <MarkdownEditor
    client:load
    slug={slug}
    initialContent={document.content}
  />
</EditorLayout>
```

**Entregable**: Editor funcional con auto-save en localStorage y preview

---

## 🎨 **FASE 6: Polish y Refinamiento** (2-3 días)

### **Tareas**

- [ ] **6.1** Mejorar estilos responsive
- [ ] **6.2** Agregar transiciones y animaciones
- [ ] **6.3** Implementar loading states
- [ ] **6.4** Agregar página 404
- [ ] **6.5** Mejorar accesibilidad (a11y)
  - [ ] ARIA labels
  - [ ] Keyboard navigation
  - [ ] Focus management
- [ ] **6.6** Agregar meta tags para SEO
- [ ] **6.7** Testing manual de todos los flujos
- [ ] **6.8** Documentar componentes (comentarios)
- [ ] **6.9** Crear README con instrucciones de desarrollo

### **404 Page**

```astro
---
// src/pages/404.astro
import BaseLayout from '@/layouts/BaseLayout.astro';
import Button from '@/shared/components/ui/Button.astro';
---

<BaseLayout title="Página no encontrada">
  <main class="page-404">
    <h1>404</h1>
    <p>La página que buscas no existe</p>
    <Button href="/" variant="primary">
      Volver al inicio
    </Button>
  </main>
</BaseLayout>
```

**Entregable**: Aplicación pulida y lista para integración con backend

---

## 📦 **ENTREGABLES FINALES**

### **Funcionalidades Implementadas**

✅ Homepage con hero y features  
✅ Lista de documentos con categorías  
✅ Vista de documento con TOC y navegación  
✅ Búsqueda funcional client-side  
✅ Editor básico con auto-save y preview  
✅ Dark mode con persistencia  
✅ Diseño responsive  
✅ Componentes UI reutilizables

### **Mock Data Incluido**

- 10-15 documentos de ejemplo
- 4-5 categorías
- Contenido Markdown variado (headers, lists, code, links)

### **Estructura de Archivos Final**

```
frontend/
├── src/
│   ├── documents/
│   │   ├── components/
│   │   │   ├── DocumentList.astro
│   │   │   └── DocumentMeta.astro
│   │   └── pages/
│   │       ├── index.astro
│   │       └── [...slug].astro
│   │
│   ├── editor/
│   │   ├── components/
│   │   │   └── MarkdownEditor.tsx
│   │   ├── services/
│   │   │   └── editor.service.ts
│   │   ├── stores/
│   │   │   └── editor.store.ts
│   │   └── pages/
│   │       └── [slug]/
│   │           └── edit.astro
│   │
│   ├── search/
│   │   ├── components/
│   │   │   ├── SearchBar.tsx
│   │   │   └── SearchResults.tsx
│   │   ├── services/
│   │   │   └── search.service.ts
│   │   ├── stores/
│   │   │   └── search.store.ts
│   │   └── pages/
│   │       └── index.astro
│   │
│   ├── markdown/
│   │   ├── components/
│   │   │   ├── MarkdownRenderer.astro
│   │   │   └── CodeBlock.astro
│   │   └── services/
│   │       └── markdown.service.ts
│   │
│   ├── shared/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Header.astro
│   │   │   │   ├── Footer.astro
│   │   │   │   ├── Sidebar.astro
│   │   │   │   └── TOC.astro
│   │   │   └── ui/
│   │   │       ├── Button.astro
│   │   │       ├── Card.astro
│   │   │       └── Modal.tsx
│   │   ├── stores/
│   │   │   └── theme.store.ts
│   │   └── utils/
│   │       ├── date.util.ts
│   │       └── string.util.ts
│   │
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   ├── DocsLayout.astro
│   │   └── EditorLayout.astro
│   │
│   ├── mocks/
│   │   ├── documents.mock.ts
│   │   ├── search.mock.ts
│   │   └── index.ts
│   │
│   ├── pages/
│   │   ├── index.astro
│   │   └── 404.astro
│   │
│   └── styles/
│       ├── global.css
│       ├── tokens.css
│       └── themes/
│           ├── light.css
│           └── dark.css
│
├── public/
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
└── package.json
```

---

## ⏱️ **CRONOGRAMA ESTIMADO**

| Fase                      | Duración | Días  |
| ------------------------- | -------- | ----- |
| Fase 0: Setup             | 1-2 días | 1-2   |
| Fase 1: Sistema de Diseño | 2-3 días | 3-5   |
| Fase 2: Homepage          | 1 día    | 6     |
| Fase 3: Documentación     | 3-4 días | 7-10  |
| Fase 4: Búsqueda          | 2 días   | 11-12 |
| Fase 5: Editor            | 3-4 días | 13-16 |
| Fase 6: Polish            | 2-3 días | 17-19 |

**Total**: 14-19 días laborables (2-3 semanas)

---

## 🚀 **SIGUIENTES PASOS POST-MOCK**

Una vez completado el frontend con mocks:

1. **Integración con Backend**

   - Reemplazar mock services con API calls reales
   - Implementar error handling
   - Agregar retry logic

2. **WebSocket**

   - Implementar presencia en tiempo real
   - Agregar PresenceIndicator.tsx
   - Conectar con WebSocket Gateway

3. **Features Avanzadas**
   - Upload de imágenes real
   - Autenticación JWT
   - Roles y permisos

---

## 📝 **NOTAS IMPORTANTES**

### **Exclusiones de este Plan**

❌ WebSocket y presencia en tiempo real  
❌ Upload real de imágenes (usar URLs mock)  
❌ Autenticación y autorización  
❌ Analytics tracking real  
❌ Backend API calls reales

### **Ventajas del Enfoque Mock**

✅ Desarrollo rápido sin depender del backend  
✅ Testing de UX y flujos sin latencia  
✅ Fácil transición a API real después  
✅ Permite iterar rápido en diseño

### **Testing Recomendado**

- [ ] Navegación entre páginas
- [ ] Dark mode toggle y persistencia
- [ ] Búsqueda con diferentes queries
- [ ] Editor: escribir, guardar, cancelar
- [ ] Responsive en mobile, tablet, desktop
- [ ] Accesibilidad básica (keyboard navigation)

---

**Última actualización**: 19 de noviembre, 2025  
**Versión**: 1.2.0 - Fase 3 completada
