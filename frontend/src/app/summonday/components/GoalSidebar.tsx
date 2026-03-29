"use client";

import { motion } from "framer-motion";
import { Target, Link as LinkIcon } from "lucide-react";
import Link from "next/link";
import GoalCharacter from "../dashboard/components/GoalCharacter";

interface Goal {
    id: number;
    title: string;
    difficulty: number | string;
    current_xp: number;
    target_xp: number;
    status: number | string;
}

interface GoalSidebarProps {
    goals: Goal[];
}

export default function GoalSidebar({ goals }: GoalSidebarProps) {
    return (
        <aside className="fixed right-0 top-0 h-screen w-72 bg-zinc-900/60 backdrop-blur-xl border-l border-white/5 flex-col z-40 hidden xl:flex">
            <div className="h-16 flex items-center px-5 border-b border-white/5 shrink-0 justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                    <Target className="w-4 h-4 text-primary" />
                    私の目標
                    <span className="ml-1 px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-bold">{goals.length}</span>
                </div>
                <Link href="/summonday/goals" className="text-xs text-zinc-500 hover:text-primary transition-colors">
                    管理する →
                </Link>
            </div>

            <div className="flex-1 overflow-y-auto py-4 px-3 space-y-3">
                {goals.length === 0 ? (
                    <div className="py-12 text-center">
                        <p className="text-zinc-600 text-sm">まだ目標がありません。</p>
                        <Link href="/summonday/goals" className="text-xs text-primary hover:underline mt-2 inline-block">
                            最初の目標を作る →
                        </Link>
                    </div>
                ) : (
                    goals.map((goal, i) => {
                        const progress = Math.round((goal.current_xp / goal.target_xp) * 100);
                        return (
                            <motion.div
                                key={goal.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.08 }}
                                className="rounded-xl border border-white/8 bg-black/30 p-4 hover:border-primary/20 transition-colors"
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <GoalCharacter currentXp={goal.current_xp} title={goal.title} size={52} />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-white leading-tight line-clamp-2">{goal.title}</p>
                                        <p className="text-xs text-zinc-500 mt-0.5">{goal.current_xp.toLocaleString()} / {goal.target_xp.toLocaleString()} XP</p>
                                    </div>
                                </div>
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.min(100, progress)}%` }}
                                        transition={{ duration: 1, ease: "easeOut", delay: i * 0.08 + 0.2 }}
                                        className="h-full bg-primary rounded-full"
                                    />
                                </div>
                                <p className="text-right text-xs text-primary font-semibold mt-1">{progress}%</p>
                            </motion.div>
                        );
                    })
                )}
            </div>
        </aside>
    );
}
