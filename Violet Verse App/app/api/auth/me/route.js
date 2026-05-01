// app/api/auth/me/route.js
import { cookies } from 'next/headers'
import { verifyJwt } from '../../../lib/jwt'
import prisma from '../../../lib/prisma'

export async function GET() {
  const token = cookies().get('token')?.value
  if (!token) {
    return Response.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const decoded = verifyJwt(token)
  if (!decoded) {
    return Response.json({ error: 'Invalid token' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
    select: { id: true, username: true, email: true, displayName: true, bio: true, profilePic: true }
  })

  return Response.json(user)
}