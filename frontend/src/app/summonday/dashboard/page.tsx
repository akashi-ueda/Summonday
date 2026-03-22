import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getGoalsAction } from "../actions";
import GoalPrompt from "./components/GoalPrompt";
import TaskPrompt from "./components/TaskPrompt";
import GoalList from "./components/GoalList";
import Navbar from "../components/Navbar";
import Link from "next/link";

export default async function DashboardPage() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session");
    
    if (!sessionCookie) {
        redirect("/summonday/login");
    }

    const user = JSON.parse(sessionCookie.value);
    const allGoals = await getGoalsAction(user.id);
    const goals = allGoals.filter((g: any) => !g.deleted);

    return (
        <div className="relative min-h-screen bg-zinc-950 text-zinc-50 overflow-hidden">
            <Navbar user={user} />
            
            {/* Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,var(--tw-gradient-stops))] from-primary/10 via-zinc-950 to-zinc-950" />
            
            {/* Main scrollable area — padded bottom so content isn't hidden behind fixed prompt */}
            <div className="relative z-10 w-full max-w-4xl mx-auto px-6 pt-28 pb-40 flex flex-col items-center">
                <header className="mb-10 text-center w-full">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
                        반갑습니다, {user.name}님
                    </h1>
                    <p className="text-lg text-zinc-400 max-w-xl mx-auto">
                        {goals.length === 0 
                            ? "첫 번째 목표를 선언하고 작은 습관부터 시작해 보세요!"
                            : "오늘도 목표를 향해 한 걸음 나아가볼까요?"}
                    </p>
                </header>

                {/* 목표 없을 때: 목표 생성 프롬프트를 메인으로 */}
                {goals.length === 0 ? (
                    <GoalPrompt user={user} />
                ) : (
                    <div className="w-full flex flex-col gap-4">
                        <div className="flex justify-end">
                            <Link href="/summonday/goals" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors bg-primary/10 px-4 py-2 rounded-lg">
                                내 전체 목표 관리하기 →
                            </Link>
                        </div>
                        {/* 목표 목록이 메인 */}
                        <GoalList goals={goals} />
                    </div>
                )}
            </div>

            {/* 하단 고정 습관 입력창 (목표가 있을 때만 표시) */}
            {goals.length > 0 && (
                <div className="fixed bottom-0 inset-x-0 z-50 bg-zinc-950/80 backdrop-blur-xl border-t border-white/10 px-6 py-4">
                    <div className="max-w-2xl mx-auto">
                        <TaskPrompt user={user} />
                    </div>
                </div>
            )}
        </div>
    );
}
