# 📸 Sistema de Imágenes en Markdown

Sistema completo de renderizado de imágenes con soporte para lazy loading, lightbox y captions automáticos.

## ✨ Características

- ✅ **Lazy Loading**: Carga diferida automática de imágenes
- ✅ **Lightbox**: Click para ver en tamaño completo
- ✅ **Captions**: Subtítulos automáticos desde el atributo `title`
- ✅ **Responsive**: Se adaptan al tamaño de pantalla
- ✅ **Hover Effects**: Efectos visuales al pasar el mouse
- ✅ **Keyboard Support**: Cierra lightbox con ESC
- ✅ **Accesibilidad**: Alt text obligatorio

## 📝 Sintaxis

### Imagen Básica

```markdown
![Descripción de la imagen](https://ejemplo.com/imagen.jpg)
```

### Imagen con Caption

```markdown
![Descripción](https://ejemplo.com/imagen.jpg "Este texto aparecerá como caption")
```

## 🎨 Ejemplos

### Ejemplo 1: Logo

```markdown
![Logo Ailurus](https://placehold.co/600x400/667eea/ffffff/png?text=Logo)
```

Resultado:

- Imagen centrada
- Border y shadow
- Hover effect
- Click para zoom

### Ejemplo 2: Diagrama con Caption

```markdown
![Arquitectura del Sistema](https://ejemplo.com/diagrama.png "Diagrama mostrando las 3 capas del sistema")
```

Resultado:

- Imagen centrada
- Caption en gris italizado debajo
- Lightbox al hacer click

## 🔧 Componentes Modificados

### 1. `markdown.service.ts`

Renderer personalizado para `<img>` tags:

```typescript
renderer.image = ({ href, title, text }) => {
  return `
    <figure class="markdown-image-container">
      <img 
        src="${href}" 
        alt="${alt}"
        loading="lazy"
        class="markdown-image"
        data-zoomable
      />
      ${caption ? `<figcaption>${caption}</figcaption>` : ""}
    </figure>
  `;
};
```

### 2. `MarkdownRenderer.astro`

Script para lightbox interactivo:

- Crea lightbox en `document.body`
- Event listeners en imágenes con `[data-zoomable]`
- Cierra con click, ESC o botón close

### 3. `markdown.css`

Estilos para:

- `.markdown-image-container`: wrapper con figure
- `.markdown-image`: estilos de imagen con hover
- `.markdown-image-caption`: caption italizado
- `.markdown-image-lightbox`: overlay fullscreen

## 🎯 Casos de Uso

### Documentación Técnica

```markdown
![Flujo de autenticación](./auth-flow.png "Flujo completo de autenticación con JWT")
```

### Capturas de Pantalla

```markdown
![Dashboard](./screenshot.png "Vista principal del dashboard con métricas")
```

### Diagramas

```markdown
![Esquema de base de datos](./db-schema.png "Relaciones entre tablas principales")
```

### Comparaciones

```markdown
| Antes                                     | Después                                 |
| ----------------------------------------- | --------------------------------------- |
| ![Versión 1](./v1.png "Interfaz antigua") | ![Versión 2](./v2.png "Nueva interfaz") |
```

## 🚀 Mejores Prácticas

### 1. Optimización

- Usar WebP cuando sea posible
- Máximo 1200px de ancho
- Comprimir imágenes < 500KB

### 2. Accesibilidad

- Siempre incluir alt text descriptivo
- Usar captions para contexto adicional
- Evitar texto en imágenes

### 3. Organización

```
/public/images/
  ├── docs/          # Documentación general
  ├── diagrams/      # Diagramas técnicos
  ├── screenshots/   # Capturas de pantalla
  └── ui/            # Elementos de UI
```

### 4. URLs

✅ Recomendado:

- `/images/docs/arquitectura.png` (relativas)
- `https://cdn.ejemplo.com/img.png` (CDN)

❌ Evitar:

- URLs locales (`file://`)
- URLs sin HTTPS
- Imágenes muy grandes sin optimizar

## 🐛 Troubleshooting

### Imagen no aparece

1. Verificar URL correcta
2. Comprobar que sea accesible públicamente
3. Revisar formato soportado (jpg, png, webp, gif, svg)

### Lightbox no funciona

1. Verificar que el script se haya cargado
2. Comprobar console por errores JS
3. Asegurarse de que la imagen tenga `data-zoomable`

### Caption no se muestra

Usar sintaxis correcta:

```markdown
![Alt text](url "Caption aquí")
```

## 📚 Recursos

- [Guía completa en /docs/images-guide](/docs/images-guide)
- [Markdown Syntax](/docs/markdown-syntax)
- [Editor Guide](/docs/editor-guide)

## 🔄 Changelog

### v1.0.0 (2025-11-20)

- ✅ Renderer personalizado con lazy loading
- ✅ Lightbox con keyboard support
- ✅ Captions automáticos desde title
- ✅ Estilos responsive con hover effects
- ✅ Documento de ejemplo en mocks
