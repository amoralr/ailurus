import { useState, useEffect, useRef } from "react";
import { useStore } from "@nanostores/react";
import {
  editorStore,
  setEditing,
  setHasChanges,
  setAutoSaveEnabled,
  setSaving,
  setLastSaved,
} from "../stores/editor.store";
import { EditorService } from "../services/editor.service";
import { markdownService } from "@/markdown/services/markdown.service";
import { Save, Eye, EyeOff, Upload, X, Download, AlertCircle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { documentsApi } from "@/services/api/documents.service";
import "@/markdown/styles/markdown.css";

interface MarkdownEditorProps {
  slug: string;
  initialContent: string;
  title: string;
  isNew?: boolean;
  path?: string;
  excerpt?: string;
}

export function MarkdownEditor({
  slug,
  initialContent,
  title,
  isNew = false,
  path = "",
  excerpt = "",
}: MarkdownEditorProps) {
  const state = useStore(editorStore);
  const { toast } = useToast();
  const [content, setContent] = useState(initialContent);
  const [docTitle, setDocTitle] = useState(title);
  const [activeTab, setActiveTab] = useState("split");
  const [renderedContent, setRenderedContent] = useState("");
  const [documentId, setDocumentId] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(isNew);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Inicializar editor y crear draft si es nuevo
  useEffect(() => {
    setEditing(true);

    const initializeEditor = async () => {
      if (isNew) {
        // Crear documento como draft en la BD
        try {
          setIsCreating(true);
          const newDoc = await documentsApi.createDocument({
            title: docTitle,
            content: content,
            excerpt: excerpt,
            categoryId: "getting-started", // TODO: Obtener de form
            path: path,
            status: "DRAFT",
          });
          setDocumentId(newDoc.id);
          setIsCreating(false);
          toast({
            title: "Borrador creado",
            description: "El documento se guardó como borrador.",
          });
        } catch (error) {
          console.error("Error creating draft:", error);
          setIsCreating(false);
          toast({
            variant: "destructive",
            title: "Error",
            description: "No se pudo crear el borrador.",
          });
        }
      } else {
        // Obtener ID del documento existente
        try {
          const doc = await documentsApi.getDocumentBySlug(slug);
          setDocumentId(doc.id);
        } catch (error) {
          console.error("Error fetching document ID:", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "No se pudo cargar el documento.",
          });
        }
      }
    };

    initializeEditor();

    // Limpiar borradores antiguos de localStorage
    EditorService.cleanOldDrafts();

    return () => {
      setEditing(false);
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, []);

  // Renderizar preview cuando cambia el contenido
  useEffect(() => {
    if (activeTab === "split" || activeTab === "preview") {
      markdownService.render(content).then((rendered) => {
        setRenderedContent(rendered);
      });
    }
  }, [content, activeTab]);

  // Agregar botones de copiar a los bloques de código en el preview
  useEffect(() => {
    if (!renderedContent) return;

    // Esperar a que el DOM se actualice
    const timer = setTimeout(() => {
      document.querySelectorAll(".markdown-content pre code[data-code]").forEach((block) => {
        const pre = block.parentElement;
        if (!pre || pre.parentElement?.classList.contains("code-block-container")) return;

        // Create copy button
        const button = document.createElement("button");
        button.className = "copy-button";
        button.innerHTML = `
          <svg class="copy-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          <span class="copy-text">Copy</span>
        `;

        // Wrap pre in container
        const container = document.createElement("div");
        container.className = "code-block-container";
        pre.parentNode?.insertBefore(container, pre);
        container.appendChild(pre);

        // Add language label
        const lang = block.getAttribute("data-lang") || "text";
        const langLabel = document.createElement("div");
        langLabel.className = "code-block-header";
        langLabel.innerHTML = `<span class="code-lang">${lang}</span>`;
        langLabel.appendChild(button);
        container.insertBefore(langLabel, pre);

        // Copy functionality
        button.addEventListener("click", async () => {
          const code = decodeURIComponent(block.getAttribute("data-code") || "");

          try {
            await navigator.clipboard.writeText(code);
            button.classList.add("copied");
            const text = button.querySelector(".copy-text");
            if (text) text.textContent = "Copied!";

            setTimeout(() => {
              button.classList.remove("copied");
              if (text) text.textContent = "Copy";
            }, 2000);
          } catch (err) {
            console.error("Failed to copy:", err);
          }
        });
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [renderedContent]);

  // Auto-save cada 5 segundos si hay cambios
  useEffect(() => {
    if (!state.hasUnsavedChanges || !state.autoSaveEnabled) return;

    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    autoSaveTimerRef.current = setTimeout(() => {
      handleSave();
    }, 5000);

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [content, state.hasUnsavedChanges, state.autoSaveEnabled]);

  // Warning al salir con cambios sin guardar
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (state.hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [state.hasUnsavedChanges]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setHasChanges(true);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDocTitle(e.target.value);
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!documentId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se encontró el ID del documento.",
      });
      return;
    }

    try {
      setSaving(true);
      
      await documentsApi.updateDraft(documentId, {
        title: docTitle,
        content: content,
        excerpt: excerpt,
        path: path,
      });

      setLastSaved(new Date());
      setHasChanges(false);
      
      toast({
        title: "Guardado",
        description: "Los cambios se guardaron correctamente.",
      });
    } catch (error) {
      console.error("Error al guardar:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron guardar los cambios.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!documentId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Debes guardar el documento primero.",
      });
      return;
    }

    // Primero guardar cambios si los hay
    if (state.hasUnsavedChanges) {
      await handleSave();
    }

    const confirmed = window.confirm("¿Quieres publicar este documento?");
    if (!confirmed) return;

    try {
      setSaving(true);
      await documentsApi.publishDocument(documentId);
      
      toast({
        title: "Publicado",
        description: "El documento se publicó exitosamente.",
      });
      
      // Redirigir después de un breve delay
      setTimeout(() => {
        window.location.href = `/docs/${slug}`;
      }, 1000);
    } catch (error) {
      console.error("Error al publicar:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo publicar el documento.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (state.hasUnsavedChanges) {
      const confirmed = window.confirm("Tienes cambios sin guardar. ¿Salir de todos modos?");
      if (!confirmed) return;
    }
    window.history.back();
  };

  const handleExport = () => {
    EditorService.exportDraft(slug, content);
  };

  const toggleAutoSave = () => {
    setAutoSaveEnabled(!state.autoSaveEnabled);
  };

  const insertMarkdown = (before: string, after: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const newText =
      content.substring(0, start) +
      before +
      selectedText +
      after +
      content.substring(end);

    setContent(newText);
    setHasChanges(true);

    // Restaurar focus y selección
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selectedText.length
      );
    }, 0);
  };

  return (
    <TooltipProvider>
      <div className="flex flex-col h-full bg-background">
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 md:gap-0 p-4 md:px-6 border-b bg-muted shrink-0">
          <div className="flex items-center gap-4">
            <input
              ref={titleInputRef}
              type="text"
              value={docTitle}
              onChange={handleTitleChange}
              className="text-lg font-semibold bg-transparent border-none outline-none px-2 py-1 -mx-2 -my-1 rounded transition-colors hover:bg-accent/10 focus:bg-accent/15 min-w-[200px] max-w-[500px]"
              placeholder="Título del documento"
            />
            
            {state.error && (
              <div className="flex items-center gap-2 text-destructive text-sm">
                <AlertCircle size={16} />
                <span>{state.error}</span>
              </div>
            )}

            {state.lastSaved && !state.hasUnsavedChanges && (
              <span className="text-primary text-sm">
                ✓ Guardado {EditorService.formatLastSaved(state.lastSaved)}
              </span>
            )}

            {state.isSaving && (
              <span className="text-muted-foreground text-sm italic">Guardando...</span>
            )}
          </div>

          <div className="flex items-center justify-center md:justify-start gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleExport}
                >
                  <Download size={16} />
                  <span className="ml-2 hidden md:inline">Exportar</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Exportar como .md</TooltipContent>
            </Tooltip>

            <Separator orientation="vertical" className="h-6" />

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSave}
                  disabled={state.isSaving || !state.hasUnsavedChanges}
                >
                  <Save size={16} />
                  <span className="ml-2 hidden md:inline">Guardar</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Guardar borrador</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="default"
                  size="sm"
                  onClick={handlePublish}
                  disabled={state.isSaving}
                >
                  <Upload size={16} />
                  <span className="ml-2 hidden md:inline">Publicar</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Publicar documento</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={handleCancel}>
                  <X size={16} />
                  <span className="ml-2 hidden md:inline">Cancelar</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Cancelar edición</TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Markdown Toolbar */}
        <div className="flex items-center gap-2 px-6 py-3 border-b bg-muted shrink-0 overflow-x-auto">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => insertMarkdown("**", "**")}
                className="p-2 min-w-[32px] h-8 border rounded bg-background hover:bg-accent hover:border-primary transition-all flex items-center justify-center font-mono"
                aria-label="Negrita"
              >
                <strong>B</strong>
              </button>
            </TooltipTrigger>
            <TooltipContent>Negrita</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => insertMarkdown("*", "*")}
                className="p-2 min-w-[32px] h-8 border rounded bg-background hover:bg-accent hover:border-primary transition-all flex items-center justify-center font-mono"
                aria-label="Cursiva"
              >
                <em>I</em>
              </button>
            </TooltipTrigger>
            <TooltipContent>Cursiva</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => insertMarkdown("`", "`")}
                className="p-2 min-w-[32px] h-8 border rounded bg-background hover:bg-accent hover:border-primary transition-all flex items-center justify-center font-mono"
                aria-label="Código inline"
              >
                <code>{"<>"}</code>
              </button>
            </TooltipTrigger>
            <TooltipContent>Código inline</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => insertMarkdown("## ", "")}
                className="p-2 min-w-[32px] h-8 border rounded bg-background hover:bg-accent hover:border-primary transition-all flex items-center justify-center font-mono"
                aria-label="Heading 2"
              >
                H2
              </button>
            </TooltipTrigger>
            <TooltipContent>Heading 2</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => insertMarkdown("### ", "")}
                className="p-2 min-w-[32px] h-8 border rounded bg-background hover:bg-accent hover:border-primary transition-all flex items-center justify-center font-mono"
                aria-label="Heading 3"
              >
                H3
              </button>
            </TooltipTrigger>
            <TooltipContent>Heading 3</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => insertMarkdown("- ", "")}
                className="p-2 min-w-[32px] h-8 border rounded bg-background hover:bg-accent hover:border-primary transition-all flex items-center justify-center font-mono"
                aria-label="Lista"
              >
                •
              </button>
            </TooltipTrigger>
            <TooltipContent>Lista</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => insertMarkdown("[", "](url)")}
                className="p-2 min-w-[32px] h-8 border rounded bg-background hover:bg-accent hover:border-primary transition-all flex items-center justify-center font-mono"
                aria-label="Insertar enlace"
              >
                🔗
              </button>
            </TooltipTrigger>
            <TooltipContent>Link</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => insertMarkdown("```\n", "\n```")}
                className="p-2 min-w-[32px] h-8 border rounded bg-background hover:bg-accent hover:border-primary transition-all flex items-center justify-center font-mono"
                aria-label="Bloque de código"
              >
                {"{ }"}
              </button>
            </TooltipTrigger>
            <TooltipContent>Bloque de código</TooltipContent>
          </Tooltip>

          <label htmlFor="auto-save-toggle" className="flex items-center gap-2 ml-auto cursor-pointer text-sm text-muted-foreground">
            <input
              id="auto-save-toggle"
              type="checkbox"
              checked={state.autoSaveEnabled}
              onChange={toggleAutoSave}
              className="cursor-pointer"
            />
            <span>Auto-save</span>
          </label>
        </div>

        {/* Editor Content with Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex justify-center border-b bg-muted/50 py-2">
            <TabsList>
              <TabsTrigger value="editor">Editor</TabsTrigger>
              <TabsTrigger value="split">Split</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="editor" className="flex-1 overflow-hidden mt-0 data-[state=active]:flex">
            <div className="flex flex-col flex-1 overflow-hidden">
              <textarea
                ref={textareaRef}
                value={content}
                onChange={handleChange}
                className="flex-1 p-8 border-none outline-none bg-background resize-none overflow-y-auto font-mono text-[0.9375rem] leading-relaxed"
                placeholder="Escribe tu contenido en Markdown..."
                spellCheck={false}
              />
            </div>
          </TabsContent>

          <TabsContent value="split" className="flex-1 overflow-hidden mt-0 data-[state=active]:flex">
            <div className="flex flex-1 overflow-hidden">
              <div className="flex flex-col w-1/2 overflow-hidden border-r">
                <textarea
                  ref={textareaRef}
                  value={content}
                  onChange={handleChange}
                  className="flex-1 p-8 border-none outline-none bg-background resize-none overflow-y-auto font-mono text-[0.9375rem] leading-relaxed"
                  placeholder="Escribe tu contenido en Markdown..."
                  spellCheck={false}
                />
              </div>
              <div className="w-1/2 overflow-y-auto p-8 bg-muted/30">
                <div
                  className="markdown-content max-w-3xl mx-auto leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: renderedContent }}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="flex-1 overflow-hidden mt-0 data-[state=active]:flex">
            <div className="flex-1 overflow-y-auto p-8 bg-muted/30">
              <div
                className="markdown-content max-w-3xl mx-auto leading-relaxed"
                dangerouslySetInnerHTML={{ __html: renderedContent }}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </TooltipProvider>
  );
}
