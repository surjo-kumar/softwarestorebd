import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import { supabase } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import { Search, X } from "lucide-react";

export default function ProductsPage() {
    const [searchParams] = useSearchParams();
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [localSearch, setLocalSearch] = useState("");
    const [categories, setCategories] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const category = searchParams.get("category");
    const search = searchParams.get("search");

    useEffect(() => {
        if (category) setSelectedCategory(category);
        if (search) setLocalSearch(search);
    }, [category, search]);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                let query = supabase.from('products').select('*, thumbnail_url:image').eq('is_active', true);

                if (selectedCategory) {
                    query = query.eq('category', selectedCategory);
                }

                if (localSearch) {
                    query = query.ilike('title', `%${localSearch}%`);
                }

                const { data, error } = await query;

                if (error) throw error;
                setProducts(data || []);

                // Extract unique categories
                if (!selectedCategory && !localSearch) {
                    const cats = [...new Set((data || []).map((p: any) => p.category).filter(Boolean))] as string[];
                    setCategories(cats);
                }
            } catch (err: any) {
                console.error("Error fetching products:", err);
                setError("Error loading products. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [selectedCategory, localSearch]);

    // Fetch all categories on mount
    useEffect(() => {
        const fetchCategories = async () => {
            const { data } = await supabase.from('products').select('category').eq('is_active', true);
            if (data) {
                const cats = [...new Set(data.map((p: any) => p.category).filter(Boolean))] as string[];
                setCategories(cats);
            }
        };
        fetchCategories();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white pb-bottom-nav">
            {/* Header */}
            <div className="px-4 pt-5 pb-3 max-w-6xl mx-auto">
                <motion.h1
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl md:text-3xl font-bold text-gray-900 mb-1"
                >
                    {selectedCategory
                        ? `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}`
                        : "All Products"}
                </motion.h1>
                <p className="text-sm text-gray-500">
                    {products.length} products found
                </p>
            </div>

            {/* Search & Filter Bar */}
            <div className="px-4 pb-4 max-w-6xl mx-auto">
                <div className="flex gap-2">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={localSearch}
                            onChange={(e) => setLocalSearch(e.target.value)}
                            className="w-full h-10 pl-10 pr-8 rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        {localSearch && (
                            <button
                                onClick={() => setLocalSearch("")}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2"
                            >
                                <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Category Filter Chips */}
                {categories.length > 0 && (
                    <div className="flex gap-2 mt-3 overflow-x-auto hide-scrollbar pb-1">
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                                !selectedCategory
                                    ? "bg-primary text-white shadow-md shadow-primary/20"
                                    : "bg-white text-gray-600 border border-gray-200 hover:border-primary/50"
                            }`}
                        >
                            All
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all capitalize ${
                                    selectedCategory === cat
                                        ? "bg-primary text-white shadow-md shadow-primary/20"
                                        : "bg-white text-gray-600 border border-gray-200 hover:border-primary/50"
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Loading State */}
            {loading && (
                <div className="px-4 max-w-6xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100">
                                <div className="aspect-square shimmer" />
                                <div className="p-3 space-y-2">
                                    <div className="h-3 w-20 shimmer rounded" />
                                    <div className="h-4 w-full shimmer rounded" />
                                    <div className="h-3 w-16 shimmer rounded" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="px-4 py-12 text-center max-w-6xl mx-auto">
                    <p className="text-red-500 font-medium">{error}</p>
                </div>
            )}

            {/* Products Grid */}
            {!loading && !error && (
                <div className="px-4 max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3"
                    >
                        {products.map((product, i) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.03, duration: 0.3 }}
                            >
                                <ProductCard
                                    id={product.id}
                                    title={product.title}
                                    description={product.description || ""}
                                    price={product.price}
                                    thumbnailUrl={product.thumbnail_url}
                                    category={product.category}
                                    isSubscription={product.is_subscription}
                                    featured={product.featured}
                                    variants={product.pricing_variants}
                                />
                            </motion.div>
                        ))}
                    </motion.div>

                    {products.length === 0 && (
                        <div className="text-center py-20">
                            <div className="text-5xl mb-4">🔍</div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">No products found</h3>
                            <p className="text-sm text-gray-500">Try searching with different keywords.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
