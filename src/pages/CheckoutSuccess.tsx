import { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Download, Home, Clock } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { motion } from "framer-motion";

export default function CheckoutSuccessPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const orderId = searchParams.get("orderId");
    const [loading, setLoading] = useState(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [order, setOrder] = useState<any>(null);

    useEffect(() => {
        if (!orderId) {
            navigate("/");
            return;
        }
        const fetchOrder = async () => {
            const { data, error } = await supabase
                .from('orders')
                .select('*, products(*)')
                .eq('id', orderId)
                .single();

            if (error || !data) {
                console.error("Order not found");
            } else {
                setOrder(data);
            }
            setLoading(false);
        };
        fetchOrder();
    }, [orderId, navigate]);

    if (loading) return <div className="p-12 text-center text-muted-foreground animate-pulse">Loading order status...</div>;
    if (!order) return <div className="p-12 text-center text-red-500">Order not found.</div>;

    const isPending = order.status === 'pending';

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 relative overflow-hidden">
            {/* Background blobs */}
            <div className="absolute top-10 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, type: "spring", bounce: 0.5 }}
                className="w-full max-w-md relative z-10 px-4"
            >
                <Card className="text-center overflow-hidden border-2 shadow-2xl bg-card/80 backdrop-blur-xl">
                    <CardHeader className="pb-2">
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="flex justify-center mb-6"
                        >
                            <div className={`rounded-full p-4 ${isPending ? "bg-yellow-100" : "bg-green-100"} shadow-lg`}>
                                {isPending ? (
                                    <Clock className={`h-16 w-16 ${isPending ? "text-yellow-600" : "text-green-600"}`} />
                                ) : (
                                    <CheckCircle2 className="h-16 w-16 text-green-600" />
                                )}
                            </div>
                        </motion.div>
                        <CardTitle className={`text-3xl font-extrabold tracking-tight ${isPending ? "text-yellow-600" : "text-green-600"}`}>
                            {isPending ? "Payment Pending" : "Payment Successful!"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-muted-foreground text-lg"
                        >
                            {isPending
                                ? "We've received your order! Please wait while we verify your payment manually."
                                : "Thank you for your purchase. Your order has been confirmed and is ready."
                            }
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 }}
                            className="bg-secondary/30 p-6 rounded-2xl border border-secondary/50 text-left space-y-3 shadow-inner"
                        >
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Order ID</span>
                                <span className="font-mono bg-background px-2 py-1 rounded border text-xs">{order.id.slice(0, 8)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Product</span>
                                <span className="font-semibold">{order.products?.title}</span>
                            </div>
                            <div className="flex justify-between items-center font-bold text-lg pt-3 border-t border-border/50">
                                <span>Total Amount</span>
                                <span className="text-primary">${order.amount}</span>
                            </div>
                        </motion.div>

                        {!isPending && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="text-sm text-green-600 font-medium flex items-center justify-center gap-2 bg-green-50 py-2 rounded-lg"
                            >
                                <CheckCircle2 className="h-4 w-4" />
                                Instant Delivery Enabled
                            </motion.p>
                        )}
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4 pt-2 pb-8">
                        {!isPending && (
                            <motion.div className="w-full" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <Button className="w-full gap-2 h-12 text-lg shadow-lg shadow-primary/25" size="lg">
                                    <Download className="h-5 w-5" />
                                    Access Downloads
                                </Button>
                            </motion.div>
                        )}
                        <Link to="/" className="w-full">
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <Button variant="outline" className="w-full gap-2 h-12 border-2 hover:bg-secondary/50">
                                    <Home className="h-5 w-5" />
                                    Return to Store
                                </Button>
                            </motion.div>
                        </Link>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    );
}
