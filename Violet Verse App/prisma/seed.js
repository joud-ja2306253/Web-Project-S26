//most important line:

// for (const item of items) {
//             await model.create({ data: item });
//         }

import { createRequire } from "module";
const require = createRequire(import.meta.url);
require("dotenv").config({ path: new URL("../.env", import.meta.url).pathname });

// prisma/seed.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ============================================================
  //  CLEAR EXISTING DATA (order matters due to foreign keys)
  // ============================================================
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.image.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  // ============================================================
  //  USERS
  // ============================================================
  const users = await Promise.all([
    prisma.user.create({
      data: {
        username: "sara_m",
        displayName: "Sara Mohammed",
        email: "sara@example.com",
        password: "password123",
        bio: "Coffee lover ☕ | Photography enthusiast",
        profilePic: "https://i.pravatar.cc/150?img=1",
      },
    }),
    prisma.user.create({
      data: {
        username: "joud_k",
        displayName: "Joud Khalid",
        email: "joud@example.com",
        password: "password123",
        bio: "Developer & designer 🎨",
        profilePic: "https://i.pravatar.cc/150?img=2",
      },
    }),
    prisma.user.create({
      data: {
        username: "randa_a",
        displayName: "Randa Ali",
        email: "randa@example.com",
        password: "password123",
        bio: "Travel & food 🌍",
        profilePic: "https://i.pravatar.cc/150?img=3",
      },
    }),
    prisma.user.create({
      data: {
        username: "noor_h",
        displayName: "Noor Hassan",
        email: "noor@example.com",
        password: "password123",
        bio: "Music is life 🎵",
        profilePic: "https://i.pravatar.cc/150?img=4",
      },
    }),
    prisma.user.create({
      data: {
        username: "lina_s",
        displayName: "Lina Salem",
        email: "lina@example.com",
        password: "password123",
        bio: "Books & tea 📚",
        profilePic: "https://i.pravatar.cc/150?img=5",
      },
    }),
    prisma.user.create({
      data: {
        username: "maya_r",
        displayName: "Maya Rashid",
        email: "maya@example.com",
        password: "password123",
        bio: "Fitness & wellness 💪",
        profilePic: "https://i.pravatar.cc/150?img=6",
      },
    }),
    prisma.user.create({
      data: {
        username: "dana_f",
        displayName: "Dana Faris",
        email: "dana@example.com",
        password: "password123",
        bio: "Art & creativity ✨",
        profilePic: "https://i.pravatar.cc/150?img=7",
      },
    }),
    prisma.user.create({
      data: {
        username: "hana_q",
        displayName: "Hana Qasim",
        email: "hana@example.com",
        password: "password123",
        bio: "Nature & photography 🌿",
        profilePic: "https://i.pravatar.cc/150?img=8",
      },
    }),
  ]);

  const [sara, joud, randa, noor, lina, maya, dana, hana] = users;
  console.log("✅ Users created");

  // ============================================================
  //  FOLLOWS
  // ============================================================
  const followPairs = [
    [joud, sara],   // joud follows sara
    [randa, sara],  // randa follows sara
    [noor, sara],   // noor follows sara
    [lina, sara],   // lina follows sara
    [maya, sara],   // maya follows sara — sara is most followed
    [sara, joud],
    [randa, joud],
    [noor, joud],
    [lina, joud],
    [sara, randa],
    [joud, randa],
    [sara, noor],
    [joud, noor],
    [randa, noor],
    [sara, lina],
    [joud, maya],
    [sara, dana],
    [joud, hana],
  ];

  await Promise.all(
    followPairs.map(([follower, following]) =>
      prisma.follow.create({
        data: { followerId: follower.id, followingId: following.id },
      })
    )
  );
  console.log("✅ Follows created");

  // ============================================================
  //  POSTS  (spread across last 4 months for stats)
  // ============================================================
  const now = new Date();
  const daysAgo = (d) => new Date(now - d * 86400000);

  const posts = await Promise.all([
    // Sara — most active (6 posts)
    prisma.post.create({ data: { content: "Good morning everyone! ☀️", authorId: sara.id, createdAt: daysAgo(5) } }),
    prisma.post.create({ data: { content: "Just finished my workout 💪", authorId: sara.id, createdAt: daysAgo(20) } }),
    prisma.post.create({ data: { content: "Loving this weather today 🌤️", authorId: sara.id, createdAt: daysAgo(35) } }),
    prisma.post.create({ data: { content: "New recipe I tried — so good!", authorId: sara.id, createdAt: daysAgo(50) } }),
    prisma.post.create({ data: { content: "Book recommendation: Atomic Habits 📖", authorId: sara.id, createdAt: daysAgo(70) } }),
    prisma.post.create({ data: { content: "Happy Friday everyone! 🎉", authorId: sara.id, createdAt: daysAgo(10) } }),

    // Joud — 4 posts
    prisma.post.create({ data: { content: "Just deployed my new project 🚀", authorId: joud.id, createdAt: daysAgo(3) } }),
    prisma.post.create({ data: { content: "CSS is an art form 🎨", authorId: joud.id, createdAt: daysAgo(15) } }),
    prisma.post.create({ data: { content: "Dark mode forever 🌙", authorId: joud.id, createdAt: daysAgo(40) } }),
    prisma.post.create({ data: { content: "Learning something new every day!", authorId: joud.id, createdAt: daysAgo(60) } }),

    // Randa — 3 posts
    prisma.post.create({ data: { content: "Just landed in Istanbul ✈️", authorId: randa.id, createdAt: daysAgo(8) } }),
    prisma.post.create({ data: { content: "Best shawarma I ever had 🌯", authorId: randa.id, createdAt: daysAgo(25) } }),
    prisma.post.create({ data: { content: "Travel is the best education 🌍", authorId: randa.id, createdAt: daysAgo(80) } }),

    // Noor — 3 posts
    prisma.post.create({ data: { content: "New playlist dropping soon 🎵", authorId: noor.id, createdAt: daysAgo(12) } }),
    prisma.post.create({ data: { content: "Concert was AMAZING last night 🎶", authorId: noor.id, createdAt: daysAgo(30) } }),
    prisma.post.create({ data: { content: "Music heals everything 🎧", authorId: noor.id, createdAt: daysAgo(55) } }),

    // Lina — 2 posts
    prisma.post.create({ data: { content: "Currently reading: The Alchemist ✨", authorId: lina.id, createdAt: daysAgo(18) } }),
    prisma.post.create({ data: { content: "Rainy day + tea + book = perfect 🍵", authorId: lina.id, createdAt: daysAgo(45) } }),

    // Maya — 2 posts
    prisma.post.create({ data: { content: "5am workout hits different 🌅", authorId: maya.id, createdAt: daysAgo(6) } }),
    prisma.post.create({ data: { content: "Meal prep Sunday 🥗", authorId: maya.id, createdAt: daysAgo(22) } }),

    // Dana — 1 post
    prisma.post.create({ data: { content: "New painting finished! So happy 🎨", authorId: dana.id, createdAt: daysAgo(14) } }),

    // Hana — 1 post
    prisma.post.create({ data: { content: "Morning hike views 🌿", authorId: hana.id, createdAt: daysAgo(9) } }),
  ]);

  console.log("✅ Posts created");

  // ============================================================
  //  LIKES  (sara's first post gets the most — most liked post)
  // ============================================================
  const saraPost1 = posts[0]; // "Good morning everyone"
  const joudPost1 = posts[6]; // "Just deployed"

  const likePairs = [
    // Sara post 1 — most liked (6 likes)
    [joud, saraPost1], [randa, saraPost1], [noor, saraPost1],
    [lina, saraPost1], [maya, saraPost1], [dana, saraPost1],

    // Joud post 1 — 3 likes
    [sara, joudPost1], [randa, joudPost1], [noor, joudPost1],

    // Spread likes across other posts
    [joud, posts[1]], [randa, posts[2]],
    [sara, posts[10]], [joud, posts[10]],
    [sara, posts[13]], [randa, posts[13]],
    [noor, posts[16]], [sara, posts[18]],
    [joud, posts[20]], [sara, posts[21]],
  ];

  await Promise.all(
    likePairs.map(([user, post]) =>
      prisma.like.create({
        data: { userId: user.id, postId: post.id },
      })
    )
  );
  console.log("✅ Likes created");

  // ============================================================
  //  COMMENTS
  // ============================================================
  const commentData = [
    { authorId: joud.id,  postId: saraPost1.id, content: "Good morning! 😊" },
    { authorId: randa.id, postId: saraPost1.id, content: "Have a great day! ☀️" },
    { authorId: noor.id,  postId: saraPost1.id, content: "Morning! 🌸" },
    { authorId: sara.id,  postId: joudPost1.id, content: "Congrats! 🎉" },
    { authorId: randa.id, postId: joudPost1.id, content: "That's amazing! 🚀" },
    { authorId: lina.id,  postId: posts[7].id,  content: "CSS is pain and beauty 😂" },
    { authorId: sara.id,  postId: posts[10].id, content: "So jealous! 😍" },
    { authorId: joud.id,  postId: posts[10].id, content: "Enjoy Istanbul! 🕌" },
    { authorId: sara.id,  postId: posts[13].id, content: "Can't wait to hear it! 🎵" },
    { authorId: maya.id,  postId: posts[16].id, content: "Great book choice! 📚" },
  ];

  await Promise.all(
    commentData.map((c) => prisma.comment.create({ data: c }))
  );
  console.log("✅ Comments created");

  console.log("🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });