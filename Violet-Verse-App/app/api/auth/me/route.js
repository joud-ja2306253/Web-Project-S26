import { NextResponse } from "next/server";
import { getUserById } from "@/repos/InteractionRepository";
import { cookies } from "next/headers";
import { verifyJwt } from "../../../lib/jwt";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const userData = verifyJwt(token);
    if (!userData) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const user = await getUserById(userData.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("ME API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}