import { NextResponse } from "next/server";
import { getCommentsByPost, createComment } from "@/repos/InteractionRepository";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const comments = await getCommentsByPost(id);
    return NextResponse.json(comments);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to load comments" },
      { status: 500 }
    );
  }
}

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const content = (body.content || body.comment || "").trim();

    if (!content) {
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

    const newComment = await createComment(body.userId, id, content);
    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to add comment" },
      { status: 500 }
    );
  }
}
