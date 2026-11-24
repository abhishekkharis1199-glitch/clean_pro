import jwt from 'jsonwebtoken'

export function requireAuth(req, res, next) {
  const authorization = req.headers.authorization

  if (!authorization?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication required' })
  }

  try {
    const payload = jwt.verify(
      authorization.slice(7),
      process.env.JWT_ACCESS_SECRET,
    )

    req.user = {
      id: payload.sub,
      role: payload.role,
    }

    next()
  } catch {
    res.status(401).json({ message: 'Invalid or expired access token' })
  }
}
