import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login, loginOtp, saveSession, sendLoginOtp } from '../services/authApi'

export default function LoginPage() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [formMessage, setFormMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [loginMethod, setLoginMethod] = useState<'password' | 'emailOtp' | 'phoneOtp'>('password')
  const [otpDestination, setOtpDestination] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [otpSent, setOtpSent] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormMessage('')

    const form = new FormData(event.currentTarget)

    try {
      setIsLoading(true)
      let response

      if (loginMethod === 'password') {
        response = await login({
          email: String(form.get('username') || ''),
          password: String(form.get('password') || ''),
        })
      } else {
        response = await loginOtp({
          destination: otpDestination,
          channel: loginMethod === 'emailOtp' ? 'email' : 'phone',
          code: otpCode,
        })
      }

      saveSession(response)

      if (response.user.role === 'admin') navigate('/admin')
      else if (response.user.role === 'provider') navigate('/provider')
      else navigate('/')
    } catch (error) {
      setFormMessage(error instanceof Error ? error.message : 'Sign-in failed')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSendOtp() {
    setFormMessage('')

    try {
      setIsLoading(true)
      const result = await sendLoginOtp({
        destination: otpDestination,
        channel: loginMethod === 'emailOtp' ? 'email' : 'phone',
      })

      setOtpSent(true)
      setFormMessage(result.demoCode ? `OTP sent. Demo code: ${result.demoCode}` : 'OTP sent successfully.')
    } catch (error) {
      setFormMessage(error instanceof Error ? error.message : 'Failed to send OTP')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="customer-signup-page">
      <section className="customer-signup-card" aria-label="Sign in to CleanHome">
        <div className="customer-signup-visual">
          <img
            src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&h=1500&q=85"
            alt="A calm, sunlit living room ready to feel like home"
          />
          <div className="customer-signup-visual-overlay" />
          <div className="customer-signup-visual-copy">
            <span className="customer-signup-eyebrow">WELCOME BACK TO CLEANHOME</span>
            <h1>Come home<br />to a little more calm.</h1>
            <p>Your trusted home professionals are just a few clicks away.</p>
            <div className="customer-signup-trust">
              <span aria-hidden="true">✓</span>
              Pick up where you left off
            </div>
          </div>
        </div>

        <div className="customer-signup-form-panel">
          <div className="customer-signup-heading">
            <span className="customer-signup-eyebrow">YOUR HOME, IN GOOD HANDS</span>
            <h2>Sign in</h2>
            <p>Access your bookings and manage your home services.</p>
            <span className="customer-signup-login">
              New to CleanHome? <Link to="/register">Create an account</Link>
            </span>
          </div>

          <form className="customer-signup-form customer-login-form" onSubmit={handleSubmit}>
            {formMessage && <p className="customer-login-message" role="status">{formMessage}</p>}

            <div className="login-method-tabs" role="tablist" aria-label="Sign-in method">
              <button type="button" className={loginMethod === 'password' ? 'is-active' : ''} onClick={() => { setLoginMethod('password'); setOtpSent(false); setFormMessage('') }}>Email & password</button>
              <button type="button" className={loginMethod === 'emailOtp' ? 'is-active' : ''} onClick={() => { setLoginMethod('emailOtp'); setOtpSent(false); setFormMessage('') }}>Email OTP</button>
              <button type="button" className={loginMethod === 'phoneOtp' ? 'is-active' : ''} onClick={() => { setLoginMethod('phoneOtp'); setOtpSent(false); setFormMessage('') }}>Mobile OTP</button>
            </div>

            {loginMethod === 'password' ? (
              <>
                <label>Email address
                  <input type="email" name="username" placeholder="you@example.com" autoComplete="username" required />
                </label>
                <label>Password
                  <span className="customer-signup-password">
                    <input type={showPassword ? 'text' : 'password'} name="password" placeholder="Enter your password" autoComplete="current-password" required />
                    <button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((open) => !open)}>◎</button>
                  </span>
                </label>
              </>
            ) : (
              <>
                <label>{loginMethod === 'emailOtp' ? 'Email address' : 'Mobile number'}
                  <input
                    type={loginMethod === 'emailOtp' ? 'email' : 'tel'}
                    value={otpDestination}
                    onChange={(event) => { setOtpDestination(event.target.value); setOtpSent(false) }}
                    placeholder={loginMethod === 'emailOtp' ? 'you@example.com' : '+91 98765 43210'}
                    required
                  />
                </label>
                <button type="button" className="otp-send-btn" onClick={handleSendOtp} disabled={isLoading || !otpDestination}>
                  {otpSent ? 'Resend OTP' : 'Send OTP'}
                </button>
                {otpSent && (
                  <label>6-digit OTP
                    <input inputMode="numeric" maxLength={6} value={otpCode} onChange={(event) => setOtpCode(event.target.value.replace(/\D/g, ''))} placeholder="Enter 123456" required />
                  </label>
                )}
              </>
            )}

            {loginMethod === 'password' && (
              <button className="customer-login-forgot" type="button" onClick={() => navigate('/forgot-password')}>Forgot password?</button>
            )}
            <button className="customer-signup-submit" type="submit" disabled={isLoading || (loginMethod !== 'password' && (!otpSent || otpCode.length !== 6))}>
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="customer-signup-divider"><span>Or sign in with</span></div>
          <div className="customer-signup-socials">
            <button type="button" disabled title="Social sign-in is not available in this demo">
              <strong className="customer-signup-google-mark" aria-hidden="true">G</strong>
              Google <small>Coming soon</small>
            </button>
            <button type="button" disabled title="Social sign-in is not available in this demo">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M16.4 12.8c0-2 1.6-3 1.7-3.1a3.7 3.7 0 0 0-2.9-1.6c-1.2-.1-2.4.7-3 .7-.7 0-1.7-.7-2.7-.6a4 4 0 0 0-3.3 2c-1.4 2.4-.4 6 1 8 .7 1 1.5 2 2.5 2s1.3-.6 2.5-.6 1.6.6 2.6.6 1.7-.9 2.4-2a9 9 0 0 0 1.1-2.3 3.5 3.5 0 0 1-1.9-3.1ZM14.4 6.8a3.6 3.6 0 0 0 .8-2.6 3.7 3.7 0 0 0-2.4 1.2 3.5 3.5 0 0 0-.8 2.5 3.1 3.1 0 0 0 2.4-1.1Z" fill="currentColor" />
              </svg>
              Apple <small>Coming soon</small>
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}
