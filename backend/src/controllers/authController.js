import bcrypt from 'bcryptjs'
import crypto from 'node:crypto'
import { pool } from '../config/database.js'
import {
  createAccessToken,
  createRefreshToken,
  hashRefreshToken,
  refreshExpiry,
} from '../utils/tokens.js'
import { sendPasswordResetEmail } from '../services/emailService.js'

function publicUser(row) {
  return {
    id: row.id || row.user_id,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    role: row.role,
  }
}

export async function signup(req, res, next) {
  const client = await pool.connect()

  try {
    const { firstName, lastName, dateOfBirth, email, password, role, phone, provider } = req.validatedBody

    if (role === 'provider' && !provider) {
      // General signup creates the provider account now.
      // Detailed provider-profile fields are collected in the provider wizard.
    }

    await client.query('BEGIN')

    const existing = await client.query(
      'SELECT id FROM cleanpro.users WHERE email = $1',
      [email.toLowerCase()],
    )

    if (existing.rowCount > 0) {
      await client.query('ROLLBACK')
      return res.status(409).json({ message: 'An account with this email already exists' })
    }

    const passwordHash = await bcrypt.hash(password, 12)

    const created = await client.query(
      `INSERT INTO cleanpro.users
       (first_name, last_name, email, phone_e164, password_hash, role, date_of_birth)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, first_name, last_name, email, role`,
      [firstName, lastName, email, phone || null, passwordHash, role, dateOfBirth],
    )

    const user = created.rows[0]

    if (role === 'provider' && provider) {
      await client.query(
        `INSERT INTO cleanpro.provider_profiles
         (user_id, business_name, service_category, custom_service_category, team_size)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          user.id,
          provider.businessName,
          provider.serviceCategory,
          provider.customServiceCategory || null,
          provider.teamSize || null,
        ],
      )
    }

    const accessToken = createAccessToken(user)
    const refreshToken = createRefreshToken()

    await client.query(
      `INSERT INTO cleanpro.refresh_sessions
       (user_id, token_hash, expires_at)
       VALUES ($1, $2, $3)`,
      [user.id, hashRefreshToken(refreshToken), refreshExpiry()],
    )

    await client.query('COMMIT')

    res.status(201).json({
      message: 'Account created successfully',
      user: publicUser(user),
      accessToken,
      refreshToken,
    })
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {})

    if (error?.code === '23505') {
      return res.status(409).json({ message: 'An account with this email or phone already exists' })
    }

    next(error)
  } finally {
    client.release()
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.validatedBody

    const result = await pool.query(
      `SELECT id, first_name, last_name, email, password_hash, role, is_active
       FROM cleanpro.users
       WHERE email = $1`,
      [email],
    )

    if (result.rowCount === 0) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const user = result.rows[0]

    if (!user.is_active) {
      return res.status(403).json({ message: 'This account is disabled' })
    }

    const passwordMatches = await bcrypt.compare(password, user.password_hash)

    if (!passwordMatches) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const accessToken = createAccessToken(user)
    const refreshToken = createRefreshToken()

    await pool.query(
      `INSERT INTO cleanpro.refresh_sessions
       (user_id, token_hash, expires_at)
       VALUES ($1, $2, $3)`,
      [user.id, hashRefreshToken(refreshToken), refreshExpiry()],
    )

    res.json({
      message: 'Signed in successfully',
      user: publicUser(user),
      accessToken,
      refreshToken,
    })
  } catch (error) {
    next(error)
  }
}

export async function refresh(req, res, next) {
  try {
    const refreshToken = req.body?.refreshToken

    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token is required' })
    }

    const tokenHash = hashRefreshToken(refreshToken)

    const result = await pool.query(
      `SELECT s.id AS session_id, s.user_id, s.expires_at,
              u.first_name, u.last_name, u.email, u.role, u.is_active
       FROM cleanpro.refresh_sessions s
       JOIN cleanpro.users u ON u.id = s.user_id
       WHERE s.token_hash = $1
         AND s.revoked_at IS NULL
         AND s.expires_at > now()`,
      [tokenHash],
    )

    if (result.rowCount === 0) {
      return res.status(401).json({ message: 'Invalid or expired refresh token' })
    }

    const session = result.rows[0]

    if (!session.is_active) {
      return res.status(403).json({ message: 'This account is disabled' })
    }

    await pool.query(
      'UPDATE cleanpro.refresh_sessions SET revoked_at = now() WHERE id = $1',
      [session.session_id],
    )

    const user = {
      id: session.user_id,
      role: session.role,
      first_name: session.first_name,
      last_name: session.last_name,
      email: session.email,
    }

    const newRefreshToken = createRefreshToken()

    await pool.query(
      `INSERT INTO cleanpro.refresh_sessions
       (user_id, token_hash, expires_at)
       VALUES ($1, $2, $3)`,
      [user.id, hashRefreshToken(newRefreshToken), refreshExpiry()],
    )

    res.json({
      accessToken: createAccessToken(user),
      refreshToken: newRefreshToken,
      user: publicUser(user),
    })
  } catch (error) {
    next(error)
  }
}

export async function logout(req, res, next) {
  try {
    const refreshToken = req.body?.refreshToken

    if (refreshToken) {
      await pool.query(
        `UPDATE cleanpro.refresh_sessions
         SET revoked_at = now()
         WHERE token_hash = $1 AND revoked_at IS NULL`,
        [hashRefreshToken(refreshToken)],
      )
    }

    res.json({ message: 'Signed out successfully' })
  } catch (error) {
    next(error)
  }
}

export async function me(req, res, next) {
  try {
    const result = await pool.query(
      `SELECT id, first_name, last_name, email, role
       FROM cleanpro.users
       WHERE id = $1 AND is_active = TRUE`,
      [req.user.id],
    )

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json({ user: publicUser(result.rows[0]) })
  } catch (error) {
    next(error)
  }
}

export async function sendLoginOtp(req, res, next) {
  try {
    const { destination, channel } = req.validatedBody
    const column = channel === 'email' ? 'email' : 'phone_e164'

    const result = await pool.query(
      `SELECT id, first_name, last_name, email, role
       FROM cleanpro.users
       WHERE ${column} = $1 AND is_active = TRUE`,
      [destination],
    )

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'No active account found for this destination' })
    }

    const code = '123456'
    const codeMac = crypto.createHash('sha256').update(code).digest()

    await pool.query(
      `INSERT INTO cleanpro.verification_challenges
       (user_id, channel, purpose, destination, code_mac, expires_at)
       VALUES ($1, $2, 'account_verification', $3, $4, now() + interval '10 minutes')`,
      [result.rows[0].id, channel, destination, codeMac],
    )

    res.json({
      message: 'OTP sent',
      demoCode: process.env.NODE_ENV === 'production' ? undefined : code,
    })
  } catch (error) {
    next(error)
  }
}

export async function loginOtp(req, res, next) {
  try {
    const { destination, channel, code } = req.validatedBody
    const codeMac = crypto.createHash('sha256').update(code).digest()

    const challenge = await pool.query(
      `SELECT vc.id, vc.user_id, vc.attempt_count,
              u.first_name, u.last_name, u.email, u.role, u.is_active
       FROM cleanpro.verification_challenges vc
       JOIN cleanpro.users u ON u.id = vc.user_id
       WHERE vc.destination = $1
         AND vc.channel = $2
         AND vc.verified_at IS NULL
         AND vc.expires_at > now()
         AND vc.code_mac = $3
       ORDER BY vc.created_at DESC
       LIMIT 1`,
      [destination, channel, codeMac],
    )

    if (challenge.rowCount === 0) {
      return res.status(401).json({ message: 'Invalid or expired OTP' })
    }

    const user = challenge.rows[0]

    if (!user.is_active) {
      return res.status(403).json({ message: 'This account is disabled' })
    }

    await pool.query(
      'UPDATE cleanpro.verification_challenges SET verified_at = now() WHERE id = $1',
      [challenge.rows[0].id],
    )

    const accessToken = createAccessToken(user)
    const refreshToken = createRefreshToken()

    await pool.query(
      `INSERT INTO cleanpro.refresh_sessions (user_id, token_hash, expires_at)
       VALUES ($1, $2, $3)`,
      [user.user_id, hashRefreshToken(refreshToken), refreshExpiry()],
    )

    res.json({
      message: 'Signed in successfully',
      user: publicUser(user),
      accessToken,
      refreshToken,
    })
  } catch (error) {
    next(error)
  }
}

export async function sendPasswordResetOtp(req, res, next) {
  try {
    const { email } = req.validatedBody

    const result = await pool.query(
      `SELECT id, first_name, last_name, email
       FROM cleanpro.users
       WHERE email = $1 AND is_active = TRUE`,
      [email],
    )

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'No active account found with this email' })
    }

    const user = result.rows[0]

    const code = '123456'
    const codeMac = crypto.createHash('sha256').update(code).digest()

    await pool.query(
      `INSERT INTO cleanpro.verification_challenges
       (user_id, channel, purpose, destination, code_mac, expires_at)
       VALUES ($1, 'email', 'password_reset', $2, $3, now() + interval '10 minutes')`,
      [user.id, email, codeMac],
    )

    await sendPasswordResetEmail(user.email, code)

    res.json({
      message: 'Password reset OTP sent',
      demoCode: process.env.NODE_ENV === 'production' ? undefined : code,
    })
  } catch (error) {
    next(error)
  }
}

export async function forgotPassword(req, res, next) {
  try {
    const { email } = req.validatedBody

    const result = await pool.query(
      `SELECT id, email FROM cleanpro.users
       WHERE email = $1 AND is_active = TRUE`,
      [email],
    )

    let resetUrl

    if (result.rowCount > 0) {
      const user = result.rows[0]
      const token = crypto.randomBytes(32).toString('base64url')
      const tokenHash = crypto.createHash('sha256').update(token).digest()

      await pool.query(
        `INSERT INTO cleanpro.verification_challenges
         (user_id, channel, purpose, destination, code_mac, expires_at)
         VALUES ($1, 'email', 'password_reset', $2, $3, now() + interval '30 minutes')`,
        [user.id, user.email, tokenHash],
      )

      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'
      resetUrl = `${frontendUrl}/reset-password?token=${encodeURIComponent(token)}`

      const emailSent = await sendPasswordResetEmail(user.email, resetUrl)

      if (!emailSent && process.env.NODE_ENV !== 'production') {
        console.log(`Password reset link for ${user.email}: ${resetUrl}`)
      }
    }

    res.json({
      message: 'If an account exists for this email, a password reset link has been sent.',
      resetUrl: process.env.NODE_ENV !== 'production' ? resetUrl : undefined,
    })
  } catch (error) {
    next(error)
  }
}

export async function resetPassword(req, res, next) {
  const client = await pool.connect()

  try {
    const { token, password } = req.validatedBody
    const tokenHash = crypto.createHash('sha256').update(token).digest()

    await client.query('BEGIN')

    const result = await client.query(
      `SELECT id, user_id
       FROM cleanpro.verification_challenges
       WHERE code_mac = $1
         AND purpose = 'password_reset'
         AND channel = 'email'
         AND verified_at IS NULL
         AND expires_at > now()
       ORDER BY created_at DESC
       LIMIT 1`,
      [tokenHash],
    )

    if (result.rowCount === 0) {
      await client.query('ROLLBACK')
      return res.status(400).json({ message: 'This password reset link is invalid or has expired.' })
    }

    const passwordHash = await bcrypt.hash(password, 12)

    await client.query(
      'UPDATE cleanpro.users SET password_hash = $1, updated_at = now() WHERE id = $2',
      [passwordHash, result.rows[0].user_id],
    )

    await client.query(
      `UPDATE cleanpro.verification_challenges
       SET verified_at = now()
       WHERE purpose = 'password_reset'
         AND user_id = $1
         AND verified_at IS NULL`,
      [result.rows[0].user_id],
    )

    await client.query(
      `UPDATE cleanpro.refresh_sessions
       SET revoked_at = now()
       WHERE user_id = $1 AND revoked_at IS NULL`,
      [result.rows[0].user_id],
    )

    await client.query('COMMIT')

    res.json({ message: 'Password reset successfully. Please sign in.' })
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {})
    next(error)
  } finally {
    client.release()
  }
}
