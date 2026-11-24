import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { resetPassword } from '../services/authApi'

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    if (!token) {
      setError('The password reset link is missing or invalid.')
      return
    }

    try {
      setIsLoading(true)
      await resetPassword({ token, password, confirmPassword })
      navigate('/login', {
        state: { message: 'Password reset successfully. Please sign in.' },
      })
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Could not reset password')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="customer-signup-page">
      <section className="customer-signup-card" aria-label="Reset password">
        <div className="customer-signup-visual">
          <img src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&h=1500&q=85" alt="A calm welcoming home" />
          <div className="customer-signup-visual-overlay" />
          <div className="customer-signup-visual-copy">
            <span className="customer-signup-eyebrow">SECURE ACCOUNT RECOVERY</span>
            <h1>Create a new<br />password.</h1>
            <p>Choose a strong password you do not use elsewhere.</p>
          </div>
        </div>
        <div className="customer-signup-form-panel">
          <div className="customer-signup-heading">
            <span className="customer-signup-eyebrow">PASSWORD RESET</span>
            <h2>Set new password</h2>
          </div>
          <form className="customer-signup-form" onSubmit={handleSubmit}>
            {error && <p className="customer-signup-error" role="alert">{error}</p>}
            <label>New password
              <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" minLength={8} required />
            </label>
            <label>Confirm new password
              <input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} autoComplete="new-password" minLength={8} required />
            </label>
            <button className="customer-signup-submit" type="submit" disabled={isLoading || password !== confirmPassword}>{isLoading ? 'Updating password...' : 'Reset password'}</button>
          </form>
          <p className="customer-signup-login"><Link to="/login">Back to sign in</Link></p>
        </div>
      </section>
    </main>
  )
}
