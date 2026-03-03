
import Link from "next/link";
import { LayoutDashboard, ShoppingBag, User, Settings, LogOut, Key } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UserDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-muted/40 pb-20 md:pb-0">
            {/* Sidebar (Desktop) */}
            <aside className="hidden w-64 flex-col border-r bg-background md:flex">
                <div className="flex h-14 items-center border-b px-6 lg:h-[60px]">
                    <span className="font-semibold">My Account</span>
                </div>
                <div className="flex-1 py-4">
                    <nav className="grid items-start px-4 text-sm font-medium gap-2">
                        <Link
                            href="/dashboard"
                            className="flex items-center gap-3 rounded-lg bg-primary/10 px-3 py-2 text-primary transition-all hover:text-primary"
                        >
                            <LayoutDashboard className="h-4 w-4" />
                            Overview
                        </Link>
                        <Link
                            href="/dashboard/orders"
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted"
                        >
                            <ShoppingBag className="h-4 w-4" />
                            My Orders
                        </Link>
                        <Link
                            href="/dashboard/subscriptions"
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted"
                        >
                            <Key className="h-4 w-4" />
                            Subscriptions
                        </Link>
                        <Link
                            href="/dashboard/profile"
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted"
                        >
                            <User className="h-4 w-4" />
                            Profile Settings
                        </Link>
                    </nav>
                </div>
                <div className="p-4 border-t">
                    <Link href="/auth/logout">
                        <Button variant="outline" className="w-full gap-2 text-red-500 hover:text-red-600 hover:bg-red-50">
                            <LogOut className="h-4 w-4" />
                            Logout
                        </Button>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex flex-col flex-1">
                <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
