import { Link } from "react-router-dom";
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

interface SiteSettings {
    [key: string]: string;
}

export function Footer() {
    const [settings, setSettings] = useState<SiteSettings>({});

    useEffect(() => {
        const fetchSettings = async () => {
            const { data, error } = await supabase
                .from("site_settings")
                .select("key, value");

            if (!error && data) {
                const mapped: SiteSettings = {};
                data.forEach((row: { key: string; value: string | null }) => {
                    mapped[row.key] = row.value || "";
                });
                setSettings(mapped);
            }
        };
        fetchSettings();

        const channel = supabase
            .channel("site_settings_changes")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "site_settings" },
                (payload: any) => {
                    if (payload.new && payload.new.key) {
                        setSettings((prev) => ({
                            ...prev,
                            [payload.new.key]: payload.new.value || "",
                        }));
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const year = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-gray-300 pb-20">
            {/* Main Footer */}
            <div className="px-4 py-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
                    {/* Brand */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <img src="/logo.png" alt="Logo" className="h-8 w-auto brightness-200" />
                            <h3 className="text-xl font-bold text-white">
                                {settings.site_name || "Software Store"}
                            </h3>
                        </div>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            {settings.footer_tagline ||
                                "Bangladesh's #1 trusted platform for authentic digital products. Premium Software, AI Tools & more at the best prices."}
                        </p>
                        <div className="flex gap-4 pt-2">
                            {settings.facebook && (
                                <a href={settings.facebook} target="_blank" rel="noopener noreferrer"
                                    className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-all duration-300 hover:scale-110">
                                    <Facebook className="h-4 w-4" />
                                </a>
                            )}
                            {settings.whatsapp && (
                                <a href={`https://wa.me/${settings.whatsapp.replace(/[^0-9+]/g, "")}`} target="_blank" rel="noopener noreferrer"
                                    className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-all duration-300 hover:scale-110">
                                    <MessageCircle className="h-4 w-4" />
                                </a>
                            )}
                            {settings.instagram && (
                                <a href={settings.instagram} target="_blank" rel="noopener noreferrer"
                                    className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-pink-600 transition-all duration-300 hover:scale-110">
                                    <Instagram className="h-4 w-4" />
                                </a>
                            )}
                            {settings.youtube && (
                                <a href={settings.youtube} target="_blank" rel="noopener noreferrer"
                                    className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-all duration-300 hover:scale-110">
                                    <Youtube className="h-4 w-4" />
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h3 className="text-base font-semibold text-white">Quick Links</h3>
                        <ul className="space-y-2.5 text-sm">
                            <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
                            <li><Link to="/products" className="hover:text-primary transition-colors">All Products</Link></li>
                            <li><Link to="/dashboard" className="hover:text-primary transition-colors">My Account</Link></li>
                            <li><Link to="/cart" className="hover:text-primary transition-colors">Shopping Cart</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div className="space-y-4">
                        <h3 className="text-base font-semibold text-white">Support</h3>
                        <ul className="space-y-2.5 text-sm">
                            <li><Link to="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
                            <li><Link to="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
                            <li><Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                            <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                            <li><Link to="/refund" className="hover:text-primary transition-colors">Refund Policy</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="space-y-4">
                        <h3 className="text-base font-semibold text-white">Contact Us</h3>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-center gap-2.5">
                                <Phone className="h-4 w-4 text-primary shrink-0" />
                                <span>{settings.support_phone || "+880 1741-684468"}</span>
                            </li>
                            <li className="flex items-center gap-2.5">
                                <Mail className="h-4 w-4 text-primary shrink-0" />
                                <span className="break-all">{settings.support_email || "softwarestore889900@gmail.com"}</span>
                            </li>
                            <li className="flex items-center gap-2.5">
                                <MapPin className="h-4 w-4 text-primary shrink-0" />
                                <span>{settings.address || "Dhaka, Bangladesh"}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-800 py-6 px-4">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-center items-center gap-2 text-xs text-gray-500 flex-wrap text-center">
                    <p>© {year} {settings.site_name || "Software Store"}. All rights reserved.</p>
                    <span className="hidden md:inline text-gray-700">|</span>
                    <span>We Accept: bKash / Nagad / Rocket</span>
                    <span className="hidden md:inline text-gray-700">|</span>
                    <a
                        href="https://clickatizer.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-primary transition-colors font-medium"
                    >
                        Developed by <span className="text-primary font-bold">Clickatizer</span>
                    </a>
                </div>
            </div>
        </footer>
    );
}
