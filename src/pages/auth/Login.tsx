import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Store, LogIn, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { motion } from "framer-motion";

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                setError(error.message);
                return;
            }

            if (data?.user) {
                navigate("/dashboard");
            }
        } catch (err: any) {
            setError(err.message || "Something went wrong.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 py-12">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50/40" />
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-primary/8 blur-3xl animate-float-slow" />
                <div className="absolute bottom-0 -left-20 w-80 h-80 rounded-full bg-blue-400/10 blur-3xl animate-float-reverse" />
                <div className="absolute top-1/2 right-1/4 w-40 h-40 rounded-full bg-indigo-300/10 blur-2xl animate-float" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative z-10 w-full max-w-md"
            >
                {/* Return to Store */}
                <Link to="/" className="flex items-center gap-2 mb-6 justify-center group">
                    <Store className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-semibold text-gray-600 group-hover:text-primary transition-colors">
                        Return to Store
                    </span>
                </Link>

                {/* Card */}
                <div className="bg-white/80 backdrop-blur-2xl rounded-3xl p-8 md:p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-white/60 relative overflow-hidden">
                    {/* Decorative gradient top line */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-blue-400 to-indigo-500" />

                    {/* Header */}
                    <div className="flex flex-col items-center gap-3 mb-8">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary via-blue-500 to-indigo-600 flex items-center justify-center shadow-xl shadow-primary/30 relative"
                        >
                            <LogIn className="h-8 w-8 text-white" />
                            <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 hover:opacity-100 transition-opacity" />
                        </motion.div>
                        <div className="text-center space-y-1">
                            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
                                Welcome Back
                            </h1>
                            <p className="text-sm text-gray-500 font-medium">
                                Sign in to your account to continue
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        {/* Email Field */}
                        <div>
                            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                                Email Address
                            </label>
                            <div className="relative group">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="w-full h-12 pl-11 pr-4 rounded-xl border-2 border-gray-200 bg-gray-50/50 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 focus:bg-white transition-all text-gray-800 placeholder:text-gray-400"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                                Password
                            </label>
                            <div className="relative group">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className="w-full h-12 pl-11 pr-12 rounded-xl border-2 border-gray-200 bg-gray-50/50 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 focus:bg-white transition-all text-gray-800 placeholder:text-gray-400"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-red-50 border border-red-200 text-red-600 text-sm font-medium px-4 py-3 rounded-xl"
                            >
                                {error}
                            </motion.div>
                        )}

                        {/* Remember me & Forgot */}
                        <div className="flex items-center justify-between text-sm pt-1">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/20 cursor-pointer" />
                                <span className="text-gray-500 font-medium group-hover:text-gray-700 transition-colors">
                                    Remember me
                                </span>
                            </label>
                            <button
                                type="button"
                                onClick={() => alert('Please contact support to reset your password.')}
                                className="font-semibold text-primary hover:text-primary/80 transition-colors"
                            >
                                Forgot password?
                            </button>
                        </div>

                        {/* Submit */}
                        <motion.button
                            type="submit"
                            disabled={isLoading}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            className="w-full h-12 rounded-xl font-bold text-white bg-gradient-to-r from-primary via-blue-500 to-indigo-600 hover:shadow-xl hover:shadow-primary/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2 text-sm md:text-base"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight className="h-4 w-4" />
                                </>
                            )}
                        </motion.button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-6">
                        <div className="flex-1 h-px bg-gray-200" />
                        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">or</span>
                        <div className="flex-1 h-px bg-gray-200" />
                    </div>

                    {/* Sign up link */}
                    <div className="text-center">
                        <p className="text-sm text-gray-500 font-medium">
                            Don't have an account?{" "}
                            <Link
                                to="/register"
                                className="text-primary font-bold hover:text-primary/80 transition-colors inline-flex items-center gap-1"
                            >
                                Create account
                                <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-xs text-gray-400 mt-6 font-medium">
                    🔒 Secured by Software Store BD
                </p>
            </motion.div>
        </div>
    );
}
