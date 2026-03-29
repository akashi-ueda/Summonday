"use client";

import { useState } from "react";
import { Send, CheckCircle2, AlertCircle, Loader2, Target, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createGoalAction } from "../../actions";

interface GoalPromptProps {
    user: { id: number; name: string; email: string };
}

export default function GoalPrompt({ user }: GoalPromptProps) {
    const [title, setTitle] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<{ success?: boolean; error?: string; goal?: any } | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!title.trim()) return;

        setIsLoading(true);
        setResult(null);

        try {
            const response = await createGoalAction(title, user.id);
            setResult(response);
            if (response.success) setTitle("");
        } catch (err) {
            setResult({ error: "ネットワークエラーが発生しました。" });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="w-full max-w-xl mx-auto space-y-6">
            {/* Main Prompt Card */}
            <div className="rounded-2xl border border-white/10 bg-black/40 px-6 py-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-primary/50 to-transparent" />
                
                <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary">
                        <Target className="h-5 w-5" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-white tracking-tight">あなたの目標は何ですか？</h2>
                        <p className="text-sm text-white/60 mt-1">{user.name}さんの新しい旅を教えてください。</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="relative group">
                    <div className="relative flex items-center">
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            disabled={isLoading}
                            placeholder="例: 毎朝30分ランニング、体重5kg減らす"
                            className="w-full h-14 pl-5 pr-14 rounded-xl border border-white/10 bg-white/5 text-base text-white placeholder:text-white/40 transition-all focus:border-primary/50 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-primary/50 disabled:opacity-50"
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !title.trim()}
                            className="absolute right-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-30 disabled:hover:bg-primary"
                        >
                            {isLoading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <Send className="h-4 w-4" />
                            )}
                        </button>
                    </div>
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
                                <div className="rounded-xl border border-green-500/20 bg-green-500/10 p-4 flex gap-3">
                                    <Sparkles className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="text-sm font-semibold text-green-100 flex items-center gap-2">
                                            素晴らしい目標が設定されました！
                                            <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-300">
                                                {result.goal.difficulty === "easy" ? "易" : result.goal.difficulty === "medium" ? "中" : "難"} 難易度
                                            </span>
                                        </h4>
                                        <p className="text-sm text-green-100/70 mt-1">
                                            「{result.goal.title}」の目標が分析・記録されました。小さな習慣から始めましょう。
                                        </p>
                                    </div>
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
