
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Star, Zap } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { supabase } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductDetailsPage() {
    const { id } = useParams<{ id: string }>();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [duration, setDuration] = useState("1 Month");
    const [finalPrice, setFinalPrice] = useState(0);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) return;
            try {
                const { data, error } = await supabase
                    .from('products')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error || !data) throw error;
                setProduct(data);

                // Determine initial pricing
                if (data.yearly_price) {
                    // Default to 1 month price if available, else calc
                    if (data.monthly_price) {
                        setFinalPrice(data.monthly_price);
                        setDuration("1 Month");
                    } else {
                        // Fallback logic
                        setFinalPrice(data.price);
                    }
                } else {
                    setFinalPrice(data.price);
                }
            } catch (err) {
                console.error(err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [variants, setVariants] = useState<any[]>([]);

    useEffect(() => {
        if (!product) return;

        // specific "admin created" variants take precedence
        if (product.pricing_variants && Array.isArray(product.pricing_variants) && product.pricing_variants.length > 0) {
            setVariants(product.pricing_variants);

            // Logic: 1. Default Flag -> 2. Lowest Price -> 3. First Index
            const defaultVar = product.pricing_variants.find((v: any) => v.is_default);
            if (defaultVar) {
                setDuration(defaultVar.label);
                setFinalPrice(defaultVar.price);
            } else {
                // Find lowest price
                const minVar = product.pricing_variants.reduce((prev: any, curr: any) =>
                    (prev.price < curr.price && prev.price > 0) ? prev : curr
                );
                setDuration(minVar.label);
                setFinalPrice(minVar.price);
            }
            return;
        }

        // Fallback to legacy logic
        let price = 0;
        if (product.yearly_price) {
            const yearly = parseFloat(product.yearly_price);
            const monthly = product.monthly_price ? parseFloat(product.monthly_price) : (yearly / 12) * 1.2;

            if (duration === "1 Month") {
                price = monthly;
            } else if (duration === "3 Months") {
                price = (yearly / 12) * 3;
            } else if (duration === "6 Months") {
                price = (yearly / 12) * 6;
            } else if (duration === "12 Months") {
                price = yearly;
            }
        } else {
            price = product.price;
        }
        setFinalPrice(Math.ceil(price));

    }, [duration, product]);

    // Handle variant selection
    const handleVariantChange = (variant: any) => {
        setDuration(variant.label);
        setFinalPrice(variant.price);
    };

    if (loading) return <div className="p-12 text-center text-muted-foreground">Loading details...</div>;
    if (error || !product) return <div className="p-12 text-center text-red-500">Product not found.</div>;

    const isSubscription = product.yearly_price || product.category === 'subscription' || product.category === 'software';

    return (
        <div className="container mx-auto px-4 py-8 lg:py-12">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
                {/* Left: Image */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center justify-center rounded-2xl bg-secondary/10 p-8 lg:p-12 relative overflow-hidden group"
                >
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <motion.img
                        src={product.image || product.thumbnail_url || "/placeholder.png"}
                        alt={product.title}
                        className="w-1/2 max-w-[300px] object-contain drop-shadow-2xl"
                        whileHover={{ scale: 1.1, rotate: -2 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    />
                </motion.div>

                {/* Right: Details */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="flex flex-col gap-6"
                >
                    <div>
                        <Badge className="mb-3 animate-in fade-in slide-in-from-bottom-2 duration-500">{product.category}</Badge>
                        <h1 className="text-3xl font-bold lg:text-4xl">{product.title}</h1>
                        <div className="flex items-center gap-2 mt-2">
                            <div className="flex text-yellow-500">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <Star key={s} className="h-4 w-4 fill-current" />
                                ))}
                            </div>
                            <span className="text-sm text-muted-foreground">(4.9/5)</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-2 h-10 overflow-hidden">
                            <AnimatePresence mode="wait">
                                <motion.span
                                    key={finalPrice}
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: -20, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="text-4xl font-bold text-primary"
                                >
                                    {formatPrice(finalPrice)}
                                </motion.span>
                            </AnimatePresence>
                            {isSubscription && <span className="text-muted-foreground text-lg">/ {duration}</span>}
                        </div>

                        {/* Duration Selector */}
                        {variants.length > 0 ? (
                            <div className="space-y-3">
                                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Select Plan</span>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {variants.map((v) => (
                                        <button
                                            key={v.label}
                                            onClick={() => handleVariantChange(v)}
                                            className={`px-3 py-3 rounded-xl border text-sm font-medium transition-all transform active:scale-95 flex flex-col items-center gap-1 ${duration === v.label
                                                ? "bg-primary text-primary-foreground border-primary ring-2 ring-primary/20 scale-105 shadow-lg"
                                                : "bg-background hover:bg-muted border-border hover:border-primary/50"
                                                }`}
                                        >
                                            <span className="font-bold">{v.label}</span>
                                            <span className={`text-xs ${duration === v.label ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                                                {formatPrice(v.price)}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (isSubscription && product.yearly_price) && (
                            <div className="space-y-3">
                                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Select Duration</span>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                    {["1 Month", "3 Months", "6 Months", "12 Months"].map((dur) => (
                                        <button
                                            key={dur}
                                            onClick={() => setDuration(dur)}
                                            className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all transform active:scale-95 ${duration === dur
                                                ? "bg-primary text-primary-foreground border-primary ring-2 ring-primary/20 scale-105 shadow-md"
                                                : "bg-background hover:bg-muted border-border hover:border-primary/50"
                                                }`}
                                        >
                                            {dur}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <p className="text-lg text-muted-foreground leading-relaxed">
                        {product.description}
                    </p>

                    <div className="flex flex-col gap-3 pt-4 border-t mt-4">
                        <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 p-3 rounded-lg border border-blue-100">
                            <Zap className="h-4 w-4" />
                            <span>Instant Delivery via Email</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-lg border border-green-100">
                            <Shield className="h-4 w-4" />
                            <span>100% Secure Payment & Warranty</span>
                        </div>

                        <Link
                            to={`/checkout?id=${product.id}&duration=${duration}&price=${finalPrice}`}
                            className="w-full"
                        >
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <Button size="lg" className="w-full text-lg h-14 mt-2 shadow-lg shadow-primary/20 relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                    <span className="relative">Buy Now - {formatPrice(finalPrice)}</span>
                                </Button>
                            </motion.div>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
