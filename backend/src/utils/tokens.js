import crypto from 'node:crypto'
import jwt from 'jsonwebtoken'

export function createAccessToken(user) {
  return jwt.sign(
    { role: user.role },
    process.env.JWT_ACCESS_SECRET,
    { subject: user.id, expiresIn: process.env.JWT_ACCESS_TTL || '15m' },
  )
}

export function createRefreshToken() {
  return crypto.randomBytes(48).toString('base64url')
}

export function hashRefreshToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex')
}

export function refreshExpiry() {
  const days = Number(process.env.JWT_REFRESH_TTL_DAYS || 30)
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000)
}
