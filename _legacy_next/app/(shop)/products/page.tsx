
import ProductCard from "@/components/ProductCard";
import { createClient } from "@/lib/supabase/server";

export const dynamic = 'force-dynamic';

export default async function ProductsPage({
    searchParams,
}: {
    searchParams: { category?: string; search?: string };
}) {
    const supabase = createClient();
    const category = searchParams.category;
    const search = searchParams.search;

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

    const { data: products, error } = await query;

    if (error) {
        console.error("Error fetching products:", error);
        return <div className="p-8 text-center text-red-500">Error loading products. Please try again.</div>;
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

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
