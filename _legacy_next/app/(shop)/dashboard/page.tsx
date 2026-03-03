import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Clock, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function UserDashboardPage() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: orders } = await supabase
        .from('orders')
        .select('*, products(*)')
        .eq('customer_email', user.email)
        .order('created_at', { ascending: false });

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground">Welcome back! Here's an overview of your account.</p>
                </div>
                <Link href="/products">
                    <Button>Browse Products</Button>
                </Link>
            </div>

            {/* Active Subscriptions */}
            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Active Subscriptions</CardTitle>
                        <CardDescription>Manage your active recurring services.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* Empty State Placeholder - Subscription logic is complex, keeping simple for now */}
                        <div className="flex flex-col items-center justify-center py-8 text-center bg-muted/20 rounded-lg border border-dashed">
                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                <Clock className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-lg font-semibold">No active subscriptions</h3>
                            <p className="text-muted-foreground max-w-sm mt-1 mb-4">
                                You don't have any active subscriptions yet. Browse our store to find premium tools.
                            </p>
                            <Link href="/products?category=subscription">
                                <Button variant="outline">Browse Subscriptions</Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Orders */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Orders</CardTitle>
                        <CardDescription>Your recent purchases and downloads.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {!orders || orders.length === 0 ? (
                                <p className="text-center text-muted-foreground py-8">No orders found.</p>
                            ) : (
                                orders.map((order: any) => (
                                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-accent/50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded bg-primary/10 flex items-center justify-center text-primary text-lg font-bold">
                                                {order.products?.title?.charAt(0) || 'P'}
                                            </div>
                                            <div>
                                                <h4 className="font-semibold">{order.products?.title || 'Unknown Product'}</h4>
                                                <p className="text-sm text-muted-foreground">
                                                    Purchased on {new Date(order.created_at).toLocaleDateString()}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    Method: <span className="uppercase">{order.payment_provider || 'Card'}</span>
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <Badge variant={order.status === 'completed' ? 'default' : 'secondary'} className={order.status === 'completed' ? "bg-green-100 text-green-700 hover:bg-green-100" : ""}>
                                                {order.status}
                                            </Badge>
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={`/checkout/success?orderId=${order.id}`}>Details</Link>
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
