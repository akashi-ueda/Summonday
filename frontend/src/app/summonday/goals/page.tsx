import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getGoalsAction } from "../actions";
import GoalManager from "./components/GoalManager";
import GoalPrompt from "../dashboard/components/GoalPrompt";
import Navbar from "../components/Navbar";
import Link from "next/link";

export default async function GoalsPage() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session");
    
    if (!sessionCookie) {
        redirect("/summonday/login");
    }

    const user = JSON.parse(sessionCookie.value);
    const allGoals = await getGoalsAction(user.id);
    
    // 상태값(status) enum: active=0, completed=1, abandoned=2
    const activeGoals = allGoals.filter((g: any) => !g.deleted);
    const abandonedGoals = allGoals.filter((g: any) => g.deleted);

    return (
        <div className="relative min-h-screen bg-zinc-950 text-zinc-50 flex flex-col items-center pt-32 p-8 overflow-hidden">
            <Navbar user={user} />
            
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,var(--tw-gradient-stops))] from-blue-900/10 via-zinc-950 to-zinc-950" />
            
            <div className="relative z-10 w-full max-w-4xl flex flex-col mx-auto">
                <header className="mb-8 w-full">
                    <Link href="/summonday/dashboard" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors mb-6">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        대시보드로 돌아가기
                    </Link>
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">목표 관리</h1>
                    <p className="text-zinc-400">진행 중인 목표를 점검하고, 포기했던 목표를 언제든 다시 시작할 수 있습니다.</p>
                </header>

                <div className="w-full flex justify-center mb-12 border-b border-white/10 pb-12">
                     <GoalPrompt user={user} />
                </div>

                <GoalManager activeGoals={activeGoals} abandonedGoals={abandonedGoals} />
            </div>
        </div>
    );
}
