# Casos de Prueba - Formulario de Nuevo Documento

## 🎯 Objetivo

Validar todas las combinaciones posibles del formulario `/docs/new` con categorías y ubicaciones.

---

## 📋 Pre-requisitos

- Backend corriendo: `cd backend && pnpm start:dev`
- Frontend corriendo: `cd frontend && pnpm dev`
- Base de datos con algunas categorías existentes (o usar modo creación)

---

## ✅ Casos de Prueba

### **Caso 1: Categoría Existente + Ubicación Automática (Raíz)**

**Objetivo:** Crear documento en la raíz de una categoría existente

**Pasos:**

1. Ir a `/docs/new`
2. Título: `Guía de Inicio Rápido`
3. Categoría: Seleccionar `Getting Started` (existente)
4. Ubicación: `📂 Automático` (por defecto)
5. Carpeta: Dejar en `Raíz de categoría`
6. Click en `Crear Documento`

**Resultado Esperado:**

- ✅ Path generado: `Getting Started/Guía de Inicio Rápido`
- ✅ Documento aparece en sidebar bajo `Getting Started`
- ✅ Redirección a editor `/docs/edit/guia-de-inicio-rapido`
- ✅ Log backend: "Auto-created FILE folder: Guía de Inicio Rápido"

**Vista Previa debe mostrar:**

```
🚀 Getting Started > Guía de Inicio Rápido
```

---

### **Caso 2: Categoría Existente + Carpeta Existente**

**Objetivo:** Agregar documento a una carpeta existente

**Pasos:**

1. Ir a `/docs/new`
2. Título: `Instalación en Windows`
3. Categoría: Seleccionar `Guides` (existente)
4. Ubicación: `📂 Automático`
5. Carpeta: Seleccionar `Guides > Instalación` (debe existir)
6. Click en `Crear Documento`

**Resultado Esperado:**

- ✅ Path: `Guides/Instalación/Instalación en Windows`
- ✅ Documento aparece bajo la carpeta seleccionada en sidebar
- ✅ Log backend: "Linked document to folder"

**Vista Previa debe mostrar:**

```
📖 Guides > Instalación > Instalación en Windows
```

---

### **Caso 3: Categoría Nueva + Ubicación Automática**

**Objetivo:** Crear categoría nueva y documento en su raíz

**Pasos:**

1. Ir a `/docs/new`
2. Título: `Mi Primera Configuración`
3. Categoría: Click `+ Crear Nueva Categoría`
   - Nombre: `Configuración`
   - Icono: Seleccionar `⚙️`
   - Click `Usar esta Categoría`
4. Ubicación: `📂 Automático` (raíz)
5. Click en `Crear Documento`

**Resultado Esperado:**

- ✅ Path: `Configuración/Mi Primera Configuración`
- ✅ Nueva categoría `Configuración ⚙️` creada en backend
- ✅ Documento aparece en sidebar bajo nueva categoría
- ✅ Log backend: "Auto-created category: configuracion"

**Vista Previa debe mostrar:**

```
⚙️ Configuración > Mi Primera Configuración
```

---

### **Caso 4: Categoría Nueva + Ruta Personalizada (1 nivel)**

**Objetivo:** Crear categoría y estructura de carpetas simple

**Pasos:**

1. Ir a `/docs/new`
2. Título: `Variables de Entorno`
3. Categoría: Click `+ Crear Nueva Categoría`
   - Nombre: `DevOps`
   - Icono: `🔧`
   - Click `Usar esta Categoría`
4. Ubicación: Click `✏️ Ruta Personalizada`
5. Ruta: `Docker`
6. Click en `Crear Documento`

**Resultado Esperado:**

- ✅ Path: `DevOps/Docker/Variables de Entorno`
- ✅ Categoría `DevOps 🔧` creada
- ✅ Carpeta `Docker` creada automáticamente
- ✅ Documento visible en: `DevOps > Docker > Variables de Entorno`
- ✅ Logs backend:
  - "Auto-created category: devops"
  - "Auto-created parent folder: Docker"
  - "Auto-created FILE folder: Variables de Entorno"

**Vista Previa debe mostrar:**

```
🔧 DevOps > Docker > Variables de Entorno
```

---

### **Caso 4b: Categoría Existente + Ruta Personalizada (DevOps)**

**Objetivo:** Agregar documento a categoría existente DevOps con nueva ruta

**Pasos:**

1. Ir a `/docs/new`
2. Título: `PRueba devops`
3. Categoría: Seleccionar `DevOps` (existente)
4. Ubicación: Click `✏️ Ruta Personalizada`
5. Ruta: `Docker`
6. Click en `Crear Documento`

**Resultado Esperado:**

- ✅ Path: `DevOps/Docker/PRueba devops`
- ✅ Documento visible en sidebar bajo: `DevOps > Docker > PRueba devops`
- ✅ Logs backend:
  - "Category found in DB: true"
  - "Auto-created parent folder: DevOps/Docker" (si no existe)
  - "Auto-created FILE folder: DevOps/Docker/PRueba devops"
  - "Linked document 22 to folder 16"

**Vista Previa debe mostrar:**

```
🔧 DevOps > Docker > PRueba devops
```

**Diagnóstico si NO aparece en sidebar:**

1. Verificar que `/api/folders` devuelve el árbol completo con DevOps
2. Verificar tabla `FolderCategory` tiene relación entre folder raíz DevOps y categoría
3. Verificar que el evento `sidebar:refresh` se dispara
4. Abrir DevTools Console y buscar: `[Sidebar Store] Refreshed sidebar data`

**Query SQL de diagnóstico:**

```sql
-- Ver folder raíz de DevOps
SELECT * FROM "Folder" WHERE path = 'DevOps';

-- Ver relación folder-category
SELECT fc.*, f.name as folder_name, c.name as category_name
FROM "FolderCategory" fc
JOIN "Folder" f ON fc."folderId" = f.id
JOIN "Category" c ON fc."categoryId" = c.id
WHERE c.id = 'devops';

-- Ver estructura completa de DevOps
SELECT * FROM "Folder" WHERE path LIKE 'DevOps%' ORDER BY path;

-- Ver documento creado
SELECT d.*, fd."folderId"
FROM "Document" d
LEFT JOIN "FolderDocument" fd ON d.id = fd."documentId"
WHERE d.id = 22;
```

---

### **Caso 5: Ruta Personalizada Multinivel (3 niveles)**

**Objetivo:** Crear jerarquía compleja de carpetas

**Pasos:**

1. Ir a `/docs/new`
2. Título: `Conexión a PostgreSQL`
3. Categoría: Seleccionar `Configuración` (de caso anterior)
4. Ubicación: Click `✏️ Ruta Personalizada`
5. Ruta: `Servidor/Base de Datos/PostgreSQL`
6. Click en `Crear Documento`

**Resultado Esperado:**

- ✅ Path: `Configuración/Servidor/Base de Datos/PostgreSQL/Conexión a PostgreSQL`
- ✅ Carpetas creadas: `Servidor` → `Base de Datos` → `PostgreSQL`
- ✅ Estructura completa en sidebar
- ✅ Logs backend: 3 x "Auto-created parent folder"

**Vista Previa debe mostrar:**

```
⚙️ Configuración > Servidor > Base de Datos > PostgreSQL > Conexión a PostgreSQL
```

---

### **Caso 6: Validación - Campos Vacíos**

**Objetivo:** Verificar validación de campos requeridos

**Pasos:**

1. Ir a `/docs/new`
2. Dejar Título vacío
3. Click en `Crear Documento`

**Resultado Esperado:**

- ❌ Toast de error: "Campos incompletos"
- ❌ No se crea el documento
- ✅ Formulario sigue visible

---

### **Caso 7: Validación - Ruta Personalizada Sin Path**

**Objetivo:** Validar campo de ruta personalizada

**Pasos:**

1. Ir a `/docs/new`
2. Título: `Test Validación`
3. Categoría: Seleccionar existente
4. Ubicación: Click `✏️ Ruta Personalizada`
5. Ruta: Dejar vacío
6. Click en `Crear Documento`

**Resultado Esperado:**

- ✅ Path debe caer a modo automático: `Categoría/Test Validación`
- ✅ Documento se crea normalmente

---

### **Caso 8: Caracteres Especiales en Path**

**Objetivo:** Validar manejo de caracteres especiales

**Pasos:**

1. Ir a `/docs/new`
2. Título: `API REST - Autenticación`
3. Categoría: `API Reference`
4. Ubicación: `✏️ Ruta Personalizada`
5. Ruta: `REST APIs/Auth & Security`
6. Click en `Crear Documento`

**Resultado Esperado:**

- ✅ Path: `API Reference/REST APIs/Auth & Security/API REST - Autenticación`
- ✅ Slug generado: `api-rest-autenticacion`
- ✅ Carpetas con espacios y `&` se crean correctamente

---

### **Caso 9: Cambio de Modo (Auto ↔ Personalizada)**

**Objetivo:** Verificar que cambiar de modo limpia estados

**Pasos:**

1. Ir a `/docs/new`
2. Título: `Test Cambio Modo`
3. Categoría: Seleccionar existente
4. Ubicación: `📂 Automático`
5. Seleccionar una carpeta del dropdown
6. Click en `✏️ Ruta Personalizada`
7. Verificar que carpeta seleccionada se limpia
8. Escribir ruta personalizada: `Custom/Path`
9. Click en `📂 Automático`
10. Verificar que ruta personalizada se limpia

**Resultado Esperado:**

- ✅ Al cambiar a `Ruta Personalizada`: `selectedFolderId = ""`
- ✅ Al cambiar a `Automático`: `customPath = ""`
- ✅ Vista previa se actualiza correctamente

---

### **Caso 10: Cancelar Creación de Categoría**

**Objetivo:** Verificar que cancelar limpia el estado

**Pasos:**

1. Ir a `/docs/new`
2. Click `+ Crear Nueva Categoría`
3. Nombre: `Temporal`
4. Icono: `🎯`
5. Click `Cancelar`

**Resultado Esperado:**

- ✅ Vuelve a selector de categorías existentes
- ✅ `newCategoryName = ""`
- ✅ `newCategoryIcon = "📄"`
- ✅ Vista previa no muestra categoría temporal

---

### **Caso 11: Emoji Personalizado en Categoría**

**Objetivo:** Probar emoji no sugerido

**Pasos:**

1. Ir a `/docs/new`
2. Click `+ Crear Nueva Categoría`
3. Nombre: `Testing`
4. Icono: Escribir manualmente `🧪` en el campo
5. Click `Usar esta Categoría`
6. Título: `Mi Test`
7. Click en `Crear Documento`

**Resultado Esperado:**

- ✅ Categoría creada con emoji `🧪`
- ✅ Vista previa muestra: `🧪 Testing > Mi Test`
- ✅ Sidebar muestra categoría con emoji correcto

---

### **Caso 12: Descripción Larga (Opcional)**

**Objetivo:** Verificar campo opcional de descripción

**Pasos:**

1. Ir a `/docs/new`
2. Título: `Documento con Descripción`
3. Categoría: Existente
4. Descripción: Escribir un texto largo (200+ caracteres)
5. Click en `Crear Documento`

**Resultado Esperado:**

- ✅ Documento creado con `excerpt` en base de datos
- ✅ Descripción visible en listados de documentos

---

## 🔍 Verificaciones Post-Creación

Para cada caso exitoso, verificar:

1. **Sidebar:**

   - ✅ Documento aparece en la ubicación correcta
   - ✅ Jerarquía de carpetas es correcta
   - ✅ Link funciona y lleva a `/docs/edit/{slug}`

2. **Base de Datos:**

   - ✅ Tabla `Document`: registro con path correcto
   - ✅ Tabla `Category`: categoría existe (nueva o existente)
   - ✅ Tabla `Folder`: carpetas creadas con tipos correctos
   - ✅ Tabla `FolderDocument`: vinculación correcta

3. **Backend Logs:**

   - ✅ "Auto-created category" (si aplica)
   - ✅ "Auto-created parent folder" (por cada carpeta intermedia)
   - ✅ "Auto-created FILE folder"
   - ✅ "Linked document to folder"

4. **Editor:**
   - ✅ Contenido inicial: `# {Título}\n\nEmpieza a escribir...`
   - ✅ Breadcrumb muestra path completo
   - ✅ Status es `DRAFT`

---

## 🐛 Escenarios de Error a Probar

### Error 1: Backend Desconectado

1. Detener backend
2. Intentar crear documento
3. **Esperado:** Toast de error con mensaje del API

### Error 2: Slug Duplicado

1. Crear documento con título "Test"
2. Crear otro documento con mismo título "Test"
3. **Esperado:** Backend debe manejar duplicados (agregar sufijo o error)

### Error 3: Path Inválido

1. Usar caracteres no permitidos en path: `\`, `|`, `<`, `>`
2. **Esperado:** Sanitización o mensaje de error

---

## 📊 Checklist de Validación

- [ ] Caso 1: Categoría existente + raíz
- [ ] Caso 2: Categoría existente + carpeta existente
- [ ] Caso 3: Categoría nueva + raíz
- [ ] Caso 4: Categoría nueva + ruta personalizada 1 nivel
- [ ] Caso 4b: Categoría existente DevOps + ruta personalizada
- [ ] Caso 5: Ruta personalizada multinivel (3 niveles)
- [ ] Caso 6: Validación campos vacíos
- [ ] Caso 7: Validación ruta personalizada sin path
- [ ] Caso 8: Caracteres especiales en path
- [ ] Caso 9: Cambio de modo Auto ↔ Personalizada
- [ ] Caso 10: Cancelar creación de categoría
- [ ] Caso 11: Emoji personalizado
- [ ] Caso 12: Descripción larga
- [ ] Error 1: Backend desconectado
- [ ] Error 2: Slug duplicado
- [ ] Error 3: Path inválido

---

## 🎨 Validación Visual

Para cada caso, verificar que la **Vista Previa** muestre:

- ✅ Icono de categoría correcto
- ✅ Breadcrumb completo con separadores `/`
- ✅ Carpetas intermedias en gris
- ✅ Título del documento en negrita
- ✅ Lista de "Se creará automáticamente" acorde al modo
- ✅ Indicador verde `✓` visible

---

## 📝 Notas Adicionales

- **Slug:** Se genera automáticamente desde el título (lowercase, sin acentos, guiones)
- **Path:** Siempre incluye categoría como prefijo
- **Folders:** Backend distingue entre `FOLDER` (intermedias) y `FILE` (documento)
- **Auto-creación:** Backend crea todo lo que falta en la jerarquía
- **Redirección:** Siempre usa `window.location.replace()` para evitar alerts
