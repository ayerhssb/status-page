import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const { userId } = await auth();

  if (!userId) {
    // If user not signed in, send to sign-in page
    redirect("/sign-in");
  } else {
    // If signed in, go to the dashboard
    redirect("/dashboard");
  }
}
