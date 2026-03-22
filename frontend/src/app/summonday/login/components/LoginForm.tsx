"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Map, Mail, Lock, User } from "lucide-react";
import { loginAction, signupAction } from "../../actions";

export function LoginForm() {
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const res = isLogin ? await loginAction(formData) : await signupAction(formData);
            if (res?.error) {
                setError(res.error);
            } else {
                setSuccess(isLogin ? "로그인 성공! 대시보드로 이동합니다." : "회원가입 성공! 환영합니다.");
            }
        } catch (e: any) {
            // Next.js redirect() throws an error to perform the redirect, which we ignore/treat as success.
            if (e.message?.includes("NEXT_REDIRECT")) {
                setSuccess(isLogin ? "로그인 성공! 대시보드로 이동합니다." : "회원가입 성공! 환영합니다.");
            } else {
                setError(e.message || "Something went wrong.");
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 mx-4 w-full max-w-md"
        >
            <div className="rounded-3xl border border-[hsl(0,0%,100%,0.2)] bg-[hsl(0,0%,100%,0.15)] px-8 py-10 shadow-2xl backdrop-blur-xl">
                {/* Logo */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="mb-8 flex flex-col items-center"
                >
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/30 font-black text-3xl text-white">
                        S
                    </div>
                    <h1 className="font-display text-4xl font-bold tracking-tight text-[hsl(0,0%,100%)]">
                        Summonday
                    </h1>
                    <p className="mt-2 text-center text-sm text-[hsl(0,0%,100%,0.7)]">
                        {isLogin ? "Welcome back" : "Your adventure starts today"}
                    </p>
                </motion.div>

                {/* Form */}
                <form action={handleSubmit} className="flex flex-col gap-4">
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50" />
                        <input
                            type="email"
                            name="email"
                            required
                            placeholder="Email address"
                            className="w-full rounded-xl border border-white/20 bg-white/10 px-12 py-3.5 text-sm text-white placeholder-white/50 outline-none focus:border-white/50 focus:bg-white/20 transition-all"
                        />
                    </div>
                    
                    <AnimatePresence mode="popLayout">
                        {!isLogin && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="relative"
                            >
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50" />
                                <input
                                    type="text"
                                    name="name"
                                    required={!isLogin}
                                    placeholder="Your name"
                                    className="w-full rounded-xl border border-white/20 bg-white/10 px-12 py-3.5 text-sm text-white placeholder-white/50 outline-none focus:border-white/50 focus:bg-white/20 transition-all"
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50" />
                        <input
                            type="password"
                            name="password"
                            required
                            placeholder="Password"
                            className="w-full rounded-xl border border-white/20 bg-white/10 px-12 py-3.5 text-sm text-white placeholder-white/50 outline-none focus:border-white/50 focus:bg-white/20 transition-all"
                        />
                    </div>

                    <AnimatePresence mode="popLayout">
                        {!isLogin && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="relative"
                            >
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50" />
                                <input
                                    type="password"
                                    name="password_confirmation"
                                    required={!isLogin}
                                    placeholder="Confirm password"
                                    className="w-full rounded-xl border border-white/20 bg-white/10 px-12 py-3.5 text-sm text-white placeholder-white/50 outline-none focus:border-white/50 focus:bg-white/20 transition-all"
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {error && (
                        <motion.p 
                            initial={{ opacity: 0, scale: 0.95 }} 
                            animate={{ opacity: 1, scale: 1 }} 
                            className="text-sm font-medium text-red-100 text-center bg-red-600/40 border border-red-500/50 py-3 px-4 rounded-xl shadow-lg backdrop-blur-sm"
                        >
                            {error}
                        </motion.p>
                    )}

                    {success && (
                        <motion.p 
                            initial={{ opacity: 0, scale: 0.95 }} 
                            animate={{ opacity: 1, scale: 1 }} 
                            className="text-sm font-medium text-emerald-50 text-center bg-emerald-600/40 border border-emerald-500/50 py-3 px-4 rounded-xl shadow-lg backdrop-blur-sm"
                        >
                            {success}
                        </motion.p>
                    )}

                    <motion.button
                        disabled={isLoading}
                        whileHover={{ scale: 1.02, y: -1 }}
                        whileTap={{ scale: 0.97, y: 1 }}
                        type="submit"
                        className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/25 transition-all hover:shadow-lg hover:shadow-primary/30 disabled:opacity-70 disabled:pointer-events-none"
                    >
                        {isLoading ? "Please wait..." : (isLogin ? "Sign In" : "Create Account")}
                        {!isLoading && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />}
                    </motion.button>
                </form>

                <p className="mt-6 flex justify-center text-sm text-[hsl(0,0%,100%,0.7)]">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <button 
                        onClick={() => setIsLogin(!isLogin)}
                        className="ml-2 font-semibold text-white hover:underline outline-none"
                    >
                        {isLogin ? "Sign up" : "Sign in"}
                    </button>
                </p>
            </div>
        </motion.div>
    );
}
