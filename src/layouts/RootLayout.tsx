import { ReactNode, useState, useCallback } from "react";
import { Toaster } from "@/components/ui/toaster";
import SplashScreen from "@/components/SplashScreen";
import { AnimatePresence, motion } from "framer-motion";

export default function RootLayout({ children }: { children: ReactNode }) {
    const [showSplash, setShowSplash] = useState(() => {
        // Only show splash once per session
        const shown = sessionStorage.getItem("splash_shown");
        return !shown;
    });

    const handleSplashComplete = useCallback(() => {
        sessionStorage.setItem("splash_shown", "true");
        setShowSplash(false);
    }, []);

    return (
        <>
            <AnimatePresence mode="wait">
                {showSplash ? (
                    <SplashScreen
                        key="splash"
                        onComplete={handleSplashComplete}
                        siteName="SoftwareStoreBD"
                    />
                ) : (
                    <motion.div
                        key="main"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
            <Toaster />
        </>
    );
}
