import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText, Folder, ArrowLeft, ChevronRight } from "lucide-react";
import { MOCK_FOLDERS } from "@/mocks/folders.mock";
import type { FolderNode } from "@/shared/types/folder-tree.types";

export function NewDocumentForm() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [selectedPath, setSelectedPath] = useState("");
  const [customPath, setCustomPath] = useState("");
  const [useCustomPath, setUseCustomPath] = useState(false);
  const [excerpt, setExcerpt] = useState("");

  // Extract all folder paths from MOCK_FOLDERS recursively
  const extractFolderPaths = (nodes: FolderNode[], paths: string[] = []): string[] => {
    for (const node of nodes) {
      if (node.type === 'folder') {
        paths.push(node.path);
        if (node.children) {
          extractFolderPaths(node.children, paths);
        }
      }
    }
    return paths;
  };

  const existingPaths = extractFolderPaths(MOCK_FOLDERS);

  // Generate slug from title
  const handleTitleChange = (value: string) => {
    setTitle(value);
    const generatedSlug = value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");
    setSlug(generatedSlug);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const finalPath = useCustomPath ? customPath : selectedPath;

    if (!title || !slug || !finalPath) {
      alert("Por favor completa todos los campos requeridos");
      return;
    }

    // Build full hierarchical path
    const documentPath = `${finalPath}/${title}`;

    // Redirect to editor with new document
    const params = new URLSearchParams({
      title,
      path: documentPath,
      excerpt: excerpt || "",
      new: "true",
    });

    window.location.href = `/docs/edit/${slug}?${params.toString()}`;
  };

  return (
    <div className="mx-auto max-w-3xl p-6">
      <div className="mb-8 space-y-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => window.location.href = "/docs"}
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

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4 rounded-lg border border-border bg-muted/30 p-6">
          <div className="space-y-2">
            <Label htmlFor="title">Título del Documento *</Label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Ej: Guía de Instalación"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug (URL) *</Label>
            <Input
              id="slug"
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="guia-de-instalacion"
              required
            />
            <p className="text-xs text-muted-foreground">
              Se generará automáticamente desde el título
            </p>
          </div>
        </div>

        <div className="space-y-4 rounded-lg border border-border bg-muted/30 p-6">
          <div className="flex gap-2">
            <Button
              type="button"
              variant={!useCustomPath ? "default" : "outline"}
              size="sm"
              onClick={() => setUseCustomPath(false)}
              className="flex-1"
            >
              <Folder className="mr-2 h-4 w-4" />
              Carpeta Existente
            </Button>
            <Button
              type="button"
              variant={useCustomPath ? "default" : "outline"}
              size="sm"
              onClick={() => setUseCustomPath(true)}
              className="flex-1"
            >
              <FileText className="mr-2 h-4 w-4" />
              Ruta Personalizada
            </Button>
          </div>

          {!useCustomPath ? (
            <div className="space-y-2">
              <Label htmlFor="path">Seleccionar Ubicación *</Label>
              <Select value={selectedPath} onValueChange={setSelectedPath} required>
                <SelectTrigger id="path">
                  <SelectValue placeholder="Selecciona una carpeta..." />
                </SelectTrigger>
                <SelectContent>
                  {existingPaths.map((path) => (
                    <SelectItem key={path} value={path}>
                      <div className="flex items-center gap-1.5 text-sm">
                        {path.split('/').map((segment, idx, arr) => (
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
                El documento se creará dentro de la carpeta seleccionada
              </p>
              {selectedPath && (
                <div className="mt-3 rounded-md bg-primary/5 border border-primary/20 p-3">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Vista previa de la ruta:</p>
                  <div className="flex items-center gap-1 text-sm">
                    {selectedPath.split('/').map((segment, idx) => (
                      <span key={idx} className="flex items-center">
                        {idx > 0 && <ChevronRight className="h-3.5 w-3.5 mx-0.5 text-muted-foreground" />}
                        <span className="text-primary font-medium">{segment}</span>
                      </span>
                    ))}
                    <ChevronRight className="h-3.5 w-3.5 mx-0.5 text-muted-foreground" />
                    <span className="text-foreground font-semibold">{title || 'Nuevo Documento'}</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="custom-path">Ruta Jerárquica Personalizada *</Label>
              <Input
                id="custom-path"
                type="text"
                value={customPath}
                onChange={(e) => setCustomPath(e.target.value)}
                placeholder="Ej: Equipo/Proyecto/Nuevas Guías"
                required={useCustomPath}
              />
              <p className="text-xs text-muted-foreground">
                Usa <code className="rounded bg-muted px-1 py-0.5">/</code> para separar niveles jerárquicos
              </p>
              {customPath && (
                <div className="mt-3 rounded-md bg-primary/5 border border-primary/20 p-3">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Vista previa de la ruta:</p>
                  <div className="flex items-center gap-1 text-sm">
                    {customPath.split('/').map((segment, idx) => (
                      <span key={idx} className="flex items-center">
                        {idx > 0 && <ChevronRight className="h-3.5 w-3.5 mx-0.5 text-muted-foreground" />}
                        <span className="text-primary font-medium">{segment}</span>
                      </span>
                    ))}
                    <ChevronRight className="h-3.5 w-3.5 mx-0.5 text-muted-foreground" />
                    <span className="text-foreground font-semibold">{title || 'Nuevo Documento'}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="space-y-4 rounded-lg border border-border bg-muted/30 p-6">
          <div className="space-y-2">
            <Label htmlFor="excerpt">Descripción breve (opcional)</Label>
            <Textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Breve descripción que aparecerá en la lista de documentos..."
              rows={3}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => window.history.back()}>
            Cancelar
          </Button>
          <Button type="submit">
            Crear y Editar
          </Button>
        </div>
      </form>
    </div>
  );
}
