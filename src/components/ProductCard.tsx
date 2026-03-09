import { Link, useNavigate } from "react-router-dom";
import { Star, ShoppingCart, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "@/contexts/CartContext";

interface ProductCardProps {
    id: string;
    title: string;
    description: string;
    price: number;
    thumbnailUrl?: string;
    category?: string;
    isSubscription?: boolean;
    featured?: boolean;
    variants?: any[];
}

export default function ProductCard({
    id,
    title,
    price,
    thumbnailUrl,
    featured,
    variants,
}: ProductCardProps) {
    const { addToCart } = useCart();
    const navigate = useNavigate();

    // Calculate price range from variants
    let priceDisplay = `৳${price}`;
    let defaultPrice = price;
    let defaultLabel: string | undefined;

    if (variants && Array.isArray(variants) && variants.length > 0) {
        const prices = variants.map((v: any) => v.price).filter((p: any) => p > 0);
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        priceDisplay = min === max ? `৳${min.toLocaleString()}` : `৳${min.toLocaleString()} – ৳${max.toLocaleString()}`;
        const defaultVar = variants.find((v: any) => v.is_default) || variants[0];
        defaultPrice = defaultVar?.price || min;
        defaultLabel = defaultVar?.label;
    }

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart({
            id,
            title,
            price: defaultPrice,
            thumbnail_url: thumbnailUrl || "",
            duration: defaultLabel,
            quantity: 1,
        });
    };

    const handleBuyNow = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const duration = defaultLabel || "";
        navigate(`/checkout?id=${id}&duration=${encodeURIComponent(duration)}&price=${defaultPrice}&qty=1`);
    };

    return (
        <div className="group relative h-full">
            <Link to={`/products/${id}`}>
                <motion.div
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="glass-card rounded-2xl overflow-hidden h-full card-3d shine-effect cursor-pointer flex flex-col"
                >
                    {/* Image */}
                    <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center p-4 md:p-6 overflow-hidden">
                        {/* Background decorative */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="product-platform relative z-10">
                            <img
                                src={thumbnailUrl || "/placeholder.png"}
                                alt={title}
                                className="w-full max-h-[120px] md:max-h-[160px] object-contain group-hover:scale-105 transition-transform duration-500"
                                loading="lazy"
                            />
                        </div>

                        {/* Sale Badge */}
                        {featured && (
                            <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] md:text-xs font-bold px-2 py-0.5 rounded-lg shadow-lg shadow-red-500/25 z-10">
                                SALE
                            </span>
                        )}
                    </div>

                    {/* Content */}
                    <div className="p-3 md:p-4 flex flex-col flex-1">
                        {/* Stars */}
                        <div className="flex gap-0.5 mb-1">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <Star key={s} className="h-3 w-3 md:h-3.5 md:w-3.5 fill-yellow-400 text-yellow-400" />
                            ))}
                        </div>

                        {/* Title */}
                        <h3 className="text-xs md:text-sm font-semibold text-gray-900 line-clamp-2 mb-1.5 leading-tight group-hover:text-primary transition-colors">
                            {title}
                        </h3>

                        {/* Price */}
                        <p className="text-sm md:text-base font-bold text-primary mb-3">
                            {priceDisplay}
                        </p>

                        {/* Spacer */}
                        <div className="flex-1" />

                        {/* Action Buttons */}
                        <div className="flex gap-1.5 mt-auto">
                            <button
                                onClick={handleBuyNow}
                                className="flex-1 flex items-center justify-center gap-1 bg-primary text-white text-[10px] md:text-xs font-semibold py-2 px-2 rounded-lg hover:bg-blue-700 transition-colors shadow-md shadow-primary/20 relative z-20"
                            >
                                <Zap className="h-3 w-3" />
                                <span>Buy Now</span>
                            </button>
                            <button
                                onClick={handleAddToCart}
                                className="flex items-center justify-center bg-white text-primary border-2 border-primary/30 hover:border-primary hover:bg-primary/5 p-2 rounded-lg transition-all relative z-20"
                                title="Add to Cart"
                            >
                                <ShoppingCart className="h-3.5 w-3.5 md:h-4 md:w-4" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            </Link>
        </div>
    );
}
