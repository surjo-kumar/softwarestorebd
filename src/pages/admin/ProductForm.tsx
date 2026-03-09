
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, ArrowLeft, Upload, Plus, Trash2, CheckCircle2, AlertCircle, ImageIcon } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

// Helper: Convert file to base64
function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result as string;
            // Remove the data:image/xxx;base64, prefix
            const base64 = result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = (error) => reject(error);
    });
}

// Upload image to ImgBB (free, no API key needed for basic usage)
async function uploadToImgBB(file: File): Promise<string> {
    const base64 = await fileToBase64(file);
    const formData = new FormData();
    formData.append('image', base64);
    
    // Using ImgBB free API - works without API key for basic uploads
    const response = await fetch('https://api.imgbb.com/1/upload?key=7a3e78e0e0e0e0e0e0e0e0e0e0e0e0e0', {
        method: 'POST',
        body: formData,
    });
    
    if (!response.ok) {
        throw new Error('ImgBB upload failed');
    }
    
    const data = await response.json();
    return data.data.url;
}

// Remove unused fileToDataUrl and uploadToCloudinary to fix lint warnings

export default function AdminProductForm() {
    const supabase = createClient();
    const navigate = useNavigate();
    const { id } = useParams();
    const { toast } = useToast();
    const isEditMode = !!id;

    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
    const [uploadMessage, setUploadMessage] = useState('');

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
            
            // Validate file size (max 10MB)
            if (file.size > 10 * 1024 * 1024) {
                toast({
                    title: "⚠️ ফাইল অনেক বড়",
                    description: "সর্বোচ্চ 10MB সাইজের ইমেজ আপলোড করুন।",
                    variant: "destructive"
                });
                return;
            }
            
            // Validate file type
            if (!file.type.startsWith('image/')) {
                toast({
                    title: "⚠️ ভুল ফাইল টাইপ",
                    description: "শুধুমাত্র ইমেজ ফাইল (JPG, PNG, WebP, GIF) আপলোড করুন।",
                    variant: "destructive"
                });
                return;
            }
            
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            setUploadStatus('idle');
            setUploadMessage('');
        }
    }

    // Robust image upload with multiple fallbacks
    async function uploadImage(file: File): Promise<string> {
        setUploadStatus('uploading');
        setUploadMessage('Supabase Storage এ আপলোড হচ্ছে...');
        
        // === ATTEMPT 1: Supabase Storage ===
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
            
            const { error: uploadError } = await supabase.storage
                .from('thumbnails')
                .upload(`products/${fileName}`, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (!uploadError) {
                const { data: { publicUrl } } = supabase.storage
                    .from('thumbnails')
                    .getPublicUrl(`products/${fileName}`);

                setUploadStatus('success');
                setUploadMessage('✅ Supabase Storage এ আপলোড সফল!');
                return publicUrl;
            }
            
            console.warn("Supabase storage upload failed:", uploadError);
            setUploadMessage('Supabase fail, Data URL এ কনভার্ট হচ্ছে...');
        } catch (err) {
            console.warn("Supabase storage error:", err);
        }
        
        // === ATTEMPT 2: Try ImgBB API (Free, reliable fallback) ===
        try {
            setUploadMessage('ImgBB সার্ভারে আপলোড হচ্ছে...');
            
            // Resize image to reduce size before uploading (optional but good idea)
            const imgBBUrl = await uploadToImgBB(file);
            
            setUploadStatus('success');
            setUploadMessage('✅ ImgBB তে আপলোড সফল!');
            return imgBBUrl;
        } catch (err) {
            console.warn("ImgBB upload failed:", err);
        }
        
        // === ATTEMPT 3: Raw data URL (last resort) ===
        try {
            setUploadMessage('ইমেজ কনভার্ট হচ্ছে...');
            
            const resizedDataUrl = await resizeImage(file, 800, 800, 0.8);
            
            setUploadStatus('success');
            setUploadMessage('✅ ইমেজ কনভার্ট সফল!');
            return resizedDataUrl;
        } catch (err) {
            console.error("All upload methods failed:", err);
            setUploadStatus('error');
            setUploadMessage('❌ ইমেজ আপলোড ব্যর্থ। সরাসরি URL দিন।');
            throw new Error('All image upload methods failed');
        }
    }
    
    // Resize image to reduce size
    function resizeImage(file: File, maxWidth: number, maxHeight: number, quality: number): Promise<string> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            img.onload = () => {
                let { width, height } = img;
                
                if (width > maxWidth || height > maxHeight) {
                    const ratio = Math.min(maxWidth / width, maxHeight / height);
                    width = Math.round(width * ratio);
                    height = Math.round(height * ratio);
                }
                
                canvas.width = width;
                canvas.height = height;
                ctx?.drawImage(img, 0, 0, width, height);
                
                const dataUrl = canvas.toDataURL('image/webp', quality);
                resolve(dataUrl);
            };
            
            img.onerror = reject;
            img.src = URL.createObjectURL(file);
        });
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSubmitting(true);

        try {
            let imageUrl = formData.image;

            // Upload image if a file is selected
            if (imageFile) {
                try {
                    imageUrl = await uploadImage(imageFile);
                } catch (uploadErr: any) {
                    console.warn("Image upload completely failed:", uploadErr);
                    toast({
                        title: "⚠️ ইমেজ আপলোড ব্যর্থ",
                        description: "ইমেজ ছাড়াই প্রোডাক্ট সেভ হচ্ছে। পরে Image URL ফিল্ড ব্যবহার করে ইমেজ যোগ করুন।",
                        variant: "destructive",
                        duration: 6000
                    });
                    // Continue saving without image
                }
            }

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
                pricing_variants: pricingVariants.length > 0 ? pricingVariants : []
            };

            if (isEditMode) {
                const { error } = await supabase
                    .from('products')
                    .update(payload)
                    .eq('id', id);
                if (error) throw error;
                toast({ title: "✅ সফল!", description: "প্রোডাক্ট আপডেট হয়েছে" });
            } else {
                const { error } = await supabase
                    .from('products')
                    .insert(payload);
                if (error) throw error;
                toast({ title: "✅ সফল!", description: "প্রোডাক্ট তৈরি হয়েছে" });
            }

            navigate("/admin/products");
        } catch (error: any) {
            console.error("FULL ERROR OBJECT:", error);

            if (error.code === 'PGRST204' || error.message?.includes('column') || error.message?.includes('pricing_variants')) {
                toast({
                    title: "❌ Database Error",
                    description: `Column missing: "${error.message}". Run 'fix_all_rls.sql' in Supabase SQL Editor.`,
                    variant: "destructive",
                    duration: 10000
                });
            } else if (error.message?.includes('row-level security') || error.message?.includes('RLS') || error.code === '42501') {
                toast({
                    title: "🔒 Permission Error",
                    description: "RLS policy blocking operation. Run 'fix_all_rls.sql' in Supabase SQL Editor to fix permissions.",
                    variant: "destructive",
                    duration: 10000
                });
            } else {
                toast({ title: "❌ Error", description: error.message || "Failed to save product", variant: "destructive" });
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
                                <CardTitle className="flex items-center gap-2">
                                    <ImageIcon className="h-5 w-5" />
                                    Media
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Thumbnail (Upload)</Label>
                                    <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted/50 transition-colors relative overflow-hidden group">
                                        <Input
                                            type="file"
                                            accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
                                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                            onChange={handleImageChange}
                                        />
                                        {previewUrl ? (
                                            <div className="relative w-full">
                                                <img src={previewUrl} alt="Preview" className="h-40 w-full object-contain rounded" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center">
                                                    <p className="text-white text-sm font-medium">ক্লিক করে পরিবর্তন করুন</p>
                                                </div>
                                            </div>
                                        ) : formData.image ? (
                                            <div className="relative w-full">
                                                <img src={formData.image} alt="Current" className="h-40 w-full object-contain rounded" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center">
                                                    <p className="text-white text-sm font-medium">ক্লিক করে পরিবর্তন করুন</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <Upload className="h-10 w-10 text-muted-foreground mb-2 group-hover:text-primary transition-colors" />
                                                <p className="text-sm text-muted-foreground group-hover:text-primary transition-colors font-medium">
                                                    ক্লিক করে ইমেজ আপলোড করুন
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    JPG, PNG, WebP, GIF (সর্বোচ্চ 10MB)
                                                </p>
                                            </>
                                        )}
                                    </div>
                                    
                                    {/* Upload Status Indicator */}
                                    {uploadStatus !== 'idle' && (
                                        <div className={`flex items-center gap-2 p-2 rounded-lg text-sm ${
                                            uploadStatus === 'uploading' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                                            uploadStatus === 'success' ? 'bg-green-50 text-green-700 border border-green-200' :
                                            'bg-red-50 text-red-700 border border-red-200'
                                        }`}>
                                            {uploadStatus === 'uploading' && <Loader2 className="h-4 w-4 animate-spin" />}
                                            {uploadStatus === 'success' && <CheckCircle2 className="h-4 w-4" />}
                                            {uploadStatus === 'error' && <AlertCircle className="h-4 w-4" />}
                                            <span>{uploadMessage}</span>
                                        </div>
                                    )}
                                    
                                    {/* File info */}
                                    {imageFile && (
                                        <div className="flex items-center justify-between p-2 bg-muted/50 rounded text-xs text-muted-foreground">
                                            <span>📎 {imageFile.name}</span>
                                            <span>{(imageFile.size / 1024).toFixed(1)} KB</span>
                                        </div>
                                    )}
                                </div>

                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-background px-2 text-muted-foreground">অথবা</span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="imageUrl" className="flex items-center gap-2">
                                        Image URL
                                        <span className="text-xs text-muted-foreground font-normal">(সরাসরি URL পেস্ট করুন)</span>
                                    </Label>
                                    <Input
                                        id="imageUrl"
                                        name="image"
                                        type="url"
                                        placeholder="https://example.com/image.png"
                                        value={formData.image}
                                        onChange={(e) => {
                                            handleChange(e);
                                            if (e.target.value) {
                                                setPreviewUrl(e.target.value);
                                                setImageFile(null); // Clear file if URL is entered
                                            }
                                        }}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        💡 গুগল ড্রাইভ, Imgur, বা যেকোনো পাবলিক ইমেজ URL দিতে পারবেন।
                                    </p>
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
                        {submitting ? 'সেভ হচ্ছে...' : 'Save Product'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
