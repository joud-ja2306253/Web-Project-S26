import { NextResponse } from "next/server";
import interactionRepo from "../../../../../repos/InteractionRepository";

// ================= GET COMMENTS =================
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const comments = await interactionRepo.getComments(id);

    return NextResponse.json(comments);

  } catch (error) {
    console.log("GET COMMENTS ERROR:", error);

    return NextResponse.json(
      { error: error.message || "Failed to load comments" },
      { status: 500 }
    );
  }
}


// ================= CREATE COMMENT =================
export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const content = (body.content || body.comment || "").trim();

    // validation
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

    // create comment
    const newComment = await interactionRepo.addComment({
      comment: content,
      postId: id,
      userId: body.userId
    });

    return NextResponse.json(newComment, { status: 201 });

  } catch (error) {
    console.log("CREATE COMMENT ERROR:", error);

    return NextResponse.json(
      { error: error.message || "Failed to add comment" },
      { status: 500 }
    );
  }
}