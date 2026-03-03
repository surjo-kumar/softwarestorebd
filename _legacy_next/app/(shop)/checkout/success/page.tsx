import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Download, Home } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function CheckoutSuccessPage({
    searchParams,
}: {
    searchParams: { orderId: string };
}) {
    return (
        <div className="container mx-auto px-4 py-20 flex items-center justify-center min-h-[60vh]">
            <Card className="max-w-md w-full text-center border-green-200 dark:border-green-900 bg-green-50/50 dark:bg-green-900/10">
                <CardHeader>
                    <div className="flex justify-center mb-4">
                        <div className="h-16 w-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl text-green-700 dark:text-green-400">Payment Successful!</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                        Thank you for your purchase. Your order has been confirmed.
                    </p>
                    <div className="bg-background p-4 rounded-lg border text-sm text-left space-y-2">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Order ID:</span>
                            <span className="font-mono">{searchParams.orderId}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Status:</span>
                            <span className="text-green-600 font-medium">Completed</span>
                        </div>
                    </div>
                    <p className="text-sm">
                        You will receive an email confirmation shortly with your download links.
                    </p>
                </CardContent>
                <CardFooter className="flex flex-col gap-3">
                    <Button className="w-full gap-2" size="lg">
                        <Download className="h-4 w-4" />
                        Access Downloads
                    </Button>
                    <Link href="/" className="w-full">
                        <Button variant="outline" className="w-full gap-2">
                            <Home className="h-4 w-4" />
                            Return Home
                        </Button>
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}
