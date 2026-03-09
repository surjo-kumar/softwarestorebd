
import { Link, Outlet, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    Package,
    Users,
    ShoppingCart,
    CreditCard,
    Settings,
    Gift,
    Menu,
    List,
    ChevronRight,
    Store,
    Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import React, { useState } from "react";
import { cn } from "@/lib/utils";

const navSections = [
    {
        label: "Overview",
        items: [
            { label: "Dashboard", icon: LayoutDashboard, to: "/admin" },
        ],
    },
    {
        label: "Management",
        items: [
            { label: "Products", icon: Package, to: "/admin/products" },
            { label: "Categories", icon: List, to: "/admin/categories" },
            { label: "Orders", icon: ShoppingCart, to: "/admin/orders" },
            { label: "Payments", icon: CreditCard, to: "/admin/payments" },
            { label: "Users", icon: Users, to: "/admin/users" },
            { label: "Coupons", icon: Gift, to: "/admin/coupons" },
        ],
    },
    {
        label: "System",
        items: [
            { label: "Settings", icon: Settings, to: "/admin/settings" },
        ],
    },
];

export default function AdminLayout() {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return sessionStorage.getItem('adminAuth') === 'true';
    });
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const location = useLocation();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === 'admin2027') {
            setIsAuthenticated(true);
            sessionStorage.setItem('adminAuth', 'true');
            setError('');
        } else {
            setError('Incorrect password');
        }
    };

    const isActive = (path: string) => {
        if (path === "/admin") return location.pathname === "/admin";
        return location.pathname.startsWith(path);
    };

    const NavContent = () => (
        <div className="flex-1 flex flex-col h-full overflow-y-auto">
            <nav className="flex-1 px-3 py-4 space-y-6">
                {navSections.map((section) => (
                    <div key={section.label}>
                        <h3 className="mb-2 px-3 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.15em]">
                            {section.label}
                        </h3>
                        <div className="space-y-1">
                            {section.items.map((navItem) => {
                                const active = isActive(navItem.to);
                                return (
                                    <Link
                                        key={navItem.to}
                                        to={navItem.to}
                                        onClick={() => setIsMobileOpen(false)}
                                        className={cn(
                                            "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 group relative",
                                            active
                                                ? "bg-primary text-white shadow-md shadow-primary/25"
                                                : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
                                        )}
                                    >
                                        <navItem.icon className={cn(
                                            "h-4 w-4 flex-shrink-0 transition-transform duration-200",
                                            active ? "text-white" : "text-muted-foreground group-hover:text-foreground group-hover:scale-110"
                                        )} />
                                        <span className="flex-1">{navItem.label}</span>
                                        {active && <ChevronRight className="h-3.5 w-3.5 text-white/60" />}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            {/* Bottom Section */}
            <div className="p-3 border-t space-y-2">
                <Link to="/" onClick={() => setIsMobileOpen(false)}>
                    <Button variant="outline" className="w-full gap-2 text-sm h-10 rounded-xl hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-all">
                        <Store className="h-4 w-4" />
                        Visit Store
                    </Button>
                </Link>
            </div>
        </div>
    );

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50/30 p-4">
                <div className="w-full max-w-md bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/20">
                    <div className="flex flex-col items-center gap-4 mb-8">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg shadow-primary/30">
                            <Sparkles className="h-8 w-8 text-white" />
                        </div>
                        <div className="text-center space-y-1">
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Admin Access</h1>
                            <p className="text-sm text-slate-500 font-medium">Please enter the master password</p>
                        </div>
                    </div>
                    
                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-2">
                            <input
                                type="password"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={cn(
                                    "flex h-12 w-full rounded-xl border bg-slate-50/50 px-4 py-2 text-sm ring-offset-background transition-all placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2",
                                    error ? "border-red-500 focus-visible:ring-red-500/50" : "border-slate-200"
                                )}
                            />
                            {error && <p className="text-sm text-red-500 font-medium px-1">{error}</p>}
                        </div>
                        <Button type="submit" className="w-full h-12 rounded-xl text-base font-semibold shadow-lg shadow-primary/25 transition-all hover:scale-[1.02]">
                            Unlock Dashboard
                        </Button>
                        <div className="pt-4 text-center">
                            <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium flex items-center justify-center gap-2">
                                <Store className="h-4 w-4" />
                                Return to Store
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
            {/* Desktop Sidebar */}
            <aside className="hidden w-[260px] flex-col border-r border-border/60 bg-white/80 backdrop-blur-xl md:flex fixed top-0 left-0 h-screen z-40">
                {/* Logo */}
                <div className="flex h-16 items-center gap-3 border-b border-border/60 px-5">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg shadow-primary/25">
                        <Sparkles className="h-4 w-4 text-white" />
                    </div>
                    <div>
                        <h1 className="text-sm font-bold tracking-tight">SoftwareStore</h1>
                        <p className="text-[10px] text-muted-foreground font-medium">Admin Panel</p>
                    </div>
                </div>
                <NavContent />
            </aside>

            {/* Mobile Sidebar (Sheet) */}
            <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
                {/* Main Content */}
                <div className="flex flex-col flex-1 md:ml-[260px]">
                    <header className="flex h-14 items-center gap-4 border-b border-border/60 bg-white/80 backdrop-blur-xl px-4 lg:h-16 lg:px-6 sticky top-0 z-30">
                        <SheetTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                className="shrink-0 md:hidden h-9 w-9 rounded-xl"
                            >
                                <Menu className="h-4 w-4" />
                                <span className="sr-only">Toggle navigation menu</span>
                            </Button>
                        </SheetTrigger>
                        <div className="w-full flex-1">
                            <h1 className="text-base font-semibold tracking-tight">
                                {navSections.flatMap(s => s.items).find(item => isActive(item.to))?.label || 'Admin'}
                            </h1>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-md shadow-primary/20">
                                    A
                                </div>
                            </div>
                        </div>
                    </header>
                    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 overflow-x-hidden">
                        <Outlet />
                    </main>
                </div>

                <SheetContent side="left" className="flex flex-col p-0 w-[280px] bg-white">
                    <SheetHeader className="flex flex-row items-center gap-3 p-4 border-b">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg shadow-primary/25">
                            <Sparkles className="h-4 w-4 text-white" />
                        </div>
                        <div>
                            <SheetTitle className="text-sm font-bold">SoftwareStore</SheetTitle>
                            <p className="text-[10px] text-muted-foreground font-medium">Admin Panel</p>
                        </div>
                    </SheetHeader>
                    <NavContent />
                </SheetContent>
            </Sheet>
        </div>
    );
}
