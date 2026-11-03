import { useState } from 'react'
import {
  Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Scatter,
  ScatterChart, Tooltip, XAxis, YAxis, ZAxis, Legend,
} from 'recharts'
import { ChevronDown, CheckCircle2, RotateCcw, Lightbulb } from 'lucide-react'
import ChartCard from '../components/ChartCard'
import Badge from '../components/Badge'
import { useApp } from '../context/AppContext'
import { COLORS } from '../utils/helpers'

const sevColor = { High: COLORS.red, Medium: COLORS.amber, Low: COLORS.teal }

function RiskAssessment() {
  const { risks, setRiskStatus } = useApp()
  const [open, setOpen] = useState('R-01')
  const [filter, setFilter] = useState('All')
  const [status, setStatus] = useState('Open')

  const visible = risks
    .filter((r) => filter === 'All' || r.severity === filter)
    .filter((r) => status === 'All' || r.status === status)
    .sort((a, b) => b.score - a.score)

  const active = risks.filter((r) => r.status === 'Open')
  const sevData = ['High', 'Medium', 'Low'].map((s) => ({
    name: s, value: active.filter((r) => r.severity === s).length,
  })).filter((d) => d.value > 0)

  const catMap = {}
  active.forEach((r) => { catMap[r.category] = (catMap[r.category] || 0) + r.score })
  const catData = Object.entries(catMap).map(([name, score]) => ({ name, score }))

  const matrix = active.map((r) => ({ x: r.likelihood, y: r.impact, z: r.score, name: r.title, severity: r.severity }))

  return (
    <div className="page">
      <div className="grid three">
        <ChartCard title="Open risks by severity" subtitle="Active items only">
          {sevData.length === 0 ? <p className="muted center-text">No open risks.</p> : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={sevData} dataKey="value" nameKey="name" innerRadius="50%" outerRadius="78%" paddingAngle={3}>
                  {sevData.map((d) => <Cell key={d.name} fill={sevColor[d.name]} />)}
                </Pie>
                <Tooltip /><Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="Risk exposure by category" subtitle="Sum of risk scores">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={catData} layout="vertical" margin={{ left: 10, right: 12, top: 4, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5ecef" horizontal={false} />
              <XAxis type="number" fontSize={12} tickLine={false} />
              <YAxis type="category" dataKey="name" fontSize={12} width={84} tickLine={false} axisLine={false} />
              <Tooltip />
              <Bar dataKey="score" fill={COLORS.teal} radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Likelihood vs impact" subtitle="Bubble size is the risk score">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 8, right: 12, left: -14, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5ecef" />
              <XAxis type="number" dataKey="x" name="Likelihood" domain={[0, 5]} ticks={[1, 2, 3, 4, 5]} fontSize={12} />
              <YAxis type="number" dataKey="y" name="Impact" domain={[0, 5]} ticks={[1, 2, 3, 4, 5]} fontSize={12} />
              <ZAxis type="number" dataKey="z" range={[80, 420]} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} formatter={(v, n) => [v, n]} labelFormatter={() => ''} />
              <Scatter data={matrix} name="Risks">
                {matrix.map((m, i) => <Cell key={i} fill={sevColor[m.severity]} fillOpacity={0.75} />)}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <section className="card filters simple">
        <div className="segmented" role="group" aria-label="Severity filter">
          {['All', 'High', 'Medium', 'Low'].map((s) => (
            <button key={s} className={filter === s ? 'active' : ''} onClick={() => setFilter(s)}>{s}</button>
          ))}
        </div>
        <div className="segmented" role="group" aria-label="Status filter">
          {['Open', 'Mitigated', 'All'].map((s) => (
            <button key={s} className={status === s ? 'active' : ''} onClick={() => setStatus(s)}>{s}</button>
          ))}
        </div>
      </section>

      {visible.length === 0 && (
        <div className="card empty"><p><strong>Nothing to show.</strong></p><p className="muted">Change the filters to see other risks.</p></div>
      )}

      <div className="risk-list">
        {visible.map((r) => {
          const isOpen = open === r.id
          return (
            <article key={r.id} className={`card risk-item ${r.status === 'Mitigated' ? 'done' : ''}`}>
              <button className="risk-head" onClick={() => setOpen(isOpen ? null : r.id)} aria-expanded={isOpen}>
                <span className="risk-score" style={{ background: sevColor[r.severity] }}>{r.score}</span>
                <span className="risk-title">
                  <strong>{r.title}</strong>
                  <span className="muted small">{r.category} · {r.supplier}</span>
                </span>
                <Badge level={r.status === 'Mitigated' ? 'Approved' : r.severity}>{r.status === 'Mitigated' ? 'Mitigated' : r.severity}</Badge>
                <ChevronDown size={18} className={`chev ${isOpen ? 'up' : ''}`} />
              </button>
              {isOpen && (
                <div className="risk-body">
                  <h4>Evidence</h4>
                  <p>{r.evidence}</p>
                  <h4><Lightbulb size={15} /> Suggested actions</h4>
                  <ul>{r.actions.map((a) => <li key={a}>{a}</li>)}</ul>
                  <div className="btn-row">
                    {r.status === 'Open'
                      ? <button className="btn btn-primary btn-small" onClick={() => setRiskStatus(r.id, 'Mitigated')}><CheckCircle2 size={16} /> Mark mitigated</button>
                      : <button className="btn btn-ghost btn-small" onClick={() => setRiskStatus(r.id, 'Open')}><RotateCcw size={16} /> Reopen</button>}
                  </div>
                </div>
              )}
            </article>
          )
        })}
      </div>
    </div>
  )
}
export default RiskAssessment
