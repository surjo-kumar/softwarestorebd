import { createClient } from "@/lib/supabase/server";
import LandingPage from "@/components/home/LandingPage";

export default async function HomePage() {
    const supabase = createClient();

    // Fetch Featured Products (Active only)
    const { data: featuredProducts } = await supabase
        .from('products')
        .select('*, thumbnail_url:image')
        .eq('is_active', true)
        .eq('featured', true)
        .limit(4);

    // Fetch Recent Products (Active only)
    const { data: recentProducts } = await supabase
        .from('products')
        .select('*, thumbnail_url:image')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(8);

    return (
        <LandingPage
            featuredProducts={featuredProducts || []}
            recentProducts={recentProducts || []}
        />
    );
}
