
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Save, Smartphone, MapPin, Mail, Phone, Facebook, Instagram, Youtube, Loader2, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

// Settings key mapping
const SETTING_KEYS = {
    // Payment
    bkash_number: "bkash_number",
    nagad_number: "nagad_number",
    rocket_number: "rocket_number",
    // General
    site_name: "site_name",
    support_email: "support_email",
    support_phone: "support_phone",
    address: "address",
    footer_tagline: "footer_tagline",
    // Social
    facebook: "facebook",
    instagram: "instagram",
    youtube: "youtube",
    whatsapp: "whatsapp",
} as const;

export default function AdminSettings() {
    const supabase = createClient();
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // All settings in one flat object
    const [settings, setSettings] = useState<Record<string, string>>({
        bkash_number: "",
        nagad_number: "",
        rocket_number: "",
        site_name: "",
        support_email: "",
        support_phone: "",
        address: "",
        footer_tagline: "",
        facebook: "",
        instagram: "",
        youtube: "",
        whatsapp: "",
    });

    // Fetch settings from Supabase on mount
    useEffect(() => {
        fetchSettings();
    }, []);

    async function fetchSettings() {
        setLoading(true);
        const { data, error } = await supabase
            .from("site_settings")
            .select("key, value");

        if (error) {
            console.error("Error fetching settings:", error);
            toast({
                title: "Error",
                description: "Failed to load settings. " + error.message,
                variant: "destructive",
            });
        } else if (data) {
            const mapped: Record<string, string> = {};
            data.forEach((row: { key: string; value: string | null }) => {
                if (row.key in SETTING_KEYS) {
                    mapped[row.key] = row.value || "";
                }
            });
            setSettings((prev) => ({ ...prev, ...mapped }));
        }
        setLoading(false);
    }

    const handleChange = (key: string, value: string) => {
        setSettings((prev) => ({ ...prev, [key]: value }));
    };

    const handleSave = async () => {
        setSaving(true);
        let hasError = false;

        // Upsert each setting key/value
        for (const [key, value] of Object.entries(settings)) {
            const { error } = await supabase
                .from("site_settings")
                .upsert(
                    { key, value, updated_at: new Date().toISOString() },
                    { onConflict: "key" }
                );

            if (error) {
                console.error(`Error saving ${key}:`, error);
                hasError = true;
            }
        }

        if (hasError) {
            toast({
                title: "Partial Error",
                description: "Some settings could not be saved. Check console for details.",
                variant: "destructive",
            });
        } else {
            toast({
                title: "✅ Settings Saved",
                description: "All settings updated successfully!",
            });
        }
        setSaving(false);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6 max-w-4xl"
        >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Site Settings</h1>
                    <p className="text-muted-foreground text-sm">
                        Manage your website configuration, payment numbers, and social links.
                    </p>
                </div>
                <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full sm:w-auto"
                >
                    {saving ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Save className="mr-2 h-4 w-4" />
                    )}
                    {saving ? "Saving..." : "Save Changes"}
                </Button>
            </div>

            <Tabs defaultValue="payment" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="payment" className="text-xs sm:text-sm">
                        💳 Payment
                    </TabsTrigger>
                    <TabsTrigger value="general" className="text-xs sm:text-sm">
                        ⚙️ General
                    </TabsTrigger>
                    <TabsTrigger value="social" className="text-xs sm:text-sm">
                        📱 Social
                    </TabsTrigger>
                </TabsList>

                {/* Payment Settings */}
                <TabsContent value="payment" className="space-y-4 mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Mobile Banking Numbers</CardTitle>
                            <CardDescription>
                                These numbers will be shown to customers during checkout.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="bkash_number" className="flex items-center gap-2">
                                    <span className="h-2.5 w-2.5 rounded-full bg-pink-500"></span>
                                    bKash Personal Number
                                </Label>
                                <div className="relative">
                                    <Smartphone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="bkash_number"
                                        className="pl-9"
                                        placeholder="01700000000"
                                        value={settings.bkash_number}
                                        onChange={(e) => handleChange("bkash_number", e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="nagad_number" className="flex items-center gap-2">
                                    <span className="h-2.5 w-2.5 rounded-full bg-orange-500"></span>
                                    Nagad Personal Number
                                </Label>
                                <div className="relative">
                                    <Smartphone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="nagad_number"
                                        className="pl-9"
                                        placeholder="01900000000"
                                        value={settings.nagad_number}
                                        onChange={(e) => handleChange("nagad_number", e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="rocket_number" className="flex items-center gap-2">
                                    <span className="h-2.5 w-2.5 rounded-full bg-purple-500"></span>
                                    Rocket Personal Number
                                </Label>
                                <div className="relative">
                                    <Smartphone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="rocket_number"
                                        className="pl-9"
                                        placeholder="01800000000"
                                        value={settings.rocket_number}
                                        onChange={(e) => handleChange("rocket_number", e.target.value)}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* General Settings */}
                <TabsContent value="general" className="space-y-4 mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">General Information</CardTitle>
                            <CardDescription>
                                Basic contact and site details visible on the website.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="site_name">Website Name</Label>
                                <Input
                                    id="site_name"
                                    placeholder="Digital Tools BD"
                                    value={settings.site_name}
                                    onChange={(e) => handleChange("site_name", e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="footer_tagline">Footer Tagline</Label>
                                <Input
                                    id="footer_tagline"
                                    placeholder="Your trusted source for premium digital products"
                                    value={settings.footer_tagline}
                                    onChange={(e) => handleChange("footer_tagline", e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="support_email">Support Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="support_email"
                                        className="pl-9"
                                        placeholder="support@example.com"
                                        value={settings.support_email}
                                        onChange={(e) => handleChange("support_email", e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="support_phone">Support Phone</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="support_phone"
                                        className="pl-9"
                                        placeholder="+880 1700 000000"
                                        value={settings.support_phone}
                                        onChange={(e) => handleChange("support_phone", e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="address">Address</Label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="address"
                                        className="pl-9"
                                        placeholder="Dhaka, Bangladesh"
                                        value={settings.address}
                                        onChange={(e) => handleChange("address", e.target.value)}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Social Settings */}
                <TabsContent value="social" className="space-y-4 mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Social Media & Messaging</CardTitle>
                            <CardDescription>
                                Links to social profiles and contact channels.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="facebook">Facebook Page URL</Label>
                                <div className="relative">
                                    <Facebook className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="facebook"
                                        className="pl-9"
                                        placeholder="https://facebook.com/your-page"
                                        value={settings.facebook}
                                        onChange={(e) => handleChange("facebook", e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="whatsapp">WhatsApp Number</Label>
                                <div className="relative">
                                    <MessageCircle className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="whatsapp"
                                        className="pl-9"
                                        placeholder="+880 1700 000000"
                                        value={settings.whatsapp}
                                        onChange={(e) => handleChange("whatsapp", e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="instagram">Instagram Profile URL</Label>
                                <div className="relative">
                                    <Instagram className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="instagram"
                                        className="pl-9"
                                        placeholder="https://instagram.com/your-page"
                                        value={settings.instagram}
                                        onChange={(e) => handleChange("instagram", e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="youtube">YouTube Channel URL</Label>
                                <div className="relative">
                                    <Youtube className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="youtube"
                                        className="pl-9"
                                        placeholder="https://youtube.com/your-channel"
                                        value={settings.youtube}
                                        onChange={(e) => handleChange("youtube", e.target.value)}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </motion.div>
    );
}
