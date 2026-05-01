// app/api/auth/login/route.js
import prisma from '../../../lib/prisma'
import bcrypt from 'bcryptjs'
import { signJwt } from '../../../lib/jwt'  
import { cookies } from 'next/headers'

export async function POST(request) {
  const { email, password } = await request.json()

  // Find user by email (matches your matchedUser logic)
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() }
  })

  // No account found (matches your error message)
  if (!user) {
    return Response.json({ error: 'No account found with this email!' }, { status: 401 })
  }

  // Compare password (matches your password check, but with hashing)
  const isValid = await bcrypt.compare(password, user.password)

  if (!isValid) {
    return Response.json({ error: 'Invalid password!' }, { status: 401 })
  }

  // Create JWT token
 const token = signJwt({ id: user.id, email: user.email, displayName: user.displayName })

  // Set cookie
  cookies().set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7
  })

  const { password: _, ...userWithoutPassword } = user

  return Response.json({ 
    success: true, 
    user: userWithoutPassword,
    userId: user.id
  })
}