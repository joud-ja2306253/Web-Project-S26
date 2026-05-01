// app/auth/jwt.js
import jwt from 'jsonwebtoken'

const SECRET_KEY = process.env.JWT_SECRET_KEY

export function signJwt(user) {
  const payload = {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    username: user.username
  }
  return jwt.sign(payload, SECRET_KEY, { expiresIn: '7d' })
}

export function verifyJwt(token) {
  try {
    return jwt.verify(token, SECRET_KEY)
  } catch (error) {
    return null
  }
}