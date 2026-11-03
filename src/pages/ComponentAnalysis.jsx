import { useState } from 'react'
import {
  Bar, BarChart, CartesianGrid, Legend, PolarAngleAxis, PolarGrid, Radar, RadarChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'
import { AlertTriangle, Send, CheckCircle2 } from 'lucide-react'
import ChartCard from '../components/ChartCard'
import Badge from '../components/Badge'
import { candidates, referenceComponent as ref } from '../data/mockData'
import { useApp } from '../context/AppContext'
import { COLORS, riskLevel } from '../utils/helpers'

function ComponentAnalysis() {
  const { submitApproval } = useApp()
  const [selectedId, setSelectedId] = useState(candidates[0].id)
  const [acknowledged, setAcknowledged] = useState(false)
  const [sent, setSent] = useState([])

  const cand = candidates.find((c) => c.id === selectedId)
  const saving = ((ref.price - cand.price) * 12000).toFixed(0) // ₹

  const rows = [
    ['Manufacturer / supplier', ref.supplier, cand.supplier],
    ['Unit price', `₹${ref.price}`, `₹${cand.price}`],
    ['Lead time', `${ref.leadTime} days`, `${cand.leadTime} days`],
    ['Stock available', ref.stock.toLocaleString(), cand.stock.toLocaleString()],
    ['Temperature range', ref.tempRange, cand.tempRange],
    ['Package', ref.package, cand.package],
    ['Flash memory', ref.flash, cand.flash],
    ['Compliance', ref.compliance, cand.compliance],
  ]

  const radar = [
    { metric: 'Pin match', ref: 100, candidate: cand.pinMatch },
    { metric: 'Performance', ref: 100, candidate: cand.perfMatch },
    { metric: 'Availability', ref: 60, candidate: cand.availability },
    { metric: 'Cost', ref: 60, candidate: cand.costScore },
    { metric: 'Safety', ref: 86, candidate: 100 - cand.riskScore },
  ]

  const bars = candidates.map((c) => ({
    name: c.name,
    'Lead time (days)': c.leadTime,
    'Price (₹)': c.price,
  }))
  bars.unshift({ name: ref.name + ' (ref)', 'Lead time (days)': ref.leadTime, 'Price (₹)': ref.price })

  const submit = () => {
    submitApproval({
      title: `Switch MCU source to ${cand.name}`,
      supplier: cand.supplier,
      value: Math.round(cand.price * 12000),
      savings: Number(saving) > 0 ? Number(saving) : 0,
      risk: riskLevel(cand.riskScore),
      summary: cand.notes + ' Engineering validation acknowledged.',
    })
    setSent([...sent, cand.id])
    setAcknowledged(false)
  }

  const alreadySent = sent.includes(cand.id)

  return (
    <div className="page">
      <section className="card">
        <div className="card-head">
          <div>
            <h3>Reference component</h3>
            <p className="muted small">{ref.type}</p>
          </div>
          <Badge level="Low">In production</Badge>
        </div>
        <div className="kv four">
          <div><span>Part</span><strong>{ref.name}</strong></div>
          <div><span>Price</span><strong>₹{ref.price}</strong></div>
          <div><span>Lead time</span><strong>{ref.leadTime} days</strong></div>
          <div><span>Stock</span><strong>{ref.stock.toLocaleString()}</strong></div>
        </div>
      </section>

      <section className="card">
        <h3>Choose a candidate substitute</h3>
        <div className="candidate-list" role="radiogroup" aria-label="Candidate components">
          {candidates.map((c) => (
            <button
              key={c.id}
              role="radio"
              aria-checked={c.id === selectedId}
              className={`candidate ${c.id === selectedId ? 'active' : ''}`}
              onClick={() => { setSelectedId(c.id); setAcknowledged(false) }}
            >
              <strong>{c.name}</strong>
              <span className="muted small">{c.supplier}</span>
              <span className="small">Pin match {c.pinMatch}% · ₹{c.price}</span>
            </button>
          ))}
        </div>
      </section>

      <div className="alert alert-warn">
        <AlertTriangle size={20} />
        <div className="alert-text">
          <strong>Engineering validation required</strong>
          <span>{cand.notes} SWAPSAFE AI scores compatibility from datasheet data only. A hardware engineer must verify before any substitution.</span>
        </div>
      </div>

      <div className="grid two">
        <ChartCard title="Compatibility profile" subtitle="Reference vs selected candidate">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radar} outerRadius="72%">
              <PolarGrid stroke="#d8e3e7" />
              <PolarAngleAxis dataKey="metric" fontSize={12} />
              <Radar name="Reference" dataKey="ref" stroke={COLORS.navy} fill={COLORS.navy} fillOpacity={0.15} />
              <Radar name={cand.name} dataKey="candidate" stroke={COLORS.teal} fill={COLORS.teal} fillOpacity={0.35} />
              <Legend />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Price and lead time" subtitle="All options">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={bars} margin={{ top: 8, right: 8, left: -14, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5ecef" vertical={false} />
              <XAxis dataKey="name" fontSize={10} tickLine={false} interval={0} />
              <YAxis fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Lead time (days)" fill={COLORS.blue} radius={[5, 5, 0, 0]} />
              <Bar dataKey="Price (₹)" fill={COLORS.teal} radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <section className="card">
        <div className="card-head">
          <h3>Side-by-side comparison</h3>
          <Badge level={riskLevel(cand.riskScore)}>{riskLevel(cand.riskScore)} risk · {cand.riskScore}</Badge>
        </div>
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Attribute</th><th>{ref.name} (reference)</th><th>{cand.name}</th></tr></thead>
            <tbody>
              {rows.map(([k, a, b]) => (
                <tr key={k}><td className="muted">{k}</td><td>{a}</td><td><strong>{b}</strong></td></tr>
              ))}
              <tr>
                <td className="muted">Estimated saving (12,000 units)</td>
                <td>–</td>
                <td><strong className={Number(saving) >= 0 ? 'good' : 'bad'}>₹{Number(saving).toLocaleString('en-IN')}</strong></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="submit-box">
          <label className="check">
            <input type="checkbox" checked={acknowledged} onChange={(e) => setAcknowledged(e.target.checked)} disabled={alreadySent} />
            I understand an engineer must validate this substitute before approval.
          </label>
          <button className="btn btn-primary" disabled={!acknowledged || alreadySent} onClick={submit}>
            {alreadySent ? <><CheckCircle2 size={17} /> Sent for approval</> : <><Send size={17} /> Send for approval</>}
          </button>
        </div>
      </section>
    </div>
  )
}
export default ComponentAnalysis
