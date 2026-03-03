
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

export default function AdminSettingsPage() {
    const [loading, setLoading] = useState(false);

    // Mock initial state (would come from DB in real app)
    const [settings, setSettings] = useState({
        siteName: "Digital Shop",
        supportEmail: "support@digitalshop.com",
        supportPhone: "+880 1234-567890",
        enableRegistrations: true,
        maintenanceMode: false,
        announcementText: "New Products Added Daily",
    });

    const handleSave = () => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            alert("Settings saved successfully!");
        }, 1000);
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
            </div>

            <div className="grid gap-6">
                {/* General Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle>General Information</CardTitle>
                        <CardDescription>Configure the basic details of your store.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="siteName">Site Name</Label>
                            <Input
                                id="siteName"
                                value={settings.siteName}
                                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="announcement">Announcement Banner</Label>
                            <Input
                                id="announcement"
                                value={settings.announcementText}
                                onChange={(e) => setSettings({ ...settings, announcementText: e.target.value })}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Contact Info */}
                <Card>
                    <CardHeader>
                        <CardTitle>Contact Information</CardTitle>
                        <CardDescription>This will be displayed in the header and footer.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Support Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={settings.supportEmail}
                                onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="phone">Support Phone</Label>
                            <Input
                                id="phone"
                                value={settings.supportPhone}
                                onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* System Controls */}
                <Card>
                    <CardHeader>
                        <CardTitle>System Controls</CardTitle>
                        <CardDescription>Manage user access and site availability.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <Label className="text-base">Allow New Registrations</Label>
                                <p className="text-sm text-muted-foreground">
                                    If disabled, new users cannot sign up.
                                </p>
                            </div>
                            <Switch
                                checked={settings.enableRegistrations}
                                onCheckedChange={(c) => setSettings({ ...settings, enableRegistrations: c })}
                            />
                        </div>

                        <div className="flex items-center justify-between rounded-lg border p-4 border-red-200 bg-red-50 dark:bg-red-900/10">
                            <div className="space-y-0.5">
                                <Label className="text-base text-red-600">Maintenance Mode</Label>
                                <p className="text-sm text-red-600/80">
                                    Disable the public store for everyone except admins.
                                </p>
                            </div>
                            <Switch
                                checked={settings.maintenanceMode}
                                onCheckedChange={(c) => setSettings({ ...settings, maintenanceMode: c })}
                            />
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end">
                    <Button size="lg" onClick={handleSave} disabled={loading}>
                        {loading ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
