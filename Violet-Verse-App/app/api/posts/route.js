import { NextResponse } from "next/server";
import { createPost } from "@/repos/InteractionRepository";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/jwt";

export async function POST(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const user = verifyJwt(token);
    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const authorId = user.id;
    const body = await req.json();

    if (!body.content?.trim() && (!body.imageUrls || body.imageUrls.length === 0)) {
      return NextResponse.json({ error: "Post must have text or image" }, { status: 400 });
    }

    const post = await createPost(
      authorId, 
      body.content ?? "", 
      body.imageUrls ?? []
    );
    
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Create post error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}