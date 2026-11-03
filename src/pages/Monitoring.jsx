import { useState } from 'react'
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Check, ChevronRight, Clock, AlertTriangle } from 'lucide-react'
import ChartCard from '../components/ChartCard'
import Badge from '../components/Badge'
import { useApp } from '../context/AppContext'
import { milestones } from '../data/mockData'
import { COLORS } from '../utils/helpers'

function Monitoring() {
  const { orders, advanceOrder, flagDelay } = useApp()
  const [selectedId, setSelectedId] = useState(orders[0].id)
  const [delay, setDelay] = useState('')

  const order = orders.find((o) => o.id === selectedId) || orders[0]
  const delayed = orders.filter((o) => o.delayDays > 0).length
  const delivered = orders.filter((o) => o.stage === 3).length

  const chart = milestones.map((m, i) => ({
    name: m.split(' ')[0] + (i === 2 ? ' prod.' : ''),
    Planned: order.planned[i],
    Actual: order.actual[i],
  }))

  const statusOf = (o) => (o.stage === 3 ? 'Delivered' : o.delayDays > 0 ? 'Delayed' : 'On track')

  const submitDelay = (e) => {
    e.preventDefault()
    const n = Number(delay)
    if (Number.isNaN(n) || n < 0) return
    flagDelay(order.id, n)
    setDelay('')
  }

  return (
    <div className="page">
      <div className="grid three-sm">
        <div className="card mini-stat"><span className="muted small">Active orders</span><strong>{orders.length - delivered}</strong></div>
        <div className="card mini-stat"><span className="muted small">Delayed</span><strong className={delayed ? 'bad' : ''}>{delayed}</strong></div>
        <div className="card mini-stat"><span className="muted small">Delivered</span><strong className="good">{delivered}</strong></div>
      </div>

      <div className="monitor-layout">
        <section className="card order-list">
          <h3>Purchase orders</h3>
          {orders.map((o) => (
            <button key={o.id} className={`order-row ${o.id === order.id ? 'active' : ''}`} onClick={() => setSelectedId(o.id)}>
              <span>
                <strong>{o.id}</strong>
                <span className="muted small block">{o.item}</span>
              </span>
              <Badge level={statusOf(o) === 'Delayed' ? 'High' : statusOf(o) === 'Delivered' ? 'Approved' : 'Low'}>{statusOf(o)}</Badge>
              <ChevronRight size={16} />
            </button>
          ))}
        </section>

        <section className="card">
          <div className="card-head">
            <div>
              <h3>{order.id} · {order.item}</h3>
              <p className="muted small">{order.supplier} · ETA {order.eta}{order.delayDays > 0 && ` (+${order.delayDays} days)`}</p>
            </div>
            <button className="btn btn-primary btn-small" disabled={order.stage >= 3} onClick={() => advanceOrder(order.id)}>
              {order.stage >= 3 ? 'Completed' : 'Mark next milestone'}
            </button>
          </div>

          {order.delayDays > 0 && (
            <div className="alert alert-warn slim">
              <AlertTriangle size={18} />
              <div className="alert-text"><strong>Running {order.delayDays} days behind plan</strong></div>
            </div>
          )}

          <ol className="timeline">
            {milestones.map((m, i) => {
              const state = i < order.stage ? 'done' : i === order.stage ? 'current' : 'todo'
              return (
                <li key={m} className={state}>
                  <span className="t-dot">{state === 'done' ? <Check size={14} /> : state === 'current' ? <Clock size={14} /> : null}</span>
                  <div>
                    <strong>{m}</strong>
                    <span className="muted small block">Planned day {order.planned[i]}{order.actual[i] != null && ` · actual day ${order.actual[i]}`}</span>
                  </div>
                </li>
              )
            })}
          </ol>

          <form className="delay-form" onSubmit={submitDelay}>
            <label className="field inline">
              <span>Record delay (days)</span>
              <input type="number" min="0" max="60" value={delay} onChange={(e) => setDelay(e.target.value)} placeholder="e.g. 5" />
            </label>
            <button className="btn btn-ghost btn-small" type="submit">Save delay</button>
            <button className="btn btn-ghost btn-small" type="button" onClick={() => flagDelay(order.id, 0)}>Clear delay</button>
          </form>
        </section>
      </div>

      <ChartCard title="Planned vs actual progress" subtitle={`${order.id}, days from order date`}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chart} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5ecef" vertical={false} />
            <XAxis dataKey="name" fontSize={12} tickLine={false} />
            <YAxis fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip /><Legend />
            <Bar dataKey="Planned" fill={COLORS.grey} radius={[5, 5, 0, 0]} />
            <Bar dataKey="Actual" fill={COLORS.teal} radius={[5, 5, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  )
}
export default Monitoring
