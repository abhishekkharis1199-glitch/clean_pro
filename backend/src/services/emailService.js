import nodemailer from 'nodemailer'

function createTransport() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
    return null
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE || 'false') === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  })
}

export async function sendPasswordResetEmail(email, resetUrl) {
  const transport = createTransport()

  if (!transport) {
    return false
  }

  await transport.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: email,
    subject: 'Reset your CleanPro password',
    text: `Reset your CleanPro password using this link: ${resetUrl}\n\nThis link expires in 30 minutes.`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;padding:24px">
        <h2>Reset your CleanPro password</h2>
        <p>We received a request to reset your password.</p>
        <p><a href="${resetUrl}" style="display:inline-block;padding:12px 18px;background:#187653;color:white;text-decoration:none;border-radius:8px">Reset password</a></p>
        <p>This link expires in 30 minutes.</p>
        <p>If you did not request this change, ignore this email.</p>
      </div>
    `,
  })

  return true
}
