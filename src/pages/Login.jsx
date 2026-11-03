import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldCheck, Eye, EyeOff, LockKeyhole, UserPlus, Zap, LineChart, Layers } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

function Login() {
  const navigate = useNavigate()
  const { login, register } = useAuth()

  const [mode, setMode] = useState('signin') // 'signin' | 'signup' | 'forgot'
  const [form, setForm] = useState({
    name: '', email: 'admin@swapsafe.ai', password: 'SwapSafe@123', confirm: '', organization: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const switchMode = (m) => {
    setMode(m)
    setError('')
    setInfo('')
    if (m === 'signup') setForm({ name: '', email: '', password: '', confirm: '', organization: '' })
    if (m === 'signin') setForm({ ...form, email: 'admin@swapsafe.ai', password: 'SwapSafe@123' })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setInfo('')

    if (mode === 'forgot') {
      setInfo(`Demo mode: no email is sent. Use admin@swapsafe.ai / SwapSafe@123, or create a new account.`)
      return
    }

    if (mode === 'signup') {
      if (form.password.length < 8) return setError('Use at least 8 characters for the password.')
      if (form.password !== form.confirm) return setError('Passwords do not match.')
      const result = register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        organization: form.organization.trim(),
      })
      if (!result.success) return setError(result.message)
      navigate('/', { replace: true })
      return
    }

    const result = login(form.email.trim(), form.password)
    if (result.success) navigate('/', { replace: true })
    else setError(result.message)
  }

  return (
    <div className="login-page">
      <aside className="login-hero">
        <div className="login-hero-inner">
          <div className="brand light">
            <span className="brand-mark"><ShieldCheck size={22} /></span>
            <span className="brand-name">SWAPSAFE AI</span>
          </div>
          <h2>Swap the part before the shortage hits.</h2>
          <p>
            Compare suppliers, test substitute components, and keep a human in the loop on every
            sourcing decision.
          </p>
          <ul className="hero-points">
            <li><Layers size={18} /> Side-by-side component substitution checks</li>
            <li><LineChart size={18} /> Live supplier and risk analytics</li>
            <li><Zap size={18} /> Disruption alerts with suggested actions</li>
          </ul>
        </div>
      </aside>

      <main className="login-panel">
        <div className="login-card">
          <div className="login-brand-mobile">
            <span className="brand-mark dark"><ShieldCheck size={22} /></span>
            <span>SWAPSAFE AI</span>
          </div>

          {mode !== 'forgot' && (
            <div className="tabs" role="tablist">
              <button role="tab" aria-selected={mode === 'signin'} className={mode === 'signin' ? 'active' : ''} onClick={() => switchMode('signin')}>Sign in</button>
              <button role="tab" aria-selected={mode === 'signup'} className={mode === 'signup' ? 'active' : ''} onClick={() => switchMode('signup')}>Create account</button>
            </div>
          )}

          <h2 className="login-heading">
            {mode === 'signin' && 'Welcome back'}
            {mode === 'signup' && 'Create your account'}
            {mode === 'forgot' && 'Reset your password'}
          </h2>
          <p className="muted">
            {mode === 'signin' && 'Sign in to open your procurement control center.'}
            {mode === 'signup' && 'Takes less than a minute. Data stays in this browser.'}
            {mode === 'forgot' && 'Enter your email and we will show you how to get back in.'}
          </p>

          <form onSubmit={handleSubmit} className="form">
            {mode === 'signup' && (
              <>
                <label className="field">
                  <span>Full name</span>
                  <input value={form.name} onChange={set('name')} placeholder="Your full name" required />
                </label>
                <label className="field">
                  <span>Organization (optional)</span>
                  <input value={form.organization} onChange={set('organization')} placeholder="Company or team" />
                </label>
              </>
            )}

            <label className="field">
              <span>Email address</span>
              <input type="email" value={form.email} onChange={set('email')} placeholder="you@company.com" required autoComplete="email" />
            </label>

            {mode !== 'forgot' && (
              <label className="field">
                <span>Password</span>
                <div className="input-wrap">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={set('password')}
                    placeholder="Enter your password"
                    required
                    autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                  />
                  <button type="button" className="icon-btn" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </label>
            )}

            {mode === 'signup' && (
              <label className="field">
                <span>Confirm password</span>
                <input type={showPassword ? 'text' : 'password'} value={form.confirm} onChange={set('confirm')} placeholder="Repeat password" required autoComplete="new-password" />
              </label>
            )}

            {mode === 'signin' && (
              <button type="button" className="link-btn align-right" onClick={() => switchMode('forgot')}>
                Forgot password?
              </button>
            )}

            {error && <p className="form-error" role="alert">{error}</p>}
            {info && <p className="form-info">{info}</p>}

            <button type="submit" className="btn btn-primary btn-block">
              {mode === 'signup' ? <UserPlus size={18} /> : <LockKeyhole size={18} />}
              {mode === 'signin' && 'Sign in'}
              {mode === 'signup' && 'Create account'}
              {mode === 'forgot' && 'Send reset instructions'}
            </button>

            {mode === 'forgot' && (
              <button type="button" className="btn btn-ghost btn-block" onClick={() => switchMode('signin')}>
                Back to sign in
              </button>
            )}
          </form>

          {mode === 'signin' && (
            <div className="demo-box">
              <strong>Hackathon demo account</strong>
              <span>Email: admin@swapsafe.ai</span>
              <span>Password: SwapSafe@123</span>
            </div>
          )}
          <p className="login-footer">© 2026 SWAPSAFE AI · Procurement Risk Intelligence</p>
        </div>
      </main>
    </div>
  )
}
export default Login
