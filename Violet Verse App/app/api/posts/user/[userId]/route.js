import { NextResponse } from "next/server";
import { getPostsByUser } from "@/repos/InteractionRepository";

// GET /api/posts/user/[userId]
export async function GET(req, { params }) {
  try {
    const { userId } = await params;
    const posts = await getPostsByUser(userId);
    return NextResponse.json(posts ?? []);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}