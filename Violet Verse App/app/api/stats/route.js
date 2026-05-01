import { NextResponse } from "next/server";
import {
  avgFollowersPerUser,
  avgPostsPerUser,
  mostActiveUser,
  mostLikedPost,
  platformOverview,
  topFollowedUsers,
} from "@/repo/InteractionRepository";

export async function GET() {
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
}