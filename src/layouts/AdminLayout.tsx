
import { Link, Outlet } from "react-router-dom";
import {
    LayoutDashboard,
    Package,
    Users,
    ShoppingCart,
    CreditCard,
    Settings,
    LogOut,
    Gift,
    Menu,
    List
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useState } from "react";

export default function AdminLayout() {
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const NavContent = () => (
        <div className="flex-1 flex flex-col h-full">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                <div className="py-2">
                    <h3 className="mb-2 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Overview
                    </h3>
                    <Link
                        to="/admin"
                        onClick={() => setIsMobileOpen(false)}
                        className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary"
                    >
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                    </Link>
                </div>

                <div className="py-2">
                    <h3 className="mb-2 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Management
                    </h3>
                    <Link
                        to="/admin/products"
                        onClick={() => setIsMobileOpen(false)}
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted"
                    >
                        <Package className="h-4 w-4" />
                        Products
                    </Link>
                    <Link
                        to="/admin/categories"
                        onClick={() => setIsMobileOpen(false)}
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted"
                    >
                        <List className="h-4 w-4" />
                        Categories
                    </Link>
                    <Link
                        to="/admin/orders"
                        onClick={() => setIsMobileOpen(false)}
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted"
                    >
                        <ShoppingCart className="h-4 w-4" />
                        Orders
                    </Link>
                    <Link
                        to="/admin/payments"
                        onClick={() => setIsMobileOpen(false)}
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted"
                    >
                        <CreditCard className="h-4 w-4" />
                        Payments
                    </Link>
                    <Link
                        to="/admin/users"
                        onClick={() => setIsMobileOpen(false)}
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted"
                    >
                        <Users className="h-4 w-4" />
                        Users
                    </Link>
                    <Link
                        to="/admin/coupons"
                        onClick={() => setIsMobileOpen(false)}
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted"
                    >
                        <Gift className="h-4 w-4" />
                        Coupons
                    </Link>
                </div>

                <div className="py-2">
                    <h3 className="mb-2 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        System
                    </h3>
                    <Link
                        to="/admin/settings"
                        onClick={() => setIsMobileOpen(false)}
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted"
                    >
                        <Settings className="h-4 w-4" />
                        Settings
                    </Link>
                </div>
            </nav>
            <div className="mt-auto p-4 border-t">
                <Button variant="outline" className="w-full gap-2 text-red-500 hover:text-red-600">
                    <LogOut className="h-4 w-4" />
                    Logout
                </Button>
            </div>
        </div>
    );

    return (
        <div className="flex min-h-screen bg-muted/40">
            {/* Desktop Sidebar */}
            <aside className="hidden w-64 flex-col border-r bg-background md:flex">
                <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                    <Link to="/" className="flex items-center gap-2 font-semibold">
                        <span className="">Digital Shop Admin</span>
                    </Link>
                </div>
                <div className="flex-1">
                    <NavContent />
                </div>
            </aside>

            {/* Mobile Sidebar (Sheet) */}
            <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
                {/* Main Content */}
                <div className="flex flex-col flex-1">
                    <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6 sticky top-0 z-30">
                        <SheetTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                className="shrink-0 md:hidden"
                            >
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle navigation menu</span>
                            </Button>
                        </SheetTrigger>
                        <div className="w-full flex-1">
                            <h1 className="text-lg font-semibold">Admin Dashboard</h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                                A
                            </div>
                        </div>
                    </header>
                    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 overflow-x-hidden">
                        <Outlet />
                    </main>
                </div>

                <SheetContent side="left" className="flex flex-col p-0 w-[280px]">
                    <SheetHeader className="p-4 border-b text-left">
                        <SheetTitle>Admin Menu</SheetTitle>
                    </SheetHeader>
                    <NavContent />
                </SheetContent>
            </Sheet>
        </div>
    );
}
