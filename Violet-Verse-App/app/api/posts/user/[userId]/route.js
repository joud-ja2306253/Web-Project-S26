import { NextResponse } from "next/server";
import { getPostsByUser } from "@/repos/InteractionRepository";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/jwt";

// GET /api/posts/user/[userId]
export async function GET(req, { params }) {
  try {
    const { userId } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const currentUser = token ? verifyJwt(token) : null;

    const posts = await getPostsByUser(userId, currentUser?.id || null);
    return NextResponse.json(posts ?? []);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
