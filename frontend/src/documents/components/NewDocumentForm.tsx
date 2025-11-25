import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { FileText, Folder, ArrowLeft, ChevronRight, Loader2, AlertCircle } from "lucide-react";
import { foldersApi } from "@/services/api/folders.service";
import { documentsApi } from "@/services/api/documents.service";
import { categoriesApi, type Category } from "@/services/api/categories.service";
import { MOCK_FOLDERS } from "@/mocks/folders.mock";
import type { FolderNode } from "@/shared/types/folder-tree.types";

export function NewDocumentForm() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [titleError, setTitleError] = useState("");
  const [slugError, setSlugError] = useState("");
  
  // New category creation state
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryIcon, setNewCategoryIcon] = useState("📄");
  
  // Pending new category (persists after closing creation mode)
  const [pendingNewCategory, setPendingNewCategory] = useState<{id: string; name: string; icon: string} | null>(null);
  
  // Folder/Path selection state
  const [pathMode, setPathMode] = useState<'auto' | 'custom'>('auto');
  const [customPath, setCustomPath] = useState("");
  const [folders, setFolders] = useState<FolderNode[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<string>("");
  
  const { toast } = useToast();

  // Extract all folders recursively for dropdown
  const extractAllFolders = (nodes: FolderNode[], list: FolderNode[] = []): FolderNode[] => {
    for (const node of nodes) {
      if (node.type === 'folder') {
        list.push(node);
      }
      if (node.children) {
        extractAllFolders(node.children, list);
      }
    }
    return list;
  };

  // Load categories from API
  const loadCategories = async () => {
    const USE_MOCKS = import.meta.env.PUBLIC_USE_MOCKS === "true";
    
    try {
      if (!USE_MOCKS) {
        const cats = await categoriesApi.getAll();
        console.log('[NewDocumentForm] Categories loaded:', cats.length, cats.map(c => c.name));
        setCategories(cats);
        if (cats.length > 0 && !selectedCategory) {
          setSelectedCategory(cats[0].id);
        }
      } else {
        // Mock categories
        const mockCategories: Category[] = [
          { id: 'getting-started', name: 'Getting Started', icon: '🚀', order: 0, stats: { published: 0, draft: 0, archived: 0, total: 0 } },
          { id: 'architecture', name: 'Architecture', icon: '🏗️', order: 1, stats: { published: 0, draft: 0, archived: 0, total: 0 } },
          { id: 'api', name: 'API Reference', icon: '📚', order: 2, stats: { published: 0, draft: 0, archived: 0, total: 0 } },
          { id: 'guides', name: 'Guides', icon: '📖', order: 3, stats: { published: 0, draft: 0, archived: 0, total: 0 } },
        ];
        setCategories(mockCategories);
        if (!selectedCategory) {
          setSelectedCategory('getting-started');
        }
      }
    } catch (error) {
      console.error("[NewDocumentForm] Failed to load categories:", error);
      toast({
        variant: "destructive",
        title: "Error al cargar categorías",
        description: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  };

  // Load folders and categories from API or mocks
  useEffect(() => {
    const loadData = async () => {
      const USE_MOCKS = import.meta.env.PUBLIC_USE_MOCKS === "true";
      
      console.log('[NewDocumentForm] Loading data...');
      try {
        // Load folders
        const folderTree = USE_MOCKS 
          ? MOCK_FOLDERS 
          : await foldersApi.getFolderTree();
        setFolders(folderTree);
        console.log('[NewDocumentForm] Folders loaded:', folderTree.length);
        
        // Load categories
        await loadCategories();
      } catch (error) {
        console.error("[NewDocumentForm] Failed to load data:", error);
        toast({
          variant: "destructive",
          title: "Error al cargar datos",
          description: error instanceof Error ? error.message : "Error desconocido",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();

    // Listen for category refresh events
    const handleCategoryRefresh = () => {
      console.log('[NewDocumentForm] Refreshing categories...');
      loadCategories();
    };

    window.addEventListener('categories:refresh', handleCategoryRefresh);

    return () => {
      window.removeEventListener('categories:refresh', handleCategoryRefresh);
    };
  }, [toast]);

  // Generate slug from title
  const handleTitleChange = (value: string) => {
    setTitle(value);
    setTitleError("");
    
    // Validation
    if (value.length > 100) {
      setTitleError("El título no puede exceder 100 caracteres");
    }
    
    const generatedSlug = value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");
    setSlug(generatedSlug);
    setSlugError("");
  };

  // Validate slug on change
  const handleSlugChange = (value: string) => {
    setSlug(value);
    setSlugError("");
    
    if (value.length > 100) {
      setSlugError("El slug no puede exceder 100 caracteres");
    } else if (!/^[a-z0-9-]*$/.test(value)) {
      setSlugError("El slug solo puede contener letras minúsculas, números y guiones");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!title || !slug || !selectedCategory) {
      toast({
        variant: "destructive",
        title: "Campos incompletos",
        description: "Por favor completa todos los campos requeridos",
      });
      return;
    }

    if (titleError || slugError) {
      toast({
        variant: "destructive",
        title: "Errores de validación",
        description: "Por favor corrige los errores en el formulario",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const USE_MOCKS = import.meta.env.PUBLIC_USE_MOCKS === "true";
      
      // Get category name (from existing or new category)
      const categoryName = isCreatingCategory 
        ? newCategoryName 
        : categories.find(c => c.id === selectedCategory)?.name || selectedCategory;
      
      // Determine document path based on mode
      let documentPath: string;
      if (pathMode === 'custom' && customPath.trim()) {
        // Use custom path (add category prefix if not included, and always add title at the end)
        const basePath = customPath.startsWith(categoryName) 
          ? customPath 
          : `${categoryName}/${customPath}`;
        documentPath = `${basePath}/${title}`;
      } else if (selectedFolderId) {
        // Use selected folder path
        const findFolderPath = (nodes: FolderNode[], id: string): string | null => {
          for (const node of nodes) {
            if (node.id === id) return node.path;
            if (node.children) {
              const found = findFolderPath(node.children, id);
              if (found) return found;
            }
          }
          return null;
        };
        const folderPath = findFolderPath(folders, selectedFolderId);
        documentPath = folderPath ? `${folderPath}/${title}` : `${categoryName}/${title}`;
      } else {
        // Auto-generate path from category
        documentPath = `${categoryName}/${title}`;
      }

      if (!USE_MOCKS) {
        // Create document in API (backend will auto-create category if it doesn't exist)
        const payload = {
          title,
          content: `# ${title}\n\nEmpieza a escribir tu documento aquí...\n`,
          path: documentPath,
          categoryId: selectedCategory,
          categoryName: pendingNewCategory ? pendingNewCategory.name : undefined,
          categoryIcon: pendingNewCategory ? pendingNewCategory.icon : undefined,
          excerpt: excerpt || undefined,
          status: 'DRAFT' as const,
          createdBy: 'Usuario' // TODO: Get from auth
        };
        
        console.log('\n========================================');
        console.log('[NewDocumentForm] CREATING DOCUMENT');
        console.log('[NewDocumentForm] hasPendingCategory:', !!pendingNewCategory);
        console.log('[NewDocumentForm] pendingNewCategory:', pendingNewCategory);
        console.log('[NewDocumentForm] Payload object:', payload);
        console.log('[NewDocumentForm] Payload.categoryName:', payload.categoryName);
        console.log('[NewDocumentForm] Payload.categoryIcon:', payload.categoryIcon);
        console.log('[NewDocumentForm] Payload as JSON:', JSON.stringify(payload, null, 2));
        console.log('========================================\n');
        
        const newDoc = await documentsApi.createDocument(payload);

        console.log('[NewDocumentForm] Document created:', newDoc);
        
        // Si se creó una nueva categoría, recargar desde el backend
        if (pendingNewCategory) {
          console.log('[NewDocumentForm] New category created, reloading categories from backend...');
          await loadCategories();
          // Dispatch event para que otros componentes también recarguen
          window.dispatchEvent(new CustomEvent('categories:refresh'));
          // Limpiar categoría pendiente
          setPendingNewCategory(null);
        }
        
        toast({
          title: "¡Documento creado!",
          description: `El documento "${title}" ha sido creado exitosamente.`,
        });
        
        // Dispatch event to refresh sidebar
        window.dispatchEvent(new CustomEvent('sidebar:refresh'));
        
        // Redirect to editor with created document
        setTimeout(() => {
          window.location.href = `/docs/edit/${newDoc.slug || slug}`;
        }, 500);
      } else {
        // Modo mocks: redirigir directamente con params
        const params = new URLSearchParams({
          title,
          path: documentPath,
          excerpt: excerpt || "",
          new: "true",
        });

        toast({
          title: "¡Documento creado!",
          description: `Redirigiendo al editor...`,
        });

        setTimeout(() => {
          window.location.replace(`/docs/edit/${slug}?${params.toString()}`);
        }, 500);
      }
    } catch (error) {
      console.error('[NewDocumentForm] Failed to create document:', error);
      toast({
        variant: "destructive",
        title: "Error al crear documento",
        description: error instanceof Error ? error.message : "Error desconocido",
      });
      setIsSubmitting(false);
    }
  };



  return (
    <div className="mx-auto max-w-4xl p-6 space-y-8">
      {/* Breadcrumb Navigation */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/docs">Documentación</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Nuevo Documento</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="space-y-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => window.location.replace("/docs")}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a documentación
        </Button>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Crear Nuevo Documento</h1>
            <p className="text-muted-foreground">
              Define el título, ubicación jerárquica y descripción del documento
            </p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-72 mt-2" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>Información Básica</CardTitle>
              <CardDescription>
                Define el título y slug del documento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">
                  Título del Documento <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Ej: Guía de Instalación"
                  className={titleError ? "border-destructive" : ""}
                  required
                />
                <div className="flex items-center justify-between">
                  {titleError && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {titleError}
                    </p>
                  )}
                  <p className={`text-xs ${title.length > 100 ? "text-destructive" : "text-muted-foreground"} ml-auto`}>
                    {title.length}/100 caracteres
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">
                  Slug (URL) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="slug"
                  type="text"
                  value={slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  placeholder="guia-de-instalacion"
                  className={slugError ? "border-destructive" : ""}
                  required
                />
                {slugError ? (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {slugError}
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Se genera automáticamente desde el título
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Category Selection Card */}
          <Card>
            <CardHeader>
              <CardTitle>Categoría</CardTitle>
              <CardDescription>
                Selecciona una categoría existente o crea una nueva
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isCreatingCategory ? (
                <>
                  {/* Mostrar categoría pendiente si existe */}
                  {pendingNewCategory ? (
                    <div className="space-y-2">
                      <Label>Categoría seleccionada</Label>
                      <div className="rounded-lg border-2 border-primary bg-primary/10 p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{pendingNewCategory.icon}</span>
                            <div>
                              <p className="font-semibold text-primary">{pendingNewCategory.name}</p>
                              <p className="text-xs text-muted-foreground">Nueva categoría (se creará automáticamente)</p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setPendingNewCategory(null);
                              setSelectedCategory("");
                              setNewCategoryName("");
                              setNewCategoryIcon("📄");
                            }}
                          >
                            Cambiar
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label htmlFor="category">
                        Categoría <span className="text-destructive">*</span>
                      </Label>
                      <Select value={selectedCategory} onValueChange={setSelectedCategory} required>
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Selecciona una categoría..." />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              <div className="flex items-center gap-2">
                                <span>{category.icon}</span>
                                <span>{category.name}</span>
                                {category.stats && (
                                  <span className="text-xs text-muted-foreground">
                                    ({category.stats.total} docs)
                                  </span>
                                )}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setIsCreatingCategory(true)}
                  >
                    <span className="text-lg mr-2">+</span>
                    {pendingNewCategory ? 'Crear Otra Categoría' : 'Crear Nueva Categoría'}
                  </Button>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="newCategoryName">
                      Nombre de la Nueva Categoría <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="newCategoryName"
                      type="text"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="Ej: Guías, Tutoriales, API..."
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="newCategoryIcon">
                      Icono (Emoji)
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="newCategoryIcon"
                        type="text"
                        value={newCategoryIcon}
                        onChange={(e) => setNewCategoryIcon(e.target.value)}
                        placeholder="📄"
                        className="w-20 text-center text-xl"
                        maxLength={2}
                      />
                      <div className="flex gap-1">
                        {['📄', '📚', '🚀', '⚙️', '🔧', '📖', '💡', '🎯'].map((emoji) => (
                          <Button
                            key={emoji}
                            type="button"
                            variant="outline"
                            size="sm"
                            className="text-lg"
                            onClick={() => setNewCategoryIcon(emoji)}
                          >
                            {emoji}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => {
                        setIsCreatingCategory(false);
                        setNewCategoryName("");
                        setNewCategoryIcon("📄");
                        setPendingNewCategory(null);
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button 
                      type="button" 
                      className="flex-1"
                      onClick={() => {
                        if (newCategoryName.trim()) {
                          const newCatId = newCategoryName.toLowerCase().replace(/\s+/g, '-');
                          // Guardar categoría pendiente de creación
                          setPendingNewCategory({
                            id: newCatId,
                            name: newCategoryName,
                            icon: newCategoryIcon
                          });
                          setSelectedCategory(newCatId);
                          setIsCreatingCategory(false);
                          console.log('[NewDocumentForm] Pending new category:', { id: newCatId, name: newCategoryName, icon: newCategoryIcon });
                        }
                      }}
                      disabled={!newCategoryName.trim()}
                    >
                      Usar esta Categoría
                    </Button>
                  </div>
                  
                  {newCategoryName && (
                    <div className="rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 p-3">
                      <p className="text-xs text-blue-700 dark:text-blue-300 font-medium mb-1">
                        Vista previa:
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{newCategoryIcon}</span>
                        <span className="font-medium">{newCategoryName}</span>
                        <span className="text-xs text-muted-foreground">({newCategoryName.toLowerCase().replace(/\s+/g, '-')})</span>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Location/Path Card */}
          <Card>
            <CardHeader>
              <CardTitle>Ubicación del Documento</CardTitle>
              <CardDescription>
                Elige dónde se guardará el documento en la estructura de carpetas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Path Mode Selector */}
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={pathMode === 'auto' ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={() => {
                    setPathMode('auto');
                    setSelectedFolderId("");
                    setCustomPath("");
                  }}
                >
                  📂 Automático
                </Button>
                <Button
                  type="button"
                  variant={pathMode === 'custom' ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={() => setPathMode('custom')}
                >
                  ✏️ Ruta Personalizada
                </Button>
              </div>

              {/* Auto Mode - Folder Selection */}
              {pathMode === 'auto' && (
                <div className="space-y-2">
                  <Label htmlFor="folder">Carpeta (Opcional)</Label>
                  <Select value={selectedFolderId || "__root__"} onValueChange={(val) => setSelectedFolderId(val === "__root__" ? "" : val)}>
                    <SelectTrigger id="folder">
                      <SelectValue placeholder="Raíz de categoría (por defecto)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__root__">
                        <div className="flex items-center gap-2">
                          <Folder className="h-4 w-4" />
                          <span>Raíz de categoría</span>
                        </div>
                      </SelectItem>
                      {extractAllFolders(folders).map((folder) => (
                        <SelectItem key={folder.id} value={folder.id}>
                          <div className="flex items-center gap-1.5 text-sm">
                            {folder.path.split('/').map((segment, idx, arr) => (
                              <span key={idx} className="flex items-center">
                                {idx > 0 && <ChevronRight className="h-3 w-3 mx-0.5 text-muted-foreground" />}
                                <span className={idx === arr.length - 1 ? 'font-medium' : 'text-muted-foreground'}>
                                  {segment}
                                </span>
                              </span>
                            ))}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Selecciona una carpeta existente o deja en blanco para la raíz
                  </p>
                </div>
              )}

              {/* Custom Mode - Path Input */}
              {pathMode === 'custom' && (
                <div className="space-y-2">
                  <Label htmlFor="customPath">
                    Ruta Personalizada <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="customPath"
                    type="text"
                    value={customPath}
                    onChange={(e) => setCustomPath(e.target.value)}
                    placeholder="Carpeta1/Subcarpeta/Archivo"
                    required={pathMode === 'custom'}
                  />
                  <p className="text-xs text-muted-foreground">
                    Usa "/" para crear subcarpetas. Ejemplo: <code className="px-1 py-0.5 bg-muted rounded">Guías/Avanzadas</code>
                  </p>
                </div>
              )}

              {/* Path Preview */}
              {(selectedCategory || pendingNewCategory) && (
                <div className="rounded-lg bg-muted/50 border border-muted p-4">
                  <p className="text-xs font-medium text-muted-foreground mb-2">
                    {pathMode === 'custom' ? 'Ruta personalizada:' : 'Ruta final:'}
                  </p>
                  <Breadcrumb>
                    <BreadcrumbList>
                      {(() => {
                        // Priorizar pendingNewCategory sobre selectedCategory
                        const categoryName = pendingNewCategory 
                          ? pendingNewCategory.name 
                          : (categories.find(c => c.id === selectedCategory)?.name || 'Categoría');
                        
                        const categoryIcon = pendingNewCategory 
                          ? pendingNewCategory.icon 
                          : (categories.find(c => c.id === selectedCategory)?.icon || '📄');
                        
                        let pathSegments: string[] = [];
                        
                        if (pathMode === 'custom' && customPath.trim()) {
                          // Custom path mode
                          pathSegments = customPath.split('/').filter(s => s.trim());
                        } else if (selectedFolderId) {
                          // Selected folder mode
                          const findFolder = (nodes: FolderNode[], id: string): FolderNode | null => {
                            for (const node of nodes) {
                              if (node.id === id) return node;
                              if (node.children) {
                                const found = findFolder(node.children, id);
                                if (found) return found;
                              }
                            }
                            return null;
                          };
                          const folder = findFolder(folders, selectedFolderId);
                          if (folder) {
                            pathSegments = folder.path.split('/').filter(s => s.trim());
                          }
                        } else {
                          // Auto mode - just category
                          pathSegments = [];
                        }
                        
                        return (
                          <>
                            <BreadcrumbItem>
                              <div className="flex items-center gap-1.5">
                                <span>{categoryIcon}</span>
                                <span className="text-primary font-medium">{categoryName}</span>
                              </div>
                            </BreadcrumbItem>
                            {pathSegments.map((segment, idx) => (
                              <span key={idx} className="flex items-center">
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                  <span className="text-muted-foreground">{segment}</span>
                                </BreadcrumbItem>
                              </span>
                            ))}
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                              <BreadcrumbPage className="font-semibold">
                                {title || 'Nuevo Documento'}
                              </BreadcrumbPage>
                            </BreadcrumbItem>
                          </>
                        );
                      })()}
                    </BreadcrumbList>
                  </Breadcrumb>
                  <div className="mt-3 flex items-start gap-2 text-xs text-muted-foreground">
                    <span className="text-green-600">✓</span>
                    <div>
                      <p className="font-medium mb-1">
                        {pathMode === 'custom' ? 'Se creará la estructura completa:' : 'Se creará automáticamente:'}
                      </p>
                      <ul className="list-disc list-inside space-y-1">
                        {pathMode === 'custom' && customPath ? (
                          <>
                            <li>Categoría: {pendingNewCategory ? pendingNewCategory.name : (categories.find(c => c.id === selectedCategory)?.name || 'Categoría')} {pendingNewCategory ? '(nueva)' : '(si no existe)'}</li>
                            <li>Carpetas intermedias: {customPath.split('/').filter(s => s.trim()).join(' → ') || 'ninguna'}</li>
                            <li>Carpeta del documento y entrada en sidebar</li>
                          </>
                        ) : selectedFolderId ? (
                          <>
                            <li>Documento dentro de la carpeta seleccionada</li>
                            <li>Entrada en el sidebar bajo esa ubicación</li>
                          </>
                        ) : (
                          <>
                            {pendingNewCategory && <li>Nueva categoría: {pendingNewCategory.name} {pendingNewCategory.icon}</li>}
                            <li>Carpeta del documento en la raíz de la categoría</li>
                            <li>Entrada en el sidebar</li>
                            <li>Jerarquía de navegación completa</li>
                          </>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
              {!selectedCategory && !pendingNewCategory && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Selecciona una categoría para ver la vista previa
                </p>
              )}
            </CardContent>
          </Card>

          {/* Description Card */}
          <Card>
            <CardHeader>
              <CardTitle>Descripción</CardTitle>
              <CardDescription>
                Agrega una breve descripción del documento (opcional)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="excerpt">Descripción breve</Label>
                <Textarea
                  id="excerpt"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Breve descripción que aparecerá en la lista de documentos..."
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  {excerpt.length}/200 caracteres recomendados
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex justify-end gap-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => window.history.back()}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting || !!titleError || !!slugError}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creando documento...
                </>
              ) : (
                "Crear y Editar"
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
