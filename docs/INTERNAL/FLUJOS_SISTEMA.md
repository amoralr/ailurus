# ✅ Validación Completada + Flujos del Sistema

**Fecha**: 17 de noviembre, 2025  
**Estado**: Listo para arquitectura

---

## 📋 **RESUMEN DE DECISIONES FINALES**

### 🎯 **Decisiones Validadas**

| Aspecto           | Decisión POC                                 | Migración Futura                |
| ----------------- | -------------------------------------------- | ------------------------------- |
| **Multi-usuario** | Real-time Simplificado (WebSocket presencia) | v2.0 → Real-time completo       |
| **Editor**        | Inline Básico (SimpleMDE/EasyMDE)            | v2.0 → Inline avanzado (TipTap) |
| **Navegación**    | Híbrido: Scroll largo + Tabs opcionales      | -                               |
| **Review State**  | Sin Review en POC                            | v0.5 → Agregar con roles        |
| **Timeline**      | POC 5-6 semanas → Iteración incremental      | -                               |

---

## 🔄 **FLUJOS DEL SISTEMA**

### 1. Flujo de Autenticación y Acceso (Futuro)

```mermaid
graph TD
    A[Usuario] -->|Accede| B{¿Autenticado?}
    B -->|No| C[Vista Pública]
    B -->|Sí| D{Verificar Permisos}

    D -->|Viewer| E[Solo Lectura]
    D -->|Editor| F[Lectura + Edición]
    D -->|Admin| G[Control Total]

    C -->|Puede leer| H[Documentación Publicada]
    E -->|Puede leer| H
    F -->|Puede editar| I[Modo Edición]
    G -->|Puede gestionar| J[Panel Admin]

    style B fill:#ff9800
    style D fill:#ff9800
    style G fill:#4caf50
```

---

### 2. Flujo de Edición de Documento (POC)

```mermaid
graph TD
    A[Usuario visualiza documento] -->|Click en área de texto| B[Editor Inline Activado]

    B --> C[SimpleMDE Editor]
    C -->|Escribe contenido| D[Auto-save Draft cada 5s]

    D --> E{WebSocket: Notificar presencia}
    E -->|Broadcast| F[Otros usuarios ven: Usuario X editando]

    F -->|Usuario decide| G{¿Continuar editando?}
    G -->|Sí| H[Warning: Otro usuario también edita]
    G -->|No| I[Espera o sale]

    H -->|Ambos guardan| J[Last Save Wins]

    D -->|Usuario satisfecho| K[Click: Publish]
    K --> L[Estado: Published]
    L --> M[Visible para todos]

    style D fill:#2196f3
    style E fill:#ff9800
    style J fill:#f44336
    style L fill:#4caf50
```

---

### 3. Flujo de Estados del Documento (POC Simplificado)

```mermaid
stateDiagram-v2
    [*] --> Draft: Crear documento

    Draft --> Draft: Auto-save cada 5s
    Draft --> Published: Click "Publish"
    Draft --> Archived: Eliminar (soft delete)

    Published --> Draft: Click "Edit" (crea nueva versión draft)
    Published --> Archived: Archivar

    Archived --> Published: Restaurar
    Archived --> [*]: Eliminar permanente

    note right of Draft
        Estado por defecto
        Solo visible para editor
        Auto-guardado automático
    end note

    note right of Published
        Visible públicamente
        Read-only por defecto
        Editar crea nueva versión draft
    end note
```

---

### 4. Flujo de Estados con Review (v0.5 - Futuro)

```mermaid
stateDiagram-v2
    [*] --> Draft: Crear documento

    Draft --> Draft: Auto-save
    Draft --> Review: Submit for Review
    Draft --> Published: Publish directo (solo Admin)

    Review --> Draft: Rechazar con comentarios
    Review --> Published: Aprobar (solo Admin)

    Published --> Draft: Editar (nueva versión)
    Published --> Archived: Archivar

    Archived --> Published: Restaurar
    Archived --> [*]: Eliminar

    note right of Review
        v0.5: Con roles
        Requiere aprobación
        Admin puede aprobar/rechazar
    end note
```

---

### 5. Flujo de Multi-usuario con Presencia (POC)

```mermaid
sequenceDiagram
    participant U1 as Usuario A
    participant WS as WebSocket Server
    participant DB as SQLite
    participant U2 as Usuario B

    U1->>WS: Connect + Join document-123
    WS->>DB: Verificar documento existe
    DB-->>WS: OK
    WS->>U1: Connected to document-123

    U1->>WS: Emitir: editing-start
    WS->>U2: Broadcast: Usuario A editando
    U2->>U2: Mostrar indicador presencia

    U1->>DB: Auto-save draft (cada 5s)
    DB-->>U1: Draft guardado

    U2->>WS: Emitir: editing-start
    WS->>U1: Broadcast: Usuario B también editando
    U1->>U1: Mostrar warning ⚠️

    U1->>DB: Publish documento
    DB-->>WS: Documento publicado
    WS->>U2: Broadcast: documento actualizado
    U2->>U2: Refrescar vista

    Note over U1,U2: Last Save Wins - Sin resolución de conflictos
```

---

### 6. Flujo de Búsqueda (POC con FTS5)

```mermaid
graph TD
    A[Usuario escribe búsqueda] -->|Query| B[Endpoint: /api/search]

    B --> C[SQLite FTS5 Query]
    C -->|Match encontrado| D{¿Resultados > 0?}

    D -->|Sí| E[Retornar resultados]
    E --> F[Mostrar en UI con highlights]

    D -->|No| G[Registrar en search_logs]
    G --> H[Búsqueda por similitud básica]
    H -->|Coincidencias parciales| I[Mostrar sugerencias]
    I --> J[Did you mean: ...]

    G --> K[Analytics: Término sin resultados]

    style D fill:#ff9800
    style G fill:#f44336
    style I fill:#2196f3
```

---

### 7. Flujo de Navegación Híbrida

```mermaid
graph TD
    A[Usuario accede /docs/instalacion] --> B[Cargar documento completo]

    B --> C{Documento tiene contenido tabbed?}

    C -->|No| D[Renderizar todo con scroll largo]
    D --> E[TOC sticky en sidebar]
    E --> F[Click en TOC → Scroll a sección]

    C -->|Sí| G[Renderizar contenido general]
    G --> H[Encontrar sección con tabs]
    H --> I[Renderizar tabs: Windows, Linux, macOS]
    I --> J[Resto de contenido sigue con scroll]

    J --> E

    F --> K[Click en link interno: /docs/configuracion]
    K --> A

    style C fill:#ff9800
    style I fill:#2196f3
```

---

### 8. Flujo de Carga de Imágenes

```mermaid
graph TD
    A[Usuario en editor] -->|Drag and Drop| B[Imagen detectada]
    A -->|Ctrl+V| B

    B --> C["Validar: tipo, tamaño"]
    C -->|Inválido| D[Error: formato no soportado]
    C -->|Válido| E[Upload a /api/upload]

    E --> F[NestJS: Procesar imagen]
    F --> G[Comprimir con Sharp]
    G --> H[Convertir a WebP + fallback JPEG]
    H --> I["Guardar en /uploads/images/"]

    I --> J["Retornar URL: /uploads/images/abc123.webp"]
    J --> K["Insertar en Markdown"]
    K --> L[Preview actualizado en editor]

    style C fill:#ff9800
    style G fill:#4caf50
```

---

### 9. Flujo de Rendering de Contenido Markdown

```mermaid
graph TD
    A["Documento en Draft/Published"] --> B[Contenido Markdown en DB]

    B --> C{"Renderizar en?"}

    C -->|Frontend Astro SSR| D[Fetch desde API]
    D --> E["Markdown to HTML con marked.js"]
    E --> F[Procesar sintaxis especial]

    F --> G{Detectar bloques especiales}
    G -->|mermaid block| H[Renderizar con mermaid.js]
    G -->|code block| I["Syntax highlight con Prism/Shiki"]
    G -->|imagen| J["Lazy load con loading=lazy"]
    G -->|"Tabs: :::tabs"| K[Componente Tab custom]

    H --> L[Diagrama SVG interactivo]
    I --> M["Code block con botón copy"]
    J --> N[Imagen optimizada WebP]
    K --> O[UI de tabs]

    L --> P[Renderizado final]
    M --> P
    N --> P
    O --> P

    P --> Q["HTML completo en página"]

    style G fill:#ff9800
    style P fill:#4caf50
```

---

### 10. Flujo de Analytics y Tracking (POC Simple)

```mermaid
graph TD
    A[Usuario visita página] --> B[Event: page_view]
    B --> C[Registrar en analytics_events]

    C --> D[Guardar: page_url, timestamp, user_id]

    A --> E[Usuario realiza búsqueda]
    E --> F[Event: search_query]
    F --> G{¿Resultados encontrados?}

    G -->|Sí| H[search_logs: query, results_count > 0]
    G -->|No| I[search_logs: query, results_count = 0]

    I --> J[Marcar para análisis]
    J --> K[Admin revisa términos sin resultados]

    style G fill:#ff9800
    style I fill:#f44336
    style K fill:#2196f3
```

---

### 11. Flujo de Comunicación Astro ↔ NestJS

```mermaid
sequenceDiagram
    participant Browser
    participant Astro as Astro SSR Server
    participant API as NestJS API
    participant DB as SQLite DB

    Browser->>Astro: GET /docs/instalacion
    Astro->>API: GET /api/documents/instalacion
    API->>DB: SELECT * FROM documents WHERE slug='instalacion'
    DB-->>API: Documento JSON
    API-->>Astro: { title, content, metadata }
    Astro->>Astro: Renderizar Markdown → HTML
    Astro-->>Browser: HTML completo

    Browser->>Browser: Usuario edita documento
    Browser->>API: POST /api/documents/instalacion/draft
    API->>DB: INSERT/UPDATE draft
    DB-->>API: Draft guardado
    API-->>Browser: { success: true }

    Browser->>API: POST /api/documents/instalacion/publish
    API->>DB: UPDATE status='published'
    DB-->>API: Publicado
    API->>API: Invalidar cache
    API-->>Browser: { published: true }

    Note over Astro,API: Comunicación REST pura<br/>Sin shared code<br/>Deployments independientes
```

---

### 12. Flujo de Versionado (Futuro v0.5)

```mermaid
graph TD
    A[Documento Publicado] --> B[Usuario click Edit]
    B --> C[Sistema crea nueva versión draft]

    C --> D[document_versions tabla]
    D --> E[version_number incrementa]
    E --> F[Usuario edita draft]

    F --> G[Auto-save crea snapshots]
    G --> H{Usuario decide}

    H -->|Publish| I[Nueva versión publicada]
    H -->|Descartar| J[Eliminar draft, mantener versión anterior]

    I --> K[Historial de versiones disponible]
    K --> L[Ver versión anterior]
    L --> M{¿Restaurar?}

    M -->|Sí| N[Crear draft desde versión antigua]
    M -->|No| O[Solo visualizar]

    style K fill:#4caf50
    style N fill:#2196f3
```

---

## 📊 **ARQUITECTURA DE ALTO NIVEL**

```mermaid
graph TB
    subgraph "Frontend: Astro SSR"
        A[Pages /docs/*] --> B[Components]
        B --> C[SimpleMDE Editor]
        B --> D[Sidebar + TOC]
        B --> E[Search UI]
        B --> F[Dark Mode Toggle]
    end

    subgraph "Backend: NestJS API"
        G[Controllers] --> H[Services]
        H --> I[DocumentService]
        H --> J[SearchService]
        H --> K[UploadService]
        H --> L[WebSocketGateway]
    end

    subgraph "Almacenamiento"
        M[(SQLite DB)]
        N[/uploads/images/]
    end

    A -->|HTTP REST| G
    C -->|WebSocket| L

    I --> M
    J --> M
    K --> N
    L --> M

    style A fill:#ff6b35
    style G fill:#4ecdc4
    style M fill:#95e1d3
```

---

## 🎯 **DECISIONES TÉCNICAS CLAVE**

### ✅ **Arquitectura Validada**

1. **Separación limpia**: Astro + NestJS sin monorepo
2. **Comunicación**: REST API + WebSocket para presencia
3. **Base de datos**: SQLite con FTS5 para búsqueda
4. **Editor**: SimpleMDE (inline básico) → TipTap (v2.0)
5. **Multi-usuario**: Presencia WebSocket → Collaboration (v2.0)
6. **Estados**: Draft → Published (POC) → +Review (v0.5)
7. **Storage**: Local filesystem → Opción externa (futuro)
8. **Timeline**: 5-6 semanas POC → Iteraciones incrementales

---

## 🚀 **PRÓXIMO PASO**

Con estos flujos validados, ahora crearemos:

1. ✅ **ARCHITECTURE.md** para cada proyecto
2. ✅ **Tech Stack** detallado con justificaciones
3. ✅ **Estructura de carpetas** completa
4. ✅ **Esquemas de base de datos** SQL
5. ✅ **Contratos de API REST** OpenAPI-style
6. ✅ **Roadmap de implementación** POC → v0.5 → v1.0 → v2.0
7. ✅ **Guía de setup inicial** con comandos

---

**📝 Nota:** Todos los flujos están diseñados para implementación incremental. POC tendrá lo esencial, versiones posteriores agregarán complejidad según validación de uso real.
