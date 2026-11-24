import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { forgotPassword } from '../services/authApi'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [resetUrl, setResetUrl] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setMessage('')
    setResetUrl('')

    try {
      setIsLoading(true)
      const response = await forgotPassword(email)
      setMessage(response.message)
      setResetUrl(response.resetUrl || '')
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Could not send the reset link')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="customer-signup-page">
      <section className="customer-signup-card" aria-label="Forgot password">
        <div className="customer-signup-visual">
          <img src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&h=1500&q=85" alt="A calm welcoming home" />
          <div className="customer-signup-visual-overlay" />
          <div className="customer-signup-visual-copy">
            <span className="customer-signup-eyebrow">ACCOUNT RECOVERY</span>
            <h1>Let's get you<br />back home.</h1>
            <p>Request a secure link to reset your CleanPro password.</p>
          </div>
        </div>
        <div className="customer-signup-form-panel">
          <div className="customer-signup-heading">
            <span className="customer-signup-eyebrow">FORGOT PASSWORD</span>
            <h2>Reset your password</h2>
            <p>Enter your registered email address.</p>
          </div>
          <form className="customer-signup-form" onSubmit={handleSubmit}>
            {message && (
              <div className="customer-login-message" role="status">
                <p>{message}</p>
                {resetUrl && (
                  <a className="customer-signup-submit" href={resetUrl} style={{ marginTop: '10px' }}>
                    Open password reset link
                  </a>
                )}
              </div>
            )}
            {error && <p className="customer-signup-error" role="alert">{error}</p>}
            <label>Email address
              <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" autoComplete="email" required />
            </label>
            <button className="customer-signup-submit" type="submit" disabled={isLoading}>{isLoading ? 'Sending link...' : 'Send reset link'}</button>
          </form>
          <p className="customer-signup-login"><Link to="/login">← Back to sign in</Link></p>
        </div>
      </section>
    </main>
  )
}
