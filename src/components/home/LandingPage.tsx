"use client";

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Reviews from "./Reviews";

interface LandingPageProps {
    featuredProducts: any[];
    recentProducts: any[];
}

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

export default function LandingPage({ featuredProducts, recentProducts }: LandingPageProps) {
    return (
        <div className="min-h-screen bg-background text-foreground overflow-hidden">
            {/* Hero Section */}
            <section className="relative pt-24 pb-12 lg:pt-48 lg:pb-32 overflow-hidden">
                {/* Animated Background Gradients */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none">
                    <div className="absolute top-0 left-1/4 h-[300px] w-[300px] md:h-[500px] md:w-[500px] rounded-full bg-purple-500/20 blur-[80px] md:blur-[120px] animate-pulse" />
                    <div className="absolute bottom-0 right-1/4 h-[300px] w-[300px] md:h-[500px] md:w-[500px] rounded-full bg-blue-500/20 blur-[80px] md:blur-[120px] animate-pulse delay-700" />
                </div>

                <div className="container relative z-10 px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Badge variant="secondary" className="mb-4 md:mb-6 px-3 py-1 md:px-4 md:py-2 text-xs md:text-sm backdrop-blur-sm border-primary/20">
                            <span className="mr-2 relative flex h-1.5 w-1.5 md:h-2 md:w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 md:h-2 md:w-2 bg-primary"></span>
                            </span>
                            New Products Added Daily
                        </Badge>

                        <h1 className="mb-4 md:mb-6 text-3xl md:text-6xl lg:text-7xl font-bold tracking-tight px-2">
                            Premium Digital <br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-blue-500 animate-gradient bg-300%">
                                Assets & Tools
                            </span>
                        </h1>

                        <p className="mx-auto mb-8 md:mb-10 max-w-2xl text-base md:text-xl text-muted-foreground px-4">
                            Instant access to the world's best digital products.
                            From AI tools to streaming services, upgrade your digital life today.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 w-full sm:w-auto px-6 sm:px-0">
                            <Button size="lg" className="w-full sm:w-auto h-11 md:h-12 px-6 md:px-8 text-base md:text-lg rounded-full shadow-lg shadow-primary/25 hover:scale-105 transition-transform" asChild>
                                <Link to="/products">Browse All</Link>
                            </Button>
                            <Button size="lg" variant="outline" className="w-full sm:w-auto h-11 md:h-12 px-6 md:px-8 text-base md:text-lg rounded-full backdrop-blur-sm hover:scale-105 transition-transform" asChild>
                                <Link to="/register">Start Selling</Link>
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Stats Section with Glassmorphism */}
            <section className="py-8 md:py-10 border-y bg-primary/5 backdrop-blur-sm">
                <div className="container px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center">
                        {[
                            { label: "Happy Customers", value: "10k+" },
                            { label: "Premium Products", value: "500+" },
                            { label: "Instant Support", value: "24/7" },
                            { label: "Average Rating", value: "4.9" },
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="p-2 md:p-4"
                            >
                                <div className="text-2xl md:text-4xl font-bold text-primary mb-1 md:mb-2">{stat.value}</div>
                                <div className="text-xs md:text-base text-muted-foreground">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Categories Grid */}
            <section className="py-12 md:py-24 relative">
                <div className="container px-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center mb-10 md:mb-16"
                    >
                        <h2 className="text-2xl md:text-5xl font-bold mb-2 md:mb-4">Explore Categories</h2>
                        <p className="text-muted-foreground text-sm md:text-lg">Find exactly what you are looking for</p>
                    </motion.div>

                    <motion.div
                        variants={container}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        className="grid gap-3 md:gap-6 grid-cols-2 md:grid-cols-2 lg:grid-cols-3"
                    >
                        {[
                            { name: "AI Tools", icon: "🤖", desc: "ChatGPT, Gemini, Midjourney", color: "text-green-500", bg: "bg-green-500/10" },
                            { name: "Streaming", icon: "🎬", desc: "Netflix, Prime, Disney+", color: "text-red-500", bg: "bg-red-500/10" },
                            { name: "Software License", icon: "💻", desc: "Windows, Office, Adobe", color: "text-blue-500", bg: "bg-blue-500/10" },
                            { name: "VPN & Security", icon: "🔒", desc: "NordVPN, ExpressVPN", color: "text-orange-500", bg: "bg-orange-500/10" },
                            { name: "Canva & Design", icon: "🎨", desc: "Canva Pro, Templates", color: "text-purple-500", bg: "bg-purple-500/10" },
                            { name: "Gaming & Top-up", icon: "🎮", desc: "Steam, FF, PUBG, PSN", color: "text-indigo-500", bg: "bg-indigo-500/10" },
                            { name: "Developer Tools", icon: "👨‍💻", desc: "GitHub Copilot, JetBrains", color: "text-slate-500", bg: "bg-slate-500/10" },
                            { name: "Social Handles", icon: "📱", desc: "Old Gmail, FB, Voice", color: "text-pink-500", bg: "bg-pink-500/10" },
                            { name: "E-Books", icon: "📚", desc: "Guides, tutorials, courses", color: "text-yellow-500", bg: "bg-yellow-500/10" },
                        ].map((cat) => (
                            <motion.div key={cat.name} variants={item}>
                                <Link
                                    to={`/products?category=${cat.name.toLowerCase()}`}
                                    className="group relative flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-3 md:gap-4 rounded-xl md:rounded-2xl border p-4 md:p-6 transition-all hover:bg-accent/50 hover:border-primary/50 overflow-hidden h-full"
                                >
                                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity ${cat.bg}`} />
                                    <div className={`flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-lg md:rounded-xl ${cat.bg} ${cat.color} text-xl md:text-2xl group-hover:scale-110 transition-transform`}>
                                        {cat.icon}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-sm md:text-lg mb-1 md:mb-0">{cat.name}</h3>
                                        <p className="text-xs md:text-sm text-muted-foreground line-clamp-2 md:line-clamp-none">{cat.desc}</p>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-12 md:py-24 bg-secondary/30">
                <div className="container px-3 md:px-4">
                    <div className="flex items-center justify-between mb-8 md:mb-12">
                        <div>
                            <h2 className="text-2xl md:text-4xl font-bold">Featured</h2>
                            <p className="mt-1 text-sm md:text-base text-muted-foreground">Hand-picked premium tools</p>
                        </div>
                        <Link to="/products" className="text-sm md:text-base text-primary hover:underline">View All &rarr;</Link>
                    </div>

                    <div className="grid gap-3 md:gap-6 grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
                        {featuredProducts?.map((product, i) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ delay: i * 0.05, duration: 0.4 }}
                            >
                                <div className="h-full">
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
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Fresh Arrivals */}
            <section className="py-12 md:py-24">
                <div className="container px-3 md:px-4">
                    <h2 className="mb-8 md:mb-12 text-center text-2xl md:text-3xl font-bold">Fresh Arrivals</h2>
                    <div className="grid gap-3 md:gap-6 grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
                        {recentProducts?.map((product, i) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ delay: i * 0.05, duration: 0.4 }}
                            >
                                <ProductCard
                                    id={product.id}
                                    title={product.title}
                                    description={product.description || ""}
                                    price={product.price}
                                    thumbnailUrl={product.thumbnail_url}
                                    category={product.category}
                                    isSubscription={product.is_subscription}
                                    variants={product.pricing_variants}
                                />
                            </motion.div>
                        ))}
                    </div>
                    <div className="mt-10 md:mt-16 text-center">
                        <Button size="lg" variant="outline" className="rounded-full px-8 w-full md:w-auto" asChild>
                            <Link to="/products">View All Products</Link>
                        </Button>
                    </div>
                </div>
            </section>
            {/* Reviews Section */}
            <Reviews />

        </div>
    );
}
