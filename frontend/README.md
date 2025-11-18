# Frontend - Ailurus Documentation Framework

Sistema de documentación moderno construido con **Astro** + **React** + **Tailwind CSS**.

## 📁 Estructura del Proyecto

```
frontend/src/
├── components/
│   ├── ui/                  # Componentes UI de shadcn
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── separator.tsx
│   └── Welcome.astro        # Componente de ejemplo
├── layouts/
│   └── Layout.astro         # Layout base de la aplicación
├── lib/
│   └── utils.ts             # Utilidades (cn helper)
├── pages/
│   └── index.astro          # Landing page
├── shared/
│   ├── components/layout/   # Componentes de layout compartidos
│   │   ├── Header.astro     # Header con navegación
│   │   ├── Footer.astro     # Footer con links
│   │   └── ThemeToggle.tsx  # Toggle de tema (React)
│   ├── stores/              # Estado global (Nanostores)
│   │   └── theme.store.ts   # Store del tema light/dark
│   └── utils/               # Utilidades compartidas
│       ├── date.util.ts     # Formateo de fechas
│       └── slug.util.ts     # Generación de slugs
└── styles/
    ├── global.css           # Estilos globales
    └── themes/              # Variables de tema
        ├── light.css        # Tema claro
        └── dark.css         # Tema oscuro
```

## 🚀 Stack Tecnológico

- **Framework**: Astro 5.x (SSG)
- **UI Library**: React 18
- **Styling**: Tailwind CSS 3.x
- **Components**: shadcn/ui
- **State Management**: Nanostores
- **Icons**: Lucide React
- **Type Safety**: TypeScript

## 🎨 Sistema de Diseño

### Colores Ailurus

- **Red**: `#E63946` - Color principal
- **Orange**: `#FF6700` - Acento
- **Brown**: `#A0522D` - Secundario
- **Cream**: `#FFF8DC` - Background claro
- **Dark**: `#1A1A1A` - Background oscuro

### Componentes UI

Todos los componentes UI están basados en **shadcn/ui** y son completamente customizables:

- `Button` - Botones con variantes y tamaños
- `Card` - Tarjetas con header, content y footer
- `Badge` - Etiquetas pequeñas
- `Separator` - Líneas divisorias

## 📦 Scripts Disponibles

```bash
# Desarrollo
pnpm dev          # Inicia servidor de desarrollo en :4321

# Build
pnpm build        # Construye para producción
pnpm preview      # Preview del build de producción

# Linting
pnpm lint         # Ejecuta linter
```

## 🎯 Características Implementadas

### ✅ Fase Actual (v0.1 - POC)

- [x] Layout base con Header y Footer
- [x] Sistema de temas (Light/Dark) con Nanostores
- [x] Componentes UI base (shadcn/ui)
- [x] Landing page completa
- [x] Responsive design
- [x] Integración con Tailwind CSS
- [x] TypeScript configurado

### 🚧 Próximas Fases

**Fase 2: Shared Layer**

- [ ] API service (axios)
- [ ] WebSocket service
- [ ] Storage service (localStorage)
- [ ] Hooks compartidos (useDebounce, etc.)

**Fase 3: Documents Feature**

- [ ] Componentes de documentos
- [ ] Servicios de API
- [ ] Tipos y DTOs
- [ ] Páginas dinámicas

**Fase 4: Editor Feature**

- [ ] Editor Markdown (SimpleMDE)
- [ ] Auto-save
- [ ] WebSocket presence
- [ ] Image upload

**Fase 5: Search Feature**

- [ ] Barra de búsqueda
- [ ] Resultados con highlighting
- [ ] Filtros
- [ ] Store de búsqueda

## 🔧 Configuración

### Astro Config

```javascript
export default defineConfig({
  output: "static", // SSG por ahora
  integrations: [
    react(), // Para componentes interactivos
    tailwind({
      applyBaseStyles: false, // Estilos custom
    }),
  ],
  vite: {
    ssr: {
      noExternal: ["@nanostores/react", "nanostores"],
    },
  },
  server: {
    port: 4321,
    host: true,
  },
});
```

### Variables de Entorno

Crear archivo `.env` en la raíz del frontend:

```env
# API URLs (cuando se implemente backend)
PUBLIC_API_URL=http://localhost:3000
PUBLIC_WS_URL=ws://localhost:3000
```

## 📚 Convenciones de Código

### Archivos

- `.astro` - Componentes SSR/estáticos
- `.tsx` - Componentes React interactivos
- `.ts` - Lógica de negocio, stores, utils
- `.css` - Estilos

### Nombres

- Componentes: `PascalCase.tsx` o `PascalCase.astro`
- Stores: `nombre.store.ts`
- Utils: `nombre.util.ts`
- Services: `nombre.service.ts`

### Importaciones

```typescript
// Alias @ configurado para src/
import { Button } from "@/components/ui/button";
import { themeStore } from "@/shared/stores/theme.store";
```

## 🎨 Uso del Sistema de Temas

```typescript
// En componentes React
import { useStore } from "@nanostores/react";
import { themeStore, toggleTheme, setTheme } from "@/shared/stores/theme.store";

function MyComponent() {
  const theme = useStore(themeStore);

  return <button onClick={toggleTheme}>Current theme: {theme}</button>;
}
```

## 📖 Documentación Adicional

- [Astro Docs](https://docs.astro.build)
- [shadcn/ui](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Nanostores](https://github.com/nanostores/nanostores)

## 🤝 Contribución

Este es un POC en desarrollo. Para contribuir:

1. Revisa la arquitectura en `docs/FRONTEND_ARCHITECTURE.md`
2. Sigue las convenciones de código
3. Usa los componentes UI existentes
4. Mantén la estructura de carpetas

---

**Estado**: 🟡 POC - UI Base Implementada  
**Versión**: 0.1.0  
**Última actualización**: Noviembre 2025
