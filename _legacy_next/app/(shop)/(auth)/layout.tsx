import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Simple header */}
            <header className="border-b">
                <div className="container mx-auto px-4 py-4">
                    <Link href="/" className="text-2xl font-bold gradient-text">
                        Digital Marketplace
                    </Link>
                </div>
            </header>

            {/* Auth content */}
            <main className="flex-1 flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    {children}
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
