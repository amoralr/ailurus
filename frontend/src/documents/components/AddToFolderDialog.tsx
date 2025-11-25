import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { documentsApi } from "@/services/api/documents.service";
import { foldersApi } from "@/services/api/folders.service";
import { Loader2, ChevronRight } from "lucide-react";
import type { FolderNode } from "@/folders/types/folder-tree.types";

interface AddToFolderDialogProps {
  documentId: number;
  documentTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AddToFolderDialog({
  documentId,
  documentTitle,
  open,
  onOpenChange,
  onSuccess,
}: AddToFolderDialogProps) {
  const [folders, setFolders] = useState<FolderNode[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Extract all folders recursively for dropdown
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

  // Load folders when dialog opens
  useEffect(() => {
    if (open) {
      loadFolders();
    } else {
      // Reset state when dialog closes
      setSelectedFolderId("");
    }
  }, [open]);

  const loadFolders = async () => {
    setIsLoading(true);
    try {
      const structure = await foldersApi.getFolderTree();
      const folderList = extractFolders(structure);
      setFolders(folderList);
    } catch (error) {
      console.error('[AddToFolderDialog] Error loading folders:', error);
      toast({
        variant: "destructive",
        title: "Error al cargar carpetas",
        description: error instanceof Error ? error.message : "Error desconocido",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFolderId) {
      toast({
        variant: "destructive",
        title: "Carpeta no seleccionada",
        description: "Por favor selecciona una carpeta",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await documentsApi.addToFolder(documentId, parseInt(selectedFolderId));
      
      toast({
        title: "Documento agregado",
        description: `"${documentTitle}" ha sido agregado a la carpeta exitosamente`,
      });

      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error('[AddToFolderDialog] Error adding to folder:', error);
      toast({
        variant: "destructive",
        title: "Error al agregar a carpeta",
        description: error instanceof Error ? error.message : "Error desconocido",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Agregar a Carpeta</DialogTitle>
          <DialogDescription>
            Asocia el documento "{documentTitle}" con una carpeta existente
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : folders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No hay carpetas disponibles</p>
              <p className="text-sm mt-2">Crea una carpeta primero en el panel de administración</p>
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="folder">Seleccionar Carpeta</Label>
              <Select value={selectedFolderId} onValueChange={setSelectedFolderId}>
                <SelectTrigger id="folder">
                  <SelectValue placeholder="Selecciona una carpeta..." />
                </SelectTrigger>
                <SelectContent>
                  {folders.map((folder) => (
                    <SelectItem key={folder.id} value={folder.id.toString()}>
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
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !selectedFolderId || isLoading}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Agregar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
