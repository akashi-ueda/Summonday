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
        <div className="relative min-h-screen bg-zinc-950 text-zinc-50 flex flex-col items-center pt-32 p-8 overflow-hidden">
            <Navbar user={user} />
            
            {/* Background elements */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,var(--tw-gradient-stops))] from-primary/10 via-zinc-950 to-zinc-950" />
            
            <div className="relative z-10 w-full max-w-4xl flex flex-col items-center mx-auto">
                <header className="mb-12 text-center relative w-full">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                        반갑습니다, {user.name}님
                    </h1>
                    <p className="text-lg text-zinc-400 max-w-xl mx-auto">
                        {goals.length === 0 
                            ? "자유롭게 목표를 선언하고 작은 습관부터 시작해 보세요. AI가 난이도를 분석해 줍니다."
                            : "오늘도 목표를 향해 한 걸음 나아가볼까요?"}
                    </p>
                </header>

                {goals.length > 0 && (
                    <div className="w-full flex justify-end mb-6">
                        <Link href="/summonday/goals" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors bg-primary/10 px-4 py-2 rounded-lg">
                            내 전체 목표 관리하기 →
                        </Link>
                    </div>
                )}

                {goals.length === 0 ? (
                    <GoalPrompt user={user} />
                ) : (
                    <div className="w-full">
                        <TaskPrompt user={user} />
                        <GoalList goals={goals} />
                    </div>
                )}
            </div>
        </div>
    );
}
