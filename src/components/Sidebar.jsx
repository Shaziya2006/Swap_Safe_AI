import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Factory, Cpu, ShieldAlert, ClipboardCheck, Activity,
  BarChart3, UserCircle, LogOut, ShieldCheck, X,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/suppliers', label: 'Suppliers', icon: Factory },
  { to: '/components', label: 'Component Analysis', icon: Cpu },
  { to: '/risk-assessment', label: 'Risk Assessment', icon: ShieldAlert },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/approvals', label: 'Approvals', icon: ClipboardCheck },
  { to: '/monitoring', label: 'Monitoring', icon: Activity },
  { to: '/profile', label: 'Profile', icon: UserCircle },
]

function Sidebar({ isOpen, closeSidebar }) {
  const { logout } = useAuth()
  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'show' : ''}`} onClick={closeSidebar} />
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="brand">
          <span className="brand-mark"><ShieldCheck size={22} /></span>
          <span className="brand-name">SWAPSAFE AI</span>
          <button className="icon-btn sidebar-close" onClick={closeSidebar} aria-label="Close menu">
            <X size={18} />
          </button>
        </div>
        <nav className="nav">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} onClick={closeSidebar}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
        <button className="nav-link logout" onClick={logout}>
          <LogOut size={18} />
          Sign out
        </button>
      </aside>
    </>
  )
}
export default Sidebar
