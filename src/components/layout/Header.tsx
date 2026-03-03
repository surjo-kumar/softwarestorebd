

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Menu, Phone, Mail, Facebook, Instagram, Youtube } from "lucide-react";

export function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            {/* Top Bar - Dark */}
            <div className="hidden md:block bg-primary text-primary-foreground py-2 text-xs md:text-sm">
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <div className="flex gap-4">
                        <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> +880 1741-684468</span>
                        <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> softwarestore889900@gmail.com</span>
                    </div>
                    <div className="flex gap-3">
                        <Link to="#" className="hover:text-white/80"><Facebook className="h-3 w-3" /></Link>
                        <Link to="#" className="hover:text-white/80"><Instagram className="h-3 w-3" /></Link>
                        <Link to="#" className="hover:text-white/80"><Youtube className="h-3 w-3" /></Link>
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <div className="container mx-auto px-4 py-3 md:py-4">
                <div className="flex items-center justify-between gap-4">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3">
                        <img src="/logo.png" alt="Software Store" className="h-12 w-auto object-contain" />
                        <span className="hidden md:block text-xl font-bold tracking-tight">Software Store</span>
                    </Link>

                    {/* Search Bar - Centered */}
                    <div className="hidden md:flex flex-1 max-w-xl relative">
                        <Input
                            type="text"
                            placeholder="Search for products (e.g. Netflix, ChatGPT)..."
                            className="w-full pl-10 pr-4 rounded-full border-primary/20 focus-visible:ring-primary"
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Button className="absolute right-1 top-1/2 -translate-y-1/2 h-8 rounded-full px-4" size="sm">Search</Button>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-4">
                        {/* Mobile Search Toggle (Visible only on mobile) */}
                        <Button variant="ghost" size="icon" className="md:hidden">
                            <Search className="h-5 w-5" />
                        </Button>


                        {/* Auth Buttons */}
                        <div className="hidden md:flex items-center gap-2">
                            <Link to="/login">
                                <Button variant="ghost" className="font-semibold">Login</Button>
                            </Link>
                            <Link to="/register">
                                <Button className="font-semibold rounded-full px-6">Sign Up</Button>
                            </Link>
                        </div>

                        {/* Mobile Menu */}
                        <Button variant="ghost" size="icon" className="md:hidden">
                            <Menu className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Navigation Bar (Categories) */}
            <div className="border-t hidden md:block">
                <div className="container mx-auto px-4">
                    <nav className="flex items-center gap-8 py-3 text-sm font-medium">
                        <Link to="/" className="text-primary font-bold">All Categories</Link>
                        <Link to="/products?category=subscription" className="hover:text-primary transition-colors">Subscriptions</Link>
                        <Link to="/products?category=software" className="hover:text-primary transition-colors">Software Licenses</Link>
                        <Link to="/products?category=games" className="hover:text-primary transition-colors">Game Top-up</Link>
                        <Link to="/products?category=courses" className="hover:text-primary transition-colors">Courses</Link>
                        <div className="flex-1" /> {/* Spacer */}
                        <Link to="/track-order" className="text-muted-foreground hover:text-primary">Track Order</Link>
                        <Link to="/contact" className="text-muted-foreground hover:text-primary">Contact</Link>
                    </nav>
                </div>
            </div>
        </header>
    );
}

