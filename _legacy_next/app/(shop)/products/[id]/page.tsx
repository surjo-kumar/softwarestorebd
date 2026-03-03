import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Shield, Star, Zap } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export default async function ProductDetailsPage({ params }: { params: { id: string } }) {
    const supabase = createClient();

    const { data: product, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', params.id)
        .single();

    if (error || !product) {
        return notFound();
    }

    // Parse features if stored as JSON/Array, otherwise mock
    const features = [
        "Instant Delivery",
        "24/7 Support",
        "Secure Payment",
        "Warranty Included"
    ];

    return (
        <div className="container mx-auto px-4 py-8 lg:py-12">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
                {/* Left: Image */}
                <div className="flex items-center justify-center rounded-2xl bg-secondary/10 p-8 lg:p-12">
                    <img
                        src={product.thumbnail_url || "/placeholder.png"}
                        alt={product.title}
                        className="w-1/2 max-w-[300px] object-contain drop-shadow-2xl transition-transform hover:scale-105"
                    />
                </div>

                {/* Right: Details */}
                <div className="flex flex-col gap-6">
                    <div>
                        <Badge className="mb-3">{product.category}</Badge>
                        <h1 className="text-3xl font-bold lg:text-4xl">{product.title}</h1>
                        <div className="flex items-center gap-2 mt-2">
                            <div className="flex text-yellow-500">
                                <Star className="h-4 w-4 fill-current" />
                                <Star className="h-4 w-4 fill-current" />
                                <Star className="h-4 w-4 fill-current" />
                                <Star className="h-4 w-4 fill-current" />
                                <Star className="h-4 w-4 fill-current" />
                            </div>
                            <span className="text-sm text-muted-foreground">(Review count unavailable)</span>
                        </div>
                    </div>

                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-primary">{formatPrice(product.price)}</span>
                        {product.is_subscription && <span className="text-muted-foreground">/ month</span>}
                    </div>

                    <p className="text-lg text-muted-foreground leading-relaxed">
                        {product.description}
                    </p>

                    {/* Features List */}
                    <div className="space-y-3">
                        <h3 className="font-semibold">Features:</h3>
                        <ul className="grid gap-2">
                            {features.map((feature: string, i: number) => (
                                <li key={i} className="flex items-center gap-2 text-sm">
                                    <Check className="h-4 w-4 text-green-500" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex flex-col gap-3 pt-4 border-t mt-4">
                        <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-800">
                            <Zap className="h-4 w-4" />
                            <span>Instant Delivery via Email</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-100 dark:border-green-800">
                            <Shield className="h-4 w-4" />
                            <span>100% Secure Payment & Warranty</span>
                        </div>

                        <Link href={`/checkout?id=${product.id}`} className="w-full">
                            <Button size="lg" className="w-full text-lg h-14 mt-2">
                                Buy Now - {formatPrice(product.price)}
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
