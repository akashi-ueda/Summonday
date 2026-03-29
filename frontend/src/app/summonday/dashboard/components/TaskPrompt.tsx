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
            setResult({ error: "ネットワークエラーが発生しました。" });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="w-full">
            {/* フィードバック - 入力欄の上に浮かび上がるポップアップ */}
            <AnimatePresence mode="popLayout">
                {result && (
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        className="mb-3"
                    >
                        {result.success ? (
                            <div className="rounded-xl border border-primary/30 bg-zinc-900/90 backdrop-blur-lg p-4 shadow-2xl space-y-3">
                                <div className="flex gap-3 items-center">
                                    <Sparkles className="h-4 w-4 text-primary shrink-0" />
                                    <span className="text-sm font-semibold text-white">{result.message}</span>
                                    <span className="ml-auto font-bold bg-primary/20 text-primary text-xs px-2 py-0.5 rounded-md">+{result.task?.xp} XP</span>
                                </div>
                                {result.affected_goals && result.affected_goals.length > 0 && (
                                    <div className="space-y-1.5 pt-2 border-t border-white/10">
                                        {result.affected_goals.map((g: any) => (
                                            <div key={g.id} className="flex justify-between items-center text-xs bg-black/30 px-3 py-1.5 rounded-lg">
                                                <span className="text-white/80 truncate pr-4">{g.title}</span>
                                                <span className="text-primary font-bold shrink-0">+{g.xp_gained} XP</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="rounded-xl border border-red-500/30 bg-zinc-900/90 backdrop-blur-lg p-4 flex items-start gap-3 shadow-2xl">
                                <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                                <p className="text-sm text-red-200">{result.error}</p>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 入力欄 */}
            <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
                <div className="flex items-center gap-2 shrink-0 text-primary">
                    <Footprints className="h-5 w-5" />
                </div>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={isLoading}
                    placeholder="今日実践した習慣を入力してください..."
                    className="flex-1 h-12 px-4 rounded-xl border border-white/10 bg-white/5 text-sm text-white placeholder:text-white/30 transition-all focus:border-primary/50 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-primary/30 disabled:opacity-50"
                />
                <button
                    type="submit"
                    disabled={isLoading || !title.trim()}
                    className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-30 shrink-0"
                >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </button>
            </form>
        </div>
    );
}
