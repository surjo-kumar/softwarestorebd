import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import LandingPage from '@/components/home/LandingPage';

interface CategoryProducts {
    category: string;
    label: string;
    products: any[];
}

export default function HomePage() {
    const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
    const [bestSelling, setBestSelling] = useState<any[]>([]);
    const [categoryGroups, setCategoryGroups] = useState<CategoryProducts[]>([]);
    const [loading, setLoading] = useState(true);
    const [settings, setSettings] = useState<any>({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch site settings
                const { data: settingsData } = await supabase
                    .from('site_settings')
                    .select('key, value');
                if (settingsData) {
                    const mapped: any = {};
                    settingsData.forEach((row: any) => { mapped[row.key] = row.value || ''; });
                    setSettings(mapped);
                }

                // Fetch all active products
                const { data: allProducts } = await supabase
                    .from('products')
                    .select('*, thumbnail_url:image')
                    .eq('is_active', true)
                    .order('created_at', { ascending: false });

                if (allProducts) {
                    // Featured (Best Products)
                    const featured = allProducts.filter((p: any) => p.featured).slice(0, 6);
                    setFeaturedProducts(featured);

                    // Best Selling - just grab recent ones
                    setBestSelling(allProducts.slice(0, 6));

                    // Group by category
                    const categoryMap: { [key: string]: any[] } = {};
                    allProducts.forEach((product: any) => {
                        const cat = product.category || 'other';
                        if (!categoryMap[cat]) categoryMap[cat] = [];
                        categoryMap[cat].push(product);
                    });

                    const groups = Object.entries(categoryMap).map(([category, products]) => ({
                        category,
                        label: category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, ' '),
                        products: products.slice(0, 6),
                    }));

                    setCategoryGroups(groups);
                }
            } catch (error) {
                console.error('Error fetching home data', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-gray-500 text-sm font-medium animate-pulse">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <LandingPage
            featuredProducts={featuredProducts}
            bestSelling={bestSelling}
            categoryGroups={categoryGroups}
            settings={settings}
        />
    );
}
