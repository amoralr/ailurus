import { useState, useEffect } from 'react';
import { categoriesApi, type Category } from '@/documents/services/categories.service';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shared/ui/select';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Button } from "@/shared/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { useToast } from "@/shared/ui/use-toast";

interface CategorySelectorProps {
    value: string;
    onChange: (categoryId: string) => void;
    disabled?: boolean;
}

export function CategorySelector({ value, onChange, disabled = false }: CategorySelectorProps) {
    const { toast } = useToast();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Creation state
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [newCategoryIcon, setNewCategoryIcon] = useState("📁");
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = () => {
        setLoading(true);
        categoriesApi
            .getCategories()
            .then((cats) => {
                setCategories(cats.sort((a, b) => a.order - b.order));
                setError(null);
            })
            .catch((err) => {
                console.error('[CategorySelector] Failed to load categories:', err);
                setError('Error al cargar');
            })
            .finally(() => setLoading(false));
    };

    const handleCreateCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCategoryName.trim()) return;

        setIsCreating(true);
        try {
            const newCategory = await categoriesApi.createCategory({
                name: newCategoryName.trim(),
                icon: newCategoryIcon.trim() || "📁",
            });

            setCategories((prev) => [...prev, newCategory].sort((a, b) => a.order - b.order));
            onChange(newCategory.id);
            setIsDialogOpen(false);
            setNewCategoryName("");
            setNewCategoryIcon("📁");

            toast({
                title: "Categoría creada",
                description: `Se ha creado la categoría "${newCategory.name}"`,
            });
        } catch (error) {
            console.error('[CategorySelector] Failed to create category:', error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "No se pudo crear la categoría. Intenta con otro nombre.",
            });
        } finally {
            setIsCreating(false);
        }
    };

    if (loading) {
        return (
            <Select disabled>
                <SelectTrigger>
                    <SelectValue placeholder="Cargando..." />
                </SelectTrigger>
            </Select>
        );
    }

    return (
        <>
            <Select
                value={value}
                onValueChange={(val) => {
                    if (val === "CREATE_NEW") {
                        setIsDialogOpen(true);
                    } else {
                        onChange(val);
                    }
                }}
                disabled={disabled}
            >
                <SelectTrigger>
                    <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                    {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                            <span className="flex items-center gap-2">
                                <span>{cat.icon}</span>
                                <span>{cat.name}</span>
                            </span>
                        </SelectItem>
                    ))}
                    <div className="p-1 border-t mt-1">
                        <SelectItem value="CREATE_NEW" className="text-primary font-medium cursor-pointer">
                            <span className="flex items-center gap-2">
                                <Plus className="h-4 w-4" />
                                Crear nueva categoría...
                            </span>
                        </SelectItem>
                    </div>
                </SelectContent>
            </Select>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Crear Nueva Categoría</DialogTitle>
                        <DialogDescription>
                            Define el nombre e ícono para la nueva categoría.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleCreateCategory} className="space-y-4 py-4">
                        <div className="grid grid-cols-4 gap-4">
                            <div className="col-span-1 space-y-2">
                                <Label htmlFor="icon">Ícono</Label>
                                <Input
                                    id="icon"
                                    value={newCategoryIcon}
                                    onChange={(e) => setNewCategoryIcon(e.target.value)}
                                    placeholder="📁"
                                    className="text-center text-2xl"
                                    maxLength={2}
                                />
                            </div>
                            <div className="col-span-3 space-y-2">
                                <Label htmlFor="name">Nombre</Label>
                                <Input
                                    id="name"
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                    placeholder="Ej: Proyectos, Marketing..."
                                    autoFocus
                                />
                            </div>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={isCreating || !newCategoryName.trim()}>
                                {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Crear Categoría
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
