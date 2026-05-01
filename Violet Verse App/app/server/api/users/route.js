import { NextResponse } from "next/server";
import { searchUsers, getUserById } from "@/repo/InteractionRepository";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("search");
  const id = searchParams.get("id");

  if (id) {
    const user = await getUserById(id);
    return NextResponse.json(user);
  }
  if (query) {
    const users = await searchUsers(query);
    return NextResponse.json(users);
  }
  return NextResponse.json({ error: "Missing params" }, { status: 400 });
}