"use client";

import { useEffect } from "react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="max-w-md text-center">
                <h2 className="mb-4 text-3xl font-bold">Something went wrong!</h2>
                <p className="mb-6 text-muted-foreground">{error.message}</p>
                <button
                    onClick={reset}
                    className="rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-transform hover:scale-105"
                >
                    Try again
                </button>
            </div>
        </div>
    );
}
