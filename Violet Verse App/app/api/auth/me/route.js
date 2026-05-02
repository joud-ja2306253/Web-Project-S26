import { NextResponse } from "next/server";
import { getUserById } from "@/repos/InteractionRepository";
import { cookies } from "next/headers";
import { verifyJwt } from "../../../lib/jwt";

export async function GET() {
  try {
    console.log("🔍 ME API - Starting...");
    
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    console.log("🔍 ME API - Token exists:", !!token);
    console.log("🔍 ME API - Token value:", token ? token.substring(0, 50) + "..." : "none");

    if (!token) {
      console.log("❌ ME API - No token found");
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    console.log("🔍 ME API - Verifying token...");
    const userData = verifyJwt(token);
    console.log("🔍 ME API - UserData from token:", userData);

    if (!userData) {
      console.log("❌ ME API - Invalid token");
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    console.log("🔍 ME API - Fetching user from DB, id:", userData.id);
    const user = await getUserById(userData.id);
    console.log("🔍 ME API - User from DB:", user ? user.displayName : "null");

    if (!user) {
      console.log("❌ ME API - User not found in DB");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("✅ ME API - Success!");
    return NextResponse.json(user);
  } catch (error) {
    console.error("❌ ME API - Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}