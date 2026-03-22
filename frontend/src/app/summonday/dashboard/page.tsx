import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getGoalsAction } from "../actions";
import GoalPrompt from "./components/GoalPrompt";
import TaskPrompt from "./components/TaskPrompt";
import Sidebar from "../components/Sidebar";
import GoalSidebar from "../components/GoalSidebar";

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
            {/* Background */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,var(--tw-gradient-stops))] from-primary/8 via-zinc-950 to-zinc-950 pointer-events-none" />

            {/* 왼쪽 사이드바 (메뉴) */}
            <Sidebar user={user} />

            {/* 오른쪽 사이드바 (목표 목록) */}
            <GoalSidebar goals={goals} />

            {/* 가운데 메인 영역: 왼쪽은 w-20(lg:w-64), 오른쪽은 w-72 만큼 여백 */}
            <main className="relative z-10 ml-20 lg:ml-64 xl:mr-72 min-h-screen flex flex-col">
                {/* 헤더 영역 */}
                <header className="px-10 pt-14 pb-8">
                    <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-white mb-1">
                        반갑습니다, <span className="text-primary">{user.name}</span>님 👋
                    </h1>
                    <p className="text-zinc-400 text-base">
                        {goals.length === 0
                            ? "첫 번째 목표를 선언하고 작은 습관부터 시작해 보세요!"
                            : "오늘의 습관을 기록하고 목표를 향해 나아가세요."}
                    </p>
                </header>

                {/* 메인 콘텐츠 */}
                <div className="flex-1 px-10 pb-36">
                    {goals.length === 0 ? (
                        <GoalPrompt user={user} />
                    ) : (
                        <div className="flex flex-col gap-8">
                            {/* 오늘의 현황 요약 카드 */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="rounded-2xl border border-white/8 bg-black/30 backdrop-blur-sm p-6">
                                    <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-2">진행 중인 목표</p>
                                    <p className="text-4xl font-black text-white">{goals.length}<span className="text-lg font-normal text-zinc-500 ml-1">개</span></p>
                                </div>
                                <div className="rounded-2xl border border-white/8 bg-black/30 backdrop-blur-sm p-6">
                                    <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-2">총 경험치</p>
                                    <p className="text-4xl font-black text-primary">
                                        {goals.reduce((s: number, g: any) => s + g.current_xp, 0).toLocaleString()}
                                        <span className="text-lg font-normal text-zinc-500 ml-1">XP</span>
                                    </p>
                                </div>
                            </div>

                            {/* 가장 진행률 높은 목표 하이라이트 */}
                            {(() => {
                                const top = [...goals].sort((a: any, b: any) => (b.current_xp / b.target_xp) - (a.current_xp / a.target_xp))[0] as any;
                                const progress = Math.round((top.current_xp / top.target_xp) * 100);
                                return (
                                    <div className="rounded-2xl border border-primary/20 bg-primary/5 backdrop-blur-sm p-6">
                                        <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-4">🏆 가장 가까운 목표</p>
                                        <div className="flex items-center gap-6">
                                            <div className="shrink-0">
                                                {/* inline GoalCharacter - server-safe way: show static stats only */}
                                                <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                                                    <span className="text-2xl font-black text-primary">{progress}%</span>
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-xl font-bold text-white mb-1">{top.title}</h3>
                                                <p className="text-sm text-zinc-400 mb-4">{top.current_xp.toLocaleString()} / {top.target_xp.toLocaleString()} XP</p>
                                                <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
                                                    <div
                                                        style={{ width: `${Math.min(100, progress)}%` }}
                                                        className="h-full bg-primary rounded-full transition-all duration-700"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>
                    )}
                </div>
            </main>

            {/* 하단 고정 입력창 (왼쪽•오른쪽 사이드바 고려한 여백) */}
            {goals.length > 0 && (
                <div className="fixed bottom-0 left-20 lg:left-64 xl:right-72 right-0 z-50 bg-zinc-950/85 backdrop-blur-xl border-t border-white/8 px-10 py-4">
                    <TaskPrompt user={user} />
                </div>
            )}
        </div>
    );
}
