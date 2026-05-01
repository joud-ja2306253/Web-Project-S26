import { NextResponse } from "next/server";
import { toggleFollow } from "@/repo/InteractionRepository";

export async function POST(req) {
  const { followerId, followingId } = await req.json();
  const result = await toggleFollow(followerId, followingId);
  return NextResponse.json(result);
}