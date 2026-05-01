import { NextResponse } from "next/server";
import interactionRepo from "../../../repos/InteractionRepository";
function formatPost(post) {
  return {
    ...post,
    userId: post.authorId,
    images: post.images?.map((img) => img.url) || [],
    likeCount: post._count?.likes || 0,
    commentCount: post._count?.comments || 0,
  };
}

// ================= GET POSTS =================
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const authorId = searchParams.get("authorId");

    // 🔹 Get posts by specific user
    if (authorId) {
      const posts = await interactionRepo.getPostsByUser(authorId);
      return NextResponse.json(posts.map(formatPost));
    }

    // 🔹 Validate userId
    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    // 🔹 Get feed
    const posts = await interactionRepo.getFeedPosts(userId);
    return NextResponse.json(posts.map(formatPost));

  } catch (error) {
    console.log("GET POSTS ERROR:", error);

    return NextResponse.json(
      { error: error.message || "Failed to load posts" },
      { status: 500 }
    );
  }
}


// ================= CREATE POST =================
export async function POST(request) {
  try {
    const body = await request.json();

    const userId = body.userId;
    const content = body.content?.trim() || "";
    const images = Array.isArray(body.images) ? body.images : [];

    // 🔹 Validation
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

    // 🔹 Create post
    const newPost = await interactionRepo.createPost(
      userId,
      content,
      images
    );

    return NextResponse.json(formatPost(newPost), { status: 201 });

  } catch (error) {
    console.log("CREATE POST ERROR:", error);

    return NextResponse.json(
      { error: error.message || "Failed to create post" },
      { status: 500 }
    );
  }
}