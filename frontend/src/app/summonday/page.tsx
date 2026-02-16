import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function SummondayPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session");

  if (session) {
    redirect("/summonday/dashboard");
  } else {
    redirect("/summonday/login");
  }
}

