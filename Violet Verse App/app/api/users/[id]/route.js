import { NextResponse } from "next/server";
import { getUserById, updateUser } from "@/repos/InteractionRepository";
import { cookies } from "next/headers";

// GET /api/users/[id]
export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const user = await getUserById(id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT /api/users/[id]  body: { username?, displayName?, bio?, profilePic? }
export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    if (userId !== id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const updated = await updateUser(id, {
      username: body.username,
      displayName: body.displayName,
      bio: body.bio,
      profilePic: body.profilePic,
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}