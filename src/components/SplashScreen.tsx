import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

interface SplashScreenProps {
    onComplete: () => void;
    siteName?: string;
}

export default function SplashScreen({ onComplete, siteName = "SoftwareStoreBD" }: SplashScreenProps) {
    const [countdown, setCountdown] = useState(3);
    const [progress, setProgress] = useState(0);
    const [showButton, setShowButton] = useState(false);
    const intervalRef = useRef<any>(null);

    useEffect(() => {
        // Animate progress bar
        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(progressInterval);
                    return 100;
                }
                return prev + (100 / 30); // ~3 seconds
            });
        }, 100);

        // Countdown timer
        intervalRef.current = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(intervalRef.current);
                    setShowButton(true);
                    // Auto-proceed after button shows
                    setTimeout(() => onComplete(), 1500);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            clearInterval(progressInterval);
            clearInterval(intervalRef.current);
        };
    }, [onComplete]);

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 0.5 }}
                className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
                style={{
                    background: "radial-gradient(ellipse at center, #0a1628 0%, #050d1a 50%, #020810 100%)",
                }}
            >
                {/* Animated Particles / Stars */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(30)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute rounded-full"
                            style={{
                                width: Math.random() * 3 + 1,
                                height: Math.random() * 3 + 1,
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                background: `rgba(${100 + Math.random() * 155}, ${150 + Math.random() * 105}, 255, ${0.3 + Math.random() * 0.5})`,
                            }}
                            animate={{
                                opacity: [0, 1, 0],
                                scale: [0, 1.5, 0],
                                y: [0, -30, -60],
                            }}
                            transition={{
                                duration: 2 + Math.random() * 3,
                                delay: Math.random() * 2,
                                repeat: Infinity,
                                repeatDelay: Math.random() * 2,
                            }}
                        />
                    ))}
                </div>

                {/* Ambient glow circles */}
                <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-blue-600/8 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-cyan-500/6 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />

                {/* Main Content */}
                <div className="relative z-10 flex flex-col items-center text-center px-6">
                    {/* Logo / Icon with spinning ring */}
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
                        className="relative mb-8"
                    >
                        {/* Spinning ring outer */}
                        <motion.div
                            className="absolute inset-[-12px] rounded-full"
                            style={{
                                border: "2px solid transparent",
                                borderTop: "2px solid rgba(59, 130, 246, 0.6)",
                                borderRight: "2px solid rgba(34, 211, 238, 0.3)",
                            }}
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        />

                        {/* Spinning ring inner */}
                        <motion.div
                            className="absolute inset-[-6px] rounded-full"
                            style={{
                                border: "1px solid transparent",
                                borderBottom: "1px solid rgba(16, 185, 129, 0.5)",
                                borderLeft: "1px solid rgba(59, 130, 246, 0.2)",
                            }}
                            animate={{ rotate: -360 }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        />

                        {/* Glow behind icon */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-cyan-400/20 rounded-full blur-xl scale-150" />

                        {/* Icon container */}
                        <motion.div
                            className="relative w-20 h-20 rounded-full bg-gradient-to-br from-blue-600/20 to-cyan-500/10 backdrop-blur-xl flex items-center justify-center border border-blue-400/20 shadow-2xl shadow-blue-500/20"
                            animate={{
                                boxShadow: [
                                    "0 0 30px rgba(59, 130, 246, 0.2)",
                                    "0 0 60px rgba(59, 130, 246, 0.4)",
                                    "0 0 30px rgba(59, 130, 246, 0.2)",
                                ],
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <Sparkles className="w-9 h-9 text-blue-400" />
                        </motion.div>
                    </motion.div>

                    {/* Title Text */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                    >
                        <h1 className="text-2xl md:text-3xl font-bold text-white mb-1 tracking-tight">
                            Redirecting to{" "}
                            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent">
                                {siteName}
                            </span>
                        </h1>
                        <motion.p
                            className="text-gray-400 text-sm md:text-base"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                        >
                            আপনাকে নিয়ে যাওয়া হচ্ছে...
                        </motion.p>
                    </motion.div>

                    {/* Countdown Circle */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5, type: "spring", stiffness: 120 }}
                        className="relative my-8"
                    >
                        <svg width="80" height="80" viewBox="0 0 80 80" className="transform -rotate-90">
                            {/* Background circle */}
                            <circle
                                cx="40"
                                cy="40"
                                r="34"
                                fill="none"
                                stroke="rgba(59, 130, 246, 0.15)"
                                strokeWidth="3"
                            />
                            {/* Progress circle */}
                            <motion.circle
                                cx="40"
                                cy="40"
                                r="34"
                                fill="none"
                                stroke="url(#circleGradient)"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeDasharray={213.6}
                                initial={{ strokeDashoffset: 213.6 }}
                                animate={{ strokeDashoffset: 213.6 - (progress / 100) * 213.6 }}
                                transition={{ duration: 0.1 }}
                            />
                            <defs>
                                <linearGradient id="circleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#22d3ee" />
                                    <stop offset="50%" stopColor="#3b82f6" />
                                    <stop offset="100%" stopColor="#10b981" />
                                </linearGradient>
                            </defs>
                        </svg>

                        {/* Countdown Number */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <AnimatePresence mode="wait">
                                <motion.span
                                    key={countdown}
                                    initial={{ scale: 0.3, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 1.5, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="text-2xl font-bold bg-gradient-to-b from-white to-blue-200 bg-clip-text text-transparent"
                                >
                                    {countdown}
                                </motion.span>
                            </AnimatePresence>
                        </div>
                    </motion.div>

                    {/* CTA Button */}
                    <motion.button
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: showButton ? 1 : 0.6, y: 0 }}
                        transition={{ delay: 0.7, duration: 0.4 }}
                        onClick={onComplete}
                        className="group relative px-8 py-3 rounded-2xl text-sm font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95"
                    >
                        {/* Button gradient background */}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 via-cyan-500/20 to-emerald-500/30 rounded-2xl border border-blue-400/20 backdrop-blur-sm" />

                        {/* Button shine effect */}
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                            animate={{ x: [-200, 200] }}
                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                        />

                        <span className="relative z-10 flex items-center gap-2">
                            এখনই যেতে ক্লিক করুন
                            <motion.span
                                animate={{ x: [0, 5, 0] }}
                                transition={{ duration: 1, repeat: Infinity }}
                            >
                                →
                            </motion.span>
                        </span>
                    </motion.button>
                </div>

                {/* Bottom gradient line */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
            </motion.div>
        </AnimatePresence>
    );
}
