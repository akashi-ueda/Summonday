"use client";

import { motion } from "framer-motion";
import { ArrowRight, Map } from "lucide-react";
import { loginAction } from "../../actions";

export function LoginForm() {
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
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/30">
                        <Map className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <h1 className="font-display text-4xl font-bold tracking-tight text-[hsl(0,0%,100%)]">
                        Summonday
                    </h1>
                    <p className="mt-2 text-center text-sm text-[hsl(0,0%,100%,0.7)]">
                        Your adventure starts today
                    </p>
                </motion.div>

                {/* Separator */}
                <div className="mb-6 flex items-center gap-3">
                    <div className="h-px flex-1 bg-[hsl(0,0%,100%,0.15)]" />
                    <span className="text-xs font-medium uppercase tracking-widest text-[hsl(0,0%,100%,0.5)]">
                        Sign in
                    </span>
                    <div className="h-px flex-1 bg-[hsl(0,0%,100%,0.15)]" />
                </div>

                {/* Google sign-in button */}
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => loginAction()}
                    className="group mb-4 flex w-full items-center justify-center gap-3 rounded-xl bg-[hsl(0,0%,100%)] px-5 py-3.5 text-sm font-semibold text-[hsl(220,25%,10%)] shadow-md transition-shadow hover:shadow-lg"
                >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                        <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                            fill="#4285F4"
                        />
                        <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                        />
                        <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                        />
                        <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                        />
                    </svg>
                    Continue with Google
                </motion.button>

                {/* Journey button */}
                <motion.button
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.97, y: 1 }}
                    onClick={() => loginAction()}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/25 transition-shadow hover:shadow-lg hover:shadow-primary/30"
                >
                    Begin Journey
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </motion.button>

                <p className="mt-6 text-center text-xs text-[hsl(0,0%,100%,0.4)]">
                    {"By continuing, you agree to our Terms and Privacy Policy"}
                </p>
            </div>
        </motion.div>
    );
}
