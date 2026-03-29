import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getGoalsAction } from "../actions";
import GoalPrompt from "./components/GoalPrompt";
import TaskPrompt from "./components/TaskPrompt";
import GoalCharacter from "./components/GoalCharacter";
import Sidebar from "../components/Sidebar";
import GoalSidebar from "../components/GoalSidebar";
import Link from "next/link";
import { Star, Target } from "lucide-react";

export default async function DashboardPage() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session");
    
    if (!sessionCookie) {
        redirect("/summonday/login");
    }

    const user = JSON.parse(sessionCookie.value);
    const allGoals = await getGoalsAction(user.id);
    const goals = allGoals.filter((g: any) => !g.deleted);
    const mainGoal = goals.find((g: any) => g.is_main) ?? goals[0] ?? null;

    return (
        <div className="relative min-h-screen bg-zinc-950 text-zinc-50 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,var(--tw-gradient-stops))] from-primary/8 via-zinc-950 to-zinc-950 pointer-events-none" />

            <Sidebar user={user} />
            <GoalSidebar goals={goals} />

            <main className="relative z-10 ml-20 lg:ml-64 xl:mr-72 min-h-screen flex flex-col">
                {/* ヘッダー */}
                <header className="px-10 pt-14 pb-6">
                    <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-white mb-1">
                        こんにちは、<span className="text-primary">{user.name}</span>さん 👋
                    </h1>
                    <p className="text-zinc-400 text-base">
                        {goals.length === 0
                            ? "まず最初の目標を宣言して、小さな習慣から始めましょう！"
                            : "今日の習慣を記録して、目標に向かって進みましょう。"}
                    </p>
                </header>

                <div className="flex-1 px-10 pb-36 space-y-8">
                    {goals.length === 0 ? (
                        <GoalPrompt user={user} />
                    ) : (
                        <>
                            {/* メイン目標ハイライト */}
                            {mainGoal && (
                                <section>
                                    <div className="flex items-center gap-2 mb-4">
                                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                        <h2 className="text-sm font-semibold text-yellow-400 uppercase tracking-widest">メイン目標</h2>
                                    </div>
                                    <div className="rounded-3xl border border-yellow-500/20 bg-linear-to-br from-yellow-500/8 via-black/30 to-primary/8 backdrop-blur-md p-8 shadow-2xl">
                                        <div className="flex flex-col md:flex-row items-center gap-8">
                                            {/* キャラクター */}
                                            <div className="shrink-0">
                                                <GoalCharacter
                                                    currentXp={mainGoal.current_xp}
                                                    title={mainGoal.title}
                                                    size={130}
                                                />
                                            </div>
                                            {/* 情報 */}
                                            <div className="flex-1 w-full min-w-0">
                                                <h3 className="text-2xl font-bold text-white mb-1 leading-tight">{mainGoal.title}</h3>
                                                <p className="text-zinc-400 text-sm mb-6">
                                                    {mainGoal.current_xp.toLocaleString()} / {mainGoal.target_xp.toLocaleString()} XP
                                                </p>
                                                {/* XP バー */}
                                                <div className="space-y-2">
                                                    <div className="flex justify-between text-xs text-zinc-500">
                                                        <span>経験値進捗</span>
                                                        <span className="text-primary font-bold">
                                                            {Math.min(100, Math.round((mainGoal.current_xp / mainGoal.target_xp) * 100))}%
                                                        </span>
                                                    </div>
                                                    <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
                                                        <div
                                                            style={{ width: `${Math.min(100, (mainGoal.current_xp / mainGoal.target_xp) * 100)}%` }}
                                                            className="h-full bg-linear-to-r from-primary to-primary/70 rounded-full transition-all duration-700"
                                                        />
                                                    </div>
                                                </div>
                                                {/* 次の進化まで */}
                                                {mainGoal.current_xp < 600 && (
                                                    <p className="text-xs text-zinc-500 mt-3">
                                                        次の進化まで{" "}
                                                        <span className="text-primary font-semibold">
                                                            {(mainGoal.current_xp < 300 ? 300 : 600) - mainGoal.current_xp} XP
                                                        </span>{" "}
                                                        残っています！
                                                    </p>
                                                )}
                                                {mainGoal.current_xp >= 600 && (
                                                    <p className="text-xs text-yellow-400 mt-3 font-semibold">✨ 最終進化達成！目標に集中しています。</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            )}

                            {/* まとめ統計 */}
                            <section className="grid grid-cols-2 gap-4">
                                <div className="rounded-2xl border border-white/8 bg-black/30 backdrop-blur-sm p-6">
                                    <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-2">進行中の目標</p>
                                    <p className="text-4xl font-black text-white">
                                        {goals.length}
                                        <span className="text-lg font-normal text-zinc-500 ml-1">個</span>
                                    </p>
                                </div>
                                <div className="rounded-2xl border border-white/8 bg-black/30 backdrop-blur-sm p-6">
                                    <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-2">合計経験値</p>
                                    <p className="text-4xl font-black text-primary">
                                        {goals.reduce((s: number, g: any) => s + g.current_xp, 0).toLocaleString()}
                                        <span className="text-lg font-normal text-zinc-500 ml-1">XP</span>
                                    </p>
                                </div>
                            </section>

                            {/* 目標管理リンク */}
                            <div className="flex justify-end">
                                <Link href="/summonday/goals" className="flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-primary transition-colors">
                                    <Target className="w-4 h-4" />
                                    全目標を管理する →
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </main>

            {/* 下部固定入力欄 */}
            {goals.length > 0 && (
                <div className="fixed bottom-0 left-20 lg:left-64 xl:right-72 right-0 z-50 bg-zinc-950/85 backdrop-blur-xl border-t border-white/8 px-10 py-4">
                    <TaskPrompt user={user} />
                </div>
            )}
        </div>
    );
}
