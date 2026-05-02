import { NextResponse } from "next/server";
import { searchUsers } from "@/repos/InteractionRepository";

export const runtime = 'nodejs';

// GET /api/users/search?q=name
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || searchParams.get("search") || "";

    if (!query.trim()) {
      return NextResponse.json({ error: "Search query is required" }, { status: 400 });
    }

    const users = await searchUsers(query);
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
