import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function AuthErrorPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <Card className="max-w-md w-full border-destructive/50">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                        <AlertCircle className="h-6 w-6 text-destructive" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Authentication Error</CardTitle>
                </CardHeader>
                <CardContent className="text-center text-muted-foreground">
                    <p>
                        There was a problem signing you in. The verification link may have expired or is invalid.
                    </p>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Button asChild>
                        <Link href="/login">Return to Login</Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
