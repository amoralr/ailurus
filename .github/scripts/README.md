# Scripts Toolkit

Colección de scripts utilitarios para automatizar tareas comunes del proyecto y facilitar la interacción con el sistema de documentación.

## 📋 Propósito

Los scripts en esta carpeta permiten:

- **Automatizar consultas** al backend de documentación
- **Recuperar información** estructurada para agentes especializados
- **Integrar** herramientas CLI con el sistema de documentación
- **Facilitar** el acceso a recursos del proyecto desde cualquier contexto

## 🗂️ Scripts Disponibles

### `documentation.js`

**Descripción**: Consulta el backend para obtener documentación específica por slug o categoría.

**Uso**:

```bash
node .github/scripts/documentation.js --slug instalacion
node .github/scripts/documentation.js --category getting-started
node .github/scripts/documentation.js --search "database migration"
node .github/scripts/documentation.js --list
```

**Flags disponibles**:

- `--slug <slug>` - Obtener documento por slug
- `--category <id>` - Listar documentos de una categoría
- `--search <query>` - Buscar en documentación
- `--list` - Listar todos los documentos publicados
- `--tree` - Mostrar árbol de folders completo
- `--render-mermaid` - Convertir diagramas Mermaid a imágenes renderizables
- `--api-url <url>` - URL del backend (default: http://localhost:3000)

**Salida**: JSON estructurado con la documentación solicitada

**Casos de uso**:

- Agentes que necesitan consultar documentación existente
- Scripts de CI/CD que validan contenido
- Herramientas de generación de índices
- Integración con sistemas externos

---

## 🎯 Integración con Agentes

Los scripts están diseñados para ser utilizados por agentes especializados mediante el sistema de flags:

### Ejemplo: Solicitar guía de instalación

```bash
# Usuario solicita:
# "Quiero saber cómo instalar el proyecto"

# Agente documentation-assistant ejecuta:
node .github/scripts/documentation.js --slug instalacion
```

### Ejemplo: Buscar información sobre migraciones

```bash
# Usuario solicita:
# "Cómo funcionan las migraciones de base de datos?"

# Agente documentation-assistant ejecuta:
node .github/scripts/documentation.js --search "database migration"
```

### Ejemplo: Renderizar diagramas Mermaid

```bash
# Usuario solicita:
# "Muéstrame la arquitectura con diagramas renderizados"

# Agente documentation-assistant ejecuta:
node .github/scripts/documentation.js --slug arquitectura --render-mermaid
```

**Resultado con `--render-mermaid`**:

- Detecta bloques `mermaid` en el contenido
- Convierte a imágenes usando mermaid.ink
- Incluye imagen renderizada + código fuente en detalles
- Agrega link para editar en Mermaid Live

---

## 🔧 Creación de Nuevos Scripts

### Template Base

```javascript
#!/usr/bin/env node

/**
 * Script Name: nombre-del-script.js
 * Purpose: Descripción breve del propósito
 * Usage: node .github/scripts/nombre-del-script.js [flags]
 */

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3000";

async function main() {
  const args = process.argv.slice(2);
  // Implementación
}

main().catch(console.error);
```

### Convenciones

1. **Nomenclatura**: kebab-case (ej: `fetch-documents.js`)
2. **Documentación**: Comentario inicial con purpose y usage
3. **Flags**: Usar `--flag-name` para argumentos
4. **Salida**: JSON estructurado para fácil parsing
5. **Errores**: Usar `console.error()` y exit codes apropiados
6. **Env vars**: Soportar configuración via variables de entorno

### Estructura de Salida Estándar

```json
{
  "success": true,
  "data": {},
  "timestamp": "2025-11-25T00:00:00.000Z",
  "source": "script-name"
}
```

---

## 📚 Scripts Planificados

- `generate-index.js` - Generar índice de documentación
- `validate-links.js` - Validar enlaces internos
- `export-markdown.js` - Exportar docs a markdown
- `sync-categories.js` - Sincronizar categorías
- `health-check.js` - Verificar salud del sistema

---

## 🔗 Referencias

- **API Documentation**: `docs/API.md`
- **Agents System**: `.github/agents.md`
- **Flags Reference**: `.github/flags.md`
- **Backend Endpoints**: `backend/src/modules/*/`

---

## 💡 Tips

- Todos los scripts asumen que el backend está corriendo en `localhost:3000`
- Usar `--api-url` para apuntar a otros ambientes
- Los scripts retornan exit code 0 en éxito, 1 en error
- La salida JSON puede ser parseada con `jq` para mejor legibilidad
