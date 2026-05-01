import { NextResponse } from "next/server";
import { toggleLike } from "@/repos/InteractionRepository";

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (!body.userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const result = await toggleLike(body.userId, id);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to like post" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  return POST(request, { params });
}
