import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getGoalsAction } from "../actions";
import GoalManager from "./components/GoalManager";
import GoalPrompt from "../dashboard/components/GoalPrompt";
import Sidebar from "../components/Sidebar";

export default async function GoalsPage() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session");
    
    if (!sessionCookie) {
        redirect("/summonday/login");
    }

    const user = JSON.parse(sessionCookie.value);
    const allGoals = await getGoalsAction(user.id);
    
    const activeGoals = allGoals.filter((g: any) => !g.deleted);
    const abandonedGoals = allGoals.filter((g: any) => g.deleted);

    return (
        <div className="relative min-h-screen bg-zinc-950 text-zinc-50 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,var(--tw-gradient-stops))] from-blue-900/8 via-zinc-950 to-zinc-950 pointer-events-none" />

            <Sidebar user={user} />

            <main className="relative z-10 ml-20 lg:ml-64 min-h-screen flex flex-col">
                <header className="px-10 pt-14 pb-8 border-b border-white/5">
                    <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-white mb-1">목표 관리</h1>
                    <p className="text-zinc-400 text-sm">진행 중인 목표를 점검하고, 포기했던 목표를 언제든 다시 시작할 수 있습니다.</p>
                </header>

                <div className="flex-1 px-10 py-8 space-y-10">
                    {/* 새 목표 추가 */}
                    <section>
                        <h2 className="text-lg font-semibold text-white mb-4">새 목표 추가</h2>
                        <GoalPrompt user={user} />
                    </section>

                    {/* 목표 목록 */}
                    <section>
                        <h2 className="text-lg font-semibold text-white mb-4">목표 목록</h2>
                        <GoalManager activeGoals={activeGoals} abandonedGoals={abandonedGoals} />
                    </section>
                </div>
            </main>
        </div>
    );
}
