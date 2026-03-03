
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Plus, Pencil, Trash2, Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";

const MotionTableRow = motion(TableRow);

// Interface for Category
interface Category {
    id: string;
    name: string;
    slug: string;
    created_at: string;
}

export default function AdminCategoriesPage() {
    const supabase = createClient();
    const { toast } = useToast();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    // Sheet State
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [formData, setFormData] = useState({ name: "", slug: "" });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    async function fetchCategories() {
        setLoading(true);
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error fetching categories:", error);
            // Don't show toast on initial load error if table doesn't exist yet, just empty list
        } else {
            setCategories(data || []);
        }
        setLoading(false);
    }

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    const filteredCategories = categories.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    const openCreateSheet = () => {
        setEditingCategory(null);
        setFormData({ name: "", slug: "" });
        setIsSheetOpen(true);
    };

    const openEditSheet = (category: Category) => {
        setEditingCategory(category);
        setFormData({ name: category.name, slug: category.slug });
        setIsSheetOpen(true);
    };

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/ /g, '-')
            .replace(/[^\w-]+/g, '');
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        // Auto-generate slug if creating new or if slug hasn't been manually edited (simple heuristic)
        // For simplicity, always update slug if creating.
        if (!editingCategory) {
            setFormData({ name, slug: generateSlug(name) });
        } else {
            setFormData(prev => ({ ...prev, name }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        const payload = {
            name: formData.name,
            slug: formData.slug || generateSlug(formData.name),
        };

        if (editingCategory) {
            // Update
            const { error } = await supabase
                .from('categories')
                .update(payload)
                .eq('id', editingCategory.id);

            if (error) {
                toast({ title: "Error", description: error.message, variant: "destructive" });
            } else {
                toast({ title: "Success", description: "Category updated successfully" });
                setCategories(categories.map(c => c.id === editingCategory.id ? { ...c, ...payload } : c));
                setIsSheetOpen(false);
            }
        } else {
            // Create
            const { data, error } = await supabase
                .from('categories')
                .insert([payload])
                .select()
                .single();

            if (error) {
                toast({ title: "Error", description: error.message, variant: "destructive" });
            } else if (data) {
                toast({ title: "Success", description: "Category created successfully" });
                setCategories([data, ...categories]);
                setIsSheetOpen(false);
            }
        }
        setSubmitting(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this category?")) return;

        try {
            const { error } = await supabase
                .from('categories')
                .delete()
                .eq('id', id);

            if (error) {
                // Check for foreign key constraint violation (Postgres error 23503)
                if (error.code === '23503') {
                    toast({
                        title: "Cannot Delete",
                        description: "This category contains products. Please delete or move the products first.",
                        variant: "destructive"
                    });
                } else {
                    throw error;
                }
            } else {
                toast({ title: "Success", description: "Category deleted" });
                setCategories(categories.filter(c => c.id !== id));
            }
        } catch (error: any) {
            console.error(error);
            toast({
                title: "Error",
                description: error.message || "Failed to delete category",
                variant: "destructive"
            });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
                <Button onClick={openCreateSheet} className="gap-2">
                    <Plus className="h-4 w-4" /> Add Category
                </Button>
            </div>

            <div className="flex items-center gap-2 max-w-sm">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search categories..."
                    value={search}
                    onChange={handleSearch}
                    className="max-w-sm"
                />
            </div>

            <div className="border rounded-lg bg-card overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Slug</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <AnimatePresence mode="popLayout">
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-10">
                                        <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                                    </TableCell>
                                </TableRow>
                            ) : filteredCategories.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                                        No categories found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredCategories.map((category, index) => (
                                    <MotionTableRow
                                        key={category.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ duration: 0.2, delay: index * 0.05 }}
                                        whileHover={{ scale: 1.01, backgroundColor: "var(--accent)" }}
                                        className="cursor-pointer"
                                    >
                                        <TableCell className="font-medium">{category.name}</TableCell>
                                        <TableCell className="text-muted-foreground">{category.slug}</TableCell>
                                        <TableCell>{new Date(category.created_at).toLocaleDateString()}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-blue-500"
                                                    onClick={() => openEditSheet(category)}
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100"
                                                    onClick={() => handleDelete(category.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </MotionTableRow>
                                ))
                            )}
                        </AnimatePresence>
                    </TableBody>
                </Table>
            </div>

            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>{editingCategory ? "Edit Category" : "New Category"}</SheetTitle>
                        <SheetDescription>
                            {editingCategory ? "Update category details." : "Create a new product category."}
                        </SheetDescription>
                    </SheetHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="cat-name">Name</Label>
                            <Input
                                id="cat-name"
                                value={formData.name}
                                onChange={handleNameChange}
                                placeholder="e.g. Software"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="cat-slug">Slug</Label>
                            <Input
                                id="cat-slug"
                                value={formData.slug}
                                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                                placeholder="e.g. software"
                                required
                            />
                        </div>
                        <SheetFooter>
                            <Button type="submit" disabled={submitting}>
                                {submitting ? "Saving..." : (editingCategory ? "Update" : "Create")}
                            </Button>
                        </SheetFooter>
                    </form>
                </SheetContent>
            </Sheet>
        </div>
    );
}
