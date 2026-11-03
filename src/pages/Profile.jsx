import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Briefcase, Building2, Mail, MapPin, Phone, Save, KeyRound, Eye, EyeOff, Trash2, CalendarDays } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { useAuth } from '../context/AuthContext'
import { useApp } from '../context/AppContext'
import { COLORS, initials, timeAgo } from '../utils/helpers'

function Toggle({ checked, onChange, label, hint }) {
  return (
    <label className="toggle-row">
      <span>
        <strong>{label}</strong>
        <span className="muted small block">{hint}</span>
      </span>
      <input type="checkbox" role="switch" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="switch" aria-hidden="true" />
    </label>
  )
}

function Profile() {
  const { user, updateProfile, changePassword } = useAuth()
  const { toast, activity, history, approvals, risks, resetDemoData } = useApp()

  const [form, setForm] = useState({
    name: user.name, role: user.role, organization: user.organization || '',
    phone: user.phone || '', location: user.location || '', bio: user.bio || '',
  })
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' })
  const [showPw, setShowPw] = useState(false)
  const [pwError, setPwError] = useState('')

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })
  const dirty = Object.keys(form).some((k) => form[k] !== (user[k] || ''))

  const saveProfile = (e) => {
    e.preventDefault()
    if (!form.name.trim()) return toast('Name cannot be empty.', 'warn')
    updateProfile({ ...form, name: form.name.trim() })
    toast('Profile saved.')
  }

  const savePassword = (e) => {
    e.preventDefault()
    setPwError('')
    if (pw.next.length < 8) return setPwError('Use at least 8 characters.')
    if (pw.next !== pw.confirm) return setPwError('New passwords do not match.')
    const r = changePassword(pw.current, pw.next)
    if (!r.success) return setPwError(r.message)
    setPw({ current: '', next: '', confirm: '' })
    toast('Password updated.')
  }

  const setNotif = (key) => (val) => {
    updateProfile({ notifications: { ...user.notifications, [key]: val } })
  }

  const approved = history.filter((h) => h.decision === 'Approved').length
  const rejected = history.filter((h) => h.decision === 'Rejected').length
  const info = history.length - approved - rejected
  const decisionData = [
    { name: 'Approved', value: approved, color: COLORS.teal },
    { name: 'Rejected', value: rejected, color: COLORS.red },
    { name: 'More info', value: info, color: COLORS.amber },
  ].filter((d) => d.value > 0)

  return (
    <div className="page profile">
      <section className="card profile-hero">
        <span className="avatar lg">{initials(user.name)}</span>
        <div className="profile-id">
          <h2>{user.name}</h2>
          <p className="muted">{user.role}{user.organization && ` · ${user.organization}`}</p>
          <div className="chips">
            <span className="chip"><Mail size={14} /> {user.email}</span>
            {user.location && <span className="chip"><MapPin size={14} /> {user.location}</span>}
            <span className="chip"><CalendarDays size={14} /> Joined {user.joined}</span>
          </div>
        </div>
        <div className="profile-stats">
          <Link to="/approvals" className="pstat"><strong>{approvals.length}</strong><span>Pending</span></Link>
          <div className="pstat"><strong>{history.length}</strong><span>Decisions</span></div>
          <Link to="/risk-assessment" className="pstat"><strong>{risks.filter((r) => r.status === 'Open').length}</strong><span>Open risks</span></Link>
        </div>
      </section>

      <div className="grid profile-grid">
        <section className="card">
          <h3>Personal details</h3>
          <form className="form" onSubmit={saveProfile}>
            <div className="grid two compact">
              <label className="field"><span>Full name</span><input value={form.name} onChange={set('name')} required /></label>
              <label className="field"><span>Job title</span><div className="input-wrap"><Briefcase size={16} /><input value={form.role} onChange={set('role')} /></div></label>
              <label className="field"><span>Organization</span><div className="input-wrap"><Building2 size={16} /><input value={form.organization} onChange={set('organization')} /></div></label>
              <label className="field"><span>Phone</span><div className="input-wrap"><Phone size={16} /><input value={form.phone} onChange={set('phone')} /></div></label>
            </div>
            <label className="field"><span>Location</span><div className="input-wrap"><MapPin size={16} /><input value={form.location} onChange={set('location')} /></div></label>
            <label className="field"><span>Short bio</span><textarea rows={3} value={form.bio} onChange={set('bio')} /></label>
            <label className="field"><span>Email (cannot be changed)</span><input value={user.email} disabled /></label>
            <div className="btn-row">
              <button className="btn btn-primary" disabled={!dirty}><Save size={17} /> Save changes</button>
              <button type="button" className="btn btn-ghost" disabled={!dirty} onClick={() => setForm({ name: user.name, role: user.role, organization: user.organization || '', phone: user.phone || '', location: user.location || '', bio: user.bio || '' })}>Discard</button>
            </div>
          </form>
        </section>

        <div className="stack">
          <section className="card">
            <h3>Notifications</h3>
            <Toggle checked={!!user.notifications?.riskAlerts} onChange={setNotif('riskAlerts')} label="Risk alerts" hint="Show high-severity risks in the bell menu" />
            <Toggle checked={!!user.notifications?.approvalRequests} onChange={setNotif('approvalRequests')} label="Approval requests" hint="Tell me when a request needs a decision" />
            <Toggle checked={!!user.notifications?.weeklyDigest} onChange={setNotif('weeklyDigest')} label="Weekly digest" hint="Summary of supplier and risk changes" />
          </section>

          <section className="card">
            <h3>My decisions</h3>
            {decisionData.length === 0 ? <p className="muted">No decisions yet.</p> : (
              <div className="mini-chart small-h">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={decisionData} dataKey="value" nameKey="name" innerRadius="55%" outerRadius="85%" paddingAngle={3}>
                      {decisionData.map((d) => <Cell key={d.name} fill={d.color} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
            <div className="legend-row">
              {decisionData.map((d) => <span key={d.name}><i style={{ background: d.color }} /> {d.name} {d.value}</span>)}
            </div>
          </section>
        </div>
      </div>

      <div className="grid two">
        <section className="card">
          <h3><KeyRound size={18} /> Change password</h3>
          <form className="form" onSubmit={savePassword}>
            <label className="field"><span>Current password</span>
              <div className="input-wrap">
                <input type={showPw ? 'text' : 'password'} value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} required autoComplete="current-password" />
                <button type="button" className="icon-btn" onClick={() => setShowPw(!showPw)} aria-label={showPw ? 'Hide passwords' : 'Show passwords'}>{showPw ? <EyeOff size={18} /> : <Eye size={18} />}</button>
              </div>
            </label>
            <label className="field"><span>New password</span><input type={showPw ? 'text' : 'password'} value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} required autoComplete="new-password" /></label>
            <label className="field"><span>Confirm new password</span><input type={showPw ? 'text' : 'password'} value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} required autoComplete="new-password" /></label>
            {pwError && <p className="form-error" role="alert">{pwError}</p>}
            <button className="btn btn-primary">Update password</button>
          </form>
        </section>

        <section className="card">
          <h3>Recent activity</h3>
          <ul className="activity">
            {activity.slice(0, 7).map((a) => (
              <li key={a.id}><span>{a.text}</span><span className="muted small">{timeAgo(a.time)}</span></li>
            ))}
          </ul>
          <div className="danger-zone">
            <div>
              <strong>Reset demo data</strong>
              <p className="muted small">Restores approvals, risks and orders to the starting sample data.</p>
            </div>
            <button className="btn btn-danger btn-small" onClick={() => { if (window.confirm('Reset all demo data in this browser?')) resetDemoData() }}>
              <Trash2 size={15} /> Reset
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}
export default Profile
