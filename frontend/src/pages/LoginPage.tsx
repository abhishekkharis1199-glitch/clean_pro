import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [formMessage, setFormMessage] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormMessage('Sign-in is a demo flow and is not connected to an account service yet.')
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
            <label>
              Email or username
              <input
                type="text"
                name="username"
                placeholder="you@example.com"
                autoComplete="username"
                required
              />
            </label>
            <label>
              Password
              <span className="customer-signup-password">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword((show) => !show)}
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M3 3l18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.9 5.2A10.7 10.7 0 0 1 12 5c5.4 0 9 5 9 7a8.6 8.6 0 0 1-2.2 3.2M6.2 6.2C3.9 7.6 3 10.2 3 12c0 2 3.6 7 9 7a9.7 9.7 0 0 0 3.1-.5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M3 12s3.2-7 9-7 9 7 9 7-3.2 7-9 7-9-7-9-7Z" fill="none" stroke="currentColor" strokeWidth="1.7" />
                      <circle cx="12" cy="12" r="2.5" fill="none" stroke="currentColor" strokeWidth="1.7" />
                    </svg>
                  )}
                </button>
              </span>
            </label>
            <button
              className="customer-login-forgot"
              type="button"
              onClick={() => setFormMessage('Password reset is not available in this demo yet.')}
            >
              Forgot password?
            </button>
            <button className="customer-signup-submit" type="submit">Sign in</button>
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
