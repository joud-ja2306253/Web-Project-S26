import { NextResponse } from "next/server";
import { createPost, getFeedPosts } from "../../../repos/InteractionRepository";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    const posts = await getFeedPosts(userId);

    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    const { userId, content, images } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    if (!content?.trim() && (!images || images.length === 0)) {
      return NextResponse.json(
        { error: "Post must have text or image" },
        { status: 400 }
      );
    }

    const newPost = await createPost(
      userId,
      content?.trim() || "",
      images || []
    );

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to create post" },
      { status: 500 }
    );
  }
}