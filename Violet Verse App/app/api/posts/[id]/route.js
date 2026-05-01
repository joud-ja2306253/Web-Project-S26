import { NextResponse } from "next/server";
import { getPostById, updatePost, deletePost } from "../../../../repos/InteractionRepository";

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
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
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
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

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