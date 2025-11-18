# 🔍 SuperCopilot Commit Analyzer & Semantic Commit Generator

## 📋 Análisis Sistemático de Cambios

### Prompt Template para Análisis

```
🔍 **COMMIT ANALYSIS REQUEST**

**Objetivo**: Analizar cambios del proyecto y generar commits semánticos con emojis por grupos lógicos

**Proceso**:
1. 📊 **Change Discovery**: `git status --porcelain` + `git diff --name-status`
2. 🧠 **Content Analysis**: Revisar contenido de cambios significativos
3. 🎯 **Logical Grouping**: Agrupar por impacto y relación
4. 📝 **Semantic Commits**: Generar commits con formato Commitizen + emojis
5. ✅ **Execution**: Realizar commits en orden lógico
```

## 🎭 Tipos de Cambio y Emojis

### 🏗️ **Architecture & Framework**

| Type       | Emoji | Description                | Example                                                   |
| ---------- | ----- | -------------------------- | --------------------------------------------------------- |
| `feat`     | 🏗️    | New architectural features | `🏗️ feat(architecture): implement screaming architecture` |
| `refactor` | 🔨    | Structural changes         | `🔨 refactor(structure): reorganize contexts`             |
| `chore`    | ⚙️    | Framework setup            | `⚙️ chore(framework): add SuperCopilot configuration`     |

### ✨ **Features & UI**

| Type   | Emoji | Description       | Example                                              |
| ------ | ----- | ----------------- | ---------------------------------------------------- |
| `feat` | ✨    | New features      | `✨ feat(admin): add user management dashboard`      |
| `feat` | 🎨    | UI components     | `🎨 feat(ui): add responsive card components`        |
| `feat` | 📱    | Responsive design | `📱 feat(responsive): implement mobile-first layout` |

### 🐛 **Fixes & Improvements**

| Type   | Emoji | Description    | Example                                                |
| ------ | ----- | -------------- | ------------------------------------------------------ |
| `fix`  | 🐛    | Bug fixes      | `🐛 fix(auth): resolve login validation issue`         |
| `fix`  | 🚑    | Critical fixes | `🚑 fix(security): patch authentication vulnerability` |
| `perf` | ⚡    | Performance    | `⚡ perf(queries): optimize database queries`          |

### 📚 **Documentation & Config**

| Type    | Emoji | Description    | Example                                             |
| ------- | ----- | -------------- | --------------------------------------------------- |
| `docs`  | 📚    | Documentation  | `📚 docs(api): add authentication endpoints guide`  |
| `docs`  | 📝    | README updates | `📝 docs(readme): update installation instructions` |
| `chore` | 🔧    | Configuration  | `🔧 chore(config): update TypeScript paths`         |

### 🧪 **Testing & Quality**

| Type    | Emoji | Description     | Example                                             |
| ------- | ----- | --------------- | --------------------------------------------------- |
| `test`  | 🧪    | Add tests       | `🧪 test(auth): add authentication unit tests`      |
| `test`  | ✅    | Test fixes      | `✅ test(integration): fix API endpoint tests`      |
| `style` | 💄    | Code formatting | `💄 style(components): apply consistent formatting` |

### 🚀 **Deployment & CI**

| Type    | Emoji | Description   | Example                                              |
| ------- | ----- | ------------- | ---------------------------------------------------- |
| `ci`    | 👷    | CI/CD changes | `👷 ci(github): add automated testing workflow`      |
| `chore` | 🚀    | Deployment    | `🚀 chore(deploy): configure production environment` |
| `chore` | 📦    | Dependencies  | `📦 chore(deps): update Next.js to v14`              |

## 🔄 Workflow de Análisis

### Fase 1: Discovery

```powershell
# Obtener estado actual
git status --porcelain
git diff --name-status
git diff --stat
```

### Fase 2: Content Analysis

```powershell
# Analizar archivos modificados
git diff HEAD -- file1.tsx file2.ts
# Revisar archivos nuevos
ls -la nuevos_archivos/
```

### Fase 3: Logical Grouping

**Criterios de agrupación**:

- 🏗️ **Architectural**: Cambios que afectan estructura general
- ✨ **Feature**: Nuevas funcionalidades por contexto
- 🔨 **Refactor**: Mejoras de código sin nueva funcionalidad
- 📚 **Documentation**: Docs y configuración
- 🧪 **Testing**: Tests y QA

### Fase 4: Commit Generation

#### Template de Commit

```
<emoji> <type>(<scope>): <subject>

<body>
- <change 1>
- <change 2>
- <change 3>

<footer>
```

#### Scope Guidelines

- `architecture`: Cambios estructurales globales
- `admin|interno|externo`: Contextos de dominio
- `ui|components`: Componentes de interfaz
- `auth|api|db`: Áreas técnicas específicas
- `config|deps`: Configuración y dependencias

## 🎯 Ejemplo de Análisis Completo

### Input (Estado Git)

```
M .copilot/instructions.md
M app/dashboard/admin/page.tsx
D components/admin-dashboard.tsx
?? admin/
?? .copilot/FLAGS.md
```

### Analysis Result

```
🔍 **CHANGE ANALYSIS**

**Group 1: Architecture Framework** 🏗️
- Added .copilot/ framework files
- Restructured from component-based to domain-based
- Deleted legacy components
- IMPACT: Breaking architectural change

**Group 2: Domain Contexts** ✨
- Created admin/, interno/, externo/ contexts
- Updated dashboard pages to use new structure
- IMPACT: New domain organization

**Group 3: Documentation** 📚
- Updated .copilot/instructions.md
- Added framework documentation
- IMPACT: Improved developer experience
```

### Generated Commits

```bash
# Commit 1: Framework
git add .copilot/
git commit -m "⚙️ chore(framework): implement SuperCopilot CLI framework

- Add comprehensive .copilot/ configuration
- Implement ARCHITECTURE, AGENTS, FLAGS, PRINCIPLES, RULES
- Add behavioral modes: Brainstorming, Introspection, Task Management
- Enable token-efficient communication mode

BREAKING CHANGE: SuperCopilot framework now required for development"

# Commit 2: Architecture
git add admin/ interno/ externo/
git rm components/admin-dashboard.tsx components/external-assistant-dashboard.tsx components/internal-assistant-dashboard.tsx
git commit -m "🏗️ feat(architecture): implement screaming architecture with domain contexts

- Create admin/, interno/, externo/ domain contexts
- Implement context-specific component structure
- Remove legacy shared components
- Follow domain-driven design principles

BREAKING CHANGE: Reorganized from feature-based to domain-based architecture"

# Commit 3: Dashboard Updates
git add app/dashboard/
git commit -m "🔨 refactor(dashboard): update pages for new domain structure

- Update admin/page.tsx to use @admin/* imports
- Update interno/page.tsx to use @interno/* imports
- Update externo/page.tsx to use @externo/* imports
- Follow new architectural patterns"

# Commit 4: Documentation
git add .copilot/instructions.md SuperCopilot_Capabilities.md
git commit -m "📚 docs(framework): add SuperCopilot capabilities documentation

- Update .copilot/instructions.md with session priorities
- Add comprehensive SuperCopilot_Capabilities.md
- Document available tools, modes, and agents
- Include usage examples and workflow patterns"
```

## 🚀 Comandos de Ejecución

### Análisis y Commits

```bash
# Multi-OS: Análisis + Commits con confirmación interactiva
npm run commit
# O directo: node .copilot/scripts/run-script.js smart-commit

# Solo análisis (sin commits)
npm run commit:analyze
# O directo: node .copilot/scripts/run-script.js analyze-changes

# Dry run (simulación sin cambios)
npm run commit:dry
# O directo: node .copilot/scripts/run-script.js smart-commit --dry-run
```

**Cross-Platform Support:**

- 🪟 **Windows**: Ejecuta scripts PowerShell (.ps1) automáticamente
- 🐧 **Linux/macOS**: Ejecuta scripts Bash (.sh) automáticamente
- 🚀 **Universal**: `run-script.js` detecta el SO y usa el script apropiado

### Versionado y Releases

```bash
# Multi-OS: Instalar standard-version (si no existe)
npm run install:standard-version

# Multi-OS: Release con confirmación interactiva
npm run release
# O directo: node .copilot/scripts/run-script.js release

# Multi-OS: Release específico (con confirmación)
npm run release:patch  # npm run release:minor | npm run release:major
# O directo: node .copilot/scripts/run-script.js release --release-as patch

# Multi-OS: Pre-release (con confirmación)
node .copilot/scripts/run-script.js release --prerelease alpha

# Multi-OS: Dry run (solo simulación)
npm run release:dry
# O directo: node .copilot/scripts/run-script.js release --dry-run
```

**Cross-Platform Support:**

- 🪟 **Windows**: PowerShell con encoding UTF-8 automático
- 🐧 **Linux/macOS**: Bash con permisos ejecutables automáticos
- 🌐 **Universal**: Detección automática del SO y ejecución apropiada

## 📦 Integration con Standard-Version

### Automatic Version Bumping

Standard-version analiza tus commits convencionales y determina automáticamente el tipo de versión:

| Commit Type             | Version Bump      | Example                                  |
| ----------------------- | ----------------- | ---------------------------------------- |
| `fix:`                  | **Patch** (0.0.x) | `🐛 fix(auth): resolve login issue`      |
| `feat:`                 | **Minor** (0.x.0) | `✨ feat(admin): add user management`    |
| `BREAKING CHANGE:`      | **Major** (x.0.0) | `🏗️ feat(api)!: redesign authentication` |
| `docs:`, `style:`, etc. | **Patch** (0.0.x) | `📚 docs(readme): update installation`   |

### Generated Files

- **CHANGELOG.md**: Generado automáticamente desde commits
- **package.json**: Version bumped automáticamente
- **Git Tags**: Creados automáticamente (v1.0.0, v1.1.0, etc.)

### Release Workflow Integration

```bash
# Flujo completo: commits → release
./.copilot/scripts/smart-commit.ps1  # Commits convencionales
./.copilot/scripts/release.ps1       # Versionado automático
git push --follow-tags origin main   # Push con tags
```

### Comando Interactivo

```bash
# Análisis paso a paso con confirmación
./scripts/smart-commit.ps1 -Interactive
```

### Comando Manual

```bash
# Solo análisis, commits manuales
./scripts/analyze-changes.ps1
```

## 📖 Conventional Commits Reference

### Standard Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Breaking Changes

```
BREAKING CHANGE: <description>
# OR
<type>!: <description>
```

### Additional Types

| Type     | Description            | When to Use                       |
| -------- | ---------------------- | --------------------------------- |
| `build`  | Build system changes   | webpack, npm scripts, etc.        |
| `revert` | Revert previous commit | `revert: feat(auth): add login`   |
| `wip`    | Work in progress       | Temporary commits (avoid in main) |

### Advanced Scopes

- **Multi-scope**: `feat(admin,interno): shared auth logic`
- **No scope**: `docs: update contributing guidelines`
- **Nested scope**: `fix(ui/button): resolve hover state`

## 🔧 Troubleshooting & Tips

### Common Issues

1. **Large changesets**: Break into atomic commits by feature/context
2. **Mixed changes**: Separate concerns (don't mix features + fixes)
3. **Breaking changes**: Always document in commit footer
4. **Scope confusion**: Use most specific applicable scope

### Best Practices

- **Atomic commits**: One logical change per commit
- **Descriptive subjects**: Clear, concise, imperative mood
- **Body details**: Explain WHY, not just WHAT
- **Reference issues**: Include issue numbers when applicable

### Quality Checklist

- [ ] Commit builds successfully
- [ ] Tests pass
- [ ] Follows conventional commit format
- [ ] Breaking changes documented
- [ ] Scope is appropriate and specific

## 🎯 Advanced Usage Examples

### Multi-Context Feature

```bash
🏗️ feat(admin,interno): implement shared user management

- Add UserService in lib/ for cross-context usage
- Create admin UI for user administration
- Add interno hooks for staff user data
- Implement role-based access patterns

Refs: #123, #124
```

### Security Fix

```bash
🚑 fix(auth)!: patch JWT token validation vulnerability

- Fix token expiry validation bypass
- Add rate limiting to auth endpoints
- Update security headers configuration
- Add input sanitization for login forms

BREAKING CHANGE: Auth middleware now requires explicit token refresh
CVE-2024-XXXX: JWT bypass vulnerability
```

### Performance Optimization

```bash
⚡ perf(db): optimize patient query performance

- Add database indexes for patient searches
- Implement query result caching (Redis)
- Reduce N+1 queries in appointment loading
- Add database query monitoring

Before: 2.3s average query time
After: 0.4s average query time
```

### Documentation Update

```bash
📚 docs(architecture): document screaming architecture implementation

- Add context organization guidelines
- Document import path conventions (@admin/*, @interno/*, @externo/*)
- Include component placement rules
- Add migration guide from legacy structure

Co-authored-by: SuperCopilot <copilot@example.com>
```
