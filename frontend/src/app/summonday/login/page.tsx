import { loginAction } from "../actions";

export default function LoginPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-background text-foreground">
            <h1 className="text-4xl font-bold mb-6">로그인</h1>
            <p className="mb-8 opacity-70">Summonday에 오신 것을 환영합니다.</p>

            <form action={loginAction} className="w-full max-w-sm">
                <button
                    type="submit"
                    className="w-full py-2 px-4 bg-foreground text-background rounded-lg font-medium hover:opacity-90 transition-opacity cursor-pointer"
                >
                    로그인 (데모)
                </button>
            </form>
        </div>
    );
}
