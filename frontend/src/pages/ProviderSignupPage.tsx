import { useState, type ChangeEvent, type DragEvent } from 'react'
import { Link } from 'react-router-dom'

const steps = ['Your details', 'Business', 'Verification']
const demoOtp = '123456'
const teamSizeLabels: Record<string, string> = {
  '1': 'Solo provider',
  '2': '2–3 people',
  '5': '4–6 people',
  '7': '7 or more people',
}
const serviceCategoryLabels: Record<string, string> = {
  regular: 'Regular home cleaning',
  deep: 'Deep cleaning',
  move: 'Move-in / move-out cleaning',
  office: 'Office cleaning',
}

function validateKycFile(file: File | null) {
  if (file && !/\.(pdf|jpe?g|png)$/i.test(file.name)) {
    return 'Choose a PDF, JPG, or PNG document.'
  }
  if (file && file.size > 10 * 1024 * 1024) {
    return 'Choose a verification document smaller than 10 MB.'
  }
  return ''
}

export default function ProviderSignupPage() {
  const [step, setStep] = useState(0)
  const [fullName, setFullName] = useState('')
  const [mobile, setMobile] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [otpVerified, setOtpVerified] = useState(false)
  const [businessName, setBusinessName] = useState('')
  const [category, setCategory] = useState('')
  const [customCategory, setCustomCategory] = useState('')
  const [teamSize, setTeamSize] = useState('2')
  const [kycDocument, setKycDocument] = useState<File | null>(null)
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null)
  const [isKycDragging, setIsKycDragging] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')
  const isCustomCategory = category === 'other'

  const sendOtp = () => {
    if (!/^\+?[0-9\s()-]{8,18}$/.test(mobile.trim())) {
      setError('Enter a valid mobile number before requesting a code.')
      return
    }

    setOtpSent(true)
    setOtpVerified(false)
    setError('')
  }

  const verifyOtp = () => {
    if (otp !== demoOtp) {
      setError('That code does not match. Use the demo code shown below.')
      return
    }

    setOtpVerified(true)
    setError('')
  }

  const continueStep = () => {
    setError('')
    if (step === 0) {
      if (!fullName.trim() || !mobile.trim() || !email.trim() || !password) {
        setError('Complete all fields to continue.')
        return
      }
      if (!/^\+?[0-9\s()-]{8,18}$/.test(mobile.trim())) {
        setError('Enter a valid mobile number.')
        return
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        setError('Enter a valid email address.')
        return
      }
      if (password.length < 8) {
        setError('Use a password with at least 8 characters.')
        return
      }
      if (!otpVerified) {
        setError('Verify your mobile number before continuing.')
        return
      }
    }

    if (step === 1) {
      if (!businessName.trim() || !category) {
        setError('Add your business name and choose a service category.')
        return
      }
      if (isCustomCategory && !customCategory.trim()) {
        setError('Enter your custom service category to continue.')
        return
      }
    }

    setStep((currentStep) => Math.min(currentStep + 1, steps.length - 1))
  }

  const setKycFile = (file: File | null) => {
    const fileError = validateKycFile(file)
    if (fileError) {
      setError(fileError)
      return
    }

    setKycDocument(file)
    setError('')
  }

  const handleKycChange = (event: ChangeEvent<HTMLInputElement>) => {
    setKycFile(event.target.files?.[0] ?? null)
    event.target.value = ''
  }

  const handleKycDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault()
    setIsKycDragging(false)
    setKycFile(event.dataTransfer.files[0] ?? null)
  }

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null
    if (file && !file.type.startsWith('image/')) {
      setError('Choose an image file for your profile photo.')
      event.target.value = ''
      return
    }
    if (file && file.size > 5 * 1024 * 1024) {
      setError('Choose a profile photo smaller than 5 MB.')
      event.target.value = ''
      return
    }

    setProfilePhoto(file)
    setError('')
  }

  const submitApplication = () => {
    if (!kycDocument) {
      setError('Upload a KYC document to submit your application.')
      return
    }

    setError('')
    setIsSubmitted(true)
  }

  return (
    <main className="provider-signup-page">
      <div className="provider-signup-wrap">
        <Link className="signup-back-link" to="/">← Back to CleanPro</Link>
        <header className="signup-heading">
          <span className="section-kicker">PROVIDER PARTNER PROGRAM</span>
          <h1>Grow your cleaning business with CleanPro.</h1>
          <p>{isSubmitted ? 'Your provider application has been received.' : 'Set up your profile in a few steps. You can review your information before submitting.'}</p>
        </header>

        <section className={`signup-card${isSubmitted ? ' signup-card-success' : ''}`} aria-label={isSubmitted ? 'Provider signup confirmation' : 'Provider signup wizard'}>
          {isSubmitted ? (
            <div className="signup-success" role="status" aria-live="polite">
              <div className="success-checkmark" aria-hidden="true">
                <svg viewBox="0 0 64 64" fill="none">
                  <circle className="success-checkmark-circle" cx="32" cy="32" r="28" />
                  <path className="success-checkmark-tick" d="m18 33 9 9 19-21" />
                </svg>
              </div>
              <span className="section-kicker">APPLICATION RECEIVED</span>
              <h2>Thanks, {fullName.split(' ')[0]}!</h2>
              <p>Your provider signup details are ready. We’ll review your verification documents before your profile goes live.</p>
              <div className="success-summary">
                <span>Business</span>
                <strong>{businessName}</strong>
                <span>Service category</span>
                <strong>{isCustomCategory ? customCategory : serviceCategoryLabels[category]}</strong>
              </div>
              <p className="demo-disclaimer">Demo only: your information and document remain in this browser and were not sent to a server.</p>
              <Link className="primary-btn wizard-next success-home-link" to="/">Back to CleanPro <span aria-hidden="true">→</span></Link>
            </div>
          ) : (
            <>
          <div className="wizard-progress" role="progressbar" aria-label="Signup progress" aria-valuemin={1} aria-valuemax={3} aria-valuenow={step + 1}>
            {steps.map((label, index) => (
              <div className={`wizard-step${index === step ? ' is-current' : ''}${index < step ? ' is-complete' : ''}`} key={label}>
                <span className="wizard-step-number">{index < step ? '✓' : index + 1}</span>
                <span>{label}</span>
              </div>
            ))}
          </div>
          <div className="wizard-progress-track" aria-hidden="true">
            <span style={{ width: `${(step / (steps.length - 1)) * 100}%` }} />
          </div>

          {step === 0 && (
            <div className="wizard-content" key="wizard-step-1">
              <div className="wizard-title">
                <span>STEP 1 OF 3</span>
                <h2>Let’s get to know you</h2>
                <p>We’ll use these details to create your provider account.</p>
              </div>
              <div className="signup-fields">
                <label className="field-span">
                  Full name
                  <input autoComplete="name" value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="e.g. Alex Morgan" />
                </label>
                <div className="phone-field field-span">
                  <label htmlFor="provider-mobile">Mobile number</label>
                  <div className="phone-input-row">
                    <input id="provider-mobile" autoComplete="tel" type="tel" value={mobile} onChange={(event) => { setMobile(event.target.value); setOtpSent(false); setOtpVerified(false) }} placeholder="+1 (555) 000-0000" />
                    <button className="outline-action" type="button" onClick={sendOtp}>{otpSent ? 'Resend code' : 'Send code'}</button>
                  </div>
                </div>
                {otpSent && (
                  <div className="otp-field field-span">
                    <label htmlFor="provider-otp">Verification code</label>
                    <div className="phone-input-row">
                      <input id="provider-otp" inputMode="numeric" maxLength={6} value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, ''))} placeholder="Enter 6-digit code" />
                      <button className="outline-action" type="button" onClick={verifyOtp} disabled={otpVerified}>{otpVerified ? 'Verified ✓' : 'Verify'}</button>
                    </div>
                    {otpVerified && (
                      <p className="otp-verified-note" role="status">
                        <span className="otp-checkmark" aria-hidden="true">✓</span>
                        Mobile number verified
                      </p>
                    )}
                    <span className="field-hint">Demo mode: enter {demoOtp} to verify. SMS delivery is not connected.</span>
                  </div>
                )}
                <label>
                  Email address
                  <input autoComplete="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@business.com" />
                </label>
                <label>
                  Password
                  <input autoComplete="new-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 8 characters" />
                </label>
              </div>
              {error && <p className="form-error" key={error} role="alert">{error}</p>}
              <div className="wizard-actions">
                <span className="secure-note">Your information is kept private and secure.</span>
                <button className="primary-btn wizard-next" type="button" onClick={continueStep}>Next step <span aria-hidden="true">→</span></button>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="wizard-content" key="wizard-step-2">
              <div className="wizard-title">
                <span>STEP 2 OF 3</span>
                <h2>Tell us about your business</h2>
                <p>Help customers understand the services and team you offer.</p>
              </div>
              <div className="signup-fields">
                <label className="field-span">
                  Business or team name
                  <input autoComplete="organization" value={businessName} onChange={(event) => setBusinessName(event.target.value)} placeholder="e.g. Bright Home Cleaning" />
                </label>
                <label>
                  Main service category
                  <select value={category} onChange={(event) => setCategory(event.target.value)}>
                    <option value="">Choose a service</option>
                    <option value="regular">Regular home cleaning</option>
                    <option value="deep">Deep cleaning</option>
                    <option value="move">Move-in / move-out cleaning</option>
                    <option value="office">Office cleaning</option>
                    <option value="other">Other Services</option>
                  </select>
                </label>
                <label>
                  Team members
                  <select value={teamSize} onChange={(event) => setTeamSize(event.target.value)}>
                    <option value="1">Just me</option>
                    <option value="2">2–3 people</option>
                    <option value="5">4–6 people</option>
                    <option value="7">7 or more</option>
                  </select>
                </label>
                <div className={`custom-category-field${isCustomCategory ? ' is-visible' : ''}`} aria-hidden={!isCustomCategory}>
                  <label htmlFor="custom-category">
                    Your service category
                    <input
                      id="custom-category"
                      value={customCategory}
                      onChange={(event) => setCustomCategory(event.target.value)}
                      placeholder="e.g. Eco-friendly home cleaning"
                      required={isCustomCategory}
                      disabled={!isCustomCategory}
                      tabIndex={isCustomCategory ? 0 : -1}
                    />
                    <span className="field-hint">This custom category will be reviewed by our team before it appears to customers.</span>
                  </label>
                </div>
              </div>
              {error && <p className="form-error" key={error} role="alert">{error}</p>}
              <div className="wizard-actions">
                <button className="back-action" type="button" onClick={() => { setError(''); setStep(0) }}>← Back</button>
                <button className="primary-btn wizard-next" type="button" onClick={continueStep}>Next step <span aria-hidden="true">→</span></button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="wizard-content" key="wizard-step-3">
              <div className="wizard-title">
                <span>STEP 3 OF 3</span>
                <h2>Verify your profile</h2>
                <p>Upload an identity or business document. Your profile photo is optional.</p>
              </div>
              <div className="upload-stack">
                <label
                  className={`upload-box kyc-dropzone${isKycDragging ? ' is-dragging' : ''}`}
                  onDragEnter={() => setIsKycDragging(true)}
                  onDragOver={(event) => event.preventDefault()}
                  onDragLeave={(event) => {
                    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                      setIsKycDragging(false)
                    }
                  }}
                  onDrop={handleKycDrop}
                >
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleKycChange} />
                  <span className="upload-icon" aria-hidden="true">↑</span>
                  <strong>{kycDocument ? kycDocument.name : 'Upload a KYC document'}</strong>
                  <span>{kycDocument ? `${(kycDocument.size / (1024 * 1024)).toFixed(2)} MB · Ready to submit` : 'Government ID or business registration · PDF, JPG or PNG · Max 10 MB'}</span>
                  <span className="upload-browse">{kycDocument ? 'Choose a different file' : 'Choose file'}</span>
                </label>
                {kycDocument && (
                  <div className="kyc-upload-progress" role="group" aria-label="KYC document selection status">
                    <div className="kyc-progress-copy">
                      <span>Document ready</span>
                      <strong>Selected locally · not uploaded</strong>
                    </div>
                    <div
                      className="kyc-progress-track"
                      role="progressbar"
                      aria-label="Document selected"
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={100}
                    >
                      <span />
                    </div>
                  </div>
                )}
                <label className="upload-box upload-box-optional">
                  <input type="file" accept="image/*" onChange={handlePhotoChange} />
                  <span className="upload-icon" aria-hidden="true">＋</span>
                  <strong>{profilePhoto ? profilePhoto.name : 'Add a profile photo'}</strong>
                  <span>{profilePhoto ? 'Photo selected' : 'Optional · Helps customers recognize you · Max 5 MB'}</span>
                  <span className="upload-browse">{profilePhoto ? 'Choose a different photo' : 'Choose photo'}</span>
                </label>
              </div>
              <div className="review-summary">
                <h3>Application summary</h3>
                <p><span>Contact</span><strong>{fullName} · {email}</strong></p>
                <p><span>Business</span><strong>{businessName} · {isCustomCategory ? customCategory : serviceCategoryLabels[category] ?? 'Service category'}</strong></p>
                <p><span>Team</span><strong>{teamSizeLabels[teamSize]}</strong></p>
              </div>
              {error && <p className="form-error" key={error} role="alert">{error}</p>}
              <div className="wizard-actions">
                <button className="back-action" type="button" onClick={() => { setError(''); setStep(1) }}>← Back</button>
                <button className="primary-btn wizard-next" type="button" onClick={submitApplication}>Submit application <span aria-hidden="true">→</span></button>
              </div>
              <p className="demo-disclaimer">Demo only: files are selected in this browser and are not uploaded to a server.</p>
            </div>
          )}
            </>
          )}
        </section>
        <p className="signup-login-note">Already have a provider account? <Link to="/login">Sign in</Link></p>
      </div>
    </main>
  )
}
