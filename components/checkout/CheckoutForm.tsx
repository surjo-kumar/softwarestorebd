"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Lock, CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";
import { processCheckout } from "@/app/(shop)/checkout/actions";

interface CheckoutFormProps {
    product: {
        id: string;
        title: string;
        price: number;
        is_subscription?: boolean;
    };
}

export default function CheckoutForm({ product }: CheckoutFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("card");
    const [formData, setFormData] = useState({
        email: "",
        name: "",
        cardNumber: "",
        expiry: "",
        cvc: "",
        mobileNumber: "",
        transactionId: "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const payload = new FormData();
        payload.append("email", formData.email);
        payload.append("name", formData.name);
        payload.append("productId", product.id);
        payload.append("price", product.price.toString());
        payload.append("payment_method", paymentMethod);

        if (paymentMethod !== 'card') {
            payload.append("transaction_id", formData.transactionId);
            payload.append("mobile_number", formData.mobileNumber);
        }

        const result = await processCheckout(payload);

        if (result?.error) {
            alert(result.error);
            setIsLoading(false);
        }
        // If success, server action redirects
    };

    return (
        <form onSubmit={handleSubmit}>
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Payment Details</CardTitle>
                    <CardDescription>
                        Complete your purchase securely.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Common Fields */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="you@example.com"
                                required
                                value={formData.email}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="John Doe"
                                required
                                value={formData.name}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    <Tabs defaultValue="card" onValueChange={setPaymentMethod} className="w-full">
                        <TabsList className="grid w-full grid-cols-3 mb-4">
                            <TabsTrigger value="card">Card</TabsTrigger>
                            <TabsTrigger value="bkash" className="data-[state=active]:bg-pink-600 data-[state=active]:text-white">Bkash</TabsTrigger>
                            <TabsTrigger value="nagad" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white">Nagad</TabsTrigger>
                        </TabsList>

                        <TabsContent value="card" className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="cardNumber">Card Number</Label>
                                <div className="relative">
                                    <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="cardNumber"
                                        name="cardNumber"
                                        className="pl-9"
                                        placeholder="0000 0000 0000 0000"
                                        required={paymentMethod === 'card'}
                                        value={formData.cardNumber}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="expiry">Expiry Date</Label>
                                    <Input
                                        id="expiry"
                                        name="expiry"
                                        placeholder="MM/YY"
                                        required={paymentMethod === 'card'}
                                        value={formData.expiry}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="cvc">CVC</Label>
                                    <Input
                                        id="cvc"
                                        name="cvc"
                                        placeholder="123"
                                        required={paymentMethod === 'card'}
                                        value={formData.cvc}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="bkash" className="space-y-4">
                            <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
                                <p className="text-sm font-medium text-pink-800 mb-2">Instructions:</p>
                                <ol className="list-decimal list-inside text-sm text-pink-700 space-y-1">
                                    <li>Open your Bkash App</li>
                                    <li>Select "Send Money"</li>
                                    <li>Enter Number: <strong>01700000000</strong></li>
                                    <li>Amount: <strong>৳{Math.round(product.price * 120)}</strong> (Approx)</li>
                                    <li>Reference: <strong>{product.id.slice(0, 6)}</strong></li>
                                </ol>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="bkashNumber">Your Bkash Number</Label>
                                <Input
                                    id="bkashNumber"
                                    name="mobileNumber"
                                    placeholder="017..."
                                    required={paymentMethod === 'bkash'}
                                    value={formData.mobileNumber}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="bkashTrx">Transaction ID</Label>
                                <Input
                                    id="bkashTrx"
                                    name="transactionId"
                                    placeholder="8N7..."
                                    required={paymentMethod === 'bkash'}
                                    value={formData.transactionId}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </TabsContent>

                        <TabsContent value="nagad" className="space-y-4">
                            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                                <p className="text-sm font-medium text-orange-800 mb-2">Instructions:</p>
                                <ol className="list-decimal list-inside text-sm text-orange-700 space-y-1">
                                    <li>Open your Nagad App</li>
                                    <li>Select "Send Money"</li>
                                    <li>Enter Number: <strong>01900000000</strong></li>
                                    <li>Amount: <strong>৳{Math.round(product.price * 120)}</strong> (Approx)</li>
                                    <li>Reference: <strong>{product.id.slice(0, 6)}</strong></li>
                                </ol>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="nagadNumber">Your Nagad Number</Label>
                                <Input
                                    id="nagadNumber"
                                    name="mobileNumber"
                                    placeholder="019..."
                                    required={paymentMethod === 'nagad'}
                                    value={formData.mobileNumber}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="nagadTrx">Transaction ID</Label>
                                <Input
                                    id="nagadTrx"
                                    name="transactionId"
                                    placeholder="7X..."
                                    required={paymentMethod === 'nagad'}
                                    value={formData.transactionId}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </TabsContent>
                    </Tabs>

                    <div className="rounded-lg bg-secondary/20 p-4 border border-border flex flex-col gap-2">
                        <div className="flex justify-between text-sm">
                            <span>Subtotal</span>
                            <span>${product.price}</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg pt-2 border-t mt-1">
                            <span>Total</span>
                            <span className="text-primary">${product.price}</span>
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button
                        type="submit"
                        className="w-full text-lg h-12"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <Lock className="mr-2 h-4 w-4" />
                                {paymentMethod === 'card' ? `Pay $${product.price}` : 'Confirm Payment'}
                            </>
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </form>
    );
}
