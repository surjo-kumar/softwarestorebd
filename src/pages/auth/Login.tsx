import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Sparkles, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase/client";

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
        <div className="min-h-screen pt-24 pb-12 flex flex-col justify-center items-center bg-gradient-to-br from-slate-50 via-white to-blue-50/30 px-4">
            <Link to="/" className="flex items-center gap-2 mb-8">
                <Store className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold tracking-tight text-slate-800">Return to Store</span>
            </Link>

            <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white/40">
                <div className="flex flex-col items-center gap-4 mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg shadow-primary/30">
                        <Sparkles className="h-7 w-7 text-white" />
                    </div>
                    <div className="text-center space-y-1.5">
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Welcome Back</h1>
                        <p className="text-sm text-slate-500 font-medium">Log in to manage your orders & downloads</p>
                    </div>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                    <div className="space-y-3">
                        <div className="relative">
                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email address"
                                className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-slate-700"
                            />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                className="w-full h-12 pl-11 pr-11 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-slate-700"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>
                    
                    {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <input type="checkbox" className="rounded border-slate-300 text-primary focus:ring-primary/20" />
                            <span className="text-slate-500 font-medium group-hover:text-slate-700 transition-colors">Remember me</span>
                        </label>
                        <button type="button" onClick={() => alert('Please contact support to reset your password.')} className="font-semibold text-primary hover:text-primary/80 transition-colors">
                            Forgot password?
                        </button>
                    </div>

                    <Button type="submit" disabled={isLoading} className="w-full h-12 rounded-xl font-semibold shadow-lg shadow-primary/20 text-white bg-primary hover:bg-primary/90 transition-all">
                        {isLoading ? "Signing in..." : "Sign In"}
                    </Button>
                </form>

                <div className="mt-8 text-center text-sm font-medium text-slate-500">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-primary font-semibold hover:text-primary/80 transition-colors">
                        Create account
                    </Link>
                </div>
            </div>
        </div>
    );
}
