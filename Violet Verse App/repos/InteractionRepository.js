
// import interactionRepo from "@/repos/InteractionRepository";
// repo/InteractionRepository.js

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


class InteractionRepository {

  // GET comments
  // async getComments(postId) {
  //   return prisma.comment.findMany({
  //     where: { postId: postId }
  //   });
  // }
  async getComments(postId) {
  return prisma.comment.findMany({
    where: {
      post: {
        id: postId   // ✅ relation filter
      }
    }
  });
}

  // ADD comment
async addComment(data) {
  return prisma.comment.create({
    data: {
      content: data.comment,

      post: {
        connect: { id: data.postId }   // ✅ FIX
      },

      author: {
        connect: { id: data.userId }   // ✅ FIX
      }
    }
  });
}
  // DELETE comment
  async deleteComment(id) {
    try {
      await prisma.comment.delete({
        where: { id: id }
      });
      return true;
    } catch {
      return false;
    }
  }

  // UPDATE comment
  async updateComment(id, data) {
    return prisma.comment.update({
      where: { id: id },
      data: {
        content: data.comment
      }
    });
  }

}

export default new InteractionRepository();

// ============================================================
//  USER FUNCTIONS
// ============================================================

// Get all users (id, username, displayName, profilePic only)
export async function getAllUsers() {
  return prisma.user.findMany({
    select: {
      id: true,
      username: true,
      displayName: true,
      profilePic: true,
      bio: true,
      createdAt: true,
    },
  });
}

// Get one user by ID with follower/following counts
export async function getUserById(id) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      username: true,
      displayName: true,
      profilePic: true,
      bio: true,
      createdAt: true,
      _count: {
        select: {
          posts: true,
          followers: true,
          following: true,
        },
      },
    },
  });
}

// Get user by email (for login)
export async function getUserByEmail(email) {
  return prisma.user.findUnique({
    where: { email },
  });
}

// Get user by username
export async function getUserByUsername(username) {
  return prisma.user.findUnique({
    where: { username },
  });
}

// Create a new user (register)
export async function createUser({ username, email, password, displayName }) {
  return prisma.user.create({
    data: { username, email, password, displayName },
  });
}

// Update user profile
export async function updateUser(id, { username, displayName, bio, profilePic }) {
  return prisma.user.update({
    where: { id },
    data: { username, displayName, bio, profilePic },
  });
}

// Search users by username or displayName
export async function searchUsers(query) {
  return prisma.user.findMany({
    where: {
      OR: [
        { username: { contains: query } },
        { displayName: { contains: query } },
      ],
    },
    select: {
      id: true,
      username: true,
      displayName: true,
      profilePic: true,
    },
  });
}

// ============================================================
//  POST FUNCTIONS
// ============================================================

// Get feed posts for a user (their posts + people they follow)
export async function getFeedPosts(userId) {
  const following = await prisma.follow.findMany({
    where: { followerId: userId },
    select: { followingId: true },
  });

  const followingIds = following.map((f) => f.followingId);
  const allowedIds = [userId, ...followingIds];

  return prisma.post.findMany({
    where: { authorId: { in: allowedIds } },
    orderBy: { createdAt: "desc" },
    include: {
      author: {
        select: { id: true, username: true, displayName: true, profilePic: true },
      },
      images: { select: { id: true, url: true } },
      _count: { select: { likes: true, comments: true } },
    },
  });
}

// Get posts by a specific user (for profile page)
export async function getPostsByUser(userId) {
  return prisma.post.findMany({
    where: { authorId: userId },
    orderBy: { createdAt: "desc" },
    include: {
      author: {
        select: { id: true, username: true, displayName: true, profilePic: true },
      },
      images: { select: { id: true, url: true } },
      _count: { select: { likes: true, comments: true } },
    },
  });
}

// Get a single post by ID
export async function getPostById(postId) {
  return prisma.post.findUnique({
    where: { id: postId },
    include: {
      author: {
        select: { id: true, username: true, displayName: true, profilePic: true },
      },
      images: { select: { id: true, url: true } },
      _count: { select: { likes: true, comments: true } },
    },
  });
}

// Create a new post (with optional images)
export async function createPost(authorId, content, imageUrls = []) {
  return prisma.post.create({
    data: {
      content,
      authorId,
      images: {
        create: imageUrls.map((url) => ({ url })),
      },
    },
    include: {
      images: true,
      _count: { select: { likes: true, comments: true } },
    },
  });
}

// Update a post's content
export async function updatePost(postId, content) {
  return prisma.post.update({
    where: { id: postId },
    data: { content },
  });
}

// Delete a post (images/likes/comments cascade)
export async function deletePost(postId) {
  return prisma.post.delete({
    where: { id: postId },
  });
}

// ============================================================
//  LIKE FUNCTIONS
// ============================================================

// Toggle like — returns { liked: true/false, likeCount }
export async function toggleLike(userId, postId) {
  const existing = await prisma.like.findUnique({
    where: { userId_postId: { userId, postId } },
  });

  if (existing) {
    await prisma.like.delete({
      where: { userId_postId: { userId, postId } },
    });
  } else {
    await prisma.like.create({
      data: { userId, postId },
    });
  }

  const likeCount = await prisma.like.count({ where: { postId } });
  return { liked: !existing, likeCount };
}

// Check if a user liked a post
export async function isLiked(userId, postId) {
  const like = await prisma.like.findUnique({
    where: { userId_postId: { userId, postId } },
  });
  return !!like;
}

// ============================================================
//  COMMENT FUNCTIONS
// ============================================================

// Get all comments for a post
export async function getCommentsByPost(postId) {
  return prisma.comment.findMany({
    where: { postId },
    orderBy: { createdAt: "asc" },
    include: {
      author: {
        select: { id: true, username: true, displayName: true, profilePic: true },
      },
    },
  });
}

// Add a comment
export async function createComment(authorId, postId, content) {
  return prisma.comment.create({
    data: { authorId, postId, content },
    include: {
      author: {
        select: { id: true, username: true, displayName: true, profilePic: true },
      },
    },
  });
}

// Edit a comment
export async function updateComment(commentId, content) {
  return prisma.comment.update({
    where: { id: commentId },
    data: { content },
  });
}

// Delete a comment
export async function deleteComment(commentId) {
  return prisma.comment.delete({
    where: { id: commentId },
  });
}

// ============================================================
//  FOLLOW FUNCTIONS
// ============================================================

// Toggle follow — returns { following: true/false }
export async function toggleFollow(followerId, followingId) {
  const existing = await prisma.follow.findUnique({
    where: { followerId_followingId: { followerId, followingId } },
  });

  if (existing) {
    await prisma.follow.delete({
      where: { followerId_followingId: { followerId, followingId } },
    });
    return { following: false };
  } else {
    await prisma.follow.create({
      data: { followerId, followingId },
    });
    return { following: true };
  }
}

// Check if user A follows user B
export async function isFollowing(followerId, followingId) {
  const follow = await prisma.follow.findUnique({
    where: { followerId_followingId: { followerId, followingId } },
  });
  return !!follow;
}

// Get all users that a user follows
export async function getFollowing(userId) {
  return prisma.follow.findMany({
    where: { followerId: userId },
    include: {
      following: {
        select: { id: true, username: true, displayName: true, profilePic: true },
      },
    },
  });
}

// Get all followers of a user
export async function getFollowers(userId) {
  return prisma.follow.findMany({
    where: { followingId: userId },
    include: {
      follower: {
        select: { id: true, username: true, displayName: true, profilePic: true },
      },
    },
  });
}

// ============================================================
//  STATISTICS FUNCTIONS (for the stats page — 40% of grade!)
// ============================================================

// 1. Average number of followers per user
export async function avgFollowersPerUser() {
  const result = await prisma.follow.groupBy({
    by: ["followingId"],
    _count: { followerId: true },
  });
  if (result.length === 0) return 0;
  const total = result.reduce((sum, r) => sum + r._count.followerId, 0);
  return (total / result.length).toFixed(2);
}

// 2. Average number of posts per user
export async function avgPostsPerUser() {
  const result = await prisma.post.groupBy({
    by: ["authorId"],
    _count: { id: true },
  });
  if (result.length === 0) return 0;
  const total = result.reduce((sum, r) => sum + r._count.id, 0);
  return (total / result.length).toFixed(2);
}

// 3. Most active user in the last 3 months (by post count)
export async function mostActiveUser() {
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  const result = await prisma.post.groupBy({
    by: ["authorId"],
    where: { createdAt: { gte: threeMonthsAgo } },
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
    take: 1,
  });

  if (result.length === 0) return null;

  const user = await prisma.user.findUnique({
    where: { id: result[0].authorId },
    select: { id: true, username: true, displayName: true, profilePic: true },
  });

  return { user, postCount: result[0]._count.id };
}

// 4. Most liked post
export async function mostLikedPost() {
  const result = await prisma.like.groupBy({
    by: ["postId"],
    _count: { userId: true },
    orderBy: { _count: { userId: "desc" } },
    take: 1,
  });

  if (result.length === 0) return null;

  const post = await prisma.post.findUnique({
    where: { id: result[0].postId },
    include: {
      author: {
        select: { id: true, username: true, displayName: true },
      },
    },
  });

  return { post, likeCount: result[0]._count.userId };
}

// 5. Total counts overview
export async function platformOverview() {
  const [userCount, postCount, likeCount, commentCount, followCount] =
    await Promise.all([
      prisma.user.count(),
      prisma.post.count(),
      prisma.like.count(),
      prisma.comment.count(),
      prisma.follow.count(),
    ]);

  return { userCount, postCount, likeCount, commentCount, followCount };
}

// 6. Top 5 most followed users
export async function topFollowedUsers() {
  const result = await prisma.follow.groupBy({
    by: ["followingId"],
    _count: { followerId: true },
    orderBy: { _count: { followerId: "desc" } },
    take: 5,
  });

  const users = await Promise.all(
    result.map(async (r) => {
      const user = await prisma.user.findUnique({
        where: { id: r.followingId },
        select: { id: true, username: true, displayName: true, profilePic: true },
      });
      return { user, followerCount: r._count.followerId };
    })
  );

  return users;
}