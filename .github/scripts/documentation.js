#!/usr/bin/env node

/**
 * Script Name: documentation.js
 * Purpose: Consultar el backend de documentación para obtener contenido específico
 * Usage: node .github/scripts/documentation.js [flags]
 * 
 * Flags:
 *   --slug <slug>        Obtener documento por slug
 *   --category <id>      Listar documentos de una categoría
 *   --search <query>     Buscar en documentación
 *   --list               Listar todos los documentos
 *   --tree               Obtener árbol de folders
 *   --categories         Listar categorías disponibles
 *   --api-url <url>      URL del backend (default: http://localhost:3000)
 */

import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { execSync } from 'child_process';
import { join } from 'path';
import { tmpdir } from 'os';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = {
    apiUrl: API_BASE_URL,
    action: null,
    value: null,
    renderMermaid: false
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    switch (arg) {
      case '--slug':
        parsed.action = 'slug';
        parsed.value = args[++i];
        break;
      case '--category':
        parsed.action = 'category';
        parsed.value = args[++i];
        break;
      case '--search':
        parsed.action = 'search';
        parsed.value = args[++i];
        break;
      case '--list':
        parsed.action = 'list';
        break;
      case '--tree':
        parsed.action = 'tree';
        break;
      case '--categories':
        parsed.action = 'categories';
        break;
      case '--render-mermaid':
        parsed.renderMermaid = true;
        break;
      case '--api-url':
        parsed.apiUrl = args[++i];
        break;
      case '--help':
      case '-h':
        showHelp();
        process.exit(0);
      default:
        if (arg.startsWith('--')) {
          console.error(`Unknown flag: ${arg}`);
          showHelp();
          process.exit(1);
        }
    }
  }

  return parsed;
}

// Show help message
function showHelp() {
  console.log(`
Documentation Script - Consultar backend de documentación

USAGE:
  node .github/scripts/documentation.js [flags]

FLAGS:
  --slug <slug>        Obtener documento por slug (ej: "instalacion")
  --category <id>      Listar documentos de categoría (ej: "getting-started")
  --search <query>     Buscar documentación (ej: "database migration")
  --list               Listar todos los documentos publicados
  --tree               Obtener árbol completo de folders
  --categories         Listar categorías disponibles con stats
  --render-mermaid     Convertir diagramas Mermaid a URLs de imágenes
  --api-url <url>      URL del backend (default: http://localhost:3000)
  --help, -h           Mostrar esta ayuda

EXAMPLES:
  # Obtener guía de instalación
  node .github/scripts/documentation.js --slug instalacion

  # Buscar información sobre migraciones
  node .github/scripts/documentation.js --search "database migration"

  # Listar documentos de Getting Started
  node .github/scripts/documentation.js --category getting-started

  # Ver árbol de carpetas completo
  node .github/scripts/documentation.js --tree

OUTPUT:
  JSON estructurado con la documentación solicitada
  {
    "success": true,
    "data": { ... },
    "timestamp": "2025-11-25T00:00:00.000Z",
    "source": "documentation-script"
  }
`);
}

// Fetch wrapper with error handling
async function fetchAPI(endpoint) {
  try {
    const url = `${endpoint}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`Failed to fetch ${endpoint}: ${error.message}`);
  }
}

// Get document by slug
async function getDocumentBySlug(apiUrl, slug) {
  const endpoint = `${apiUrl}/docs/${slug}`;
  return await fetchAPI(endpoint);
}

// Get documents by category
async function getDocumentsByCategory(apiUrl, categoryId) {
  const endpoint = `${apiUrl}/docs?category=${categoryId}`;
  return await fetchAPI(endpoint);
}

// Search documentation
async function searchDocumentation(apiUrl, query) {
  const encodedQuery = encodeURIComponent(query);
  const endpoint = `${apiUrl}/search?q=${encodedQuery}`;
  return await fetchAPI(endpoint);
}

// List all documents
async function listAllDocuments(apiUrl) {
  const endpoint = `${apiUrl}/docs`;
  return await fetchAPI(endpoint);
}

// Get folder tree
async function getFolderTree(apiUrl) {
  const endpoint = `${apiUrl}/folders`;
  return await fetchAPI(endpoint);
}

// Get categories
async function getCategories(apiUrl) {
  const endpoint = `${apiUrl}/categories`;
  return await fetchAPI(endpoint);
}

// Generate local SVG from Mermaid code using npx
async function generateMermaidSVG(mermaidCode, index) {
  const tempDir = join(tmpdir(), 'mermaid-diagrams');
  
  // Create temp directory if it doesn't exist
  if (!existsSync(tempDir)) {
    mkdirSync(tempDir, { recursive: true });
  }
  
  const inputFile = join(tempDir, `diagram-${index}.mmd`);
  const outputFile = join(tempDir, `diagram-${index}.svg`);
  
  try {
    // Write mermaid code to temp file
    writeFileSync(inputFile, mermaidCode);
    
    // Generate SVG using npx @mermaid-js/mermaid-cli
    execSync(`npx -y @mermaid-js/mermaid-cli@latest -i "${inputFile}" -o "${outputFile}" -b transparent`, {
      stdio: 'pipe'
    });
    
    return outputFile;
  } catch (error) {
    console.error(`Error generating SVG: ${error.message}`);
    return null;
  }
}

// Process Mermaid diagrams to local SVG files
async function processMermaidToImages(content) {
  if (!content || typeof content !== 'string') {
    return content;
  }

  // Regex to match mermaid code blocks
  const mermaidRegex = /```mermaid\n([\s\S]*?)```/g;
  
  let processed = content;
  const matches = [];
  let match;
  
  // Collect all matches first
  while ((match = mermaidRegex.exec(content)) !== null) {
    matches.push({
      fullMatch: match[0],
      code: match[1].trim()
    });
  }
  
  // Process each match
  for (let i = 0; i < matches.length; i++) {
    const { fullMatch, code } = matches[i];
    const svgPath = await generateMermaidSVG(code, i);
    
    // Create markdown with embedded code and file path
    const base64Code = Buffer.from(code).toString('base64');
    const editorUrl = `https://mermaid.live/edit#base64:${base64Code}`;
    
    const imageMarkdown = `
**Diagrama Mermaid:**

${svgPath ? `📊 **SVG generado**: \`${svgPath}\`` : '⚠️ No se pudo generar SVG'}

\`\`\`mermaid
${code}
\`\`\`

> 💡 **Visualizar en VS Code**: Presiona \`Ctrl+Shift+V\` para ver la vista previa de Markdown
`;
    
    processed = processed.replace(fullMatch, imageMarkdown);
  }
  
  return processed;
}

// Process document or array of documents for Mermaid rendering (async)
async function processDataForMermaidAsync(data) {
  if (!data) return data;
  
  // Handle single document
  if (data.content) {
    return {
      ...data,
      content: await processMermaidToImages(data.content)
    };
  }
  
  // Handle array of documents
  if (Array.isArray(data)) {
    const processed = [];
    for (const doc of data) {
      if (doc.content) {
        processed.push({
          ...doc,
          content: await processMermaidToImages(doc.content)
        });
      } else {
        processed.push(doc);
      }
    }
    return processed;
  }
  
  return data;
}

// Format output
function formatOutput(success, data, error = null) {
  const output = {
    success,
    data: success ? data : null,
    error: error || null,
    timestamp: new Date().toISOString(),
    source: 'documentation-script'
  };
  
  return JSON.stringify(output, null, 2);
}

// Main execution
async function main() {
  const args = parseArgs();

  if (!args.action) {
    console.error('Error: No action specified. Use --help for usage information.');
    process.exit(1);
  }

  try {
    let result;

    switch (args.action) {
      case 'slug':
        if (!args.value) {
          throw new Error('--slug requires a value');
        }
        result = await getDocumentBySlug(args.apiUrl, args.value);
        break;

      case 'category':
        if (!args.value) {
          throw new Error('--category requires a value');
        }
        result = await getDocumentsByCategory(args.apiUrl, args.value);
        break;

      case 'search':
        if (!args.value) {
          throw new Error('--search requires a query');
        }
        result = await searchDocumentation(args.apiUrl, args.value);
        break;

      case 'list':
        result = await listAllDocuments(args.apiUrl);
        break;

      case 'tree':
        result = await getFolderTree(args.apiUrl);
        break;

      case 'categories':
        result = await getCategories(args.apiUrl);
        break;

      default:
        throw new Error(`Unknown action: ${args.action}`);
    }

    // Process Mermaid diagrams if flag is enabled
    if (args.renderMermaid && result) {
      result = await processDataForMermaidAsync(result);
    }

    console.log(formatOutput(true, result));
    process.exit(0);

  } catch (error) {
    console.error(formatOutput(false, null, error.message));
    process.exit(1);
  }
}

// Run script
main().catch((error) => {
  console.error(formatOutput(false, null, error.message));
  process.exit(1);
});
