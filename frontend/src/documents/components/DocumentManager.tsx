import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { 
  Loader2, 
  Plus, 
  Pencil, 
  Trash2, 
  Search,
  FolderPlus,
  Eye,
  FileText,
} from "lucide-react";
import { documentsApi } from "@/services/api/documents.service";
import { categoriesApi } from "@/services/api/categories.service";
import { AddToFolderDialog } from "@/documents/components/AddToFolderDialog";
import type { Document } from "@/types/document.types";
import type { Category } from "@/services/api/categories.service";

export function DocumentManager() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  
  // Add to folder dialog state
  const [folderDialogOpen, setFolderDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  
  // Delete confirmation dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [docs, cats] = await Promise.all([
        documentsApi.getDocuments(),
        categoriesApi.getAll(),
      ]);
      setDocuments(docs);
      setCategories(cats);
    } catch (error) {
      console.error("[DocumentManager] Failed to load data:", error);
      toast({
        variant: "destructive",
        title: "Error al cargar datos",
        description: error instanceof Error ? error.message : "Error desconocido",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToFolder = (document: Document) => {
    setSelectedDocument(document);
    setFolderDialogOpen(true);
  };

  const handleView = (slug: string) => {
    window.location.href = `/docs/${slug}`;
  };

  const handleEdit = (slug: string) => {
    window.location.href = `/docs/edit/${slug}`;
  };

  const handleDeleteClick = (doc: Document) => {
    setDocumentToDelete(doc);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!documentToDelete) return;

    try {
      await documentsApi.archiveDocument(documentToDelete.id);
      toast({
        title: "Documento archivado",
        description: `"${documentToDelete.title}" ha sido archivado.`,
      });
      setDeleteDialogOpen(false);
      setDocumentToDelete(null);
      loadData();
    } catch (error) {
      console.error("[DocumentManager] Failed to archive:", error);
      toast({
        variant: "destructive",
        title: "Error al archivar",
        description: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  };

  // Filter documents
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || doc.categoryId === selectedCategory;
    const matchesStatus = selectedStatus === "all" || doc.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return <Badge variant="default" className="bg-green-600">Publicado</Badge>;
      case "DRAFT":
        return <Badge variant="secondary">Borrador</Badge>;
      case "ARCHIVED":
        return <Badge variant="outline">Archivado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Documentos</h1>
          <p className="text-muted-foreground mt-1">
            Administra todos los documentos del sistema
          </p>
        </div>
        <Button onClick={() => window.location.href = '/docs/new'}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Documento
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por título o slug..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las categorías</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.icon} {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="PUBLISHED">Publicados</SelectItem>
            <SelectItem value="DRAFT">Borradores</SelectItem>
            <SelectItem value="ARCHIVED">Archivados</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-lg border p-4">
          <div className="text-2xl font-bold">{documents.length}</div>
          <div className="text-sm text-muted-foreground">Total</div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-2xl font-bold text-green-600">
            {documents.filter(d => d.status === "PUBLISHED").length}
          </div>
          <div className="text-sm text-muted-foreground">Publicados</div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-2xl font-bold text-yellow-600">
            {documents.filter(d => d.status === "DRAFT").length}
          </div>
          <div className="text-sm text-muted-foreground">Borradores</div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-2xl font-bold text-gray-600">
            {documents.filter(d => d.status === "ARCHIVED").length}
          </div>
          <div className="text-sm text-muted-foreground">Archivados</div>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="ml-3 text-muted-foreground">Cargando documentos...</span>
        </div>
      ) : filteredDocuments.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">
            {searchQuery || selectedCategory !== "all" || selectedStatus !== "all"
              ? "No se encontraron documentos con los filtros aplicados"
              : "No hay documentos creados"}
          </p>
          {!searchQuery && selectedCategory === "all" && selectedStatus === "all" && (
            <Button onClick={() => window.location.href = '/docs/new'} variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Crear primer documento
            </Button>
          )}
        </div>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead className="w-[200px]">Slug</TableHead>
                <TableHead className="w-[150px]">Categoría</TableHead>
                <TableHead className="w-[120px]">Estado</TableHead>
                <TableHead className="w-[150px]">Creado</TableHead>
                <TableHead className="w-[200px] text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.map((doc) => {
                const category = categories.find(c => c.id === doc.categoryId);
                
                return (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium">{doc.title}</TableCell>
                    <TableCell className="font-mono text-sm text-muted-foreground">
                      {doc.slug}
                    </TableCell>
                    <TableCell>
                      {category && (
                        <div className="flex items-center gap-2">
                          <span>{category.icon}</span>
                          <span className="text-sm">{category.name}</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(doc.status)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(doc.createdAt).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAddToFolder(doc)}
                          title="Agregar a carpeta"
                        >
                          <FolderPlus className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleView(doc.slug)}
                          title="Ver documento"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(doc.slug)}
                          title="Editar documento"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(doc)}
                          title="Archivar documento"
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

      {/* Add to Folder Dialog */}
      {selectedDocument && (
        <AddToFolderDialog
          documentId={selectedDocument.id}
          documentTitle={selectedDocument.title}
          open={folderDialogOpen}
          onOpenChange={setFolderDialogOpen}
          onSuccess={loadData}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Archivar documento?</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas archivar el documento "{documentToDelete?.title}"?
              Esta acción no eliminará el documento permanentemente, solo lo archivará.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Archivar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
