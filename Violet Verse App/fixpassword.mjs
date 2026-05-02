import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const hashed = await bcrypt.hash("password123", 10);
await prisma.user.updateMany({ data: { password: hashed } });
console.log("Done! All passwords are now: password123");
await prisma.$disconnect();