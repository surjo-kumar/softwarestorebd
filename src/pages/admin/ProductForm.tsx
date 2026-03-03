
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, ArrowLeft, Upload, Plus, Trash2 } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

export default function AdminProductForm() {
    const supabase = createClient();
    const navigate = useNavigate();
    const { id } = useParams();
    const { toast } = useToast();
    const isEditMode = !!id;

    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        description: "",
        price: "",
        monthly_price: "",
        yearly_price: "",
        category: "software",
        stock: "100",
        is_active: true,
        featured: false,
        image: "",
        is_subscription: false
    });

    const [pricingVariants, setPricingVariants] = useState<{ label: string; price: number; is_default?: boolean }[]>([]);

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>("");

    const [categories, setCategories] = useState<any[]>([]);

    useEffect(() => {
        fetchCategories();
        if (isEditMode) {
            fetchProduct();
        }
    }, [id]);

    async function fetchCategories() {
        const { data, error } = await supabase.from('categories').select('*').order('name');
        if (!error && data) {
            setCategories(data);
        }
    }

    async function fetchProduct() {
        setLoading(true);
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error(error);
            toast({ title: "Error", description: "Could not fetch product", variant: "destructive" });
        } else if (data) {
            setFormData({
                title: data.title,
                slug: data.slug || "",
                description: data.description || "",
                price: data.price.toString(),
                monthly_price: data.monthly_price?.toString() || "",
                yearly_price: data.yearly_price?.toString() || "",
                category: data.category,
                stock: data.stock.toString(),
                is_active: data.is_active,
                featured: data.featured || false,
                image: data.image,
                is_subscription: data.category === 'subscription' || !!data.yearly_price
            });
            if (data.pricing_variants && Array.isArray(data.pricing_variants)) {
                setPricingVariants(data.pricing_variants);
            }
            setPreviewUrl(data.image);
        }
        setLoading(false);
    }

    function handleChange(e: any) {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    }

    function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSubmitting(true);

        try {
            let imageUrl = formData.image;

            // Upload image if selected
            if (imageFile) {
                const fileExt = imageFile.name.split('.').pop();
                const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
                const { error: uploadError, data: _ } = await supabase.storage
                    .from('thumbnails') // Ensure this bucket exists in Supabase
                    .upload(`products/${fileName}`, imageFile);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('thumbnails')
                    .getPublicUrl(`products/${fileName}`);

                imageUrl = publicUrl;
            }

            // TEMPORARY FIX: Only send pricing_variants if it has data, to avoid error if column missing and user hasn't added variants
            // Note: If column is missing, even sending empty array might fail if Supabase is strict. 
            // We will attempt to send it. If it fails, we catch it.

            const payload: any = {
                title: formData.title,
                slug: formData.slug || formData.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
                description: formData.description,
                price: formData.is_subscription ? (parseFloat(formData.monthly_price) || 0) : parseFloat(formData.price),
                monthly_price: formData.is_subscription ? parseFloat(formData.monthly_price) : null,
                yearly_price: formData.is_subscription ? parseFloat(formData.yearly_price) : null,
                category: formData.category,
                stock: parseInt(formData.stock),
                is_active: formData.is_active,
                featured: formData.featured,
                image: imageUrl,
                pricing_variants: pricingVariants
            };



            if (isEditMode) {
                const { error } = await supabase
                    .from('products')
                    .update(payload)
                    .eq('id', id);
                if (error) throw error;
                toast({ title: "Success", description: "Product updated successfully" });
            } else {
                const { error } = await supabase
                    .from('products')
                    .insert(payload);
                if (error) throw error;
                toast({ title: "Success", description: "Product created successfully" });
            }

            navigate("/admin/products");
        } catch (error: any) {
            console.error("FULL ERROR OBJECT:", error);

            // If it's a 406 or similar, it might be schema cache.
            // If code is "PGRST204" (column not found), then it is definitely DB issue.

            if (error.code === 'PGRST204' || error.message?.includes('column') || error.message?.includes('pricing_variants')) {
                toast({
                    title: "Database Mismatch",
                    description: `Database column missing: "${error.message}". \nPlease run 'db_fix_v2.sql' in Supabase to fix all missing columns (slug, joined_date, pricing_variants, etc).`,
                    variant: "destructive",
                    duration: 10000
                });
            } else {
                toast({ title: "Error", description: error.message || "Failed to save product", variant: "destructive" });
            }
        } finally {
            setSubmitting(false);
        }
    }

    if (loading) return <Loader2 className="h-8 w-8 animate-spin mx-auto mt-20" />;

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-10">
            <div className="flex items-center gap-4">
                <Link to="/admin/products">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold tracking-tight">
                    {isEditMode ? "Edit Product" : "New Product"}
                </h1>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid gap-6 md:grid-cols-2">
                    <Card className="md:col-span-1">
                        <CardHeader>
                            <CardTitle>Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title" name="title"
                                    value={formData.title} onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Select
                                    value={formData.category}
                                    onValueChange={(val) => {
                                        setFormData(p => ({
                                            ...p,
                                            category: val,
                                            is_subscription: val === 'subscription' // Only auto-toggle for 'subscription'
                                        }));
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.length > 0 ? (
                                            categories.map((cat) => (
                                                <SelectItem key={cat.id} value={cat.slug || cat.name.toLowerCase()}>
                                                    {cat.name}
                                                </SelectItem>
                                            ))
                                        ) : (
                                            <>
                                                <SelectItem value="software">Software</SelectItem>
                                                <SelectItem value="subscription">Subscription</SelectItem>
                                                <SelectItem value="games">Games</SelectItem>
                                                <SelectItem value="courses">Courses</SelectItem>
                                                <SelectItem value="ebooks">E-Books</SelectItem>
                                                <SelectItem value="other">Other</SelectItem>
                                                <SelectItem value="giftcards">Gift Cards</SelectItem>
                                            </>
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-center justify-between border p-3 rounded-lg bg-secondary/10">
                                <div className="space-y-0.5">
                                    <Label className="text-sm font-semibold">Subscription Product?</Label>
                                    <p className="text-xs text-muted-foreground">Enables 1/3/6/12 Month logic</p>
                                </div>
                                <Switch
                                    checked={formData.is_subscription}
                                    onCheckedChange={(c) => setFormData(p => ({ ...p, is_subscription: c }))}
                                />
                            </div>

                            {!formData.is_subscription ? (
                                <div className="space-y-2">
                                    <Label htmlFor="price">One-Time Price (BDT)</Label>
                                    <Input
                                        id="price" name="price" type="number"
                                        value={formData.price} onChange={handleChange}
                                        required={!formData.is_subscription}
                                    />
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Label>Pricing Variants</Label>
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="outline"
                                            onClick={() => setPricingVariants([...pricingVariants, { label: "", price: 0, is_default: false }])}
                                        >
                                            <div className="flex items-center gap-1">
                                                <Plus className="h-3 w-3" /> Add Variant
                                            </div>
                                        </Button>
                                    </div>

                                    {pricingVariants.length === 0 && (
                                        <div className="text-center p-4 border border-dashed rounded-lg text-sm text-muted-foreground">
                                            No variants added. Add durations like "4 Months", "1 Year".
                                        </div>
                                    )}

                                    {pricingVariants.map((variant, index) => (
                                        <div key={index} className="flex items-end gap-2 border p-3 rounded-lg bg-card">
                                            <div className="space-y-2 flex-1">
                                                <Label className="text-xs">Label (Duration)</Label>
                                                <Input
                                                    placeholder="e.g. 4 Months"
                                                    value={variant.label}
                                                    onChange={(e) => {
                                                        const newVariants = [...pricingVariants];
                                                        newVariants[index].label = e.target.value;
                                                        setPricingVariants(newVariants);
                                                    }}
                                                />
                                            </div>
                                            <div className="space-y-2 w-32">
                                                <Label className="text-xs">Price (BDT)</Label>
                                                <Input
                                                    type="number"
                                                    placeholder="0"
                                                    value={variant.price}
                                                    onChange={(e) => {
                                                        const newVariants = [...pricingVariants];
                                                        newVariants[index].price = parseFloat(e.target.value) || 0;
                                                        setPricingVariants(newVariants);
                                                    }}
                                                />
                                            </div>
                                            <div className="space-y-2 flex flex-col items-center justify-center px-2">
                                                <Label className="text-xs text-center w-full">Default</Label>
                                                <input
                                                    type="radio"
                                                    name="default_variant"
                                                    checked={!!variant.is_default}
                                                    onChange={() => {
                                                        const newVariants = pricingVariants.map((v, i) => ({
                                                            ...v,
                                                            is_default: i === index
                                                        }));
                                                        setPricingVariants(newVariants);
                                                    }}
                                                    className="w-4 h-4 text-primary focus:ring-primary"
                                                />
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                onClick={() => setPricingVariants(pricingVariants.filter((_, i) => i !== index))}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}

                                    <div className="text-xs text-muted-foreground bg-yellow-50 p-2 rounded border border-yellow-200">
                                        Note: If you add variants here, the "Monthly/Yearly" logic will be overridden. The user will see exactly these options.
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="stock">Stock</Label>
                                <Input
                                    id="stock" name="stock" type="number"
                                    value={formData.stock} onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description" name="description"
                                    value={formData.description} onChange={handleChange}
                                    rows={5}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Media</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Thumbnail</Label>
                                    <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted/50 transition-colors relative overflow-hidden">
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            onChange={handleImageChange}
                                        />
                                        {previewUrl ? (
                                            <img src={previewUrl} alt="Preview" className="h-40 w-full object-contain" />
                                        ) : (
                                            <>
                                                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                                                <p className="text-sm text-muted-foreground">Click to upload image</p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Status & Visibility</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between border p-3 rounded-lg">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Active Status</Label>
                                        <p className="text-xs text-muted-foreground">Product will be visible in store</p>
                                    </div>
                                    <Switch
                                        checked={formData.is_active}
                                        onCheckedChange={(c) => setFormData(p => ({ ...p, is_active: c }))}
                                    />
                                </div>

                                <div className="flex items-center justify-between border p-3 rounded-lg">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Featured</Label>
                                        <p className="text-xs text-muted-foreground">Show in featured section</p>
                                    </div>
                                    <Switch
                                        checked={formData.featured}
                                        onCheckedChange={(c) => setFormData(p => ({ ...p, featured: c }))}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-4">
                    <Link to="/admin/products">
                        <Button type="button" variant="outline">Cancel</Button>
                    </Link>
                    <Button type="submit" disabled={submitting}>
                        {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Product
                    </Button>
                </div>
            </form>
        </div>
    );
}
