import { NextResponse } from "next/server";
import { createPost } from "@/repos/InteractionRepository";
import { cookies } from "next/headers";

export async function POST(req) {
  try {
    const cookieStore = await cookies();
    const authorId = cookieStore.get("userId")?.value;

    if (!authorId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}