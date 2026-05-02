import { NextResponse } from "next/server";
import { getFeedPosts } from "@/repos/InteractionRepository";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const posts = await getFeedPosts(userId);
    return NextResponse.json(posts ?? []);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}