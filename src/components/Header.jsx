import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Bell, ChevronDown, LogOut, Menu, UserCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useApp } from '../context/AppContext'
import { navItems } from './Sidebar'
import { initials } from '../utils/helpers'

function useClickOutside(ref, handler) {
  useEffect(() => {
    const fn = (e) => ref.current && !ref.current.contains(e.target) && handler()
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [ref, handler])
}

function Header({ openSidebar }) {
  const { user, logout } = useAuth()
  const { risks, approvals } = useApp()
  const location = useLocation()
  const navigate = useNavigate()
  const [menu, setMenu] = useState(null) // 'bell' | 'user' | null
  const wrapRef = useRef(null)
  useClickOutside(wrapRef, () => setMenu(null))

  const current = navItems.find((n) => (n.end ? location.pathname === n.to : location.pathname.startsWith(n.to)))
  const openHigh = risks.filter((r) => r.status === 'Open' && r.severity === 'High')
  const alertCount = openHigh.length + approvals.length

  const go = (path) => { setMenu(null); navigate(path) }

  return (
    <header className="header">
      <div className="header-left">
        <button className="icon-btn menu-btn" onClick={openSidebar} aria-label="Open menu">
          <Menu size={20} />
        </button>
        <h1 className="page-title">{current?.label ?? 'SWAPSAFE AI'}</h1>
      </div>

      <div className="header-right" ref={wrapRef}>
        <div className="menu-wrap">
          <button className="icon-btn bell" onClick={() => setMenu(menu === 'bell' ? null : 'bell')} aria-label="Notifications">
            <Bell size={19} />
            {alertCount > 0 && <span className="dot">{alertCount}</span>}
          </button>
          {menu === 'bell' && (
            <div className="dropdown notif">
              <div className="dropdown-title">Needs attention</div>
              {openHigh.map((r) => (
                <button key={r.id} className="dropdown-item" onClick={() => go('/risk-assessment')}>
                  <strong>{r.title}</strong>
                  <span className="muted small">High risk · {r.supplier}</span>
                </button>
              ))}
              {approvals.map((a) => (
                <button key={a.id} className="dropdown-item" onClick={() => go('/approvals')}>
                  <strong>{a.title}</strong>
                  <span className="muted small">Waiting for your decision</span>
                </button>
              ))}
              {alertCount === 0 && <p className="muted small pad">You're all caught up.</p>}
            </div>
          )}
        </div>

        <div className="menu-wrap">
          <button className="user-chip" onClick={() => setMenu(menu === 'user' ? null : 'user')} aria-label="Account menu">
            <span className="avatar sm">{initials(user.name)}</span>
            <span className="user-meta">
              <span className="user-name">{user.name}</span>
              <span className="user-role">{user.role}</span>
            </span>
            <ChevronDown size={15} />
          </button>
          {menu === 'user' && (
            <div className="dropdown">
              <Link to="/profile" className="dropdown-item row" onClick={() => setMenu(null)}>
                <UserCircle size={16} /> My profile
              </Link>
              <button className="dropdown-item row danger" onClick={logout}>
                <LogOut size={16} /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
export default Header
