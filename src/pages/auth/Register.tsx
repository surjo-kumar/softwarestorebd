import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, Eye, EyeOff, Store, UserPlus, Phone, ArrowRight, Check } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { motion } from "framer-motion";

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [error, setError] = useState("");
    const [agreed, setAgreed] = useState(false);

    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!agreed) {
            setError("Please agree to the Terms of Service and Privacy Policy.");
            return;
        }

        setIsLoading(true);

        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                        phone: phone
                    }
                }
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

    // Password strength
    const getPasswordStrength = () => {
        if (password.length === 0) return { level: 0, label: "", color: "" };
        if (password.length < 6) return { level: 1, label: "Weak", color: "bg-red-400" };
        if (password.length < 8) return { level: 2, label: "Fair", color: "bg-yellow-400" };
        if (password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)) return { level: 4, label: "Strong", color: "bg-green-500" };
        return { level: 3, label: "Good", color: "bg-blue-400" };
    };

    const strength = getPasswordStrength();

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 py-12">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-blue-50/40" />
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-indigo-400/10 blur-3xl animate-float-slow" />
                <div className="absolute bottom-0 -right-20 w-80 h-80 rounded-full bg-primary/8 blur-3xl animate-float-reverse" />
                <div className="absolute top-1/3 left-1/4 w-40 h-40 rounded-full bg-blue-300/10 blur-2xl animate-float" />
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
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-primary to-blue-400" />

                    {/* Header */}
                    <div className="flex flex-col items-center gap-3 mb-8">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 via-primary to-blue-500 flex items-center justify-center shadow-xl shadow-primary/30 relative"
                        >
                            <UserPlus className="h-8 w-8 text-white" />
                            <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 hover:opacity-100 transition-opacity" />
                        </motion.div>
                        <div className="text-center space-y-1">
                            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
                                Create Account
                            </h1>
                            <p className="text-sm text-gray-500 font-medium">
                                Join us and start shopping instantly
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-4">
                        {/* Full Name */}
                        <div>
                            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Full Name</label>
                            <div className="relative group">
                                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                                <input
                                    type="text"
                                    required
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="Enter your full name"
                                    className="w-full h-12 pl-11 pr-4 rounded-xl border-2 border-gray-200 bg-gray-50/50 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 focus:bg-white transition-all text-gray-800 placeholder:text-gray-400"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Email Address</label>
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

                        {/* Phone */}
                        <div>
                            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Phone Number</label>
                            <div className="relative group">
                                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                                <input
                                    type="tel"
                                    required
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="01XXXXXXXXX"
                                    className="w-full h-12 pl-11 pr-4 rounded-xl border-2 border-gray-200 bg-gray-50/50 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 focus:bg-white transition-all text-gray-800 placeholder:text-gray-400"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Min 6 characters"
                                    minLength={6}
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
                            {/* Password Strength */}
                            {password.length > 0 && (
                                <div className="mt-2 flex items-center gap-2">
                                    <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden flex gap-0.5">
                                        {[1, 2, 3, 4].map((i) => (
                                            <div
                                                key={i}
                                                className={`flex-1 rounded-full transition-all duration-300 ${i <= strength.level ? strength.color : "bg-gray-200"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <span className={`text-[10px] font-bold ${strength.level <= 1 ? 'text-red-500' :
                                            strength.level === 2 ? 'text-yellow-500' :
                                                strength.level === 3 ? 'text-blue-500' : 'text-green-500'
                                        }`}>
                                        {strength.label}
                                    </span>
                                </div>
                            )}
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

                        {/* Terms */}
                        <div className="flex items-start text-sm pt-1">
                            <label className="flex items-start gap-2.5 cursor-pointer group">
                                <div className="relative mt-0.5">
                                    <input
                                        type="checkbox"
                                        checked={agreed}
                                        onChange={(e) => setAgreed(e.target.checked)}
                                        className="sr-only"
                                    />
                                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${agreed
                                            ? 'bg-primary border-primary'
                                            : 'border-gray-300 bg-white group-hover:border-primary/50'
                                        }`}>
                                        {agreed && <Check className="h-3.5 w-3.5 text-white" />}
                                    </div>
                                </div>
                                <span className="text-gray-500 font-medium group-hover:text-gray-700 transition-colors leading-snug">
                                    I agree to the{" "}
                                    <Link to="/terms" className="text-primary font-semibold hover:underline">Terms of Service</Link>{" "}
                                    and{" "}
                                    <Link to="/privacy" className="text-primary font-semibold hover:underline">Privacy Policy</Link>
                                </span>
                            </label>
                        </div>

                        {/* Submit */}
                        <motion.button
                            type="submit"
                            disabled={isLoading}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            className="w-full h-12 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-500 via-primary to-blue-500 hover:shadow-xl hover:shadow-primary/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2 text-sm md:text-base"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Creating Account...
                                </>
                            ) : (
                                <>
                                    Create Account
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

                    {/* Login link */}
                    <div className="text-center">
                        <p className="text-sm text-gray-500 font-medium">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="text-primary font-bold hover:text-primary/80 transition-colors inline-flex items-center gap-1"
                            >
                                Sign in
                                <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-xs text-gray-400 mt-6 font-medium">
                    🔒 Your data is protected and encrypted
                </p>
            </motion.div>
        </div>
    );
}
