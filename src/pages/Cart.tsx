import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, ArrowRight, Store, Sparkles, Trash2, ShieldCheck, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
    const { items, removeFromCart, cartTotal, cartCount } = useCart();
    const navigate = useNavigate();

    if (items.length === 0) {
        return (
            <div className="min-h-[80vh] flex flex-col justify-center items-center bg-gradient-to-br from-slate-50 via-white to-blue-50/30 px-4 py-12">
                <div className="max-w-lg w-full">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100 text-center relative overflow-hidden"
                    >
                        {/* Background decorations */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -ml-16 -mb-16"></div>
                        
                        <div className="relative z-10">
                            <div className="w-24 h-24 mx-auto rounded-full bg-slate-50/80 border border-slate-100 flex items-center justify-center shadow-sm mb-6 relative">
                                <div className="absolute inset-0 rounded-full border border-primary/20 animate-spin-slow" style={{ animationDuration: '3s' }}></div>
                                <ShoppingCart className="h-10 w-10 text-slate-300" />
                                <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                                    <span className="text-white text-xs font-bold">0</span>
                                </div>
                            </div>
                            
                            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 mb-3">
                                Your cart is empty
                            </h1>
                            
                            <p className="text-sm md:text-base text-slate-500 font-medium leading-relaxed mb-8">
                                Looks like you haven't added any digital products, software, or tools to your cart yet.
                            </p>
                            
                            <div className="space-y-4">
                                <Link to="/products">
                                    <Button className="w-full h-12 md:h-14 rounded-xl text-base font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all group overflow-hidden relative">
                                        <span className="relative z-10 flex items-center justify-center gap-2">
                                            <Store className="h-5 w-5" />
                                            Browse Products
                                            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                        </span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-primary via-blue-600 to-primary opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundSize: '200% auto', animation: 'gradient 2s linear infinite' }}></div>
                                    </Button>
                                </Link>
                                
                                <div className="pt-4 flex flex-col items-center gap-2">
                                    <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                                        <Sparkles className="h-3 w-3 text-amber-500" /> 
                                        Instant delivery via email after purchase
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                    <ShoppingCart className="h-8 w-8 text-primary" />
                    Shopping Cart
                    <span className="text-base font-medium text-slate-500 bg-slate-200/50 px-3 py-1 rounded-full">{cartCount} items</span>
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-8 flex flex-col gap-4">
                        <AnimatePresence>
                            {items.map((item) => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, x: -50 }}
                                    className="bg-white rounded-2xl p-4 sm:p-5 flex gap-4 sm:gap-6 items-center shadow-sm border border-slate-100 relative group overflow-hidden hover:border-primary/20 hover:shadow-md transition-all"
                                >
                                    <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden relative">
                                        <img src={item.thumbnail_url || 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=200'} alt={item.title} className="w-full h-full object-cover" />
                                    </div>
                                    
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-slate-900 text-base sm:text-lg mb-1 truncate pr-8">{item.title}</h3>
                                        <div className="flex flex-wrap gap-2 items-center mb-2">
                                            {item.duration && (
                                                <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">
                                                    {item.duration}
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-lg sm:text-xl font-bold text-slate-900">
                                            {formatPrice(item.price)}
                                            {item.quantity > 1 && <span className="text-sm font-medium text-slate-500 ml-2">x {item.quantity}</span>}
                                        </div>
                                    </div>
                                    
                                    <button 
                                        onClick={() => removeFromCart(item.id)}
                                        className="h-10 w-10 shrink-0 bg-red-50 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm group-hover:shadow-red-500/20 absolute top-4 right-4 sm:relative sm:top-auto sm:right-auto"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-4">
                        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 sticky top-24">
                            <h2 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h2>
                            
                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-slate-600 font-medium">
                                    <span>Subtotal ({cartCount} items)</span>
                                    <span>{formatPrice(cartTotal)}</span>
                                </div>
                                <div className="flex justify-between text-slate-600 font-medium">
                                    <span>Delivery</span>
                                    <span className="text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-md text-xs font-bold border border-emerald-100">Free</span>
                                </div>
                                <div className="h-px w-full bg-slate-100 !my-6"></div>
                                <div className="flex justify-between text-lg sm:text-xl font-bold text-slate-900">
                                    <span>Total</span>
                                    <span className="text-primary">{formatPrice(cartTotal)}</span>
                                </div>
                            </div>
                            
                            <Button 
                                onClick={() => navigate("/checkout")}
                                className="w-full h-14 rounded-xl text-base font-bold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all flex items-center justify-center gap-2 mb-4"
                            >
                                <CreditCard className="h-5 w-5" />
                                Proceed to Checkout
                            </Button>
                            
                            <div className="flex items-center justify-center gap-2 text-xs font-medium text-slate-500 bg-slate-50 py-3 rounded-xl border border-slate-100">
                                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                                Secure Checkout by SSBD
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
