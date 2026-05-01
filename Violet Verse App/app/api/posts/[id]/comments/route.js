import { NextResponse } from "next/server";
import interactionRepo from "../../../../../repos/InteractionRepository";

export async function GET(request, { params }) {
  try {
    // the post id 
    const { id } = await params;

    // ❌ remove Number()
    const comments = await interactionRepo.getComments(id);

    return NextResponse.json(comments);

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    const { id } = await params;

    const body = await request.json();

    if (!body.comment || !body.comment.trim()) {
      return NextResponse.json(
        { error: "comment is required" },
        { status: 400 }
      );
    }

    const newComment = await interactionRepo.addComment({
      comment: body.comment,
      postId: id,   // ✅ send as STRING
      userId: 1
    });

    return NextResponse.json(newComment, { status: 201 });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}