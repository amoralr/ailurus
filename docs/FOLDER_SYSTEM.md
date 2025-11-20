# 🗂️ Sistema de Navegación Jerárquica

**Proyecto**: Ailurus  
**Tipo**: Estructura Obsidian-style  
**Fecha**: 20 de noviembre, 2025

---

## 📋 **Visión General**

Ailurus implementa un sistema de navegación jerárquica tipo **Obsidian** con carpetas anidadas ilimitadas. Esta estructura permite organizar documentos en una jerarquía visual e intuitiva, similar a un sistema de archivos tradicional pero optimizado para documentación técnica.

**Características principales**:

- 🌳 **Jerarquía ilimitada**: Carpetas dentro de carpetas sin límite de profundidad
- 🔄 **Recursión nativa**: Estructura auto-referencial en base de datos
- 📁 **Tipos diferenciados**: FOLDER (carpeta) vs FILE (link a documento)
- 🎨 **Iconos emoji**: Cada nodo puede tener un icono visual
- 🔢 **Ordenamiento controlado**: Propiedad `order` para sorting personalizado
- 🔗 **Múltiples ubicaciones**: Un documento puede aparecer en varias carpetas (M:M)

---

## 🏗️ **Arquitectura del Sistema**

### **Flujo de Datos**

```
┌─────────────────┐
│   SQLite 3      │
│   Tabla: Folder │
│   (self-ref)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Backend (NestJS)│
│ FoldersService  │
│ → buildTree()   │
└────────┬────────┘
         │ JSON
         ▼
┌─────────────────┐
│ Frontend (Astro)│
│ Sidebar.astro   │
│ → SidebarItem   │
│   (recursivo)   │
└─────────────────┘
```

---

## 📐 **Modelo de Datos**

### **Interface TypeScript (Frontend)**

The frontend uses a FolderNode interface that defines: id, name, type (folder/file), optional icon emoji, full path string, order for sorting, optional children array for recursion, and optional slug for file documents.

### **Tabla Database (Backend - Prisma)**

The Folder model contains: id (auto-increment primary key), name, type (FOLDER or FILE enum), optional icon, unique path, order (default 0), and optional parentId for self-referential foreign key. Relations include parent and children using "FolderHierarchy" relation with cascade delete. Performance indices are created on parentId, path, and type fields.

**Explicación de campos**:

- `parentId`: Permite jerarquía ilimitada (null = raíz)
- `path`: Ruta única para búsqueda directa ("Equipo/Proyecto/...")
- `order`: Control de ordenamiento (independiente de alfabético)
- `onDelete: Cascade`: Al borrar carpeta, borra todos sus hijos

---

## 🌲 **Jerarquía Real del Sistema**

### **Estructura Actual**

```
📦 Equipo (id: 1, order: 1)
│
├─ 👣 Información del Equipo (file, slug: equipo-overview)
│
└─ 📦 Proyecto (id: 2, order: 2)
   │
   ├─ 👣 Resumen del Proyecto (file, slug: proyecto-overview)
   │
   ├─ 🚀 Getting Started (id: 3, order: 1)
   │  │
   │  ├─ 📄 Introducción (file, slug: getting-started-intro)
   │  │
   │  ├─ 👣 Primeros Pasos (id: 4, order: 2)
   │  │  ├─ 📄 Guía de Instalación (file, slug: instalacion)
   │  │  └─ 📄 Quick Start (file, slug: quick-start)
   │  │
   │  └─ ⚙️ Configuración (id: 5, order: 3)
   │     └─ 📄 Configuración Avanzada (file, slug: configuracion)
   │
   ├─ 🏗️ Architecture (id: 6, order: 2)
   │  ├─ 📄 Arquitectura del Sistema (file, slug: arquitectura)
   │  ├─ 📄 Arquitectura Frontend (file, slug: frontend-architecture)
   │  ├─ 📄 Arquitectura Backend (file, slug: backend-architecture)
   │  └─ 📄 Esquema de Base de Datos (file, slug: database-schema)
   │
   ├─ 📚 API Reference (id: 7, order: 3)
   │  ├─ 📄 API Overview (file, slug: api-overview)
   │  ├─ 📄 API de Documentos (file, slug: api-documents)
   │  ├─ 📄 API de Búsqueda (file, slug: api-search)
   │  ├─ 📄 API de Upload (file, slug: api-upload)
   │  └─ 📄 WebSocket API (file, slug: api-websocket)
   │
   └─ 📖 Guides (id: 8, order: 4)
      ├─ 📄 Guía del Editor (file, slug: editor-guide)
      ├─ 📄 Sintaxis Markdown (file, slug: markdown-syntax)
      └─ 📄 Guía de Deployment (file, slug: deployment)

📦 Recursos (id: 9, order: 2)
└─ 📄 Información de Recursos (file, slug: recursos-overview)
```

### **Características de la Jerarquía**

| Nivel        | Ejemplo                       | Total Nodos | Total Files |
| ------------ | ----------------------------- | ----------- | ----------- |
| **Raíz (0)** | Equipo, Recursos              | 2 folders   | 0           |
| **Nivel 1**  | Proyecto, Info Equipo         | 1 folder    | 1 file      |
| **Nivel 2**  | Getting Started, Architecture | 4 folders   | 1 file      |
| **Nivel 3**  | Primeros Pasos, Configuración | 2 folders   | 15 files    |

**Total**: 9 folders + 20 files = **29 nodos**

---

## 🎨 **Sistema de Iconos**

### **Iconos por Tipo de Carpeta**

| Categoría       | Emoji | Código                | Uso                                |
| --------------- | ----- | --------------------- | ---------------------------------- |
| Equipo          | 👥    | `folder_users`        | Información de equipo/organización |
| Proyecto        | 📦    | `folder_project`      | Proyectos y subproyectos           |
| Getting Started | 🚀    | `folder_rocket`       | Guías de inicio rápido             |
| Architecture    | 🏗️    | `folder_architecture` | Documentación de arquitectura      |
| API Reference   | 📚    | `folder_books`        | Referencias de API                 |
| Guides          | 📖    | `folder_book_open`    | Tutoriales y guías                 |
| Primeros Pasos  | 👣    | `folder_footprints`   | Pasos iniciales                    |
| Configuración   | ⚙️    | `folder_settings`     | Configuración del sistema          |

### **Iconos de UI (lucide-react)**

Para representación visual en componentes se utilizan los iconos: Folder (cerrado), FolderOpen (abierto), y File (archivo) de la librería lucide-react.

---

## 🎯 **Implementación Frontend**

### **Componente Recursivo: SidebarItem.tsx**

**Propósito**: Renderizar árbol de carpetas de forma recursiva.

**Diagrama de flujo**:

```
┌─────────────────────┐
│   SidebarItem       │
│   node={rootFolder} │
└──────────┬──────────┘
           │
    ┌──────▼──────┐
    │ ¿Es folder? │
    └──────┬──────┘
           │
    ┌──────▼──────────────────┐
    │ SÍ                       │
    │ - Render button          │
    │ - Show Folder icon       │
    │ - Toggle expand/collapse │
    │ - ¿Expandido?            │
    │   ├─ SÍ → Render children│
    │   │         (recursivo)  │
    │   └─ NO → Ocultar        │
    └──────────────────────────┘
           │
    ┌──────▼──────────────────┐
    │ NO (es file)             │
    │ - Render <a> link        │
    │ - Show File icon         │
    │ - href={/docs/${slug}}   │
    └──────────────────────────┘
```

**Interface del componente**:

SidebarItemProps acepta: node (FolderNode), level opcional para profundidad/indentación, y currentSlug opcional para highlight del documento activo.

**Características**:

- ✅ **Recursión**: Llama a sí mismo para cada hijo
- ✅ **Estado local**: Cada folder mantiene su estado de expansión
- ✅ **Indentación visual**: `padding-left: ${level * 1rem}`
- ✅ **Highlight activo**: Compara `currentSlug` con `node.slug`
- ✅ **Iconos dinámicos**: Alterna entre `Folder` y `FolderOpen`
- ✅ **Badges**: Muestra count de hijos en folders
- ✅ **Keyboard nav**: Enter, Space, Arrow keys

---

## 📊 **Estado Global (Nanostores)**

### **folder-tree.store.ts**

Mantiene estado de expansión de carpetas usando nanostores. Define un atom con Set de IDs de folders expandidos y funciones para: expandFolder (agregar ID al Set), collapseFolder (remover ID del Set), toggleFolder (alternar estado), e isExpanded (verificar si ID está en el Set).

**Persistencia**: Se puede guardar en `localStorage` para mantener estado entre sesiones.

---

## 🔧 **Implementación Backend**

### **FoldersController (NestJS)**

**Endpoints**:

#### **1. GET /folders**

Obtener árbol completo de carpetas.

**Response**:

Returns JSON with success flag and data array containing folder tree hierarchy with id, name, type, icon, path, order, and nested children.

#### **2. GET /folders/:path**

Obtener nodo específico por path.

**Ejemplo**: `GET /folders/Equipo/Proyecto/Getting%20Started`

**Response**:

Returns JSON with success flag and data object containing the specific folder node with all its properties and children array.

### **FoldersService**

**Método clave**: `buildTree()`

**Algoritmo**:

```
1. Obtener todos los folders de DB ordenados por order
2. Crear mapa: { [id]: folder }
3. Inicializar array de raíces (parentId = null)
4. Para cada folder:
   a. Si parentId es null → agregar a raíces
   b. Si no → buscar padre en mapa y agregar a sus children
5. Retornar raíces (árbol completo)
```

**Complejidad**: O(n) donde n = total de folders

---

## 📱 **Responsive Design**

### **Desktop (>1024px)**

```
┌─────────────────────────────────┐
│ Header                          │
├─────────┬──────────────┬────────┤
│ Sidebar │   Content    │  TOC   │
│ (250px) │   (1fr)      │(250px) │
│         │              │        │
│ 📦 Team │ # Document   │ ## Sec │
│ └─📦 Pr │              │ ## Sec │
│   └─🚀  │   Lorem...   │ ## Sec │
│         │              │        │
└─────────┴──────────────┴────────┘
```

### **Mobile (<768px)**

```
┌──────────────────┐
│ ≡ Menu  [Search] │ ← Header sticky
├──────────────────┤
│                  │
│  # Document      │
│                  │
│  Lorem ipsum...  │
│                  │
│                  │
└──────────────────┘

Sidebar → Drawer (toggle)
TOC → Hidden
```

---

## ♿ **Accesibilidad**

### **Keyboard Navigation**

| Tecla             | Acción                                |
| ----------------- | ------------------------------------- |
| `Tab`             | Navegar entre folders/files           |
| `Enter` / `Space` | Expandir/colapsar folder o abrir file |
| `Arrow Down`      | Siguiente item                        |
| `Arrow Up`        | Item anterior                         |
| `Arrow Right`     | Expandir folder (si está cerrado)     |
| `Arrow Left`      | Colapsar folder (si está abierto)     |
| `Home`            | Primer item del nivel                 |
| `End`             | Último item del nivel                 |

### **ARIA Labels**

Buttons use role="treeitem" with aria-expanded state, aria-label showing name and child count, and tabIndex 0 for keyboard navigation. Links use role="treeitem" with aria-current="page" for active state and href to document path.

### **WCAG 2.2 AA Compliance**

- ✅ **Contrast ratio**: 4.5:1 mínimo (texto sobre fondo)
- ✅ **Focus visible**: Outline de 2px en elementos enfocados
- ✅ **Touch targets**: Mínimo 44x44px en móvil
- ✅ **Screen readers**: Labels descriptivos en todos los elementos

---

## 🔄 **Relación M:M con Documentos**

### **Caso de Uso: Shortcuts**

Un documento puede aparecer en múltiples ubicaciones:

```
📦 Proyecto
├─ 🚀 Getting Started
│  └─ 📄 Instalación          ← Documento original
└─ 📖 Guides
   └─ 🔗 Instalación (link)   ← Shortcut al mismo documento
```

### **Tabla Junction: FolderDocument**

Junction table with folderId, documentId, and order (default 0). Relations to Folder and Document with cascade delete. Composite primary key on [folderId, documentId] with indices on both foreign keys.

**Query**: Obtener todos los folders donde aparece un documento:

Use Prisma's findMany with where clause filtering documents relation where some match the documentId.

---

## 📈 **Performance**

### **Optimizaciones Implementadas**

1. **Índices estratégicos**:

   - `parentId`: Búsqueda de hijos rápida
   - `path`: Lookup directo por ruta
   - `type`: Filtrado folder vs file

2. **Carga lazy (futuro)**:

   - Cargar solo folders raíz inicialmente
   - Expandir bajo demanda (API call)
   - Útil para árboles >1000 nodos

3. **Memoización frontend**:

   - React.memo en SidebarItem
   - useMemo para children filtrados
   - Evita re-renders innecesarios

4. **Virtualización (futuro)**:
   - `react-window` para listas largas
   - Renderizar solo items visibles
   - Scrolling performante con 10,000+ items

---

## 🔍 **Búsqueda en Árbol**

### **Algoritmo: Find by Path**

Split path by "/" into segments, iterate through tree starting from root, for each segment find matching node by name, traverse into children if available, return null if segment not found, return final node if all segments matched.

**Complejidad**: O(d) donde d = profundidad del path

---

## 🚀 **Próximos Pasos**

### **Backend**

1. Implementar `FoldersController` con endpoints `/folders` y `/folders/:path`
2. Implementar `FoldersService.buildTree()` con lógica de construcción de árbol
3. Seed database con 29 nodos de la jerarquía real

### **Frontend**

1. SidebarItem.tsx ya está implementado ✅
2. Integrar con API real (actualmente usa mocks)
3. Agregar animaciones de expansión/colapso
4. Implementar drag & drop para reordenar (v2.0)

### **Features Futuras (v2.0)**

- 🔍 Búsqueda dentro del árbol (highlight matching nodes)
- 📌 Pin folders favoritos al inicio
- 🎨 Colores personalizados por categoría
- 🔔 Badges de "nuevos documentos" en folders
- 📊 Analytics: folders más visitados

---

## 📚 **Referencias**

- [Obsidian Documentation](https://obsidian.md) - Inspiración de UX
- [Tree View Pattern - WAI-ARIA](https://www.w3.org/WAI/ARIA/apg/patterns/treeview/) - Accesibilidad
- [Prisma Self-Relations](https://www.prisma.io/docs/concepts/components/prisma-schema/relations/self-relations) - DB Design
- [React Recursive Components](https://kentcdodds.com/blog/recursive-components-in-react) - Frontend patterns

---

**Última actualización**: 20 de noviembre, 2025  
**Mantenedor**: Sistema de documentación Ailurus
