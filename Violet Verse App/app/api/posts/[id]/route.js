import { NextResponse } from "next/server";
import { getPostById, updatePost, deletePost } from "@/repos/InteractionRepository";

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

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const post = await getPostById(id);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(formatPost(post));
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to get post" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const content = body.content?.trim() || "";

    const existingPost = await getPostById(id);
    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    if (!content && existingPost.images.length === 0) {
      return NextResponse.json(
        { error: "Post cannot be empty" },
        { status: 400 }
      );
    }

    const updatedPost = await updatePost(id, content);
    return NextResponse.json(updatedPost);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to update post" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    const existingPost = await getPostById(id);
    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    await deletePost(id);
    return NextResponse.json({ message: "Post deleted" });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to delete post" },
      { status: 500 }
    );
  }
}
