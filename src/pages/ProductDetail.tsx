import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
    Star, Shield, Zap, ChevronRight, Check,
    Award, HeadphonesIcon, Package,
    ArrowLeft, ShoppingCart, Phone, MessageCircle, Send,
    Truck, BadgeCheck
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import { useCart } from "@/contexts/CartContext";

export default function ProductDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const { addToCart } = useCart();
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [duration, setDuration] = useState("1 Month");
    const [finalPrice, setFinalPrice] = useState(0);
    const [activeTab, setActiveTab] = useState<"description" | "features" | "info">("description");
    const [variants, setVariants] = useState<any[]>([]);
    const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
    const [settings, setSettings] = useState<any>({});
    const [quantity, setQuantity] = useState(1);
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewName, setReviewName] = useState("");
    const [reviewText, setReviewText] = useState("");
    const [cartNotification, setCartNotification] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            const { data } = await supabase.from("site_settings").select("key, value");
            if (data) {
                const mapped: any = {};
                data.forEach((row: any) => { mapped[row.key] = row.value || ""; });
                setSettings(mapped);
            }
        };
        fetchSettings();
    }, []);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) return;
            try {
                const { data, error } = await supabase
                    .from('products')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error || !data) throw error;
                setProduct(data);

                const { data: related } = await supabase
                    .from('products')
                    .select('*, thumbnail_url:image')
                    .eq('is_active', true)
                    .eq('category', data.category)
                    .neq('id', id)
                    .limit(4);
                setRelatedProducts(related || []);

                if (data.pricing_variants && Array.isArray(data.pricing_variants) && data.pricing_variants.length > 0) {
                    setVariants(data.pricing_variants);
                    const defaultVar = data.pricing_variants.find((v: any) => v.is_default);
                    if (defaultVar) {
                        setDuration(defaultVar.label);
                        setFinalPrice(defaultVar.price);
                    } else {
                        setDuration(data.pricing_variants[0].label);
                        setFinalPrice(data.pricing_variants[0].price);
                    }
                } else {
                    setFinalPrice(data.price);
                }
            } catch (err) {
                console.error(err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
        window.scrollTo(0, 0);
    }, [id]);

    const handleVariantChange = (variant: any) => {
        setDuration(variant.label);
        setFinalPrice(variant.price);
    };

    const getPriceRange = () => {
        if (variants.length === 0) return null;
        const prices = variants.map((v: any) => v.price).filter(Boolean);
        if (prices.length < 2) return null;
        return { min: Math.min(...prices), max: Math.max(...prices) };
    };

    const handleAddToCart = () => {
        if (!product) return;
        addToCart({
            id: product.id,
            title: product.title,
            price: finalPrice,
            thumbnail_url: product.image || product.thumbnail_url,
            duration: variants.length > 0 ? duration : undefined,
            quantity: quantity
        });

        setCartNotification(true);
        setTimeout(() => setCartNotification(false), 2000);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white pb-bottom-nav">
                <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                        <div className="w-14 h-14 border-4 border-primary/20 rounded-full" />
                        <div className="absolute inset-0 w-14 h-14 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                    <p className="text-gray-400 text-sm font-medium">লোড হচ্ছে...</p>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white pb-bottom-nav">
                <div className="text-center px-6">
                    <div className="w-20 h-20 mx-auto mb-4 bg-red-50 rounded-2xl flex items-center justify-center">
                        <Package className="h-10 w-10 text-red-300" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">প্রোডাক্ট পাওয়া যায়নি</h2>
                    <p className="text-gray-500 mb-6 text-sm">এই প্রোডাক্টটি মুছে ফেলা হয়েছে বা বিদ্যমান নেই।</p>
                    <Link to="/products" className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-semibold text-sm shadow-lg shadow-primary/25 hover:shadow-xl transition-all">
                        <ArrowLeft className="h-4 w-4" /> সব প্রোডাক্ট দেখুন
                    </Link>
                </div>
            </div>
        );
    }

    const priceRange = getPriceRange();
    const supportPhone = settings.support_phone || "+880 1618-473208";

    return (
        <div className="min-h-screen bg-white pb-bottom-nav">
            {/* Cart Added Toast */}
            <AnimatePresence>
                {cartNotification && (
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] bg-green-500 text-white px-6 py-3 rounded-xl shadow-xl shadow-green-500/30 flex items-center gap-2 font-semibold text-sm"
                    >
                        <Check className="h-5 w-5" />
                        কার্টে যোগ হয়েছে!
                    </motion.div>
                )}
            </AnimatePresence>
            {/* ===== Breadcrumb ===== */}
            <div className="bg-gray-50 border-b">
                <div className="max-w-6xl mx-auto px-4 py-2.5">
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <Link to="/" className="hover:text-primary transition-colors">হোম</Link>
                        <ChevronRight className="h-3 w-3" />
                        <Link to="/products" className="hover:text-primary transition-colors">সকল প্রোডাক্ট</Link>
                        <ChevronRight className="h-3 w-3" />
                        <span className="text-gray-600 font-medium truncate max-w-[200px]">{product.title}</span>
                    </div>
                </div>
            </div>

            {/* ===== Main Product Section (Two Column) ===== */}
            <div className="max-w-6xl mx-auto px-4 py-6 md:py-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">

                    {/* ======= LEFT COLUMN - Product Image ======= */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="relative"
                    >
                        {/* Image Container */}
                        <div className="relative bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-2xl border border-gray-100 overflow-hidden group">
                            {/* Featured/Sale Badge */}
                            {product.featured && (
                                <div className="absolute top-3 left-3 z-10">
                                    <span className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md">
                                        🔥 SALE
                                    </span>
                                </div>
                            )}

                            <div className="p-6 md:p-10 flex items-center justify-center min-h-[300px] md:min-h-[400px]">
                                <motion.img
                                    src={product.image || "/placeholder.png"}
                                    alt={product.title}
                                    className="max-w-full max-h-[350px] md:max-h-[400px] object-contain drop-shadow-2xl"
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                />
                            </div>

                            {/* Phone number badge at bottom */}
                            <div className="absolute bottom-3 left-3 right-3">
                                <a
                                    href={`tel:${supportPhone}`}
                                    className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-lg hover:bg-green-600 transition-colors w-fit"
                                >
                                    <Phone className="h-4 w-4" />
                                    {supportPhone}
                                </a>
                            </div>
                        </div>
                    </motion.div>

                    {/* ======= RIGHT COLUMN - Product Info ======= */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="flex flex-col"
                    >
                        {/* Title */}
                        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2 leading-tight">
                            {product.title}
                        </h1>

                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-3">
                            <div className="flex items-center gap-0.5">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <Star key={s} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>
                            <span className="text-sm text-gray-500">(4.9)</span>
                            <span className="text-xs text-gray-400">⭐ 124+ রিভ্যু</span>
                        </div>

                        {/* Price Display */}
                        <div className="bg-blue-50/80 border border-blue-100 rounded-xl p-3 mb-4">
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl md:text-3xl font-black text-primary">
                                    ৳{priceRange ? priceRange.min.toLocaleString() : finalPrice.toLocaleString()}
                                </span>
                                {priceRange && (
                                    <>
                                        <span className="text-xl font-bold text-gray-400">–</span>
                                        <span className="text-2xl md:text-3xl font-black text-primary">
                                            ৳{priceRange.max.toLocaleString()}
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Short Description */}
                        {product.description && (
                            <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3" style={{ whiteSpace: 'pre-line' }}>
                                {product.description}
                            </p>
                        )}

                        {/* ===== Variant Selector ===== */}
                        {variants.length > 0 && (
                            <div className="mb-4">
                                <p className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                                    <Zap className="h-4 w-4 text-primary" />
                                    আপনি সিলেক্ট করুন
                                </p>
                                <div className="grid grid-cols-2 gap-2">
                                    {variants.map((v: any) => (
                                        <button
                                            key={v.label}
                                            onClick={() => handleVariantChange(v)}
                                            className={`relative py-3 px-3 rounded-xl text-center transition-all duration-200 border-2 ${duration === v.label
                                                ? "border-primary bg-primary/5 shadow-md"
                                                : "border-gray-200 bg-white hover:border-primary/40"
                                                }`}
                                        >
                                            {duration === v.label && (
                                                <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-primary rounded-full flex items-center justify-center shadow">
                                                    <Check className="h-3 w-3 text-white" />
                                                </div>
                                            )}
                                            <p className="text-xs font-medium text-gray-500">{v.label}</p>
                                            <p className={`text-base font-extrabold ${duration === v.label ? 'text-primary' : 'text-gray-800'}`}>
                                                ৳{v.price?.toLocaleString()}
                                            </p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity */}
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-sm font-semibold text-gray-700">পরিমাণ</span>
                            <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                                <button
                                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                    className="px-3 py-2 text-gray-600 hover:bg-gray-50 font-bold"
                                >−</button>
                                <span className="px-4 py-2 text-sm font-bold border-x-2 border-gray-200 min-w-[40px] text-center">
                                    {quantity}
                                </span>
                                <button
                                    onClick={() => setQuantity(q => q + 1)}
                                    className="px-3 py-2 text-gray-600 hover:bg-gray-50 font-bold"
                                >+</button>
                            </div>
                        </div>

                        {/* Order Buttons */}
                        <div className="space-y-2 mb-4">
                            <Link
                                to={`/checkout?id=${product.id}&duration=${encodeURIComponent(duration)}&price=${finalPrice}&qty=${quantity}`}
                                className="block"
                            >
                                <motion.button
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    className="w-full py-3.5 bg-primary text-white font-bold text-base rounded-xl shadow-lg shadow-primary/25 flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
                                >
                                    <Zap className="h-5 w-5" />
                                    এখনই কিনুন
                                </motion.button>
                            </Link>
                            <button
                                onClick={handleAddToCart}
                                className="w-full py-3.5 bg-white text-primary font-bold text-base rounded-xl border-2 border-primary flex items-center justify-center gap-2 hover:bg-primary/5 transition-colors"
                            >
                                <ShoppingCart className="h-5 w-5" />
                                কার্ট যোগ করুন
                            </button>
                        </div>

                        {/* Trust Badges Row */}
                        <div className="flex items-center justify-between py-3 border-y border-gray-100 mb-4">
                            {[
                                { icon: Truck, text: "Same Day Delivery" },
                                { icon: Zap, text: "ইনস্ট্যান্ট ডেলিভারি" },
                                { icon: HeadphonesIcon, text: "24/7 সাপোর্ট" },
                            ].map((b, i) => (
                                <div key={i} className="flex flex-col items-center gap-1 text-center flex-1">
                                    <b.icon className="h-4 w-4 text-gray-400" />
                                    <span className="text-[10px] text-gray-500 font-medium leading-tight">{b.text}</span>
                                </div>
                            ))}
                        </div>

                        {/* Contact Section */}
                        <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-3 mb-4">
                            <p className="text-xs font-bold text-gray-700 mb-2 flex items-center gap-1.5">
                                <MessageCircle className="h-3.5 w-3.5 text-primary" />
                                আমাদের সাথে যোগাযোগ করুন
                            </p>
                            <div className="flex items-center gap-2 flex-wrap">
                                <a
                                    href={`https://wa.me/${(settings.whatsapp_number || "8801618473208").replace(/[^0-9]/g, '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 bg-green-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-green-600 transition-colors"
                                >
                                    WhatsApp
                                </a>
                                <a
                                    href={settings.facebook_url || "https://facebook.com"}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors"
                                >
                                    Facebook
                                </a>
                                <span className="text-xs text-gray-600 font-medium flex items-center gap-1">
                                    <Phone className="h-3 w-3" /> {supportPhone}
                                </span>
                            </div>
                        </div>

                        {/* DBID + Payment Icons */}
                        <div className="flex items-center gap-3 flex-wrap mb-2">
                            <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-lg px-2.5 py-1.5">
                                <BadgeCheck className="h-4 w-4 text-green-600" />
                                <div>
                                    <p className="text-[9px] font-bold text-green-700 leading-none">DBID</p>
                                    <p className="text-[8px] text-green-600 leading-none">We are Gov't Verified</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1.5">
                                {['bKash', 'Nagad', 'Visa', 'MC'].map((m) => (
                                    <div key={m} className="bg-gray-100 rounded px-2 py-1 text-[9px] font-bold text-gray-600">
                                        {m}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* ===== Tabs Section ===== */}
            <div className="bg-gray-50 border-y">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex items-center gap-0 overflow-x-auto">
                        {[
                            { key: "description", label: "📝 বিবরণ", icon: "description" },
                            { key: "features", label: "⚡ ফিচার সমূহ", icon: "features" },
                            { key: "info", label: "📋 তথ্য", icon: "info" },
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key as any)}
                                className={`py-3 px-4 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${activeTab === tab.key
                                    ? "border-primary text-primary"
                                    : "border-transparent text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-6">
                <AnimatePresence mode="wait">
                    {activeTab === "description" && (
                        <motion.div
                            key="desc"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                                📝 বিস্তারিত বিবরণ
                            </h3>
                            <div className="text-sm text-gray-600 leading-relaxed bg-white rounded-xl border p-4" style={{ whiteSpace: 'pre-line' }}>
                                {product.description || "এই প্রোডাক্টের জন্য কোনো বিবরণ পাওয়া যায়নি।"}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "features" && (
                        <motion.div
                            key="features"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                                ⚡ ফিচার সমূহ
                            </h3>
                            <div className="bg-white rounded-xl border p-4 space-y-2">
                                {[
                                    "অরিজিনাল প্রিমিয়াম একাউন্ট",
                                    "ইনস্ট্যান্ট ডেলিভারি",
                                    "রিপ্লেসমেন্ট গ্যারান্টি",
                                    "24/7 কাস্টমার সাপোর্ট",
                                    "সকল ডিভাইসে ব্যবহারযোগ্য",
                                ].map((feature, i) => (
                                    <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                                        <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                                        {feature}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "info" && (
                        <motion.div
                            key="info"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                                📋 অতিরিক্ত তথ্য
                            </h3>
                            <div className="bg-white rounded-xl border divide-y">
                                {[
                                    { label: "ক্যাটাগরি", value: product.category, capitalize: true },
                                    { label: "ডেলিভারি টাইম", value: "ইনস্ট্যান্ট (5-30 মিনিট)" },
                                    ...(variants.length > 0 ? [{ label: "প্ল্যান", value: variants.map((v: any) => v.label).join(', ') }] : []),
                                    { label: "ওয়ারেন্টি", value: "রিপ্লেসমেন্ট গ্যারান্টি" },
                                    { label: "সাপোর্ট", value: "24/7 Live Chat" },
                                ].map((row, i) => (
                                    <div key={i} className="flex justify-between py-3 px-4 text-sm">
                                        <span className="text-gray-500 font-medium">{row.label}</span>
                                        <span className={`font-semibold text-gray-900 ${row.capitalize ? 'capitalize' : ''}`}>{row.value}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* ===== Why Buy From Us ===== */}
            <section className="bg-gray-50 border-y py-8">
                <div className="max-w-6xl mx-auto px-4">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
                        👑 কেন আমাদের থেকে কিনবেন?
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { icon: Shield, title: "নিরাপদ পেমেন্ট", desc: "আমাদের সকল পেমেন্ট সিস্টেম সম্পূর্ণ নিরাপদ ও এনক্রিপ্টেড।", color: "text-blue-600 bg-blue-50 border-blue-100" },
                            { icon: Zap, title: "ইনস্ট্যান্ট ডেলিভারি", desc: "পেমেন্ট করার পর সাথে সাথে আপনার প্রোডাক্ট পেয়ে যাবেন।", color: "text-yellow-600 bg-yellow-50 border-yellow-100" },
                            { icon: HeadphonesIcon, title: "24/7 সাপোর্ট", desc: "আমাদের কাস্টমার সাপোর্ট টিম সবসময় আপনার সেবায় প্রস্তুত।", color: "text-green-600 bg-green-50 border-green-100" },
                            { icon: Award, title: "অথেনটিক প্রোডাক্ট", desc: "আমরা শুধুমাত্র ১০০% অরিজিনাল ও লাইসেন্সড প্রোডাক্ট বিক্রি করি।", color: "text-purple-600 bg-purple-50 border-purple-100" },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className={`rounded-xl p-4 text-center border ${item.color} hover:shadow-md transition-all duration-300`}
                            >
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3">
                                    <item.icon className="h-6 w-6" />
                                </div>
                                <h3 className="text-sm font-bold text-gray-900 mb-1">{item.title}</h3>
                                <p className="text-[11px] text-gray-500 leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== Customer Reviews Section ===== */}
            <section className="py-8">
                <div className="max-w-6xl mx-auto px-4">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">
                        ⭐ কাস্টমার রিভিউ
                    </h2>

                    <div className="bg-gray-50 rounded-xl border p-4 mb-6 text-center">
                        <p className="text-sm text-gray-500">এখন পর্যন্ত কোনো রিভিউ নেই। প্রথম রিভিউ দিন! 😊</p>
                    </div>

                    {/* Review Form */}
                    <div className="bg-white rounded-xl border p-5">
                        <h3 className="text-base font-bold text-gray-900 mb-1 flex items-center gap-2">
                            ✏️ আপনার রিভিউ দিন
                        </h3>
                        <p className="text-xs text-gray-500 mb-3">(জনতা).</p>

                        {/* Star Rating */}
                        <div className="mb-3">
                            <p className="text-sm font-semibold text-gray-700 mb-1">রেটিং</p>
                            <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => setReviewRating(s)}
                                        className="transition-transform hover:scale-110"
                                    >
                                        <Star
                                            className={`h-6 w-6 ${s <= reviewRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Name */}
                        <div className="mb-3">
                            <label className="text-sm font-semibold text-gray-700 block mb-1">আপনার নাম</label>
                            <input
                                type="text"
                                value={reviewName}
                                onChange={(e) => setReviewName(e.target.value)}
                                placeholder="আপনার নাম লিখুন"
                                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors"
                            />
                        </div>

                        {/* Review Text */}
                        <div className="mb-3">
                            <label className="text-sm font-semibold text-gray-700 block mb-1">আপনার মতামত</label>
                            <textarea
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                                placeholder="আপনার অভিজ্ঞতা শেয়ার করুন..."
                                rows={3}
                                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors resize-none"
                            />
                        </div>

                        <p className="text-[10px] text-gray-400 mb-3">* রিভিউ যাচাই করার পর প্রকাশিত হবে</p>

                        <button className="bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-md">
                            <Send className="h-4 w-4" />
                            রিভিউ জমা দিন
                        </button>
                    </div>
                </div>
            </section>

            {/* ===== Related Products ===== */}
            {relatedProducts.length > 0 && (
                <section className="bg-gray-50 border-t py-8">
                    <div className="max-w-6xl mx-auto px-4">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-xl font-bold text-gray-900">
                                🔗 সম্পর্কিত প্রোডাক্ট
                            </h2>
                            <Link to="/products" className="text-primary text-sm font-semibold flex items-center gap-0.5 hover:underline">
                                সব দেখুন <ChevronRight className="h-4 w-4" />
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                            {relatedProducts.map((p: any) => (
                                <ProductCard
                                    key={p.id}
                                    id={p.id}
                                    title={p.title}
                                    description={p.description || ""}
                                    price={p.price}
                                    thumbnailUrl={p.thumbnail_url}
                                    category={p.category}
                                    isSubscription={p.is_subscription}
                                    featured={p.featured}
                                    variants={p.pricing_variants}
                                />
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}
