import { NextResponse } from "next/server";
import { toggleLike } from "@/repo/InteractionRepository";

export async function POST(req) {
  const { userId, postId } = await req.json();
  const result = await toggleLike(userId, postId);
  return NextResponse.json(result);
}