import { NextResponse } from "next/server";
import interactionRepo from "../../../../../../repos/InteractionRepository";


// ==================== GET (single comment)
export async function GET(request, { params }) {
  const { commentId } = await params;

  const comment = await interactionRepo.getCommentById(commentId);

  if (!comment) {
    return NextResponse.json(
      { error: "Comment not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(comment);
}


// ==================== PUT (update comment)
export async function PUT(request, { params }) {
  const { commentId } = await params;
  const body = await request.json();

  if (!body.comment || !body.comment.trim()) {
    return NextResponse.json(
      { error: "Comment is required" },
      { status: 400 }
    );
  }

  const updated = await interactionRepo.updateComment(commentId, {
    comment: body.comment
  });

  if (!updated) {
    return NextResponse.json(
      { error: "Comment not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(updated);
}


// ==================== DELETE
export async function DELETE(request, { params }) {
  const { commentId } = await params;

  const success = await interactionRepo.deleteComment(commentId);

  if (!success) {
    return NextResponse.json(
      { error: "Comment not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ message: "Comment deleted" });
}