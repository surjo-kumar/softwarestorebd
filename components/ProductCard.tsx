
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { ShoppingCart, Star, Zap } from "lucide-react";

interface ProductCardProps {
    id: string;
    title: string;
    description: string;
    price: number;
    thumbnailUrl?: string;
    category: string;
    isSubscription?: boolean;
    featured?: boolean;
}

export default function ProductCard({
    id,
    title,
    description,
    price,
    thumbnailUrl,
    category,
    isSubscription,
    featured,
}: ProductCardProps) {
    // Generate random gradient for placeholder if no thumbnail
    const gradientClass = `bg-gradient-to-br ${category === 'chatgpt' ? 'from-green-400/80 to-emerald-600/80' :
        category === 'netflix' ? 'from-red-500/80 to-rose-700/80' :
            category === 'software' ? 'from-blue-400/80 to-indigo-600/80' :
                'from-purple-400/80 to-violet-600/80'
        }`;

    return (
        <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl border-border/50 bg-card/40 backdrop-blur-md flex flex-col h-full rounded-xl md:rounded-2xl">
            {featured && (
                <div className="absolute right-0 top-0 z-10 rounded-bl-lg bg-yellow-500 px-2 py-0.5 text-[10px] md:text-xs font-bold text-black shadow-sm">
                    Featured
                </div>
            )}

            <div className="relative aspect-square md:aspect-video overflow-hidden rounded-t-xl md:rounded-t-2xl bg-secondary/30 p-4 md:p-6 flex items-center justify-center">
                {thumbnailUrl ? (
                    <img
                        src={thumbnailUrl}
                        alt={title}
                        className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-110 drop-shadow-md"
                    />
                ) : (
                    <div className={`flex h-full w-full items-center justify-center ${gradientClass} text-white rounded-lg shadow-inner`}>
                        {category === 'chatgpt' && <span className="text-3xl md:text-5xl">🤖</span>}
                        {category === 'netflix' && <span className="text-3xl md:text-5xl">🎬</span>}
                        {category === 'software' && <span className="text-3xl md:text-5xl">💻</span>}
                        {category === 'ebooks' && <span className="text-3xl md:text-5xl">📚</span>}
                        {category === 'gemini' && <span className="text-3xl md:text-5xl">✨</span>}
                        {category === 'other' && <span className="text-3xl md:text-5xl">💎</span>}
                    </div>
                )}

                {/* Mobile: Full card click, Desktop: Hover button */}
                <Link href={`/products/${id}`} className="absolute inset-0 z-20 md:hidden">
                    <span className="sr-only">View {title}</span>
                </Link>

                {/* Desktop Hover Overlay */}
                <div className="hidden md:flex absolute inset-0 items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-30">
                    <Link href={`/products/${id}`} className="transform scale-90 transition-transform duration-200 group-hover:scale-100">
                        <Button variant="secondary" className="font-semibold shadow-lg rounded-full px-6">
                            View Details
                        </Button>
                    </Link>
                </div>
            </div>

            <CardHeader className="p-3 md:p-4 pb-0 md:pb-2 space-y-1">
                <div className="flex items-center justify-between">
                    <Badge variant="outline" className="bg-primary/5 capitalize text-primary border-primary/20 text-[10px] md:text-xs px-1.5 py-0 md:px-2.5 md:py-0.5 h-5 md:h-auto">
                        {category}
                    </Badge>
                    <div className="flex items-center text-[10px] md:text-xs text-yellow-500">
                        <Star className="mr-0.5 h-3 w-3 fill-current" />
                        <span>4.9</span>
                    </div>
                </div>
                <h3 className="line-clamp-1 text-sm md:text-lg font-bold group-hover:text-primary transition-colors leading-tight">
                    {title}
                </h3>
            </CardHeader>

            <CardContent className="px-3 md:px-4 py-1 md:py-2 flex-grow">
                {/* Hide description on very small screens to save space if needed, or keep clamp-2 */}
                <p className="line-clamp-2 text-xs md:text-sm text-muted-foreground leading-relaxed">
                    {description || "Premium digital product with instant delivery."}
                </p>
            </CardContent>

            <CardFooter className="flex flex-col md:flex-row items-start md:items-center justify-between p-3 md:p-4 pt-2 md:pt-4 mt-auto gap-2 md:gap-0">
                <div className="w-full md:w-auto">
                    {/* <p className="text-[10px] text-muted-foreground hidden md:block">Starting at</p> */}
                    <div className="flex items-baseline gap-1">
                        <span className="text-base md:text-xl font-bold text-primary">{formatPrice(price)}</span>
                        {isSubscription && <span className="text-[10px] md:text-xs text-muted-foreground">/mo</span>}
                    </div>
                </div>

                <Link href={`/checkout?id=${id}`} className="w-full md:w-auto">
                    <Button size="sm" className="w-full h-8 md:h-9 text-xs md:text-sm bg-primary hover:bg-primary/90 shadow-md transition-all rounded-lg md:rounded-md active:scale-95">
                        <ShoppingCart className="mr-1.5 h-3.5 w-3.5 md:mr-2 md:h-4 md:w-4" />
                        Buy Now
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    );
}
