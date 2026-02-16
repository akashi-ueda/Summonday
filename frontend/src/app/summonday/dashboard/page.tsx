import { logoutAction } from "../actions";

export default function DashboardPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-background text-foreground">
            <h1 className="text-4xl font-bold mb-6">대시보드</h1>
            <p className="mb-8 opacity-70">로그인된 상태입니다. 서비스를 이용해 보세요.</p>

            <form action={logoutAction} className="w-full max-w-sm">
                <button
                    type="submit"
                    className="w-full py-2 px-4 border border-foreground rounded-lg font-medium hover:bg-foreground hover:text-background transition-all cursor-pointer"
                >
                    로그아웃 (데모)
                </button>
            </form>
        </div>
    );
}
