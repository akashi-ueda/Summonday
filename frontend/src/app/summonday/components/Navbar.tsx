import { logoutAction } from "../actions";
import Link from "next/link";
import { LogOut } from "lucide-react";

export default function Navbar({ user }: { user: { name: string; email: string } }) {
    return (
        <nav className="fixed top-0 inset-x-0 h-16 bg-black/40 backdrop-blur-xl border-b border-white/5 z-50 flex items-center justify-between px-6 lg:px-12">
            <div className="flex items-center gap-6">
                <Link href="/summonday/dashboard" className="text-white font-bold tracking-tight text-xl hover:text-primary transition-colors flex items-center gap-2">
                    <span className="bg-primary text-white w-8 h-8 rounded-lg flex items-center justify-center font-black">S</span>
                    Summonday
                </Link>
            </div>
            
            <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-zinc-300 hidden sm:inline-block bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                    {user.name} さん、ようこそ
                </span>
                <form action={logoutAction}>
                    <button type="submit" className="text-sm flex items-center gap-2 text-zinc-400 hover:text-white transition-colors hover:bg-white/10 px-3 py-1.5 rounded-md cursor-pointer">
                        <LogOut className="w-4 h-4" />
                        ログアウト
                    </button>
                </form>
            </div>
        </nav>
    );
}
