import { NextResponse } from "next/server";
import { createPost, getFeedPosts, getPostsByUser } from "@/repos/InteractionRepository";

function formatPost(post) {
  return {
    ...post,
    userId: post.authorId,
    images: post.images?.map((img) => img.url) || [],
    likeCount: post._count?.likes || 0,
    commentCount: post._count?.comments || 0,
  };
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const authorId = searchParams.get("authorId");

    if (authorId) {
      const posts = await getPostsByUser(authorId);
      return NextResponse.json(posts.map(formatPost));
    }

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    const posts = await getFeedPosts(userId);
    return NextResponse.json(posts.map(formatPost));
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to load posts" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const userId = body.userId;
    const content = body.content?.trim() || "";
    const images = Array.isArray(body.images) ? body.images : [];

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    if (!content && images.length === 0) {
      return NextResponse.json(
        { error: "Post must have text or image" },
        { status: 400 }
      );
    }

    const newPost = await createPost(userId, content, images);
    return NextResponse.json(formatPost(newPost), { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to create post" },
      { status: 500 }
    );
  }
}
