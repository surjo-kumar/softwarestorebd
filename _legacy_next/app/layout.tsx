import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Digital Marketplace - Premium Digital Products",
    description: "Buy premium digital products including ChatGPT accounts, Gemini subscriptions, Netflix accounts, software licenses, and ebooks.",
    keywords: ["digital products", "chatgpt", "gemini", "netflix", "software", "ebooks", "subscriptions"],
    authors: [{ name: "Digital Marketplace" }],
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "https://yoursite.com",
        title: "Digital Marketplace - Premium Digital Products",
        description: "Buy premium digital products including ChatGPT accounts, Gemini subscriptions, Netflix accounts, software licenses, and ebooks.",
        siteName: "Digital Marketplace",
    },
    twitter: {
        card: "summary_large_image",
        title: "Digital Marketplace - Premium Digital Products",
        description: "Buy premium digital products including ChatGPT accounts, Gemini subscriptions, Netflix accounts, software licenses, and ebooks.",
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                    enableSystem
                    disableTransitionOnChange
                >
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}
