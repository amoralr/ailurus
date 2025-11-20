# 🎨 Design System - Ailurus

**Proyecto**: Ailurus Documentation Platform  
**Framework UI**: shadcn/ui + Tailwind CSS  
**Fecha**: 20 de noviembre, 2025

---

## 📋 **Visión General**

El Design System de Ailurus está construido sobre **shadcn/ui** (componentes React sin dependencias) y **Tailwind CSS** para un sistema de diseño modular, accesible y mantenible.

**Principios de diseño**:

- 🎯 **Simplicidad**: Componentes limpios y predecibles
- ♿ **Accesibilidad**: WCAG 2.2 AA compliant
- 🌓 **Dark mode nativo**: Soporte completo de temas
- 📱 **Mobile-first**: Responsive por defecto
- ⚡ **Performance**: CSS utility-first, sin CSS-in-JS runtime

---

## 🎨 **Sistema de Colores**

### **Light Mode**

**Backgrounds**: Primary (#ffffff), Secondary (#f5f5f5), Tertiary (#e5e5e5)

**Text**: Primary (#1a1a1a), Secondary (#666666), Tertiary (#999999)

**Brand**: Accent (#0070f3), Accent Hover (#0051cc)

**Borders**: Default (#e5e5e5), Hover (#cccccc)

**States**: Success (#10b981), Warning (#f59e0b), Error (#ef4444), Info (#3b82f6)

**Code blocks**: Background (#fafafa), Border (#e5e5e5)

### **Dark Mode**

**Backgrounds**: Primary (#0a0a0a), Secondary (#1a1a1a), Tertiary (#2a2a2a)

**Text**: Primary (#e5e5e5), Secondary (#a0a0a0), Tertiary (#707070)

**Brand**: Accent (#0070f3), Accent Hover (#3291ff)

**Borders**: Default (#333333), Hover (#4a4a4a)

**States**: Success (#10b981), Warning (#f59e0b), Error (#ef4444), Info (#3b82f6)

**Code blocks**: Background (#161616), Border (#2a2a2a)

### **Paleta Semántica**

| Uso             | Variable       | Light   | Dark    |
| --------------- | -------------- | ------- | ------- |
| Fondo principal | `bg-primary`   | #ffffff | #0a0a0a |
| Texto principal | `text-primary` | #1a1a1a | #e5e5e5 |
| Acento/CTA      | `accent`       | #0070f3 | #0070f3 |
| Éxito           | `success`      | #10b981 | #10b981 |
| Error           | `error`        | #ef4444 | #ef4444 |

---

## ✍️ **Tipografía**

### **Font Stack**

**Sans-serif**: Inter Variable, system-ui, -apple-system, sans-serif

**Monospace**: Fira Code Variable, JetBrains Mono, Courier New, monospace

Variable fonts are used for optimal performance.

### **Type Scale**

**Headings**: H1 (40px/2.5rem), H2 (32px/2rem), H3 (24px/1.5rem), H4 (20px/1.25rem), H5 (18px/1.125rem), H6 (16px/1rem)

**Body**: Base (16px/1rem), Small (14px/0.875rem), Extra Small (12px/0.75rem)

**Line Heights**: Tight (1.25), Normal (1.5), Relaxed (1.75)

**Font Weights**: Normal (400), Medium (500), Semibold (600), Bold (700)

### **Uso por Contexto**

| Elemento    | Font      | Size | Weight | Line Height |
| ----------- | --------- | ---- | ------ | ----------- |
| H1          | Inter     | 40px | 700    | 1.25        |
| H2          | Inter     | 32px | 700    | 1.25        |
| H3          | Inter     | 24px | 600    | 1.25        |
| Body        | Inter     | 16px | 400    | 1.5         |
| Caption     | Inter     | 14px | 400    | 1.5         |
| Code inline | Fira Code | 14px | 400    | 1.5         |
| Code block  | Fira Code | 14px | 400    | 1.75        |

---

## 📏 **Spacing System**

### **Escala de Espaciado**

**Spacing Scale**: 0 (0), 1 (4px), 2 (8px), 3 (12px), 4 (16px), 5 (20px), 6 (24px), 8 (32px), 10 (40px), 12 (48px), 16 (64px), 20 (80px)

### **Uso Recomendado**

| Contexto                   | Spacing                                 |
| -------------------------- | --------------------------------------- |
| Gap entre elementos inline | `spacing-2` (8px)                       |
| Padding de botones         | `spacing-2` x `spacing-4`               |
| Gap entre secciones        | `spacing-8` (32px)                      |
| Margin entre componentes   | `spacing-6` (24px)                      |
| Container padding          | `spacing-4` (16px) → `spacing-8` (32px) |

---

## 🔲 **Bordes y Sombras**

### **Border Radius**

**Small** (4px): Used for badges and tags

**Medium** (8px): Used for buttons and inputs

**Large** (12px): Used for cards

**Extra Large** (16px): Used for modals

**Full** (9999px): Used for circular elements like avatars

### **Shadows**

**Small**: Subtle shadow with 5% opacity (0 1px 2px)

**Medium**: Standard shadow with 10% opacity (0 4px 6px)

**Large**: Elevated shadow with 10% opacity (0 10px 15px)

**Extra Large**: Deep shadow with 10% opacity (0 20px 25px)

### **Borders**

**Border Width**: Standard (1px), Thick (2px)

**Border Colors**: Uses theme-specific color variables (see Colors section)

---

## 🎭 **Iconos**

### **Sistema de Carpetas (Emoji)**

Iconos emoji usados en la navegación jerárquica:

| Categoría       | Emoji | Código    | Significado              |
| --------------- | ----- | --------- | ------------------------ |
| Equipo          | 👥    | `U+1F465` | Organización/equipo      |
| Proyecto        | 📦    | `U+1F4E6` | Proyectos y paquetes     |
| Getting Started | 🚀    | `U+1F680` | Lanzamiento/inicio       |
| Architecture    | 🏗️    | `U+1F3D7` | Construcción/estructura  |
| API Reference   | 📚    | `U+1F4DA` | Libros/documentación     |
| Guides          | 📖    | `U+1F4D6` | Libro abierto/tutoriales |
| Primeros Pasos  | 👣    | `U+1F463` | Pasos/comienzo           |
| Configuración   | ⚙️    | `U+2699`  | Ajustes/config           |
| Recursos        | 📦    | `U+1F4E6` | Recursos generales       |

**Uso**: Emojis should be wrapped in a span with appropriate ARIA labels for accessibility (e.g., role="img" and descriptive aria-label).

### **UI Icons (lucide-react)**

Biblioteca: [Lucide React](https://lucide.dev/) (fork optimizado de Feather)

**Iconos principales**:

| Categoría      | Iconos                                                        |
| -------------- | ------------------------------------------------------------- |
| **Navegación** | `Folder`, `FolderOpen`, `File`, `ChevronRight`, `ChevronDown` |
| **Acciones**   | `Plus`, `Edit`, `Trash2`, `Copy`, `Check`, `X`                |
| **UI**         | `Menu`, `Search`, `Settings`, `User`, `Bell`                  |
| **Estados**    | `AlertCircle`, `CheckCircle`, `Info`, `XCircle`               |
| **Tema**       | `Moon`, `Sun`                                                 |
| **Editor**     | `Bold`, `Italic`, `Link`, `Image`, `Code`                     |

**Tamaños estándar**:

- **Small (16px)**: Inline text
- **Medium (20px)**: Buttons and UI elements
- **Large (24px)**: Headings and featured elements

---

## 🧩 **Componentes shadcn/ui**

### **Instalados**

```bash
npx shadcn-ui@latest add badge button card dialog dropdown-menu \
  input label select separator skeleton tabs textarea tooltip
```

### **Componentes Disponibles**

#### **1. Button**

Variantes y tamaños:

| Variant       | Uso                | Ejemplo            |
| ------------- | ------------------ | ------------------ |
| `default`     | Acción primaria    | "Guardar", "Crear" |
| `secondary`   | Acción secundaria  | "Cancelar"         |
| `outline`     | Acción terciaria   | Filtros            |
| `ghost`       | Acción sutil       | Iconos, links      |
| `destructive` | Acción destructiva | "Eliminar"         |

| Size      | Height | Padding   |
| --------- | ------ | --------- |
| `sm`      | 32px   | 12px 16px |
| `default` | 40px   | 16px 24px |
| `lg`      | 48px   | 20px 32px |

#### **2. Card**

Contenedor de contenido con secciones:

```
┌────────────────────────┐
│ CardHeader             │
│  ├─ CardTitle          │
│  └─ CardDescription    │
├────────────────────────┤
│ CardContent            │
│  [Contenido principal] │
├────────────────────────┤
│ CardFooter             │
│  [Acciones]            │
└────────────────────────┘
```

#### **3. Dialog (Modal)**

Modal accesible con overlay:

```
════════════════════════════
║                          ║
║  DialogHeader            ║
║   ├─ DialogTitle         ║
║   └─ DialogDescription   ║
║                          ║
║  [Contenido]             ║
║                          ║
║  DialogFooter            ║
║   └─ [Acciones]          ║
║                          ║
════════════════════════════
```

#### **4. Input**

Input component with integrated label support. Inputs should be associated with Label components using htmlFor attributes for accessibility.

#### **5. Select**

Styled native dropdown component with SelectTrigger, SelectValue, SelectContent, and SelectItem subcomponents for building accessible select menus.

#### **6. Badge**

Etiquetas inline:

| Variant       | Uso                   |
| ------------- | --------------------- |
| `default`     | Estado neutral        |
| `secondary`   | Información adicional |
| `destructive` | Error/advertencia     |
| `outline`     | Sutil                 |

#### **7. Tabs**

Navegación por pestañas:

```
┌─────┬─────┬─────┐
│ Tab1│ Tab2│ Tab3│ (TabsList)
├─────┴─────┴─────┴───┐
│ Contenido Tab 1      │ (TabsContent)
└──────────────────────┘
```

#### **8. Tooltip**

Contextual information component. Requires TooltipProvider wrapper, with TooltipTrigger and TooltipContent subcomponents for displaying hover-based information.

#### **9. Skeleton**

Loading placeholder component. Uses className prop to define dimensions (height and width) for content placeholders during loading states.

#### **10. Separator**

Visual divider component. Supports horizontal and vertical orientations via the orientation prop.

---

## 📱 **Responsive Design**

### **Breakpoints**

Tailwind default breakpoints:

- **sm**: 640px (Mobile landscape)
- **md**: 768px (Tablet portrait)
- **lg**: 1024px (Tablet landscape / Desktop)
- **xl**: 1280px (Desktop)
- **2xl**: 1536px (Large desktop)

### **Layout Patterns**

#### **Desktop (>1024px)**

```
┌───────────────────────────────────────┐
│ Header (fixed)                        │
├───────────┬───────────────────┬───────┤
│ Sidebar   │ Main Content      │ TOC   │
│ (250px)   │ (flex-1)          │(250px)│
│ fixed     │ scroll            │scroll │
│           │                   │       │
│ 📦 Nav    │ # Document        │ ## H2 │
│ 🚀 Item   │                   │ ## H2 │
│   └─📄    │ Lorem ipsum...    │ ## H2 │
│           │                   │       │
└───────────┴───────────────────┴───────┘
```

#### **Tablet (768px - 1024px)**

```
┌──────────────────────────┐
│ Header (fixed)           │
├──────────────────────────┤
│ Main Content (100%)      │
│                          │
│ # Document               │
│                          │
│ Lorem ipsum...           │
│                          │
└──────────────────────────┘

Sidebar → Drawer (toggle)
TOC → Inline (al final del contenido)
```

#### **Mobile (<768px)**

```
┌────────────────┐
│ ≡  [Search] 🌙 │ ← Header sticky
├────────────────┤
│                │
│ # Document     │
│                │
│ Lorem ipsum... │
│                │
└────────────────┘

Sidebar → Drawer modal
TOC → Hidden
Font size → 14px
```

---

## ♿ **Accesibilidad (WCAG 2.2 AA)**

### **Contrast Ratios**

| Elemento             | Ratio Mínimo | Implementado |
| -------------------- | ------------ | ------------ |
| Texto normal         | 4.5:1        | ✅ 7.2:1     |
| Texto grande (18px+) | 3:1          | ✅ 5.1:1     |
| Componentes UI       | 3:1          | ✅ 4.8:1     |
| Estados hover/focus  | 3:1          | ✅ 5.2:1     |

### **Focus Indicators**

All focusable elements display a 2px solid accent-colored outline with 2px offset and 4px border radius when focused via keyboard navigation (focus-visible).

### **Touch Targets**

Minimum size: **44x44px** (WCAG 2.2)

On mobile devices (max-width: 768px), buttons and links enforce minimum dimensions of 44x44px for accessible touch interaction.

### **Keyboard Navigation**

| Elemento               | Soporte |
| ---------------------- | ------- |
| Tab order lógico       | ✅      |
| Skip to content        | ✅      |
| Escape cierra modals   | ✅      |
| Arrow keys en menús    | ✅      |
| Enter/Space en buttons | ✅      |

### **Screen Readers**

**ARIA Labels**: Descriptive labels should be provided for icon-only buttons and interactive elements.

**Live Regions**: Dynamic content changes use role="status" with aria-live="polite" to announce updates.

**Landmarks**: Navigation and main content areas use semantic HTML with descriptive aria-labels.

---

## 🎭 **Animaciones**

### **Transiciones**

**Durations**: Fast (150ms), Normal (300ms), Slow (500ms)

**Easing Functions**: Ease-in (cubic-bezier 0.4, 0, 1, 1), Ease-out (cubic-bezier 0, 0, 0.2, 1), Ease-in-out (cubic-bezier 0.4, 0, 0.2, 1)

### **Uso por Contexto**

| Acción             | Duration | Easing      |
| ------------------ | -------- | ----------- |
| Hover              | 150ms    | ease-out    |
| Click/tap          | 300ms    | ease-in-out |
| Modal open/close   | 300ms    | ease-in-out |
| Page transition    | 500ms    | ease-out    |
| Toast notification | 150ms    | ease-out    |

### **Reduced Motion**

When users enable reduced motion preferences, all animations and transitions are shortened to 0.01ms to respect accessibility preferences.

---

## 🔧 **Uso en Código**

### **Importación de Componentes**

Components are imported from the @/components/ui directory (e.g., button, card, dialog). Multiple subcomponents can be imported in a single statement.

### **Ejemplo: Card con Badge**

A Card component with CardHeader containing a flex layout that positions a CardTitle and Badge side by side. The CardContent displays supplementary text with muted styling for secondary information like timestamps.

### **Ejemplo: Modal de Creación**

A Dialog component triggered by a Button with an icon. The modal contains:

- **DialogHeader**: With DialogTitle and DialogDescription for context
- **Form Fields**: Label-Input pairs for title entry and Select dropdown for category selection
- **DialogFooter**: Action buttons (Cancel and Create) with appropriate variants

---

## 📊 **Tokens de Diseño (Tailwind Config)**

**tailwind.config.mjs** - theme.extend define: colors (border, background, foreground usando hsl(var(--X)), primary con DEFAULT y foreground), borderRadius (lg usa var(--radius), md calc(var(--radius) - 2px), sm calc(var(--radius) - 4px
},
fontFamily: {
sans: ["Inter Variable", "sans-serif"],
mono: ["Fira Code Variable", "monospace"],
},
},
},
};

```

---

## 🎯 **Próximos Pasos**

1. ✅ **Implementado**: 13+ componentes shadcn/ui
2. ✅ **Implementado**: Sistema de temas (light/dark)
3. ⏳ **Pendiente**: Agregar más variantes de Badge
4. ⏳ **Pendiente**: Implementar Toast notifications
5. ⏳ **Pendiente**: Crear componente Avatar
6. ⏳ **Pendiente**: Documentar patrones de composición

---

## 📚 **Referencias**

- [shadcn/ui Documentation](https://ui.shadcn.com/) - Componentes
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [Lucide Icons](https://lucide.dev/) - Biblioteca de iconos
- [WCAG 2.2 Guidelines](https://www.w3.org/WAI/WCAG22/quickref/) - Accesibilidad
- [Inter Font](https://rsms.me/inter/) - Tipografía variable
- [Fira Code](https://github.com/tonsky/FiraCode) - Fuente monoespaciada

---

**Última actualización**: 20 de noviembre, 2025
**Mantenedor**: Sistema de documentación Ailurus
```
