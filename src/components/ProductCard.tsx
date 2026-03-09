import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

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
    // Calculate price range from variants
    let priceDisplay = `৳${price}`;
    let variantLabels: string[] = [];

    if (variants && Array.isArray(variants) && variants.length > 0) {
        const prices = variants.map((v: any) => v.price).filter((p: any) => p > 0);
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        priceDisplay = min === max ? `৳${min.toLocaleString()}` : `৳${min.toLocaleString()} – ৳${max.toLocaleString()}`;
        variantLabels = variants.map((v: any) => v.label).slice(0, 3);
    }

    return (
        <Link to={`/products/${id}`}>
            <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="group glass-card rounded-2xl overflow-hidden h-full card-3d shine-effect cursor-pointer"
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
                <div className="p-3 md:p-4">
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
                    <p className="text-sm md:text-base font-bold text-primary mb-2">
                        {priceDisplay}
                    </p>

                    {/* Variant Tags */}
                    {variantLabels.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                            {variantLabels.map((label: string) => (
                                <span
                                    key={label}
                                    className="text-[9px] md:text-[10px] font-medium bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-md border border-blue-100"
                                >
                                    {label}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </motion.div>
        </Link>
    );
}
