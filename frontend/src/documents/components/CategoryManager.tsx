import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Plus, Pencil, Trash2, MoveUp, MoveDown } from "lucide-react";
import { categoriesApi, type Category } from "@/services/api/categories.service";

interface CategoryFormData {
  id: string;
  name: string;
  icon: string;
  order: number;
}

export function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState<CategoryFormData>({
    id: "",
    name: "",
    icon: "",
    order: 0,
  });

  const { toast } = useToast();

  // Load categories
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setIsLoading(true);
    try {
      const data = await categoriesApi.getAll();
      setCategories(data.sort((a, b) => a.order - b.order));
    } catch (error) {
      console.error("[CategoryManager] Failed to load categories:", error);
      toast({
        variant: "destructive",
        title: "Error al cargar categorías",
        description: error instanceof Error ? error.message : "Error desconocido",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Open create dialog
  const handleCreate = () => {
    setEditingCategory(null);
    setFormData({
      id: "",
      name: "",
      icon: "",
      order: categories.length,
    });
    setIsDialogOpen(true);
  };

  // Open edit dialog
  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      id: category.id,
      name: category.name,
      icon: category.icon,
      order: category.order,
    });
    setIsDialogOpen(true);
  };

  // Open delete confirmation
  const handleDeleteClick = (category: Category) => {
    setDeletingCategory(category);
    setIsDeleteDialogOpen(true);
  };

  // Save category (create or update)
  const handleSave = async () => {
    if (!formData.id || !formData.name || !formData.icon) {
      toast({
        variant: "destructive",
        title: "Campos incompletos",
        description: "Por favor completa todos los campos requeridos",
      });
      return;
    }

    setIsSaving(true);
    try {
      if (editingCategory) {
        // Update
        await categoriesApi.updateCategory(formData.id, {
          name: formData.name,
          icon: formData.icon,
          order: formData.order,
        });
        toast({
          title: "Categoría actualizada",
          description: `La categoría "${formData.name}" ha sido actualizada exitosamente.`,
        });
      } else {
        // Create
        await categoriesApi.createCategory(formData);
        toast({
          title: "Categoría creada",
          description: `La categoría "${formData.name}" ha sido creada exitosamente.`,
        });
      }
      
      setIsDialogOpen(false);
      loadCategories();
      
      // Dispatch event para que otros componentes recarguen categorías
      window.dispatchEvent(new CustomEvent('categories:refresh'));
    } catch (error) {
      console.error("[CategoryManager] Failed to save category:", error);
      toast({
        variant: "destructive",
        title: "Error al guardar categoría",
        description: error instanceof Error ? error.message : "Error desconocido",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Delete category
  const handleDelete = async () => {
    if (!deletingCategory) return;

    setIsSaving(true);
    try {
      await categoriesApi.deleteCategory(deletingCategory.id);
      toast({
        title: "Categoría eliminada",
        description: `La categoría "${deletingCategory.name}" ha sido eliminada.`,
      });
      
      setIsDeleteDialogOpen(false);
      setDeletingCategory(null);
      loadCategories();
      
      // Dispatch event para que otros componentes recarguen categorías
      window.dispatchEvent(new CustomEvent('categories:refresh'));
    } catch (error) {
      console.error("[CategoryManager] Failed to delete category:", error);
      toast({
        variant: "destructive",
        title: "Error al eliminar categoría",
        description: error instanceof Error ? error.message : "Error desconocido",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Reorder categories
  const handleReorder = async (category: Category, direction: "up" | "down") => {
    const currentIndex = categories.findIndex(c => c.id === category.id);
    if (
      (direction === "up" && currentIndex === 0) ||
      (direction === "down" && currentIndex === categories.length - 1)
    ) {
      return;
    }

    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    const newCategories = [...categories];
    const [moved] = newCategories.splice(currentIndex, 1);
    newCategories.splice(newIndex, 0, moved);

    // Update order values
    const updates = newCategories.map((cat, idx) => ({
      ...cat,
      order: idx,
    }));

    setCategories(updates);

    // Save to backend
    try {
      await categoriesApi.updateCategory(category.id, {
        name: category.name,
        icon: category.icon,
        order: newIndex,
      });
      
      toast({
        title: "Orden actualizado",
        description: "El orden de las categorías ha sido actualizado.",
      });
    } catch (error) {
      console.error("[CategoryManager] Failed to reorder:", error);
      toast({
        variant: "destructive",
        title: "Error al reordenar",
        description: "No se pudo actualizar el orden.",
      });
      // Revert on error
      loadCategories();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Categorías</h1>
          <p className="text-muted-foreground mt-1">
            Administra las categorías de documentos del sistema
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Categoría
        </Button>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="ml-3 text-muted-foreground">Cargando categorías...</span>
        </div>
      ) : categories.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground mb-4">No hay categorías creadas</p>
          <Button onClick={handleCreate} variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Crear primera categoría
          </Button>
        </div>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px]">Orden</TableHead>
                <TableHead className="w-[60px]">Icono</TableHead>
                <TableHead className="w-[200px]">ID</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead className="w-[150px]">Documentos</TableHead>
                <TableHead className="w-[200px] text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category, index) => (
                <TableRow key={category.id}>
                  <TableCell className="font-mono text-sm">
                    {category.order}
                  </TableCell>
                  <TableCell className="text-2xl">{category.icon}</TableCell>
                  <TableCell className="font-mono text-sm">
                    {category.id}
                  </TableCell>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>
                    {category.stats ? (
                      <div className="text-sm text-muted-foreground">
                        {category.stats.total} docs
                        {category.stats.published > 0 && (
                          <span className="ml-2 text-green-600">
                            ({category.stats.published} publicados)
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleReorder(category, "up")}
                        disabled={index === 0}
                      >
                        <MoveUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleReorder(category, "down")}
                        disabled={index === categories.length - 1}
                      >
                        <MoveDown className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(category)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClick(category)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Editar Categoría" : "Nueva Categoría"}
            </DialogTitle>
            <DialogDescription>
              {editingCategory
                ? "Modifica los datos de la categoría existente"
                : "Completa los datos para crear una nueva categoría"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="id">
                ID <span className="text-destructive">*</span>
              </Label>
              <Input
                id="id"
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                placeholder="getting-started"
                disabled={!!editingCategory}
              />
              <p className="text-xs text-muted-foreground">
                Identificador único (solo letras minúsculas y guiones)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">
                Nombre <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Getting Started"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="icon">
                Icono (Emoji) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="icon"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="🚀"
                className="text-2xl"
                maxLength={2}
              />
              <p className="text-xs text-muted-foreground">
                Usa un emoji para representar la categoría
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="order">Orden</Label>
              <Input
                id="order"
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
              />
              <p className="text-xs text-muted-foreground">
                Orden de aparición en la navegación
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isSaving}
            >
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : editingCategory ? (
                "Actualizar"
              ) : (
                "Crear"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente la categoría "
              {deletingCategory?.name}" y no podrá deshacerse.
              {deletingCategory?.stats && deletingCategory.stats.total > 0 && (
                <span className="block mt-2 font-semibold text-destructive">
                  ⚠️ Esta categoría contiene {deletingCategory.stats.total} documentos.
                  Considera reasignarlos antes de eliminar.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSaving}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isSaving}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Eliminando...
                </>
              ) : (
                "Eliminar"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
