"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { abandonGoalAction, restoreGoalAction } from "../../actions";
import { Target, Archive, RefreshCw, XCircle, Loader2 } from "lucide-react";
import GoalCharacter from "../../dashboard/components/GoalCharacter";

interface Goal {
    id: number;
    title: string;
    difficulty: number;
    current_xp: number;
    target_xp: number;
    status: number;
}

interface GoalManagerProps {
    activeGoals: Goal[];
    abandonedGoals: Goal[];
}

export default function GoalManager({ activeGoals, abandonedGoals }: GoalManagerProps) {
    const [tab, setTab] = useState<"active" | "abandoned">("active");
    const [loadingId, setLoadingId] = useState<number | null>(null);

    const handleAbandon = async (id: number) => {
        setLoadingId(id);
        await abandonGoalAction(id);
        setLoadingId(null);
    };

    const handleRestore = async (id: number) => {
        setLoadingId(id);
        await restoreGoalAction(id);
        setLoadingId(null);
    };

    const renderGoalCard = (goal: Goal, isAbandoned: boolean) => (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            key={goal.id}
            className={`rounded-2xl border ${isAbandoned ? 'border-zinc-800 bg-zinc-900/50' : 'border-white/10 bg-black/40'} p-6 shadow-xl backdrop-blur-md flex flex-col justify-between`}
        >
            <div>
                <div className="flex flex-col items-center mb-4">
                    <GoalCharacter
                        progress={Math.round((goal.current_xp / goal.target_xp) * 100)}
                        title={isAbandoned ? "" : goal.title}
                        size={80}
                    />
                </div>
                <div className="flex justify-between items-start mb-3 gap-2">
                    <h4 className={`text-lg font-medium line-clamp-2 leading-tight ${isAbandoned ? 'text-zinc-500 line-through' : 'text-white'}`}>
                        {goal.title}
                    </h4>
                </div>
                
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-end text-sm">
                        <span className="text-zinc-500">경험치 진행률</span>
                        <span className={`font-semibold ${isAbandoned ? 'text-zinc-600' : 'text-primary'}`}>
                            {Math.round((goal.current_xp / goal.target_xp) * 100)}%
                        </span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                        <div
                            style={{ width: `${Math.min(100, (goal.current_xp / goal.target_xp) * 100)}%` }}
                            className={`h-full ${isAbandoned ? 'bg-zinc-700' : 'bg-primary'}`}
                        />
                    </div>
                </div>
            </div>

            <div className="mt-6 flex justify-end">
                {isAbandoned ? (
                    <button
                        onClick={() => handleRestore(goal.id)}
                        disabled={loadingId === goal.id}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-800 text-zinc-300 text-sm font-medium hover:bg-zinc-700 transition-colors disabled:opacity-50"
                    >
                        {loadingId === goal.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                        다시 시작하기
                    </button>
                ) : (
                    <button
                        onClick={() => handleAbandon(goal.id)}
                        disabled={loadingId === goal.id}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/10 transition-colors disabled:opacity-50"
                    >
                        {loadingId === goal.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                        목표 포기하기
                    </button>
                )}
            </div>
        </motion.div>
    );

    return (
        <div className="w-full space-y-8">
            <div className="flex gap-2 p-1 bg-white/5 rounded-xl self-start w-max">
                <button
                    onClick={() => setTab("active")}
                    className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${tab === "active" ? "bg-white text-black shadow-sm" : "text-zinc-400 hover:text-white hover:bg-white/5"}`}
                >
                    <Target className="w-4 h-4" />
                    진행 중인 목표
                    <span className={`ml-1.5 px-2 py-0.5 rounded-full text-xs ${tab === "active" ? "bg-black/10" : "bg-white/10"}`}>{activeGoals.length}</span>
                </button>
                <button
                    onClick={() => setTab("abandoned")}
                    className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${tab === "abandoned" ? "bg-white text-black shadow-sm" : "text-zinc-400 hover:text-white hover:bg-white/5"}`}
                >
                    <Archive className="w-4 h-4" />
                    포기한 목표
                    <span className={`ml-1.5 px-2 py-0.5 rounded-full text-xs ${tab === "abandoned" ? "bg-black/10" : "bg-white/10"}`}>{abandonedGoals.length}</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AnimatePresence mode="popLayout">
                    {tab === "active" ? (
                        activeGoals.length > 0 ? (
                            activeGoals.map(g => renderGoalCard(g, false))
                        ) : (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-full py-12 text-center border border-dashed border-white/10 rounded-2xl">
                                <p className="text-zinc-500">진행 중인 목표가 없습니다.</p>
                            </motion.div>
                        )
                    ) : (
                        abandonedGoals.length > 0 ? (
                            abandonedGoals.map(g => renderGoalCard(g, true))
                        ) : (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-full py-12 text-center border border-dashed border-white/10 rounded-2xl">
                                <p className="text-zinc-500">포기한 목표가 텅 비었습니다. 훌륭해요!</p>
                            </motion.div>
                        )
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
