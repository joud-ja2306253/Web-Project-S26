import { NextResponse } from "next/server";
import {
  avgFollowersPerUser,
  avgPostsPerUser,
  mostActiveUser,
  mostLikedPost,
  platformOverview,
  topFollowedUsers,
} from "@/repos/InteractionRepository";

export const runtime = 'nodejs';

// GET /api/statistics
export async function GET() {
  try {
    const [avg_followers, avg_posts, active_user, top_post, overview, top_users] =
      await Promise.all([
        avgFollowersPerUser(),
        avgPostsPerUser(),
        mostActiveUser(),
        mostLikedPost(),
        platformOverview(),
        topFollowedUsers(),
      ]);

    return NextResponse.json({
      avg_followers,
      avg_posts,
      active_user,
      top_post,
      overview,
      top_users,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}