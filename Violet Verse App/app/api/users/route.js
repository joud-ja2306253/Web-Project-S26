import { NextResponse } from "next/server";
import { getAllUsers } from "@/repos/InteractionRepository";

/*this is new*/
export async function GET() {
  try {
    const users = await getAllUsers();
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to load users" },
      { status: 500 },
    );
  }
}
