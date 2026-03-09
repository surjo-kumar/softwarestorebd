import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Package, Clock, User, LogOut, ArrowRight, Download, Store, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/utils";

export default function UserDashboard() {
    const [activeTab, setActiveTab] = useState("orders");
    const [user, setUser] = useState<any>(null);
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [profileLoading, setProfileLoading] = useState(false);
    
    // Form fields
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        let isMounted = true;
        
        async function loadProfile() {
            setLoading(true);
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.user) {
                navigate("/login");
                return;
            }
            
            if (isMounted) {
                const currentUser = session.user;
                setUser(currentUser);
                setFullName(currentUser.user_metadata?.full_name || "");
                setPhone(currentUser.user_metadata?.phone || "");
                
                // Fetch orders for this user by email
                const email = currentUser.email;
                if (email) {
                    const { data, error } = await supabase
                        .from("orders")
                        .select("*, products(title)")
                        .eq("customer_email", email)
                        .order("created_at", { ascending: false });
                        
                    if (!error && data) {
                        setOrders(data);
                    }
                }
                setLoading(false);
            }
        }
        
        loadProfile();
        
        return () => { isMounted = false; }
    }, [navigate]);

    const handleUpdateProfile = async () => {
        setProfileLoading(true);
        try {
            await supabase.auth.updateUser({
                data: { full_name: fullName, phone: phone }
            });
            // Show toast or alert? Just basic alert for now
            alert("Profile updated successfully!");
        } catch (error) {
            console.error(error);
            alert("Failed to update profile");
        } finally {
            setProfileLoading(false);
        }
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        navigate("/login");
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 pt-20 pb-12">
            <div className="max-w-6xl mx-auto px-4 md:px-6">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">My Account</h1>
                        <p className="text-slate-500 font-medium mt-1">Manage your orders and subscription details</p>
                    </div>
                    <div className="flex items-center gap-3 bg-white/60 p-1.5 rounded-2xl shadow-sm border border-slate-200/50 backdrop-blur-sm">
                        <Button 
                            variant="ghost" 
                            className={`rounded-xl h-10 px-5 font-semibold transition-all ${activeTab === 'orders' ? 'bg-primary text-white shadow-md' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'}`}
                            onClick={() => setActiveTab('orders')}
                        >
                            <Package className="h-4 w-4 mr-2" />
                            Orders
                        </Button>
                        <Button 
                            variant="ghost" 
                            className={`rounded-xl h-10 px-5 font-semibold transition-all ${activeTab === 'profile' ? 'bg-primary text-white shadow-md' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'}`}
                            onClick={() => setActiveTab('profile')}
                        >
                            <User className="h-4 w-4 mr-2" />
                            Profile
                        </Button>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* Main Content Area */}
                    <div className="lg:col-span-8 space-y-6">
                        {activeTab === 'orders' && (
                            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-white/40">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                        <Package className="h-5 w-5 text-primary" />
                                        Order History
                                    </h2>
                                </div>
                                
                                <div className="space-y-4">
                                    {orders.length === 0 ? (
                                        <div className="text-center py-8 text-slate-500 font-medium bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                            No orders found.
                                        </div>
                                    ) : (
                                        orders.map((order) => (
                                            <div key={order.id} className="group bg-slate-50/50 border border-slate-100 hover:border-primary/20 hover:shadow-md transition-all rounded-2xl p-5 relative overflow-hidden">
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors"></div>
                                                
                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                                                    <div>
                                                        <div className="flex items-center gap-3 mb-1">
                                                            <span className="font-bold text-slate-900">ID: {order.id.slice(0, 8)}</span>
                                                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${order.status === 'completed' ? 'bg-green-100 text-green-700' : order.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                                                                {order.status}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm font-medium text-slate-700">{order.products?.title || "Product"}</p>
                                                        <p className="text-xs font-medium text-slate-400 mt-1">Placed on {new Date(order.created_at).toLocaleDateString()} • {formatPrice(order.amount)}</p>
                                                    </div>
                                                    
                                                    <div className="flex items-center gap-3">
                                                        {order.status === 'completed' ? (
                                                            <Button variant="outline" size="sm" className="rounded-xl h-9 gap-2 text-primary border-primary/20 hover:bg-primary/5 hover:border-primary/30">
                                                                <Download className="h-4 w-4" />
                                                                Get Access
                                                            </Button>
                                                        ) : (
                                                            <span className="text-xs font-semibold text-amber-600 flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100">
                                                                <Clock className="h-3.5 w-3.5" />
                                                                Processing...
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'profile' && (
                            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-white/40">
                                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-6">
                                    <User className="h-5 w-5 text-primary" />
                                    Account Details
                                </h2>
                                <div className="space-y-6 max-w-lg relative z-10">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-slate-600">Full Name</label>
                                        <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-slate-600">Email Address</label>
                                        <input type="email" value={user?.email || ""} readOnly className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-100/50 text-sm opacity-70 cursor-not-allowed" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-slate-600">Phone</label>
                                        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                                    </div>
                                    <Button onClick={handleUpdateProfile} disabled={profileLoading} className="h-11 px-6 rounded-xl font-semibold shadow-md shadow-primary/20">
                                        {profileLoading ? "Saving..." : "Save Changes"}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar Area */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Profile Summary Card */}
                        <div className="bg-primary rounded-3xl p-6 text-white relative overflow-hidden shadow-[0_8px_30px_rgb(59,130,246,0.3)]">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-xl -ml-10 -mb-10"></div>
                            
                            <div className="relative z-10">
                                <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-xl font-bold mb-4 border border-white/20 uppercase">
                                    {fullName ? fullName.charAt(0) : user?.email?.charAt(0) || 'U'}
                                </div>
                                <h3 className="text-lg font-bold">{fullName || 'User'}</h3>
                                <p className="text-white/80 text-sm font-medium mb-6 truncate">{user?.email}</p>
                                
                                <div className="grid grid-cols-2 gap-4 border-t border-white/20 pt-4 mt-4">
                                    <div>
                                        <p className="text-white/70 text-xs font-semibold uppercase tracking-wider mb-1">Total Orders</p>
                                        <p className="text-2xl font-bold">{orders.length}</p>
                                    </div>
                                    <div>
                                        <p className="text-white/70 text-xs font-semibold uppercase tracking-wider mb-1">Completed</p>
                                        <p className="text-2xl font-bold">{orders.filter(o => o.status === 'completed').length}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/40 space-y-1">
                            <Link to="/products" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group">
                                <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Store className="h-5 w-5" />
                                </div>
                                <div className="flex-1 font-semibold text-sm text-slate-700 group-hover:text-emerald-600 transition-colors">Browse New Tools</div>
                                <ArrowRight className="h-4 w-4 text-slate-400" />
                            </Link>
                            <button onClick={handleSignOut} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 transition-colors group text-left">
                                <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <LogOut className="h-5 w-5" />
                                </div>
                                <div className="flex-1 font-semibold text-sm text-slate-700 group-hover:text-red-600 transition-colors">Sign Out</div>
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
