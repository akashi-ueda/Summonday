"use client";

import { useState } from "react";
import { Send, Loader2, Footprints, Sparkles, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createTaskAction } from "../../actions";

interface TaskPromptProps {
    user: { id: number; name: string; email: string };
}

export default function TaskPrompt({ user }: TaskPromptProps) {
    const [title, setTitle] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!title.trim()) return;

        setIsLoading(true);
        setResult(null);

        try {
            const response = await createTaskAction(title, user.id);
            setResult(response);
            if (response.success) setTitle("");
        } catch (err) {
            setResult({ error: "네트워크 오류가 발생했습니다." });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="w-full max-w-xl mx-auto space-y-6">
            <div className="rounded-2xl border border-primary/20 bg-primary/5 px-6 py-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-primary/50 to-transparent" />
                
                <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary">
                        <Footprints className="h-5 w-5" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-white tracking-tight">오늘 어떤 습관을 실천하셨나요?</h2>
                        <p className="text-sm text-white/60 mt-1">사소한 행동도 모이면 큰 목표를 달성할 수 있습니다.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="relative group flex items-center">
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        disabled={isLoading}
                        placeholder="예: 물 1잔 마시기, 스쿼트 10개 하기"
                        className="w-full h-14 pl-5 pr-14 rounded-xl border border-primary/20 bg-black/40 text-base text-white placeholder:text-white/40 transition-all focus:border-primary/50 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-primary/50 disabled:opacity-50"
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !title.trim()}
                        className="absolute right-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-30 disabled:hover:bg-primary shrink-0"
                    >
                        {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-4 w-4" />}
                    </button>
                </form>

                <AnimatePresence mode="popLayout">
                    {result && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: "auto" }}
                            exit={{ opacity: 0, y: -10, height: 0 }}
                            className="mt-6"
                        >
                            {result.success ? (
                                <div className="rounded-xl border border-primary/30 bg-primary/10 p-5 space-y-4">
                                    <div className={`flex gap-3 items-center ${result.affected_goals && result.affected_goals.length > 0 ? "border-b border-primary/20 pb-4" : ""}`}>
                                        <Sparkles className="h-5 w-5 text-primary shrink-0" />
                                        <div>
                                            <h4 className="text-sm font-semibold text-white">{result.message}</h4>
                                            <p className="text-sm text-primary/80 mt-1 flex items-center gap-2">
                                                <span className="font-medium bg-primary/20 text-primary px-2 py-0.5 rounded-md">
                                                    +{result.task.xp} XP
                                                </span>
                                                획득!
                                            </p>
                                        </div>
                                    </div>
                                    
                                    {result.affected_goals && result.affected_goals.length > 0 && (
                                        <div className="pt-2">
                                            <p className="text-xs font-medium text-white/50 mb-3 uppercase tracking-wider">이 습관이 도움을 준 목표</p>
                                            <div className="space-y-3">
                                                {result.affected_goals.map((g: any) => (
                                                    <div key={g.id} className="flex justify-between items-center text-sm bg-black/20 p-3 rounded-lg border border-white/5">
                                                        <span className="text-white/90 font-medium truncate pr-4">{g.title}</span>
                                                        <span className="text-primary font-bold bg-primary/20 px-2 py-1 rounded shrink-0">+{g.xp_gained} XP</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 flex items-start gap-3">
                                    <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                                    <p className="text-sm text-red-100/80">{result.error}</p>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
