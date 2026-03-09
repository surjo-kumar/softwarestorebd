
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingCart, DollarSign, ArrowUpRight, Activity, Star, BarChart3, Clock } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Link } from "react-router-dom";

export default function AdminDashboardPage() {
    const supabase = createClient();
    const [stats, setStats] = useState({
        totalProducts: 0,
        activeProducts: 0,
        totalOrders: 0,
        pendingOrders: 0,
        totalRevenue: 0,
        totalCategories: 0,
    });
    const [recentProducts, setRecentProducts] = useState<any[]>([]);
    const [recentOrders, setRecentOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    async function fetchDashboardData() {
        setLoading(true);
        try {
            // Fetch products
            const { data: products } = await supabase.from('products').select('*');
            const { data: orders } = await supabase.from('orders').select('*');
            const { data: categories } = await supabase.from('categories').select('*');

            const totalProducts = products?.length || 0;
            const activeProducts = products?.filter(p => p.is_active)?.length || 0;
            const totalOrders = orders?.length || 0;
            const pendingOrders = orders?.filter(o => o.status === 'pending')?.length || 0;
            const totalRevenue = orders?.filter(o => o.status === 'completed')?.reduce((sum, o) => sum + (o.amount || 0), 0) || 0;
            const totalCategories = categories?.length || 0;

            setStats({
                totalProducts,
                activeProducts,
                totalOrders,
                pendingOrders,
                totalRevenue,
                totalCategories,
            });

            // Recent products (last 5)
            setRecentProducts((products || []).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5));

            // Recent orders (last 5)
            setRecentOrders((orders || []).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5));
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    }

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.08 }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100 } }
    };

    const statCards = [
        {
            title: "Total Revenue",
            value: formatPrice(stats.totalRevenue),
            icon: DollarSign,
            trend: "+12.5%",
            trendUp: true,
            gradient: "from-emerald-500 to-teal-600",
            bgGlow: "bg-emerald-500/10",
            iconBg: "bg-emerald-500/20 text-emerald-600",
        },
        {
            title: "Total Products",
            value: stats.totalProducts.toString(),
            subtitle: `${stats.activeProducts} active`,
            icon: Package,
            trend: `${stats.activeProducts} active`,
            trendUp: true,
            gradient: "from-blue-500 to-indigo-600",
            bgGlow: "bg-blue-500/10",
            iconBg: "bg-blue-500/20 text-blue-600",
        },
        {
            title: "Total Orders",
            value: stats.totalOrders.toString(),
            subtitle: `${stats.pendingOrders} pending`,
            icon: ShoppingCart,
            trend: `${stats.pendingOrders} pending`,
            trendUp: stats.pendingOrders > 0,
            gradient: "from-violet-500 to-purple-600",
            bgGlow: "bg-violet-500/10",
            iconBg: "bg-violet-500/20 text-violet-600",
        },
        {
            title: "Categories",
            value: stats.totalCategories.toString(),
            icon: BarChart3,
            trend: "Active",
            trendUp: true,
            gradient: "from-amber-500 to-orange-600",
            bgGlow: "bg-amber-500/10",
            iconBg: "bg-amber-500/20 text-amber-600",
        },
    ];

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="flex flex-col gap-6"
        >
            {/* Welcome Header */}
            <motion.div variants={item} className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary via-blue-600 to-indigo-700 p-6 md:p-8 text-white">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-1/4 w-32 h-32 bg-white/5 rounded-full translate-y-1/2" />
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                        <Activity className="h-5 w-5 text-blue-200" />
                        <span className="text-blue-200 text-sm font-medium">Dashboard Overview</span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold mb-1">Welcome Back, Admin! 👋</h1>
                    <p className="text-blue-200 text-sm md:text-base">Here's what's happening with your store today.</p>
                </div>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                {statCards.map((stat) => (
                    <motion.div key={stat.title} variants={item}>
                        <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer">
                            {/* Gradient top bar */}
                            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.gradient}`} />
                            {/* Background glow */}
                            <div className={`absolute -top-4 -right-4 w-24 h-24 rounded-full ${stat.bgGlow} blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                            <CardContent className="p-4 md:p-6 relative z-10">
                                <div className="flex items-start justify-between mb-3">
                                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl ${stat.iconBg} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
                                        <stat.icon className="h-5 w-5 md:h-6 md:w-6" />
                                    </div>
                                    <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${stat.trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                        {stat.trendUp ? <ArrowUpRight className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                                        {stat.trend}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs md:text-sm text-muted-foreground font-medium mb-1">{stat.title}</p>
                                    <p className="text-xl md:text-2xl font-bold tracking-tight">{loading ? "..." : stat.value}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Content Grid - Recent Products & Recent Orders */}
            <div className="grid gap-6 lg:grid-cols-7">
                {/* Recent Products */}
                <motion.div variants={item} className="lg:col-span-4">
                    <Card className="border-0 shadow-lg h-full">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                    <Package className="h-4 w-4 text-blue-600" />
                                </div>
                                <CardTitle className="text-base font-semibold">Recent Products</CardTitle>
                            </div>
                            <Link to="/admin/products" className="text-xs text-primary font-semibold hover:underline">View All →</Link>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="space-y-3">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="h-14 rounded-xl shimmer" />
                                    ))}
                                </div>
                            ) : recentProducts.length === 0 ? (
                                <div className="text-center py-8">
                                    <Package className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                                    <p className="text-sm text-muted-foreground">No products yet</p>
                                    <Link to="/admin/products/new" className="text-primary text-sm font-semibold hover:underline mt-2 inline-block">+ Add First Product</Link>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {recentProducts.map((product, index) => (
                                        <motion.div
                                            key={product.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-muted/50 transition-colors group cursor-pointer"
                                        >
                                            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-gray-100 to-blue-50 overflow-hidden flex items-center justify-center flex-shrink-0">
                                                {product.image ? (
                                                    <img src={product.image} alt="" className="h-full w-full object-cover" />
                                                ) : (
                                                    <Package className="h-4 w-4 text-muted-foreground" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">{product.title}</p>
                                                <p className="text-xs text-muted-foreground capitalize">{product.category}</p>
                                            </div>
                                            <div className="text-right flex-shrink-0">
                                                <p className="text-sm font-bold text-primary">৳{product.price?.toLocaleString()}</p>
                                                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${product.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                                                    {product.is_active ? 'Active' : 'Draft'}
                                                </span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Recent Orders */}
                <motion.div variants={item} className="lg:col-span-3">
                    <Card className="border-0 shadow-lg h-full">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
                                    <ShoppingCart className="h-4 w-4 text-violet-600" />
                                </div>
                                <CardTitle className="text-base font-semibold">Recent Orders</CardTitle>
                            </div>
                            <Link to="/admin/orders" className="text-xs text-primary font-semibold hover:underline">View All →</Link>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="space-y-3">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="h-14 rounded-xl shimmer" />
                                    ))}
                                </div>
                            ) : recentOrders.length === 0 ? (
                                <div className="text-center py-8">
                                    <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                                    <p className="text-sm text-muted-foreground">No orders yet</p>
                                    <p className="text-xs text-muted-foreground/60 mt-1">Orders will show up here</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {recentOrders.map((order, index) => (
                                        <motion.div
                                            key={order.id}
                                            initial={{ opacity: 0, x: 10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-muted/50 transition-colors group"
                                        >
                                            <div className={`h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold ${
                                                order.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                                                order.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                                'bg-red-100 text-red-700'
                                            }`}>
                                                {order.customer_name?.charAt(0).toUpperCase() || order.customer_email?.charAt(0).toUpperCase() || '?'}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">{order.customer_name || order.customer_email || 'Unknown'}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {new Date(order.created_at).toLocaleDateString('bn-BD', { day: 'numeric', month: 'short' })}
                                                </p>
                                            </div>
                                            <div className="text-right flex-shrink-0">
                                                <p className="text-sm font-bold">৳{order.amount?.toLocaleString()}</p>
                                                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                                                    order.status === 'completed' ? 'bg-emerald-50 text-emerald-600' :
                                                    order.status === 'pending' ? 'bg-amber-50 text-amber-600' :
                                                    'bg-red-50 text-red-600'
                                                }`}>
                                                    {order.status === 'completed' ? '✓ Done' : order.status === 'pending' ? '⏳ Pending' : '✕ Failed'}
                                                </span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Quick Actions */}
            <motion.div variants={item}>
                <Card className="border-0 shadow-lg">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <Star className="h-4 w-4 text-amber-500" />
                            Quick Actions
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {[
                                { label: "Add Product", icon: Package, to: "/admin/products/new", color: "from-blue-500 to-blue-600" },
                                { label: "View Orders", icon: ShoppingCart, to: "/admin/orders", color: "from-violet-500 to-violet-600" },
                                { label: "Categories", icon: BarChart3, to: "/admin/categories", color: "from-amber-500 to-amber-600" },
                                { label: "Settings", icon: Activity, to: "/admin/settings", color: "from-emerald-500 to-emerald-600" },
                            ].map((action) => (
                                <Link key={action.label} to={action.to}>
                                    <motion.div
                                        whileHover={{ y: -3, scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`bg-gradient-to-br ${action.color} p-4 rounded-xl text-white text-center cursor-pointer shadow-md hover:shadow-lg transition-shadow`}
                                    >
                                        <action.icon className="h-6 w-6 mx-auto mb-2" />
                                        <p className="text-xs font-semibold">{action.label}</p>
                                    </motion.div>
                                </Link>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    );
}
