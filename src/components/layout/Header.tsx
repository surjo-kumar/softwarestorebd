import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase/client";
import { Menu, Search, ShoppingCart, User, X, Home, Store, Package, ClipboardList } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/contexts/CartContext";

export function Header() {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [settings, setSettings] = useState<any>({});
    const searchRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
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

    // Live search
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (searchQuery.trim().length > 1) {
                const { data } = await supabase
                    .from("products")
                    .select("id, title, image, price")
                    .eq("is_active", true)
                    .ilike("title", `%${searchQuery}%`)
                    .limit(5);
                setSearchResults(data || []);
            } else {
                setSearchResults([]);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Close on outside click
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setSearchResults([]);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
            setSearchResults([]);
        }
    };

    return (
        <>
            {/* Main Header - Glass Effect */}
            <header className="sticky top-0 z-50 w-full glass-strong shadow-sm">
                {/* Top Bar */}
                <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
                    {/* Hamburger Menu */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="p-2 hover:bg-white/60 rounded-xl transition-all md:hidden"
                    >
                        <Menu className="h-6 w-6 text-gray-700" />
                    </button>

                    {/* Desktop left nav */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link to="/" className="flex items-center gap-2.5">
                            <img src="/logo.png" alt={settings.site_name || "Software Store"} className="h-9 w-auto object-contain" />
                            <span className="text-xl font-bold tracking-tight text-gray-800">
                                {settings.site_name || "Software Store"}
                            </span>
                        </Link>
                        <nav className="flex items-center gap-5 text-sm font-medium text-gray-600">
                            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                            <Link to="/products" className="hover:text-primary transition-colors">Products</Link>
                            <Link to="/dashboard" className="hover:text-primary transition-colors">Orders</Link>
                        </nav>
                    </div>

                    {/* Mobile Center Logo */}
                    <Link to="/" className="flex items-center gap-2 md:hidden">
                        <img src="/logo.png" alt={settings.site_name || "Software Store"} className="h-8 w-auto object-contain" />
                        <span className="text-lg font-bold tracking-tight text-gray-800">
                            {settings.site_name || "Software Store"}
                        </span>
                    </Link>

                    {/* Right Actions */}
                    <div className="flex items-center gap-1 md:gap-2">
                        <Link to="/cart" className="p-2 hover:bg-white/60 rounded-xl transition-all relative group">
                            <ShoppingCart className="h-5 w-5 text-gray-700" />
                            {cartCount > 0 && (
                                <span className="absolute top-0 right-0 h-4 w-4 bg-primary text-white text-[10px] font-bold flex items-center justify-center rounded-full shadow-md shadow-primary/30 group-hover:scale-110 transition-transform">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                        <Link to="/dashboard" className="p-2 hover:bg-white/60 rounded-xl transition-all">
                            <User className="h-5 w-5 text-gray-700" />
                        </Link>
                        {/* Desktop auth buttons */}
                        <div className="hidden md:flex items-center gap-2 ml-2">
                            <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors px-3 py-1.5">
                                Login
                            </Link>
                            <Link to="/register" className="text-sm font-semibold text-white bg-primary px-4 py-2 rounded-xl hover:bg-primary/90 transition-all shadow-md shadow-primary/20">
                                Sign Up
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="px-4 pb-3 max-w-3xl mx-auto" ref={searchRef}>
                    <form onSubmit={handleSearchSubmit} className="relative">
                        <input
                            type="text"
                            placeholder="Search for products"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-11 pl-4 pr-12 rounded-2xl border border-gray-200/80 bg-white/70 backdrop-blur-sm text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                        />
                        <button
                            type="submit"
                            className="absolute right-1.5 top-1/2 -translate-y-1/2 h-8 w-8 bg-primary rounded-xl flex items-center justify-center hover:bg-primary/90 transition-colors shadow-md shadow-primary/25"
                        >
                            <Search className="h-4 w-4 text-white" />
                        </button>

                        {/* Search Results */}
                        <AnimatePresence>
                            {searchResults.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute top-full left-0 right-0 mt-2 glass-strong rounded-2xl shadow-xl overflow-hidden z-50"
                                >
                                    {searchResults.map((product) => (
                                        <Link
                                            key={product.id}
                                            to={`/products/${product.id}`}
                                            onClick={() => { setSearchResults([]); setSearchQuery(""); }}
                                            className="flex items-center gap-3 px-4 py-3 hover:bg-white/60 transition-all border-b border-gray-100/50 last:border-0"
                                        >
                                            {product.image && (
                                                <img src={product.image} alt={product.title} className="w-10 h-10 rounded-xl object-cover shadow-sm" />
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 truncate">{product.title}</p>
                                                <p className="text-xs text-primary font-semibold">৳{product.price}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </form>
                </div>
            </header>

            {/* Mobile Side Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
                            onClick={() => setMobileMenuOpen(false)}
                        />
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="fixed top-0 left-0 bottom-0 w-[280px] glass-strong z-[70] shadow-2xl"
                        >
                            <div className="flex items-center justify-between p-4 border-b border-gray-200/50">
                                <Link to="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                                    <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
                                    <span className="font-bold text-lg text-gray-800">{settings.site_name || "Software Store"}</span>
                                </Link>
                                <button onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-white/60 rounded-xl">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                            <nav className="py-4">
                                {[
                                    { label: "হোম", icon: Home, to: "/" },
                                    { label: "All Products", icon: Store, to: "/products" },
                                    { label: "My Orders", icon: Package, to: "/dashboard" },
                                    { label: "Login", icon: User, to: "/login" },
                                    { label: "Register", icon: ClipboardList, to: "/register" },
                                ].map((item) => (
                                    <Link
                                        key={item.label}
                                        to={item.to}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center gap-3 px-6 py-3.5 text-gray-700 hover:bg-primary/5 hover:text-primary transition-all text-sm font-medium rounded-lg mx-2"
                                    >
                                        <item.icon className="h-5 w-5" />
                                        {item.label}
                                    </Link>
                                ))}
                            </nav>

                            <div className="border-t border-gray-200/50 pt-4 px-6">
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Categories</p>
                                {["AI Tools", "Streaming", "Software", "Design Tools", "VPN & Security"].map((cat) => (
                                    <Link
                                        key={cat}
                                        to={`/products?category=${cat.toLowerCase()}`}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="block py-2.5 text-sm text-gray-600 hover:text-primary transition-colors"
                                    >
                                        {cat}
                                    </Link>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
