"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Target, LogOut } from "lucide-react";
import { logoutAction } from "../actions";

const navItems = [
    { href: "/summonday/dashboard", icon: LayoutDashboard, label: "ダッシュボード" },
    { href: "/summonday/goals", icon: Target, label: "目標管理" },
];

export default function Sidebar({ user }: { user: { name: string; email: string } }) {
    const pathname = usePathname();

    return (
        <aside className="fixed left-0 top-0 h-screen w-20 lg:w-64 bg-zinc-900/80 backdrop-blur-xl border-r border-white/5 flex flex-col z-40 transition-all">
            {/* ロゴ */}
            <div className="h-16 flex items-center px-4 lg:px-6 border-b border-white/5 shrink-0">
                <Link href="/summonday/dashboard" className="flex items-center gap-3">
                    <span className="bg-primary text-white w-9 h-9 rounded-xl flex items-center justify-center font-black text-lg shrink-0">S</span>
                    <span className="hidden lg:block font-bold text-lg tracking-tight text-white">Summonday</span>
                </Link>
            </div>

            {/* ナビゲーション */}
            <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
                {navItems.map(({ href, icon: Icon, label }) => {
                    const isActive = pathname === href || (href !== "/summonday/dashboard" && pathname.startsWith(href));
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all group ${
                                isActive
                                    ? "bg-primary/15 text-primary"
                                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                            }`}
                        >
                            <Icon className={`w-5 h-5 shrink-0 transition-colors ${isActive ? "text-primary" : "text-zinc-500 group-hover:text-white"}`} />
                            <span className="hidden lg:block">{label}</span>
                            {isActive && <span className="hidden lg:block ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
                        </Link>
                    );
                })}
            </nav>

            {/* プロフィール & ログアウト */}
            <div className="px-3 pb-6 shrink-0 border-t border-white/5 pt-4 space-y-2">
                <div className="hidden lg:flex items-center gap-3 px-3 py-2">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-primary">{user.name[0]}</span>
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-medium text-white truncate">{user.name}</p>
                        <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                    </div>
                </div>
                <form action={logoutAction}>
                    <button type="submit" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer">
                        <LogOut className="w-4 h-4 shrink-0" />
                        <span className="hidden lg:block">ログアウト</span>
                    </button>
                </form>
            </div>
        </aside>
    );
}
