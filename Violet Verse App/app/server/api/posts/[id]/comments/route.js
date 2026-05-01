import { NextResponse } from "next/server";
import interactionRepo from "../../../../../repos/InteractionRepository";
export async function GET(request, { params }) {
  try {
    const { id } = await params;   // ✅ must await

    const comments = await interactionRepo.getComments(id); // ✅ string id

    return NextResponse.json(comments);

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


// ==================== POST
export async function POST(request, { params }) {
  try {
    const { id } = await params;   // ✅ get postId

    const body = await request.json();

    if (!body.comment || !body.comment.trim()) {
      return NextResponse.json(
        { error: "comment is required" },
        { status: 400 }
      );
    }

    if (!body.userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    const newComment = await interactionRepo.addComment({
      comment: body.comment,
      postId: id,            // ✅ use string id
      userId: body.userId    // ✅ dynamic user
    });

    return NextResponse.json(newComment, { status: 201 });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}