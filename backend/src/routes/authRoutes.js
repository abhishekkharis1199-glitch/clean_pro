import { Router } from 'express'
import { z } from 'zod'
import {
  login,
  loginOtp,
  logout,
  me,
  refresh,
  sendLoginOtp,
  signup,
  forgotPassword,
  resetPassword,
} from '../controllers/authController.js'
import { requireAuth } from '../middleware/auth.js'

export const authRoutes = Router()

const signupSchema = z.object({
  firstName: z.string().trim().min(1).max(100),
  lastName: z.string().trim().min(1).max(100),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().min(8).max(18),
  password: z.string().min(8).max(72),
  confirmPassword: z.string().min(8).max(72),
  role: z.enum(['customer', 'provider']).default('customer'),
  provider: z.object({
    businessName: z.string().trim().min(1).max(200),
    serviceCategory: z.string().trim().min(1).max(100),
    customServiceCategory: z.string().trim().max(200).optional(),
    teamSize: z.coerce.number().int().min(1).max(500).optional(),
  }).optional(),
}).refine((value) => value.password === value.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
})

const sendOtpSchema = z.object({
  destination: z.string().trim().min(3),
  channel: z.enum(['email', 'phone']),
})

const loginOtpSchema = z.object({
  destination: z.string().trim().min(3),
  channel: z.enum(['email', 'phone']),
  code: z.string().regex(/^\d{6}$/),
})

const forgotPasswordSchema = z.object({
  email: z.string().trim().email().max(254),
})

const resetPasswordSchema = z.object({
  token: z.string().trim().min(32),
  password: z.string().min(8).max(72),
  confirmPassword: z.string().min(8).max(72),
}).refine((value) => value.password === value.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body)

    if (!result.success) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: result.error.flatten().fieldErrors,
      })
    }

    req.validatedBody = result.data
    next()
  }
}

authRoutes.post('/signup', validate(signupSchema), signup)
authRoutes.post('/login', validate(loginSchema), login)
authRoutes.post('/login/otp/send', validate(sendOtpSchema), sendLoginOtp)
authRoutes.post('/login/otp/verify', validate(loginOtpSchema), loginOtp)
authRoutes.post('/refresh', refresh)
authRoutes.post('/logout', logout)
authRoutes.get('/me', requireAuth, me)
authRoutes.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword)
authRoutes.post('/reset-password', validate(resetPasswordSchema), resetPassword)
