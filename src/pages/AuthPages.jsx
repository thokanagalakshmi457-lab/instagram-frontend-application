import { useState } from 'react'
import { Eye, EyeOff, Sparkles } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'

function AuthFrame({ children, tagline }) {
  return <main className="auth-screen"><section className="auth-art"><div className="auth-art-copy"><span className="eyebrow">A place for the in-between</span><h1>Keep the moments<br />that <em>move</em> you.</h1><p>{tagline}</p></div><div className="auth-art-photo"><img src="https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=1200&q=85" alt="Golden morning light over a quiet landscape" /></div><span className="art-caption">POSTCARD NO. 04 · COPENHAGEN</span></section><section className="auth-panel"><Link to="/" className="brand auth-brand"><span className="brand-mark"><Sparkles size={18} /></span><span>fieldnote</span></Link>{children}<footer className="auth-footer">A small corner of the internet, made for sharing.</footer></section></main>
}

function PasswordField({ label, value, onChange, autoComplete = 'current-password' }) {
  const [visible, setVisible] = useState(false)
  const Icon = visible ? EyeOff : Eye
  return <label className="field-label">{label}<span className="password-field"><input required type={visible ? 'text' : 'password'} value={value} onChange={onChange} autoComplete={autoComplete} minLength={6} /><button type="button" aria-label={visible ? 'Hide password' : 'Show password'} onClick={() => setVisible((show) => !show)}><Icon size={18} /></button></span></label>
}

export function Login() {
  const { setAuthenticated, notify } = useApp()
  const navigate = useNavigate()
  const [identity, setIdentity] = useState('')
  const [password, setPassword] = useState('')
  const submit = (event) => {
    event.preventDefault()
    if (!event.currentTarget.reportValidity()) return
    setAuthenticated(true)
    navigate('/')
  }
  return <AuthFrame tagline="A slower feed for the places, people, and days worth remembering."><div className="auth-content"><span className="eyebrow">Welcome back</span><h2>Good to see you.</h2><p className="auth-description">Pick up where your last little moment left off.</p><form className="auth-form" onSubmit={submit}><label className="field-label">Email or username<input required autoComplete="username" value={identity} onChange={(event) => setIdentity(event.target.value)} /></label><PasswordField label="Password" value={password} onChange={(event) => setPassword(event.target.value)} /><button type="button" className="forgot-link" onClick={() => notify('Password reset is not connected in this demo')}>Forgot password?</button><button className="primary-button auth-submit" type="submit">Log in</button></form><div className="auth-divider"><span>or</span></div><button type="button" className="social-login" onClick={() => notify('Social sign-in is a visual demo only')}>Continue with Google</button><p className="auth-switch">New around here? <Link to="/signup">Create an account</Link></p></div></AuthFrame>
}

export function Signup() {
  const { setAuthenticated } = useApp()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [error, setError] = useState('')
  const submit = (event) => {
    event.preventDefault()
    if (password !== confirmation) {
      setError('Your passwords do not match.')
      return
    }
    setError('')
    setAuthenticated(true)
    navigate('/')
  }
  return <AuthFrame tagline="A slower feed for the places, people, and days worth remembering."><div className="auth-content signup-content"><span className="eyebrow">Start your journal</span><h2>Make room for more.</h2><p className="auth-description">Create an account to share the things you notice.</p><form className="auth-form" onSubmit={submit}><label className="field-label">Name<input required autoComplete="name" /></label><label className="field-label">Username<input required autoComplete="username" minLength={3} /></label><label className="field-label">Email<input required type="email" autoComplete="email" /></label><PasswordField label="Password" value={password} onChange={(event) => { setPassword(event.target.value); setError('') }} autoComplete="new-password" /><PasswordField label="Confirm password" value={confirmation} onChange={(event) => { setConfirmation(event.target.value); setError('') }} autoComplete="new-password" />{error && <p className="field-error" role="alert">{error}</p>}<button className="primary-button auth-submit" type="submit">Create account</button></form><p className="auth-switch">Already have a space here? <Link to="/login">Log in</Link></p></div></AuthFrame>
}