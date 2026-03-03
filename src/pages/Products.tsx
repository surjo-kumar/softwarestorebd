import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import { supabase } from "@/lib/supabase/client";

export default function ProductsPage() {
    const [searchParams] = useSearchParams();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const category = searchParams.get("category");
    const search = searchParams.get("search");

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                let query = supabase.from('products').select('*, thumbnail_url:image').eq('is_active', true);

                if (category) {
                    if (category === 'software') {
                        // Software category catches both license and software category
                        query = query.or(`category.eq.software,is_license.eq.true`);
                    } else {
                        query = query.eq('category', category);
                    }
                }

                if (search) {
                    query = query.ilike('title', `%${search}%`);
                }

                const { data, error } = await query;

                if (error) throw error;
                setProducts(data || []);
            } catch (err: any) {
                console.error("Error fetching products:", err);
                setError("Error loading products. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [category, search]);

    if (loading) return <div className="p-8 text-center text-muted-foreground">Loading products...</div>;

    if (error) {
        return <div className="p-8 text-center text-red-500">{error}</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">
                    {category ? `${category.charAt(0).toUpperCase() + category.slice(1)} Products` : "All Products"}
                </h1>
                <p className="text-muted-foreground">
                    {products?.length || 0} results found
                </p>
            </div>

            <div className="grid gap-3 md:gap-6 grid-cols-2 lg:grid-cols-4">
                {products?.map((product) => (
                    <ProductCard
                        key={product.id}
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
                ))}
            </div>

            {(!products || products.length === 0) && (
                <div className="text-center py-20">
                    <h3 className="text-lg font-semibold">No products found</h3>
                    <p className="text-muted-foreground">Try adjusting your filters.</p>
                </div>
            )}
        </div>
    );
}
