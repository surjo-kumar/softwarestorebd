"use client";

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import Reviews from "./Reviews";
import { ChevronRight, Sparkles } from "lucide-react";

interface CategoryProducts {
    category: string;
    label: string;
    products: any[];
}

interface LandingPageProps {
    featuredProducts: any[];
    bestSelling: any[];
    categoryGroups: CategoryProducts[];
    settings: any;
}

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.06 }
    }
};

const item = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35 } }
};

export default function LandingPage({ featuredProducts, bestSelling, categoryGroups, settings }: LandingPageProps) {
    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white pb-bottom-nav">
            {/* ===== Hero Banner ===== */}
            <section className="relative overflow-hidden">
                {/* Glass Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 via-white/80 to-blue-50/40 pointer-events-none" />
                
                {/* Animated Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-20 -right-20 w-72 md:w-96 h-72 md:h-96 rounded-full bg-blue-200/25 blur-3xl animate-float-slow" />
                    <div className="absolute top-1/2 -left-16 w-48 md:w-64 h-48 md:h-64 rounded-full bg-primary/10 blur-3xl animate-float-reverse" />
                    <div className="absolute bottom-10 right-20 w-32 h-32 rounded-full bg-blue-100/30 animate-float" />
                    <div className="absolute top-20 left-1/3 w-20 h-20 rounded-full bg-primary/8 animate-float-slow" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
                    <div className="flex flex-col md:flex-row items-center gap-6 py-8 md:py-16 lg:py-20">
                        {/* Left: Copy */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="flex-1 text-center md:text-left"
                        >
                            <div className="flex items-center gap-2 mb-3 justify-center md:justify-start">
                                <img src="/logo.png" alt="Logo" className="h-7 w-auto" />
                                <span className="text-lg font-bold text-gray-800">
                                    {settings.site_name || "Software Store"}
                                </span>
                            </div>
                            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-3">
                                Unlock <span className="text-primary">Premium</span> Apps
                            </h1>
                            <p className="text-sm md:text-base text-gray-600 leading-relaxed max-w-md mx-auto md:mx-0 mb-6">
                                for Less — Get trusted software subscriptions at <span className="font-semibold text-primary">unbeatable prices</span>!
                                Instant delivery, 24/7 support.
                            </p>

                            <div className="flex items-center gap-3 justify-center md:justify-start">
                                <Link
                                    to="/products"
                                    className="btn-premium inline-flex items-center gap-2 bg-primary text-white px-7 py-3 rounded-2xl text-sm font-semibold shadow-xl shadow-primary/25"
                                >
                                    <Sparkles className="h-4 w-4" />
                                    Buy now
                                    <ChevronRight className="h-4 w-4" />
                                </Link>
                                <Link
                                    to="/products"
                                    className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm text-gray-700 px-6 py-3 rounded-2xl text-sm font-semibold border border-gray-200 hover:border-primary/50 hover:text-primary transition-all shadow-sm"
                                >
                                    Browse All
                                </Link>
                            </div>
                        </motion.div>

                        {/* Right: App Icons Grid */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="flex-shrink-0"
                        >
                            <div className="grid grid-cols-3 gap-3 md:gap-4" style={{ perspective: '1000px' }}>
                                {['🤖', '🎬', '💻', '🎨', '📱', '🎮'].map((emoji, i) => (
                                    <motion.div
                                        key={i}
                                        className="w-14 h-14 md:w-20 md:h-20 lg:w-24 lg:h-24 glass-card rounded-2xl flex items-center justify-center text-2xl md:text-3xl lg:text-4xl animate-subtle-3d cursor-pointer"
                                        style={{ animationDelay: `${i * 0.5}s` }}
                                        whileHover={{ scale: 1.15, rotateY: 15 }}
                                    >
                                        {emoji}
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ===== Best Products ===== */}
            {featuredProducts.length > 0 && (
                <section className="px-4 md:px-8 py-6 md:py-10 max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="flex items-center justify-between mb-4 md:mb-6"
                    >
                        <h2 className="section-heading text-lg md:text-2xl font-bold text-gray-900">Best Products</h2>
                        <Link to="/products" className="text-primary text-xs md:text-sm font-semibold flex items-center gap-0.5 hover:underline">
                            View All <ChevronRight className="h-3 w-3 md:h-4 md:w-4" />
                        </Link>
                    </motion.div>

                    <motion.div
                        variants={container}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4"
                    >
                        {featuredProducts.map((product) => (
                            <motion.div key={product.id} variants={item}>
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
                </section>
            )}

            {/* ===== Best Selling ===== */}
            {bestSelling.length > 0 && (
                <section className="px-4 md:px-8 py-6 md:py-10 bg-frosted-blue max-w-7xl mx-auto rounded-none md:rounded-3xl md:my-4">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="flex items-center justify-between mb-4 md:mb-6"
                    >
                        <h2 className="section-heading text-lg md:text-2xl font-bold text-gray-900">Best Selling</h2>
                        <Link to="/products" className="text-primary text-xs md:text-sm font-semibold flex items-center gap-0.5 hover:underline">
                            View All <ChevronRight className="h-3 w-3 md:h-4 md:w-4" />
                        </Link>
                    </motion.div>

                    <motion.div
                        variants={container}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4"
                    >
                        {bestSelling.map((product) => (
                            <motion.div key={product.id} variants={item}>
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
                </section>
            )}

            {/* ===== Category Sections ===== */}
            {categoryGroups.map((group, groupIndex) => (
                <section
                    key={group.category}
                    className={`px-4 md:px-8 py-6 md:py-10 max-w-7xl mx-auto ${
                        groupIndex % 2 === 0 ? '' : 'bg-frosted-blue rounded-none md:rounded-3xl md:my-4'
                    }`}
                >
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="flex items-center justify-between mb-4 md:mb-6"
                    >
                        <h2 className="section-heading text-lg md:text-2xl font-bold text-gray-900">{group.label}</h2>
                        <Link
                            to={`/products?category=${group.category}`}
                            className="text-primary text-xs md:text-sm font-semibold flex items-center gap-0.5 hover:underline"
                        >
                            View All <ChevronRight className="h-3 w-3 md:h-4 md:w-4" />
                        </Link>
                    </motion.div>

                    <motion.div
                        variants={container}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4"
                    >
                        {group.products.map((product: any) => (
                            <motion.div key={product.id} variants={item}>
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
                </section>
            ))}

            {/* ===== Reviews ===== */}
            <Reviews />
        </div>
    );
}
