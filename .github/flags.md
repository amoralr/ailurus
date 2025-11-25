# SuperCopilot Framework Flags

Behavioral flags for Copilot CLI to enable specific execution modes and tool selection patterns.

## Mode Activation Flags

**--brainstorm**

- Trigger: Vague project requests, exploration keywords ("maybe", "thinking about", "not sure")
- Behavior: Activate collaborative discovery mindset, ask probing questions, guide requirement elicitation

**--introspect**

- Trigger: Self-analysis requests, error recovery, complex problem solving requiring meta-cognition
- Behavior: Expose thinking process with transparency markers (🤔, 🎯, ⚡, 📊, 💡)

**--task-manage**

- Trigger: Multi-step operations (>3 steps), complex scope (>2 directories OR >3 files)
- Behavior: Orchestrate through systematic organization and progressive enhancement

**--orchestrate**

- Trigger: Multi-tool operations, performance constraints, optimization opportunities
- Behavior: Optimize tool selection matrix, sequential execution planning, adapt to resource constraints

**--token-efficient**

- Trigger: Context usage >75%, large-scale operations, --uc flag
- Behavior: Symbol-enhanced communication, 30-50% token reduction while preserving clarity

## MCP Server Flags

**--c7 / --context7**

- Trigger: Library imports, framework questions, official documentation needs
- Behavior: Enable Context7 for curated documentation lookup and pattern guidance

**--seq / --sequential**

- Trigger: Complex debugging, system design, multi-component analysis
- Behavior: Enable Sequential for structured multi-step reasoning and hypothesis testing

**--all-mcp**

- Trigger: Maximum complexity scenarios, multi-domain problems
- Behavior: Enable all MCP servers for comprehensive capability

**--no-mcp**

- Trigger: Native-only execution needs, performance priority
- Behavior: Disable all MCP servers, use native tools with WebSearch fallback

## Execution Control Flags

**--loop**

- Trigger: Improvement keywords (polish, refine, enhance, improve)
- Behavior: Enable iterative improvement cycles with validation gates

**--iterations [n]**

- Trigger: Specific improvement cycle requirements
- Behavior: Set improvement cycle count (range: 1-10)

**--validate**

- Trigger: Risk score >0.7, resource usage >75%, production environment
- Behavior: Pre-execution risk assessment and validation gates

**--safe-mode**

- Trigger: Resource usage >85%, production environment, critical operations
- Behavior: Maximum validation, conservative execution, auto-enable --uc

## Output Optimization Flags

**--uc / --ultracompressed**

- Trigger: Context pressure, efficiency requirements, large operations
- Behavior: Symbol communication system, 30-50% token reduction

**--scope [file|module|project|system]**

- Trigger: Analysis boundary needs
- Behavior: Define operational scope and analysis depth

**--focus [performance|security|quality|architecture|accessibility|testing]**

- Trigger: Domain-specific optimization needs
- Behavior: Target specific analysis domain and expertise application

## Script Utility Flags

**--doc / --documentation**

- Trigger: Documentation lookup requests, guide inquiries, reference needs
- Behavior: Execute documentation.js script to fetch content from backend
- Usage: `--doc <slug>` or `--doc search:<query>` or `--doc category:<id>`

**--doc-slug [slug]**

- Trigger: Specific document request by slug identifier
- Behavior: Fetch document: `node .github/scripts/documentation.js --slug [slug]`
- Example: `--doc-slug instalacion`

**--doc-search [query]**

- Trigger: Search-based documentation discovery
- Behavior: Search docs: `node .github/scripts/documentation.js --search "[query]"`
- Example: `--doc-search "database migration"`

**--doc-category [id]**

- Trigger: Category-based documentation browsing
- Behavior: List category: `node .github/scripts/documentation.js --category [id]`
- Example: `--doc-category getting-started`

**--doc-list**

- Trigger: Request for all available documentation
- Behavior: Execute: `node .github/scripts/documentation.js --list`

**--doc-tree**

- Trigger: Navigation structure requests
- Behavior: Execute: `node .github/scripts/documentation.js --tree`

## Flag Priority Rules

**Safety First**: --safe-mode > --validate > optimization flags
**Explicit Override**: User flags > auto-detection
**MCP Control**: --no-mcp overrides all individual MCP flags
**Scope Precedence**: system > project > module > file
**Script Execution**: --doc flags trigger script execution before other processing
