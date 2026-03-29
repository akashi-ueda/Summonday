"use client";

import { motion } from "framer-motion";
import { Target } from "lucide-react";
import GoalCharacter from "./GoalCharacter";

interface Goal {
    id: number;
    title: string;
    difficulty: number | string;
    current_xp: number;
    target_xp: number;
    status: number;
}

interface GoalListProps {
    goals: Goal[];
}

export default function GoalList({ goals }: GoalListProps) {
    if (!goals || goals.length === 0) return null;

    const getDifficultyLabel = (diff: number | string) => {
        if (diff === 0 || diff === "easy") return "易";
        if (diff === 1 || diff === "medium") return "中";
        return "難";
    }

    return (
        <div className="w-full max-w-4xl mx-auto space-y-6 mt-16">
            <h3 className="text-xl font-semibold text-zinc-100 flex items-center gap-2 mb-8">
                <Target className="h-5 w-5 text-primary" />
                現在進行中の目標
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {goals.map((goal, i) => (
                    <motion.div
                        key={goal.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="rounded-2xl border border-white/10 bg-black/40 p-6 shadow-xl backdrop-blur-md relative overflow-hidden flex flex-col justify-between min-h-[200px]"
                    >
                        <div className="flex flex-col items-center mb-4">
                            <GoalCharacter
                                currentXp={goal.current_xp}
                                title={goal.title}
                                size={88}
                            />
                        </div>
                        
                        <div className="flex justify-between items-start mb-4 gap-4">
                            <h4 className="text-lg font-medium text-white line-clamp-2 leading-tight">
                                {goal.title}
                            </h4>
                            <span className="shrink-0 rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-medium text-zinc-300">
                                難易度: {getDifficultyLabel(goal.difficulty)}
                            </span>
                        </div>
                        
                        <div className="mt-auto flex flex-col gap-2">
                            <div className="flex justify-between items-end text-sm">
                                <span className="text-zinc-400">進捗</span>
                                <span className="font-semibold text-primary">
                                    {Math.round((goal.current_xp / goal.target_xp) * 100)}%
                                </span>
                            </div>
                            
                            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min(100, (goal.current_xp / goal.target_xp) * 100)}%` }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    className="h-full bg-primary"
                                />
                            </div>
                            
                            <p className="text-xs text-zinc-500 text-right mt-1">
                                {goal.current_xp.toLocaleString()} / {goal.target_xp.toLocaleString()} XP
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
