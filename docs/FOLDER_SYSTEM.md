# 🗂️ Sistema de Navegación Jerárquica

**Tipo**: Estructura Obsidian-style  
**Versión**: v0.5  
**Última actualización**: Noviembre 2025

---

## 📋 VISIÓN GENERAL

Ailurus implementa un sistema de navegación jerárquica tipo **Obsidian** con carpetas anidadas ilimitadas.

**Características principales**:
- 🌳 Jerarquía ilimitada: Carpetas dentro de carpetas sin límite
- 🔄 Recursión nativa: Estructura auto-referencial en base de datos
- 📁 Tipos diferenciados: FOLDER (carpeta) vs FILE (link a documento)
- 🎨 Iconos emoji: Cada nodo puede tener un icono visual
- 🔢 Ordenamiento controlado: Propiedad `order` para sorting personalizado
- 🔗 Múltiples ubicaciones: Un documento puede aparecer en varias carpetas (M:M)

---

## 🏗️ ARQUITECTURA DEL SISTEMA

```mermaid
flowchart TD
    A[SQLite Folder Table<br/>self-referential] --> B[Backend NestJS<br/>FoldersService]
    B --> C[buildTree method<br/>recursivo]
    C --> D[JSON árbol completo]
    D --> E[Frontend Astro<br/>Sidebar.astro]
    E --> F[SidebarItem.tsx<br/>componente recursivo]
    F --> G[Renderizado visual<br/>con expansión/colapso]
```

---

## 📐 MODELO DE DATOS

### Interface FolderNode

**Implementación**: `frontend/src/shared/types/folder.types.ts`

```mermaid
graph LR
    subgraph "FolderNode Interface"
        N1[id: string]
        N2[name: string]
        N3[type: folder/file]
        N4[icon?: emoji]
        N5[path: string]
        N6[order: number]
        N7[slug?: string solo files]
        N8[count?: number solo folders]
        N9[children?: FolderNode array]
    end
    
    N9 -.->|recursivo| N1
```

### Tabla Database

**Implementación**: `backend/prisma/schema.prisma`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | Int (PK) | Identificador único |
| `name` | String | Nombre del folder/file |
| `type` | Enum | FOLDER o FILE |
| `icon` | String | Emoji opcional |
| `path` | String (UK) | Ruta completa única |
| `order` | Int | Orden de aparición |
| `parentId` | Int (FK) | Padre (NULL = raíz) |

**Características**:
- `parentId`: Permite jerarquía ilimitada (null = raíz)
- `path`: Ruta única para búsqueda directa ("Equipo/Proyecto/...")
- `onDelete: Cascade`: Al borrar carpeta, borra todos sus hijos

---

## 🌲 JERARQUÍA REAL DEL SISTEMA

### Estructura Actual (29 nodos)

```mermaid
graph TD
    R1[📦 Equipo] --> R2[👣 Información del Equipo]
    R1 --> P1[📦 Proyecto]
    
    P1 --> P2[👣 Resumen del Proyecto]
    P1 --> GS[🚀 Getting Started]
    P1 --> AR[🏗️ Architecture]
    P1 --> API[📚 API Reference]
    P1 --> GU[📖 Guides]
    
    GS --> GS1[📄 Introducción]
    GS --> PP[👣 Primeros Pasos]
    GS --> CF[⚙️ Configuración]
    
    PP --> PP1[📄 Guía de Instalación]
    PP --> PP2[📄 Quick Start]
    
    CF --> CF1[📄 Configuración Avanzada]
    
    AR --> AR1[📄 Arquitectura del Sistema]
    AR --> AR2[📄 Arquitectura Frontend]
    AR --> AR3[📄 Arquitectura Backend]
    AR --> AR4[📄 Esquema de Base de Datos]
    
    API --> API1[📄 API Overview]
    API --> API2[📄 API de Documentos]
    API --> API3[📄 API de Búsqueda]
    API --> API4[📄 API de Upload]
    API --> API5[📄 WebSocket API]
    
    GU --> GU1[📄 Guía del Editor]
    GU --> GU2[📄 Sintaxis Markdown]
    GU --> GU3[📄 Guía de Deployment]
    
    RES[📦 Recursos] --> RES1[📄 Información de Recursos]
```

**Total**: 9 folders + 20 files = **29 nodos**

---

## 🎯 IMPLEMENTACIÓN FRONTEND

### Componente: SidebarItem.tsx

**Implementación**: `frontend/src/shared/components/layout/SidebarItem.tsx` (174 líneas)

### Flujo de Renderizado Recursivo

```mermaid
flowchart TD
    A[SidebarItem recibe node] --> B{¿Tipo de nodo?}
    B -->|folder| C[Renderizar botón con chevron]
    B -->|file| D[Renderizar link a documento]
    
    C --> E{¿Tiene children?}
    E -->|Sí| F{¿Está expandido?}
    E -->|No| Z[Fin]
    
    F -->|Sí| G[Mapear children]
    F -->|No| Z
    
    G --> H[Para cada child]
    H --> I[Renderizar SidebarItem recursivo]
    I --> J{¿Más children?}
    J -->|Sí| H
    J -->|No| Z
    
    D --> Z
```

**Características**:
- ✅ Recursión: Llama a sí mismo para cada hijo
- ✅ Estado local: Cada folder mantiene su estado de expansión
- ✅ Indentación visual: `padding-left: ${level * 1rem}`
- ✅ Highlight activo: Compara `currentSlug` con `node.slug`
- ✅ Iconos dinámicos: Alterna entre `Folder` y `FolderOpen`
- ✅ Badges: Muestra count de hijos en folders
- ✅ Keyboard nav: Enter, Space, Arrow keys

---

## 📊 ESTADO GLOBAL

### Store: folder-tree.store.ts

**Implementación**: `frontend/src/shared/stores/folder-tree.store.ts`

```mermaid
graph LR
    subgraph "Nanostores Atom"
        S1[expandedFolders: Record string boolean]
    end
    
    subgraph "Actions"
        A1[toggleFolder path]
        A2[expandFolder path]
        A3[collapseFolder path]
    end
    
    A1 --> S1
    A2 --> S1
    A3 --> S1
    
    S1 -.->|reactivo| C[SidebarItem components]
```

**Funcionalidad**: Gestiona qué folders están expandidos usando un objeto con paths como keys y booleanos como values.

---

## 🔧 IMPLEMENTACIÓN BACKEND

### FoldersService

**Implementación**: `backend/src/modules/folders/folders.service.ts` (244 líneas)

### Algoritmo BuildTree

```mermaid
flowchart TD
    A[Obtener todos los folders de DB] --> B[Llamar buildTree parentId=null]
    B --> C{Filtrar folders con parentId=null}
    C --> D[Ordenar por campo order]
    D --> E{Para cada folder raíz}
    E --> F[Llamar buildTree recursivo con parentId=folder.id]
    F --> G[Asignar children al folder]
    G --> H{¿Más folders raíz?}
    H -->|Sí| E
    H -->|No| I[Retornar árbol completo]
```

**Complejidad**: O(n) donde n = total de folders

---

## ♿ ACCESIBILIDAD

### Keyboard Navigation

| Tecla | Acción |
|-------|--------|
| `Tab` | Navegar entre folders/files |
| `Enter` / `Space` | Expandir/colapsar folder o abrir file |
| `Arrow Down` | Siguiente item |
| `Arrow Up` | Item anterior |
| `Arrow Right` | Expandir folder (si está cerrado) |
| `Arrow Left` | Colapsar folder (si está abierto) |

### ARIA Labels

- Buttons: `role="treeitem"` con `aria-expanded`
- Links: `role="treeitem"` con `aria-current="page"` para activo
- Labels descriptivos: "Folder {name} with {count} items"

### WCAG 2.2 AA Compliance

- ✅ Contrast ratio: 4.5:1 mínimo
- ✅ Focus visible: Outline de 2px
- ✅ Touch targets: Mínimo 44x44px en móvil
- ✅ Screen readers: Labels descriptivos

---

## 🔄 RELACIÓN M:M CON DOCUMENTOS

### Caso de Uso: Shortcuts

```mermaid
graph TD
    F1[📦 Getting Started] --> D1[📄 Instalación<br/>documento original]
    F2[📖 Guides] --> D2[🔗 Instalación<br/>shortcut]
    
    D1 -.->|mismo documentId| D2
```

### Tabla Junction: FolderDocument

**Implementación**: `backend/prisma/schema.prisma`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `folderId` | Int (PK, FK) | ID del folder |
| `documentId` | Int (PK, FK) | ID del documento |
| `order` | Int | Orden en el folder |

**Composite PK**: `(folderId, documentId)`

---

## 📈 PERFORMANCE

### Optimizaciones Implementadas

1. **Índices estratégicos**:
   - `parentId`: Búsqueda de hijos rápida
   - `path`: Lookup directo por ruta
   - `type`: Filtrado folder vs file

2. **Memoización frontend**:
   - React.memo en SidebarItem
   - useMemo para children filtrados
   - Evita re-renders innecesarios

---

## 📚 REFERENCIAS

- **Frontend Component**: `frontend/src/shared/components/layout/SidebarItem.tsx`
- **Frontend Store**: `frontend/src/shared/stores/folder-tree.store.ts`
- **Backend Service**: `backend/src/modules/folders/folders.service.ts`
- **Database Schema**: `backend/prisma/schema.prisma`

**Siguiente**: Ver [Design System](./DESIGN_SYSTEM.md) para componentes UI.
