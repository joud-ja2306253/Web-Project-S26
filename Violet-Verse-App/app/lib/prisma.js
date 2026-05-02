// app/lib/prisma.js 
//reuse a single database connection across your entire app
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
export default prisma