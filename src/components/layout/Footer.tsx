
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

        // Real-time subscription for live updates
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
        <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100 border-t border-slate-700/50">
            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                    {/* About Column */}
                    <div className="space-y-5">
                        <h3 className="text-2xl font-bold text-white bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                            {settings.site_name || "Software Store"}
                        </h3>
                        <p className="text-base text-slate-300 leading-relaxed">
                            {settings.footer_tagline ||
                                "Bangladesh's #1 trusted platform for authentic digital products. We provide Netflix, ChatGPT, Premium Software, and Game Top-ups at the best prices."}
                        </p>
                        <div className="flex gap-5 pt-3">
                            {settings.facebook && (
                                <a
                                    href={settings.facebook}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-blue-400 transition-all duration-300 hover:scale-110"
                                    aria-label="Facebook"
                                >
                                    <Facebook className="h-6 w-6" />
                                </a>
                            )}
                            {settings.whatsapp && (
                                <a
                                    href={`https://wa.me/${settings.whatsapp.replace(/[^0-9+]/g, "")}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-green-400 transition-all duration-300 hover:scale-110"
                                    aria-label="WhatsApp"
                                >
                                    <MessageCircle className="h-6 w-6" />
                                </a>
                            )}
                            {settings.instagram && (
                                <a
                                    href={settings.instagram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-pink-400 transition-all duration-300 hover:scale-110"
                                    aria-label="Instagram"
                                >
                                    <Instagram className="h-6 w-6" />
                                </a>
                            )}
                            {settings.youtube && (
                                <a
                                    href={settings.youtube}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-red-400 transition-all duration-300 hover:scale-110"
                                    aria-label="YouTube"
                                >
                                    <Youtube className="h-6 w-6" />
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-5">
                        <h3 className="text-xl font-semibold text-white">Quick Links</h3>
                        <ul className="space-y-3 text-base">
                            <li><Link to="/" className="hover:text-blue-400 transition-colors duration-200 hover:translate-x-1 inline-block">Home</Link></li>
                            <li><Link to="/products" className="hover:text-blue-400 transition-colors duration-200 hover:translate-x-1 inline-block">All Products</Link></li>
                            <li><Link to="/dashboard" className="hover:text-blue-400 transition-colors duration-200 hover:translate-x-1 inline-block">My Account</Link></li>
                            <li><Link to="/checkout" className="hover:text-blue-400 transition-colors duration-200 hover:translate-x-1 inline-block">Shopping Cart</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div className="space-y-5">
                        <h3 className="text-xl font-semibold text-white">Support</h3>
                        <ul className="space-y-3 text-base">
                            <li><Link to="/contact" className="hover:text-blue-400 transition-colors duration-200 hover:translate-x-1 inline-block">Contact Us</Link></li>
                            <li><Link to="/faq" className="hover:text-blue-400 transition-colors duration-200 hover:translate-x-1 inline-block">FAQ</Link></li>
                            <li><Link to="/terms" className="hover:text-blue-400 transition-colors duration-200 hover:translate-x-1 inline-block">Terms of Service</Link></li>
                            <li><Link to="/privacy" className="hover:text-blue-400 transition-colors duration-200 hover:translate-x-1 inline-block">Privacy Policy</Link></li>
                            <li><Link to="/refund" className="hover:text-blue-400 transition-colors duration-200 hover:translate-x-1 inline-block">Refund Policy</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info — from Supabase */}
                    <div className="space-y-5">
                        <h3 className="text-xl font-semibold text-white">Contact Us</h3>
                        <ul className="space-y-4 text-base">
                            <li className="flex items-center gap-3">
                                <Phone className="h-5 w-5 text-blue-400 shrink-0" />
                                <span>{settings.support_phone || "+880 1741-684468"}</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-blue-400 shrink-0" />
                                <span className="break-all">{settings.support_email || "softwarestore889900@gmail.com"}</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <MapPin className="h-5 w-5 text-blue-400 shrink-0" />
                                <span>{settings.address || "Dhaka, Bangladesh"}</span>
                            </li>
                            {settings.whatsapp && (
                                <li className="flex items-center gap-3">
                                    <MessageCircle className="h-5 w-5 text-green-400 shrink-0" />
                                    <a
                                        href={`https://wa.me/${settings.whatsapp.replace(/[^0-9+]/g, "")}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:text-green-400 transition-colors duration-200"
                                    >
                                        WhatsApp: {settings.whatsapp}
                                    </a>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-slate-700/50 bg-slate-950/80 py-8">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-center items-center gap-3 md:gap-6 text-sm text-slate-400 flex-wrap">
                        <p className="text-center">© {year} {settings.site_name || "Software Store"}. All rights reserved.</p>
                        <span className="hidden md:inline text-slate-600">|</span>
                        <span className="text-slate-400">We Accept: bKash / Nagad / Rocket</span>
                        <span className="hidden md:inline text-slate-600">|</span>
                        <a
                            href="https://clickatizer.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-300 hover:text-blue-400 transition-all duration-300 font-medium hover:scale-105 inline-block"
                        >
                            Developed by <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent font-bold">Clickatizer</span>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
