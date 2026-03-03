import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import LandingPage from '@/components/home/LandingPage';

export default function HomePage() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [recentProducts, setRecentProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Featured
                const { data: featured } = await supabase
                    .from('products')
                    .select('*, thumbnail_url:image')
                    .eq('is_active', true)
                    .eq('featured', true)
                    .limit(4);

                // Fetch Recent
                const { data: recent } = await supabase
                    .from('products')
                    .select('*, thumbnail_url:image')
                    .eq('is_active', true)
                    .order('created_at', { ascending: false })
                    .limit(8);

                setFeaturedProducts(featured || []);
                setRecentProducts(recent || []);
            } catch (error) {
                console.error('Error fetching home data', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-background text-foreground">Loading...</div>;
    }

    return (
        <LandingPage
            featuredProducts={featuredProducts}
            recentProducts={recentProducts}
        />
    );
}
