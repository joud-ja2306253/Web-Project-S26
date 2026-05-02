import { NextResponse } from "next/server";
import { toggleLike } from "@/repos/InteractionRepository";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/jwt";

// POST /api/posts/[id]/like
export async function POST(request, { params }) {
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

    const result = await toggleLike(user.id, id);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Like error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to like post" },
      { status: 500 }
    );
  }
}

// DELETE /api/posts/[id]/like
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

    const result = await toggleLike(user.id, id);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Unlike error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to unlike post" },
      { status: 500 }
    );
  }
}