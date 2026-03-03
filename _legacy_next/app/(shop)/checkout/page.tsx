import { createClient } from "@/lib/supabase/server";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import { notFound, redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, ShieldCheck } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function CheckoutPage({
    searchParams,
}: {
    searchParams: { id?: string };
}) {
    const id = searchParams.id;

    if (!id) {
        redirect("/products");
    }

    const supabase = createClient();
    const { data: product, error } = await supabase
        .from('products')
        .select('*, thumbnail_url:image')
        .eq('id', id)
        .single();

    if (error || !product) {
        // Fallback for debugging if DB issue
        console.error("Checkout Error:", error);
        return notFound();
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>

            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
                {/* Left: Summary */}
                <div className="space-y-6">
                    <div className="bg-secondary/10 p-6 rounded-xl border border-border/50">
                        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                        <div className="flex gap-4">
                            <div className="h-24 w-24 bg-background rounded-lg p-2 flex items-center justify-center border">
                                <img
                                    src={product.thumbnail_url || "/placeholder.png"}
                                    alt={product.title}
                                    className="max-h-full max-w-full object-contain"
                                />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">{product.title}</h3>
                                <Badge variant="secondary" className="mt-1">{product.category}</Badge>
                            </div>
                        </div>

                        <div className="mt-6 space-y-3 pt-6 border-t border-border/50">
                            <div className="flex items-start gap-2 text-sm text-muted-foreground">
                                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                                <span>Complete access to all premium features</span>
                            </div>
                            <div className="flex items-start gap-2 text-sm text-muted-foreground">
                                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                                <span>Instant delivery via email</span>
                            </div>
                            <div className="flex items-start gap-2 text-sm text-muted-foreground">
                                <ShieldCheck className="h-4 w-4 text-green-500 mt-0.5" />
                                <span>30-day money-back guarantee</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Payment Form */}
                <div>
                    <CheckoutForm product={product} />
                    <div className="mt-4 text-center text-xs text-muted-foreground">
                        <p>By clicking "Pay", you agree to our Terms of Service using a simulated payment gateway.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
