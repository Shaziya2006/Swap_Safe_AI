import { CheckCircle2, AlertTriangle } from 'lucide-react'
import { useApp } from '../context/AppContext'

function Toasts() {
  const { toasts } = useApp()
  return (
    <div className="toasts" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.type}`}>
          {t.type === 'warn' ? <AlertTriangle size={17} /> : <CheckCircle2 size={17} />}
          {t.message}
        </div>
      ))}
    </div>
  )
}
export default Toasts
