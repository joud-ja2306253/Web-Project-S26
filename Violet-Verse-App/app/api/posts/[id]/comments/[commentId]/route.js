import { NextResponse } from "next/server";
import { getCommentById, updateComment, deleteComment } from "@/repos/InteractionRepository";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/jwt";

export const runtime = 'nodejs';

// PUT /api/posts/[id]/comments/[commentId]
export async function PUT(request, { params }) {
  try {
    const { id, commentId } = await params;
    
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = verifyJwt(token);
    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const body = await request.json();
    const content = body.comment || body.content;

    if (!content || !content.trim()) {
      return NextResponse.json({ error: "Comment is required" }, { status: 400 });
    }

    const existingComment = await getCommentById(commentId);
    
    if (!existingComment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    if (existingComment.postId !== id) {
      return NextResponse.json({ error: "Comment does not belong to this post" }, { status: 400 });
    }

    if (existingComment.authorId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updated = await updateComment(commentId, content);

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT comment error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/posts/[id]/comments/[commentId]
export async function DELETE(request, { params }) {
  try {
    const { id, commentId } = await params;
    
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = verifyJwt(token);
    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const existingComment = await getCommentById(commentId);
    
    if (!existingComment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    if (existingComment.postId !== id) {
      return NextResponse.json({ error: "Comment does not belong to this post" }, { status: 400 });
    }

    if (existingComment.authorId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await deleteComment(commentId);

    return NextResponse.json({ message: "Comment deleted" });
  } catch (error) {
    console.error("DELETE comment error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}