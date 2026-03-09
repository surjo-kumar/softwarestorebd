
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, ShieldCheck, Clock } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import { formatPrice } from "@/lib/utils";
import { motion } from "framer-motion";
import { useCart } from "@/contexts/CartContext";

export default function CheckoutPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { items: cartItems, cartTotal, cartCount } = useCart();
    const id = searchParams.get("id");
    const durationParam = searchParams.get("duration") || "1 Month";
    const priceParam = searchParams.get("price");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [currentUser, setCurrentUser] = useState<any>(null);

    useEffect(() => {
        // Optional auth check — pre-fill info if logged in, but don't block checkout
        const checkAuth = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.user) {
                    setCurrentUser(session.user);
                }
            } catch (err) {
                // Ignore auth errors — user can still checkout
            }
        };
        checkAuth();

        const isCartCheckout = !id && cartCount > 0;
        
        if (!id && !isCartCheckout) {
            navigate("/products");
            return;
        }

        if (isCartCheckout) {
            setLoading(false);
            return;
        }

        const fetchProduct = async () => {
            try {
                const { data, error } = await supabase
                    .from('products')
                    .select('*, thumbnail_url:image')
                    .eq('id', id)
                    .single();

                if (error || !data) {
                    console.error("Checkout Error:", error);
                } else {
                    setProduct(data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id, navigate, cartCount]);

    const isCartCheckout = !id && cartCount > 0;

    if (loading && !isCartCheckout) return <div className="p-12 text-center text-muted-foreground animate-pulse">Loading checkout...</div>;
    if (!product && !isCartCheckout) return <div className="p-12 text-center text-red-500">Product not found.</div>;

    // Calculate final price and duration with priority: URL Params -> Default Variant -> Lowest Variant -> Legacy Price
    let computedPrice = product?.price || 0;
    let computedDuration = durationParam;

    if (priceParam) {
        computedPrice = parseFloat(priceParam);
    } else if (product.pricing_variants && Array.isArray(product.pricing_variants) && product.pricing_variants.length > 0) {
        // No price param, so find default/lowest variant
        const defaultVar = product.pricing_variants.find((v: any) => v.is_default);
        if (defaultVar && defaultVar.price > 0) {
            computedPrice = defaultVar.price;
            computedDuration = defaultVar.label;
        } else {
            // Find lowest price (never 0)
            const validVars = product.pricing_variants.filter((v: any) => v.price > 0);
            if (validVars.length > 0) {
                const minVar = validVars.reduce((prev: any, curr: any) => prev.price < curr.price ? prev : curr);
                computedPrice = minVar.price;
                computedDuration = minVar.label;
            }
        }
    }

    // Safety check: Never allow 0 price checkout if not valid
    if (!computedPrice || computedPrice <= 0) {
        if (!isCartCheckout) {
            return <div className="p-12 text-center text-red-500">Error: Product price is unavailable.</div>;
        }
    }

    const finalPrice = computedPrice;
    const finalDuration = computedDuration;

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-3xl font-bold mb-8 text-center text-primary"
            >
                Secure Checkout
            </motion.h1>

            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-start">

                {/* Right: Payment Form (Mobile First approach suggests form is important, but typically on Desktop it's right side) */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="lg:order-2"
                >
                    <CheckoutForm
                        product={product}
                        duration={finalDuration}
                        finalPrice={finalPrice}
                        initialEmail={currentUser?.email}
                        initialName={currentUser?.user_metadata?.full_name}
                        cartMode={isCartCheckout}
                    />
                    <div className="mt-4 text-center text-xs text-muted-foreground">
                        <p>Your privacy is our priority. We do not store your financial details.</p>
                    </div>
                </motion.div>

                {/* Left: Summary */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="space-y-6 lg:order-1"
                >
                    <div className="bg-secondary/10 p-6 rounded-xl border border-border/50">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Order Summary</h2>
                            {isCartCheckout && (
                                <Link to="/cart" className="text-sm text-primary hover:underline flex items-center gap-1">
                                    Edit Cart
                                </Link>
                            )}
                        </div>
                        
                        {isCartCheckout ? (
                            <div className="space-y-4 mb-4">
                                {cartItems.map(item => (
                                    <div key={item.id} className="flex gap-4 p-3 bg-white rounded-lg border border-border/50 shadow-sm">
                                        <div className="h-16 w-16 bg-card rounded flex items-center justify-center shrink-0 overflow-hidden">
                                            <img src={item.thumbnail_url} alt={item.title} className="max-h-full max-w-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-sm truncate">{item.title}</h3>
                                            {item.duration && (
                                                <Badge variant="secondary" className="mt-1 text-[10px]">{item.duration}</Badge>
                                            )}
                                            <div className="mt-1 flex justify-between items-center">
                                                <span className="text-xs text-muted-foreground">Qty: {item.quantity}</span>
                                                <span className="font-semibold text-sm">{formatPrice(item.price * item.quantity)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex gap-4">
                                <div className="h-24 w-24 bg-card rounded-lg p-2 flex items-center justify-center border shadow-sm">
                                    <img
                                        src={product?.thumbnail_url || product?.image || "/placeholder.png"}
                                        alt={product?.title}
                                        className="max-h-full max-w-full object-contain"
                                    />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{product?.title}</h3>
                                    <Badge variant="secondary" className="mt-1">{product?.category}</Badge>
                                    {(product?.yearly_price) && (
                                        <div className="flex items-center gap-1.5 mt-2 text-sm font-medium text-muted-foreground bg-background/50 px-2 py-0.5 rounded border">
                                            <Clock className="w-3.5 h-3.5" />
                                            <span>{finalDuration}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="mt-6 flex justify-between items-center py-4 border-t border-b border-border/50">
                            <span className="text-muted-foreground">Total to pay</span>
                            <span className="text-2xl font-bold text-primary">{formatPrice(isCartCheckout ? cartTotal : finalPrice)}</span>
                        </div>

                        <div className="mt-4 space-y-3 pt-2">
                            <div className="flex items-start gap-2 text-sm text-muted-foreground">
                                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                                <span>Complete access to all features</span>
                            </div>
                            <div className="flex items-start gap-2 text-sm text-muted-foreground">
                                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                                <span>Instant delivery via email included</span>
                            </div>
                            <div className="flex items-start gap-2 text-sm text-muted-foreground">
                                <ShieldCheck className="h-4 w-4 text-green-500 mt-0.5" />
                                <span>100% money-back guarantee</span>
                            </div>
                        </div>
                    </div>

                    {/* Trust Signals */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-muted/20 rounded-lg text-center border border-border/30">
                            <p className="font-bold text-lg">24/7</p>
                            <p className="text-xs text-muted-foreground">Live Support</p>
                        </div>
                        <div className="p-4 bg-muted/20 rounded-lg text-center border border-border/30">
                            <p className="font-bold text-lg">10k+</p>
                            <p className="text-xs text-muted-foreground">Happy Customers</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
