"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAction() {
    const cookieStore = await cookies();

    // 데모를 위해 7일간 유지되는 세션 쿠키를 생성합니다.
    cookieStore.set("session", "demo-token-123", {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_VALUE === "production",
        maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    redirect("/summonday/dashboard");
}

export async function logoutAction() {
    const cookieStore = await cookies();

    // 세션 쿠키를 삭제합니다.
    cookieStore.delete("session");

    redirect("/summonday/login");
}
