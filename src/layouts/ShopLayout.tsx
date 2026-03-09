import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Outlet, Link, useLocation } from "react-router-dom";
import { Home, Store, ShoppingCart, MessageCircle, X } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from "@/lib/supabase/client";
import { useCart } from "@/contexts/CartContext";

const WhatsAppIcon = () => (
    <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-white">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
    </svg>
);

const MessengerIcon = () => (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-white">
        <path d="M23.998 11.83c0-6.155-5.373-11.144-11.999-11.144C5.372.686 0 5.675 0 11.83c0 3.2 1.5 6.138 3.999 8.169V24l3.66-2A12.446 12.446 0 0012 22.973c6.626 0 11.998-4.99 11.998-11.144zM12.75 14l-2.5-2.75-5 2.75 5.5-6 2.5 2.75 5-2.75-5.5 6z"></path>
    </svg>
);

const TelegramIcon = () => (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-white">
        <line x1="22" y1="2" x2="11" y2="13"></line>
        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
    </svg>
);

export default function ShopLayout() {
    const location = useLocation();
    const [chatOpen, setChatOpen] = useState(false);
    const [settings, setSettings] = useState<any>({});
    const { cartCount } = useCart();

    useEffect(() => {
        const fetchSettings = async () => {
            const { data } = await supabase.from("site_settings").select("key, value");
            if (data) {
                const mapped: any = {};
                data.forEach((row: any) => { mapped[row.key] = row.value || ""; });
                setSettings(mapped);
            }
        };
        fetchSettings();
    }, []);

    const navItems = [
        { label: "হোম", icon: Home, to: "/" },
        { label: "শপ", icon: Store, to: "/products" },
        { label: "কার্ট", icon: ShoppingCart, to: "/cart" },
    ];

    const isActive = (path: string) => {
        if (path === "/") return location.pathname === "/";
        return location.pathname.startsWith(path);
    };

    return (
        <div className="relative pb-16 md:pb-0">
            <Header />
            <main className="min-h-screen bg-slate-50">
                <Outlet />
            </main>
            <Footer />

            {/* Floating Chat Button */}
            <div className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-50 flex flex-col items-end">
                <AnimatePresence>
                    {chatOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                            className="bg-white rounded-2xl shadow-xl border border-slate-100 p-2 mb-4 flex flex-col gap-2 relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>
                            
                            {settings.whatsapp_number && (
                                <a 
                                    href={`https://wa.me/${settings.whatsapp_number}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-green-50 text-slate-700 hover:text-green-600 transition-all group relative z-10"
                                >
                                    <div className="bg-[#25D366] text-white p-2 rounded-full group-hover:scale-110 transition-transform shadow-md shadow-[#25D366]/30">
                                        <WhatsAppIcon />
                                    </div>
                                    <span className="font-semibold text-sm">WhatsApp</span>
                                </a>
                            )}
                            
                            {settings.messenger_link && (
                                <a 
                                    href={settings.messenger_link} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-50 text-slate-700 hover:text-blue-600 transition-all group relative z-10"
                                >
                                    <div className="bg-[#00B2FF] text-white p-2 rounded-full group-hover:scale-110 transition-transform shadow-md shadow-[#00B2FF]/30">
                                        <MessengerIcon />
                                    </div>
                                    <span className="font-semibold text-sm">Messenger</span>
                                </a>
                            )}
                            
                            {settings.telegram_link && (
                                <a 
                                    href={settings.telegram_link} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-cyan-50 text-slate-700 hover:text-cyan-600 transition-all group relative z-10"
                                >
                                    <div className="bg-[#0088cc] text-white p-2 rounded-full group-hover:scale-110 transition-transform shadow-md shadow-[#0088cc]/30">
                                        <TelegramIcon />
                                    </div>
                                    <span className="font-semibold text-sm">Telegram</span>
                                </a>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setChatOpen(!chatOpen)}
                    className="bg-primary text-white h-14 w-14 rounded-full flex items-center justify-center shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all relative z-10"
                >
                    <AnimatePresence mode="wait">
                        {chatOpen ? (
                            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                                <X className="h-6 w-6" />
                            </motion.div>
                        ) : (
                            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                                <MessageCircle className="h-6 w-6" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.button>
            </div>

            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-slate-200/50 z-50 px-2 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
                <div className="flex items-center justify-around py-2 max-w-lg mx-auto">
                    {navItems.map((navItem) => {
                        const active = isActive(navItem.to);
                        return (
                            <Link
                                key={navItem.label}
                                to={navItem.to}
                                className={`relative flex flex-col items-center gap-1 px-4 py-1.5 rounded-2xl transition-all duration-300 min-w-[64px] ${
                                    active
                                        ? "text-primary bg-primary/5"
                                        : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                                }`}
                            >
                                <div className="relative">
                                    <navItem.icon className={`h-5 w-5 transition-transform duration-300 ${active ? "stroke-[2.5] scale-110" : "stroke-[1.5]"}`} />
                                    {navItem.to === "/cart" && cartCount > 0 && (
                                        <span className="absolute -top-1.5 -right-1.5 h-4 w-4 bg-primary text-white text-[9px] font-bold flex items-center justify-center rounded-full shadow-md shadow-primary/20 animate-in zoom-in-50">
                                            {cartCount}
                                        </span>
                                    )}
                                </div>
                                <span className={`text-[10px] transition-all duration-300 ${active ? "font-bold" : "font-medium"}`}>
                                    {navItem.label}
                                </span>
                                {active && (
                                    <motion.div
                                        layoutId="bottomNavIndicator"
                                        className="absolute -top-[1px] w-8 h-[3px] bg-primary rounded-full shadow-[0_0_8px_rgba(var(--primary),0.8)]"
                                    />
                                )}
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
}
