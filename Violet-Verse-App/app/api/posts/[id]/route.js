import { NextResponse } from "next/server";
import { getPostById, updatePost, deletePost } from "@/repos/InteractionRepository";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/jwt";

export const runtime = 'nodejs';

function formatPost(post) {
  if (!post) return null;

  return {
    ...post,
    userId: post.authorId,
    images: post.images?.map((img) => img.url) || [],
    likeCount: post._count?.likes || 0,
    commentCount: post._count?.comments || 0,
  };
}

// ================= GET POST =================
// GET /api/posts/[id]
// Access: Public
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const post = await getPostById(id);
    return NextResponse.json(formatPost(post));
  } catch (error) {
    console.log("GET POST ERROR:", error);
    return NextResponse.json(
      { error: error.message || "Failed to load post" },
      { status: 500 }
    );
  }
}

// ================= UPDATE POST =================
// PUT /api/posts/[id]
// Access: Requires authentication (only post owner)
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = verifyJwt(token);
    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const existingPost = await getPostById(id);
    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    if (existingPost.authorId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const updatedPost = await updatePost(id, body.content);

    return NextResponse.json(formatPost(updatedPost));
  } catch (error) {
    console.log("UPDATE POST ERROR:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update post" },
      { status: 500 }
    );
  }
}

// ================= DELETE POST =================
// DELETE /api/posts/[id]
// Access: Requires authentication (only post owner)
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = verifyJwt(token);
    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const existingPost = await getPostById(id);
    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    if (existingPost.authorId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await deletePost(id);
    return NextResponse.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.log("DELETE POST ERROR:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete post" },
      { status: 500 }
    );
  }
}