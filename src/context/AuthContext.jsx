import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

const USERS_KEY = 'swapsafe_users'
const SESSION_KEY = 'swapsafe_user'

// Demo account that always exists. Frontend-only auth: NOT secure, for demos only.
const DEMO_USER = {
  name: 'Procurement Manager',
  email: 'admin@swapsafe.ai',
  password: 'SwapSafe@123',
  role: 'Procurement Manager',
  organization: 'SWAPSAFE Demo Corp',
  phone: '+91 98765 43210',
  location: 'Bengaluru, India',
  bio: 'Leads supplier risk reviews and component sourcing decisions.',
  notifications: { riskAlerts: true, approvalRequests: true, weeklyDigest: false },
  joined: '2026-01-12',
}

function readUsers() {
  try {
    const stored = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
    const hasDemo = stored.some((u) => u.email === DEMO_USER.email)
    return hasDemo ? stored : [DEMO_USER, ...stored]
  } catch {
    return [DEMO_USER]
  }
}

function writeUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function stripPassword(u) {
  const { password, ...safe } = u
  return safe
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(SESSION_KEY)
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  const persistSession = (u) => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(u))
    setUser(u)
  }

  const login = (email, password) => {
    const found = readUsers().find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    )
    if (!found) return { success: false, message: 'Invalid email or password.' }
    persistSession(stripPassword(found))
    return { success: true }
  }

  const register = ({ name, email, password, role, organization }) => {
    const users = readUsers()
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, message: 'An account with this email already exists.' }
    }
    const newUser = {
      name,
      email,
      password,
      role: role || 'Procurement Analyst',
      organization: organization || '',
      phone: '',
      location: '',
      bio: '',
      notifications: { riskAlerts: true, approvalRequests: true, weeklyDigest: false },
      joined: new Date().toISOString().slice(0, 10),
    }
    writeUsers([...users, newUser])
    persistSession(stripPassword(newUser))
    return { success: true }
  }

  const updateProfile = (changes) => {
    const users = readUsers()
    const updatedUsers = users.map((u) => (u.email === user.email ? { ...u, ...changes } : u))
    writeUsers(updatedUsers)
    persistSession({ ...user, ...changes })
  }

  const changePassword = (current, next) => {
    const users = readUsers()
    const me = users.find((u) => u.email === user.email)
    if (!me || me.password !== current) {
      return { success: false, message: 'Current password is incorrect.' }
    }
    writeUsers(users.map((u) => (u.email === user.email ? { ...u, password: next } : u)))
    return { success: true }
  }

  const logout = () => {
    localStorage.removeItem(SESSION_KEY)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, updateProfile, changePassword, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
