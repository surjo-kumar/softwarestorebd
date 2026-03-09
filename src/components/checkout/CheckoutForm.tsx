
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Lock, Smartphone, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { processCheckout } from "@/lib/checkout";
import { formatPrice } from "@/lib/utils";
import { supabase } from "@/lib/supabase/client";
import { useCart } from "@/contexts/CartContext";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";

interface CheckoutFormProps {
    product?: {
        id: string;
        title: string;
        price: number;
        is_subscription?: boolean;
    };
    duration?: string;
    finalPrice?: number;
    initialEmail?: string;
    initialName?: string;
    cartMode?: boolean;
}

const checkoutSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    name: z.string().min(2, "Name must be at least 2 characters"),
    mobileNumber: z.string().regex(/^01[3-9]\d{8}$/, "Must be a valid 11-digit BD number (e.g. 017...)"),
    transactionId: z.string().min(4, "Transaction ID is too short").max(20, "Transaction ID is too long"),
});

type FormData = z.infer<typeof checkoutSchema>;

export default function CheckoutForm({ product, duration = "1 Month", finalPrice, initialEmail = "", initialName = "", cartMode = false }: CheckoutFormProps) {
    const { items: cartItems, cartTotal, clearCart } = useCart();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("bkash");
    const [formData, setFormData] = useState<FormData>({
        email: initialEmail,
        name: initialName,
        mobileNumber: "",
        transactionId: "",
    });
    const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

    // Payment numbers from Supabase
    const [paymentNumbers, setPaymentNumbers] = useState({
        bkash_number: "01741684468",
        nagad_number: "01622753121",
        rocket_number: "01622753121",
    });

    useEffect(() => {
        const fetchPaymentNumbers = async () => {
            const { data } = await supabase
                .from("site_settings")
                .select("key, value")
                .in("key", ["bkash_number", "nagad_number", "rocket_number"]);

            if (data) {
                const mapped: Record<string, string> = {};
                data.forEach((row: { key: string; value: string | null }) => {
                    if (row.value) mapped[row.key] = row.value;
                });
                setPaymentNumbers((prev) => ({ ...prev, ...mapped }));
            }
        };
        fetchPaymentNumbers();
    }, []);

    const priceToPay = cartMode ? cartTotal : (finalPrice || product?.price || 0);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear error when user types
        if (errors[name as keyof FormData]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const validateForm = () => {
        try {
            checkoutSchema.parse(formData);
            setErrors({});
            return true;
        } catch (error) {
            if (error instanceof z.ZodError) {
                const newErrors: Partial<Record<keyof FormData, string>> = {};
                error.errors.forEach((err) => {
                    if (err.path[0]) {
                        newErrors[err.path[0] as keyof FormData] = err.message;
                    }
                });
                setErrors(newErrors);
            }
            return false;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        const payload = new FormData();
        payload.append("email", formData.email);
        payload.append("name", formData.name);
        payload.append("payment_method", paymentMethod);
        payload.append("transaction_id", formData.transactionId);
        payload.append("mobile_number", formData.mobileNumber);
        
        if (cartMode) {
            payload.append("cartItems", JSON.stringify(cartItems));
        } else if (product) {
            payload.append("productId", product.id);
            payload.append("price", priceToPay.toString());
            payload.append("duration", duration);
        }

        const result = await processCheckout(payload);

        if (result?.error) {
            alert(result.error);
            setIsLoading(false);
        } else if (result?.success && result.orderId) {
            if (cartMode) clearCart();
            navigate(`/checkout/success?orderId=${result.orderId}${result.multiple ? '&multiple=true' : ''}`);
        } else {
            console.error("Unknown checkout result", result);
            setIsLoading(false);
        }
    };

    const getHelperText = (method: string) => {
        switch (method) {
            case 'bkash':
                return {
                    number: paymentNumbers.bkash_number,
                    type: "bKash Personal",
                    color: "border-[#e2136e]"
                };
            case 'nagad':
                return {
                    number: paymentNumbers.nagad_number,
                    type: "Nagad Personal",
                    color: "border-[#ec1d24]"
                };
            case 'rocket':
                return {
                    number: paymentNumbers.rocket_number,
                    type: "Rocket Personal",
                    color: "border-[#8c3494]"
                };
            default:
                return { number: "", type: "", color: "border-border" };
        }
    };

    const helper = getHelperText(paymentMethod);

    return (
        <form onSubmit={handleSubmit}>
            <Card className="w-full border-border/50 shadow-xl bg-card/60 backdrop-blur-md">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Lock className="w-5 h-5 text-primary" />
                        Checkout
                    </CardTitle>
                    <CardDescription>
                        Complete payment (Manual Verification)
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* User Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="flex justify-between">
                                Email Address <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={handleInputChange}
                                className={errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}
                            />
                            {errors.email && <p className="text-xs text-red-500 font-medium flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.email}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="name">
                                Full Name <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="Your Name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className={errors.name ? "border-red-500 focus-visible:ring-red-500" : ""}
                            />
                            {errors.name && <p className="text-xs text-red-500 font-medium flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.name}</p>}
                        </div>
                    </div>

                    <div className="rounded-lg bg-muted/30 p-4 border border-border">
                        <h3 className="font-semibold mb-2 text-sm uppercase tracking-wide text-muted-foreground">Order Summary</h3>
                        {cartMode ? (
                            <div className="space-y-2 mb-2">
                                {cartItems.map(item => (
                                    <div key={item.id} className="flex justify-between text-sm py-1 border-b border-border/50 last:border-0">
                                        <span className="text-foreground/80 pr-2 truncate">{item.title}</span>
                                        <div className="flex items-center gap-2 whitespace-nowrap">
                                            {item.duration && <span className="font-medium bg-secondary px-2 py-0.5 rounded text-[10px]">{item.duration}</span>}
                                            <span className="font-medium">x{item.quantity}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex justify-between text-sm py-1">
                                <span className="text-foreground/80">{product?.title}</span>
                                <span className="font-medium bg-secondary px-2 py-0.5 rounded text-xs">{duration}</span>
                            </div>
                        )}
                        <div className="flex justify-between font-bold text-xl pt-3 border-t mt-2">
                            <span>Total</span>
                            <span className="text-primary">{formatPrice(priceToPay)}</span>
                        </div>
                    </div>

                    <Tabs defaultValue="bkash" onValueChange={setPaymentMethod} className="w-full">
                        <Label className="mb-2 block">Select Payment Method <span className="text-red-500">*</span></Label>
                        <TabsList className="grid w-full grid-cols-3 mb-4 h-auto p-1 bg-muted/50">
                            <TabsTrigger value="bkash" className="py-2.5 data-[state=active]:bg-[#e2136e] data-[state=active]:text-white font-bold transition-all">bKash</TabsTrigger>
                            <TabsTrigger value="nagad" className="py-2.5 data-[state=active]:bg-[#ec1d24] data-[state=active]:text-white font-bold transition-all">Nagad</TabsTrigger>
                            <TabsTrigger value="rocket" className="py-2.5 data-[state=active]:bg-[#8c3494] data-[state=active]:text-white font-bold transition-all">Rocket</TabsTrigger>
                        </TabsList>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={paymentMethod}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="p-4 rounded-lg bg-card border shadow-sm space-y-4"
                            >
                                <div className="space-y-3">
                                    <div className={`text-sm border-l-4 ${helper.color} pl-3 py-1 bg-muted/20 rounded-r-sm`}>
                                        <p className="font-medium mb-1">{helper.type}: <span className="font-bold select-all text-base">{helper.number}</span></p>
                                        <p className="text-muted-foreground text-xs">Send Money (Personal) • Reference: <span className="font-mono text-primary">{cartMode ? "Cart Order" : product?.id?.substring(0, 6)}</span></p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="mobileNumber">Sender Number <span className="text-red-500">*</span></Label>
                                        <div className="relative">
                                            <Smartphone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="mobileNumber"
                                                name="mobileNumber"
                                                placeholder="017..."
                                                className={`pl-9 ${errors.mobileNumber ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                                                value={formData.mobileNumber}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        {errors.mobileNumber && <p className="text-xs text-red-500 font-medium flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.mobileNumber}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="transactionId">Transaction ID (TrxID) <span className="text-red-500">*</span></Label>
                                        <Input
                                            id="transactionId"
                                            name="transactionId"
                                            placeholder="e.g. 8N7A6D..."
                                            className={`font-mono uppercase placeholder:normal-case ${errors.transactionId ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                                            value={formData.transactionId}
                                            onChange={handleInputChange}
                                        />
                                        {errors.transactionId && <p className="text-xs text-red-500 font-medium flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.transactionId}</p>}
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </Tabs>

                </CardContent>
                <CardFooter>
                    <Button
                        type="submit"
                        className="w-full text-base h-11 font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.01]"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Verifying...
                            </>
                        ) : (
                            <>
                                <Lock className="mr-2 h-4 w-4" />
                                Confirm Order & Pay {formatPrice(priceToPay)}
                            </>
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </form>
    );
}
