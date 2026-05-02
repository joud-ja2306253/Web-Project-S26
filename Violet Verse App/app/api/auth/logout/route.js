// app/api/auth/logout/route.js
import { cookies } from "next/headers";

export const runtime = 'nodejs';  

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete("token");
  return Response.json({ success: true });
}
