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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Plus, Pencil, Trash2, Folder, ChevronRight } from "lucide-react";
import { foldersApi } from "@/services/api/folders.service";
import type { FolderNode } from "@/folders/types/folder-tree.types";

interface FolderFormData {
  name: string;
  parentId: number | null;
  icon?: string;
  order: number;
}

interface DeletePreview {
  folderCount: number;
  documentCount: number;
  folderNames: string[];
}

export function FolderManager() {
  const [folders, setFolders] = useState<FolderNode[]>([]);
  const [flatFolders, setFlatFolders] = useState<FolderNode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingFolder, setEditingFolder] = useState<FolderNode | null>(null);
  const [deletingFolder, setDeletingFolder] = useState<FolderNode | null>(null);
  const [deletePreview, setDeletePreview] = useState<DeletePreview | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState<FolderFormData>({
    name: "",
    parentId: null,
    icon: "📁",
    order: 0,
  });

  const { toast } = useToast();

  // Extract all folders recursively for flat list and dropdown
  const extractFolders = (nodes: FolderNode[], list: FolderNode[] = []): FolderNode[] => {
    for (const node of nodes) {
      if (node.type === 'folder') {
        list.push(node);
        if (node.children) {
          extractFolders(node.children, list);
        }
      }
    }
    return list;
  };

  // Load folders
  useEffect(() => {
    loadFolders();
  }, []);

  const loadFolders = async () => {
    setIsLoading(true);
    try {
      const tree = await foldersApi.getFolderTree();
      setFolders([...tree]); // Crear nueva referencia
      const flat = extractFolders(tree, []); // Pasar array vacío explícito
      setFlatFolders([...flat]); // Crear nueva referencia
    } catch (error) {
      console.error("[FolderManager] Failed to load folders:", error);
      toast({
        variant: "destructive",
        title: "Error al cargar carpetas",
        description: error instanceof Error ? error.message : "Error desconocido",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Open create dialog
  const handleCreate = () => {
    setEditingFolder(null);
    setFormData({
      name: "",
      parentId: null,
      icon: "📁",
      order: flatFolders.length,
    });
    setIsDialogOpen(true);
  };

  // Open edit dialog
  const handleEdit = (folder: FolderNode) => {
    setEditingFolder(folder);
    
    // Extract parentId from path (get parent folder path and find its id)
    const pathParts = folder.path.split('/');
    const parentPath = pathParts.length > 1 ? pathParts.slice(0, -1).join('/') : null;
    const parent = parentPath ? flatFolders.find(f => f.path === parentPath) : null;
    
    setFormData({
      name: folder.name,
      parentId: parent ? parseInt(parent.id) : null,
      icon: folder.icon || "📁",
      order: folder.order || 0,
    });
    setIsDialogOpen(true);
  };

  // Open delete confirmation with preview
  const handleDeleteClick = async (folder: FolderNode) => {
    setDeletingFolder(folder);
    setDeletePreview(null);
    setIsDeleteDialogOpen(true);
    
    // Load delete preview
    setIsLoadingPreview(true);
    try {
      const preview = await foldersApi.getDeletePreview(parseInt(folder.id));
      setDeletePreview(preview);
    } catch (error) {
      console.error("[FolderManager] Failed to load delete preview:", error);
      toast({
        variant: "destructive",
        title: "Error al cargar información",
        description: "No se pudo obtener la información de eliminación",
      });
    } finally {
      setIsLoadingPreview(false);
    }
  };

  // Generate path based on parent and name
  const generatePath = (parentId: number | null, name: string): string => {
    if (!parentId) return name;
    const parent = flatFolders.find(f => parseInt(f.id) === parentId);
    return parent ? `${parent.path}/${name}` : name;
  };

  // Save folder (create or update)
  const handleSave = async () => {
    if (!formData.name) {
      toast({
        variant: "destructive",
        title: "Nombre requerido",
        description: "Por favor ingresa un nombre para la carpeta",
      });
      return;
    }

    setIsSaving(true);
    try {
      const path = generatePath(formData.parentId, formData.name);
      
      if (editingFolder) {
        // Update
        await foldersApi.updateFolder(parseInt(editingFolder.id), {
          name: formData.name,
          parentId: formData.parentId ?? undefined,
          icon: formData.icon,
          order: formData.order,
        });
        toast({
          title: "Carpeta actualizada",
          description: `La carpeta "${formData.name}" ha sido actualizada exitosamente.`,
        });
      } else {
        // Create
        await foldersApi.createFolder({
          name: formData.name,
          parentId: formData.parentId ?? undefined,
          path,
          type: 'FOLDER',
          icon: formData.icon,
          order: formData.order,
        });
        toast({
          title: "Carpeta creada",
          description: `La carpeta "${formData.name}" ha sido creada exitosamente.`,
        });
      }
      
      setIsDialogOpen(false);
      loadFolders();
    } catch (error) {
      console.error("[FolderManager] Failed to save folder:", error);
      toast({
        variant: "destructive",
        title: "Error al guardar carpeta",
        description: error instanceof Error ? error.message : "Error desconocido",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Delete folder recursively
  const handleDelete = async () => {
    if (!deletingFolder) return;

    setIsSaving(true);
    try {
      const result = await foldersApi.deleteFolderRecursive(parseInt(deletingFolder.id));
      
      // Cerrar diálogo y limpiar estado primero
      setIsDeleteDialogOpen(false);
      setDeletingFolder(null);
      setDeletePreview(null);
      
      // Forzar recarga completa
      setFolders([]);
      setFlatFolders([]);
      
      // Recargar carpetas desde el servidor
      await loadFolders();
      
      toast({
        title: "Carpeta eliminada",
        description: result.message,
      });
    } catch (error) {
      console.error("[FolderManager] Failed to delete folder:", error);
      toast({
        variant: "destructive",
        title: "Error al eliminar carpeta",
        description: error instanceof Error ? error.message : "Error desconocido",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Carpetas</h1>
          <p className="text-muted-foreground mt-1">
            Administra la estructura jerárquica de carpetas del sistema
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Carpeta
        </Button>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="ml-3 text-muted-foreground">Cargando carpetas...</span>
        </div>
      ) : flatFolders.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground mb-4">No hay carpetas creadas</p>
          <Button onClick={handleCreate} variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Crear primera carpeta
          </Button>
        </div>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px]">Icono</TableHead>
                <TableHead>Ruta Jerárquica</TableHead>
                <TableHead className="w-[100px]">Orden</TableHead>
                <TableHead className="w-[150px]">Hijos</TableHead>
                <TableHead className="w-[150px] text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {flatFolders.map((folder) => {
                const childCount = folder.children?.filter(c => c.type === 'folder').length || 0;
                
                return (
                  <TableRow key={folder.id}>
                    <TableCell className="text-2xl">{folder.icon || "📁"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm">
                        {folder.path.split('/').map((segment: string, idx: number, arr: string[]) => (
                          <span key={idx} className="flex items-center">
                            {idx > 0 && <ChevronRight className="h-3 w-3 mx-0.5 text-muted-foreground" />}
                            <span className={idx === arr.length - 1 ? 'font-medium' : 'text-muted-foreground'}>
                              {segment}
                            </span>
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {folder.order || 0}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {childCount > 0 ? (
                          <span>{childCount} carpeta{childCount > 1 ? 's' : ''}</span>
                        ) : (
                          <span>Sin hijos</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(folder)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(folder)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingFolder ? "Editar Carpeta" : "Nueva Carpeta"}
            </DialogTitle>
            <DialogDescription>
              {editingFolder
                ? "Modifica los datos de la carpeta existente"
                : "Completa los datos para crear una nueva carpeta"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                Nombre <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Mi Carpeta"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="parent">Carpeta Padre (Opcional)</Label>
              <Select 
                value={formData.parentId?.toString() || "root"} 
                onValueChange={(value) => setFormData({ ...formData, parentId: value === "root" ? null : parseInt(value) })}
              >
                <SelectTrigger id="parent">
                  <SelectValue placeholder="Raíz (sin padre)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="root">
                    <div className="flex items-center gap-2">
                      <Folder className="h-4 w-4" />
                      <span>Raíz (sin padre)</span>
                    </div>
                  </SelectItem>
                  {flatFolders
                    .filter(f => !editingFolder || f.id !== editingFolder.id) // Don't allow self as parent
                    .map((folder) => (
                      <SelectItem key={folder.id} value={folder.id}>
                        <div className="flex items-center gap-1.5 text-sm">
                          {folder.path.split('/').map((segment: string, idx: number, arr: string[]) => (
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
                La ruta se generará automáticamente: {generatePath(formData.parentId, formData.name || "Nombre")}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="icon">Icono (Emoji)</Label>
              <Input
                id="icon"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="📁"
                className="text-2xl"
                maxLength={2}
              />
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
              ) : editingFolder ? (
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
            <AlertDialogTitle>⚠️ Eliminar Carpeta y Todo su Contenido</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3">
                <p>
                  Estás a punto de eliminar permanentemente la carpeta "
                  <strong>{deletingFolder?.name}</strong>" y <strong>todo su contenido relacionado</strong>.
                </p>
                
                {isLoadingPreview ? (
                  <div className="flex items-center gap-2 text-sm">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Calculando elementos a eliminar...</span>
                  </div>
                ) : deletePreview ? (
                  <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 space-y-2">
                    <p className="font-semibold text-destructive">
                      Se eliminarán los siguientes elementos:
                    </p>
                    <ul className="text-sm space-y-1 ml-4 list-disc">
                      <li>
                        <strong>{deletePreview.folderCount}</strong> carpeta(s)
                        {deletePreview.folderCount > 1 && " (incluyendo subcarpetas)"}
                      </li>
                      {deletePreview.documentCount > 0 && (
                        <li>
                          <strong>{deletePreview.documentCount}</strong> documento(s) asociado(s)
                        </li>
                      )}
                    </ul>
                    
                    {deletePreview.folderNames.length > 1 && (
                      <details className="mt-3 text-sm">
                        <summary className="cursor-pointer font-medium hover:text-destructive">
                          Ver carpetas afectadas ({deletePreview.folderNames.length})
                        </summary>
                        <ul className="mt-2 ml-4 space-y-1 text-muted-foreground list-disc">
                          {deletePreview.folderNames.map((name, idx) => (
                            <li key={idx}>{name}</li>
                          ))}
                        </ul>
                      </details>
                    )}
                  </div>
                ) : null}
                
                <p className="text-destructive font-semibold">
                  Esta acción no se puede deshacer.
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSaving}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isSaving || isLoadingPreview}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Eliminando...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Eliminar Todo
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
