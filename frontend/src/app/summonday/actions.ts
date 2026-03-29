"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidateTag, revalidatePath } from "next/cache";

const BACKEND_URL = process.env.NODE_ENV === "development" ? "http://backend:3000" : "http://backend:3000";

export async function loginAction(formData: FormData) {
    const email = formData.get("email");
    const password = formData.get("password");

    const res = await fetch(`${BACKEND_URL}/api/v1/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
        return { error: "Login failed" };
    }

    const data = await res.json();
    const cookieStore = await cookies();
    cookieStore.set("session", JSON.stringify(data.user), {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7,
    });

    redirect("/summonday/dashboard");
}

export async function signupAction(formData: FormData) {
    const email = formData.get("email");
    const password = formData.get("password");
    const password_confirmation = formData.get("password_confirmation") || password;
    const name = formData.get("name") || email?.toString().split('@')[0];

    const res = await fetch(`${BACKEND_URL}/api/v1/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: { email, password, password_confirmation, name } }),
    });

    if (!res.ok) {
        const err = await res.json();
        return { error: err.error || "Signup failed" };
    }

    const data = await res.json();
    const cookieStore = await cookies();
    cookieStore.set("session", JSON.stringify(data.user), {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7,
    });

    redirect("/summonday/dashboard");
}

export async function logoutAction() {
    const cookieStore = await cookies();
    cookieStore.delete("session");
    redirect("/summonday/login");
}

export async function createGoalAction(title: string, userId: number) {
    const res = await fetch(`${BACKEND_URL}/api/v1/goals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, user_id: userId }),
    });

    if (!res.ok) {
        const err = await res.json();
        return { error: err.error || "目標の作成中にエラーが発生しました。" };
    }

    const data = await res.json();
    // @ts-ignore
    revalidateTag('goals');
    return { success: true, goal: data };
}

export async function getGoalsAction(userId: number) {
    const res = await fetch(`${BACKEND_URL}/api/v1/goals?user_id=${userId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        next: { tags: ['goals'] }, // Next.js cache tag for revalidation
        cache: 'no-store'
    });

    if (!res.ok) {
        return [];
    }
    return res.json();
}

export async function createTaskAction(title: string, userId: number) {
    const res = await fetch(`${BACKEND_URL}/api/v1/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, user_id: userId }),
    });

    if (!res.ok) {
        const err = await res.json();
        return { error: err.error || "タスクの作成中にエラーが発生しました。" };
    }

    const data = await res.json();
    // @ts-ignore
    revalidateTag('goals');
    return { success: true, task: data.task, affected_goals: data.affected_goals, message: data.message };
}

export async function abandonGoalAction(goalId: number) {
    const res = await fetch(`${BACKEND_URL}/api/v1/goals/${goalId}/abandon`, { method: "PATCH" });
    if (!res.ok) return { error: "目標の断念に失敗しました。" };
    // @ts-ignore
    revalidateTag('goals');
    revalidatePath('/summonday/dashboard');
    revalidatePath('/summonday/goals');
    return { success: true };
}

export async function restoreGoalAction(goalId: number) {
    const res = await fetch(`${BACKEND_URL}/api/v1/goals/${goalId}/restore`, { method: "PATCH" });
    if (!res.ok) return { error: "目標の復元に失敗しました。" };
    // @ts-ignore
    revalidateTag('goals');
    revalidatePath('/summonday/dashboard');
    revalidatePath('/summonday/goals');
    return { success: true };
}

export async function setMainGoalAction(goalId: number) {
    const res = await fetch(`${BACKEND_URL}/api/v1/goals/${goalId}/set_main`, { method: "PATCH" });
    if (!res.ok) return { error: "メイン目標の設定に失敗しました。" };
    // @ts-ignore
    revalidateTag('goals');
    revalidatePath('/summonday/dashboard');
    revalidatePath('/summonday/goals');
    return { success: true };
}
