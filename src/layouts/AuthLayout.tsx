import { Link, Outlet } from "react-router-dom";

export default function AuthLayout() {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Simple header */}
            <header className="border-b">
                <div className="container mx-auto px-4 py-4">
                    <Link to="/" className="text-2xl font-bold gradient-text">
                        Digital Marketplace
                    </Link>
                </div>
            </header>

            {/* Auth content */}
            <main className="flex-1 flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <Outlet />
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t py-6">
                <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
                    <p>&copy; 2026 Digital Marketplace. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
