import { NextResponse } from "next/server";
import { toggleFollow, isFollowing } from "@/repos/InteractionRepository";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/jwt";

export const runtime = 'nodejs';

// POST /api/users/[id]/follow    follow user
// DELETE /api/users/[id]/follow  unfollow user
export async function POST(req, { params }) {
  return handleToggle(params);
}

export async function DELETE(req, { params }) {
  return handleToggle(params);
}

async function handleToggle(params) {
  try {
    const { id: followingId } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const user = verifyJwt(token);
    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const followerId = user.id;

    if (followerId === followingId) {
      return NextResponse.json({ error: "You cannot follow yourself" }, { status: 400 });
    }

    const result = await toggleFollow(followerId, followingId);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Follow toggle error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// GET /api/users/[id]/follow = check if logged-in user follows this user
export async function GET(req, { params }) {
  try {
    const { id: followingId } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const user = verifyJwt(token);
    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const following = await isFollowing(user.id, followingId);
    return NextResponse.json({ following });
  } catch (error) {
    console.error("Check follow error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}