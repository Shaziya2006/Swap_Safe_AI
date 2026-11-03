import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import {
  initialApprovals,
  initialHistory,
  initialOrders,
  initialRisks,
} from '../data/mockData'

const AppContext = createContext(null)
const STORE_KEY = 'swapsafe_app_state_v1'

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORE_KEY))
    if (saved) return saved
  } catch { /* ignore */ }
  return {
    approvals: initialApprovals,
    history: initialHistory,
    risks: initialRisks,
    orders: initialOrders,
    shortlist: [],
    activity: [
      { id: 'L-1', text: 'Signed in to SWAPSAFE AI', time: new Date().toISOString() },
    ],
  }
}

export function AppProvider({ children }) {
  const [state, setState] = useState(load)
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    localStorage.setItem(STORE_KEY, JSON.stringify(state))
  }, [state])

  const toast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random()
    setToasts((t) => [...t, { id, message, type }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500)
  }, [])

  const log = (text) => ({
    id: 'L-' + Date.now() + Math.random().toString(16).slice(2, 5),
    text,
    time: new Date().toISOString(),
  })

  const decide = (approvalId, decision, comment, by) => {
    setState((s) => {
      const item = s.approvals.find((a) => a.id === approvalId)
      if (!item) return s
      const entry = {
        id: 'H-' + Date.now(),
        request: `${item.id} · ${item.title}`,
        decision,
        by,
        comment: comment || 'No comment added.',
        date: new Date().toISOString().slice(0, 10),
      }
      return {
        ...s,
        approvals: s.approvals.filter((a) => a.id !== approvalId),
        history: [entry, ...s.history],
        activity: [log(`${decision}: ${item.title}`), ...s.activity].slice(0, 30),
      }
    })
    toast(`Request ${decision.toLowerCase()}.`)
  }

  const submitApproval = (req) => {
    setState((s) => {
      const id = 'A-' + (2042 + s.approvals.length + s.history.length)
      const item = {
        id,
        requester: 'Procurement',
        submitted: new Date().toISOString().slice(0, 10),
        status: 'Pending',
        ...req,
      }
      return {
        ...s,
        approvals: [item, ...s.approvals],
        activity: [log(`Submitted for approval: ${req.title}`), ...s.activity].slice(0, 30),
      }
    })
    toast('Sent to Approvals for human review.')
  }

  const setRiskStatus = (riskId, status) => {
    setState((s) => {
      const risk = s.risks.find((r) => r.id === riskId)
      return {
        ...s,
        risks: s.risks.map((r) => (r.id === riskId ? { ...r, status } : r)),
        activity: [log(`Risk ${riskId} marked ${status.toLowerCase()}`), ...s.activity].slice(0, 30),
      }
    })
    toast(`Risk marked ${status.toLowerCase()}.`)
  }

  const advanceOrder = (orderId) => {
    setState((s) => ({
      ...s,
      orders: s.orders.map((o) => {
        if (o.id !== orderId || o.stage >= 3) return o
        const nextStage = o.stage + 1
        const actual = [...o.actual]
        actual[nextStage] = o.planned[nextStage] + o.delayDays
        return { ...o, stage: nextStage, actual }
      }),
      activity: [log(`Advanced ${orderId} to next milestone`), ...s.activity].slice(0, 30),
    }))
    toast('Milestone updated.')
  }

  const flagDelay = (orderId, days) => {
    setState((s) => ({
      ...s,
      orders: s.orders.map((o) => (o.id === orderId ? { ...o, delayDays: days } : o)),
      activity: [log(`Delay of ${days} day(s) set on ${orderId}`), ...s.activity].slice(0, 30),
    }))
    toast(days ? `Delay of ${days} day(s) recorded.` : 'Delay cleared.', days ? 'warn' : 'success')
  }

  const toggleShortlist = (supplierId) => {
    setState((s) => {
      const has = s.shortlist.includes(supplierId)
      return {
        ...s,
        shortlist: has ? s.shortlist.filter((x) => x !== supplierId) : [...s.shortlist, supplierId],
      }
    })
  }

  const resetDemoData = () => {
    localStorage.removeItem(STORE_KEY)
    setState(load())
    toast('Demo data reset.')
  }

  const addActivity = (text) =>
    setState((s) => ({ ...s, activity: [log(text), ...s.activity].slice(0, 30) }))

  return (
    <AppContext.Provider
      value={{
        ...state,
        toasts,
        toast,
        decide,
        submitApproval,
        setRiskStatus,
        advanceOrder,
        flagDelay,
        toggleShortlist,
        resetDemoData,
        addActivity,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  return useContext(AppContext)
}
