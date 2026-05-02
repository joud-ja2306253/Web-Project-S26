import { NextResponse } from "next/server";
import interactionRepo from "@/repos/InteractionRepository";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/jwt";

// GET /api/posts/[id]/comments
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

// POST /api/posts/[id]/comments
// ================= CREATE COMMENT =================
export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = verifyJwt(token);
    if (!user) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const content = (body.content || body.comment || "").trim();

    // validation
    if (!content) {
      return NextResponse.json(
        { error: "comment is required" },
        { status: 400 }
      );
    }

    // create comment using authenticated user's ID
    const newComment = await interactionRepo.addComment({
      comment: content,
      postId: id,
      userId: user.id
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