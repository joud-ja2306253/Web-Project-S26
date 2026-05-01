// app/api/auth/register/route.js
import prisma from '../../../lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

console.log("✅ Register API route loaded")  // ← ADD THIS LINE

export async function POST(request) {
  const { firstName, lastName, username, email, password } = await request.json()

  // Validation (matches your frontend)
  if (!firstName || !lastName || !username || !email || !password) {
    return Response.json({ error: 'Please fill all fields' }, { status: 400 })
  }

  // Check if email already exists (matches your allUsers.find logic)
  const existingEmail = await prisma.user.findUnique({
    where: { email: email.toLowerCase() }
  })

  if (existingEmail) {
    return Response.json({ error: 'An account with this email already exists' }, { status: 400 })
  }

  // Check if username already exists
  const existingUsername = await prisma.user.findUnique({
    where: { username: username.toLowerCase() }
  })

  if (existingUsername) {
    return Response.json({ error: 'Username already taken' }, { status: 400 })
  }

  // Generate ID (matches your generateId function)
  const generateId = () => {
    return Date.now() + '-' + Math.random().toString(36).substr(2, 6)
  }

  // Hash password (SECURITY - not plain text like your original)
  const hashedPassword = await bcrypt.hash(password, 10)

  // Create user (matches your newUser object)
  const newUser = await prisma.user.create({
    data: {
      id: generateId(),
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password: hashedPassword,  // ← HASHED, not plain text!
      displayName: `${firstName} ${lastName}`,
      bio: '',
      profilePic: 'https://i.pinimg.com/1200x/28/16/5a/28165aaca2ee560b4a6b760765efe976.jpg',
      createdAt: new Date().toISOString()
    }
  })

  // Create JWT token
  const token = jwt.sign(
    { id: newUser.id, email: newUser.email, displayName: newUser.displayName },
    process.env.JWT_SECRET_KEY,
    { expiresIn: '7d' }
  )

  // Set cookie
  cookies().set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7
  })

  const { password: _, ...userWithoutPassword } = newUser

  return Response.json({ 
    success: true, 
    user: userWithoutPassword,
    userId: newUser.id
  })
}