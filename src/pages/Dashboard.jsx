import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart,
  Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'
import { AlertTriangle, ClipboardCheck, Factory, ShieldAlert, Timer, X, Download } from 'lucide-react'
import StatCard from '../components/StatCard'
import ChartCard from '../components/ChartCard'
import Badge from '../components/Badge'
import { useApp } from '../context/AppContext'
import { categorySpend, riskTrend, spendTrend, suppliers } from '../data/mockData'
import { COLORS, PIE_COLORS, downloadCSV, riskLevel } from '../utils/helpers'

function Dashboard() {
  const navigate = useNavigate()
  const { risks, approvals } = useApp()
  const [alertOpen, setAlertOpen] = useState(true)

  const openHigh = risks.filter((r) => r.status === 'Open' && r.severity === 'High')
  const avgOtd = Math.round(suppliers.reduce((s, x) => s + x.reliability, 0) / suppliers.length)
  const riskBars = [...suppliers].sort((a, b) => b.risk - a.risk).map((s) => ({
    name: s.name.split(' ')[0], risk: s.risk,
  }))

  return (
    <div className="page">
      {alertOpen && openHigh.length > 0 && (
        <div className="alert alert-warn">
          <AlertTriangle size={20} />
          <div className="alert-text">
            <strong>Disruption alert: {openHigh[0].title}</strong>
            <span>{openHigh[0].evidence}</span>
          </div>
          <div className="alert-actions">
            <button className="btn btn-small btn-dark" onClick={() => navigate('/risk-assessment')}>View risk</button>
            <button className="icon-btn" onClick={() => setAlertOpen(false)} aria-label="Dismiss alert"><X size={17} /></button>
          </div>
        </div>
      )}

      <div className="grid stats">
        <StatCard icon={Factory} label="Active suppliers" value={suppliers.length} hint="3 preferred" onClick={() => navigate('/suppliers')} />
        <StatCard icon={ShieldAlert} tone="red" label="High risks open" value={openHigh.length} hint="Needs action" onClick={() => navigate('/risk-assessment')} />
        <StatCard icon={ClipboardCheck} tone="amber" label="Pending approvals" value={approvals.length} hint="Human review required" onClick={() => navigate('/approvals')} />
        <StatCard icon={Timer} tone="blue" label="Avg reliability" value={`${avgOtd}%`} hint="On-time and in-spec" onClick={() => navigate('/analytics')} />
      </div>

      <div className="grid two">
        <ChartCard title="Spend and savings" subtitle="Monthly, in ₹ lakh">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={spendTrend} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
              <defs>
                <linearGradient id="gSpend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={COLORS.teal} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={COLORS.teal} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5ecef" />
              <XAxis dataKey="month" tickLine={false} fontSize={12} />
              <YAxis tickLine={false} axisLine={false} fontSize={12} />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="spend" name="Spend" stroke={COLORS.teal} strokeWidth={2.5} fill="url(#gSpend)" />
              <Area type="monotone" dataKey="savings" name="Savings" stroke={COLORS.amber} strokeWidth={2.5} fill="none" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Risk trend by type" subtitle="Index score, last six months">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={riskTrend} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5ecef" />
              <XAxis dataKey="month" tickLine={false} fontSize={12} />
              <YAxis tickLine={false} axisLine={false} fontSize={12} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="supply" name="Supply" stroke={COLORS.teal} strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="geopolitical" name="Geopolitical" stroke={COLORS.red} strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="financial" name="Financial" stroke={COLORS.blue} strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="quality" name="Quality" stroke={COLORS.violet} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid two">
        <ChartCard title="Supplier risk score" subtitle="Higher means riskier">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={riskBars} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5ecef" vertical={false} />
              <XAxis dataKey="name" tickLine={false} fontSize={12} interval={0} />
              <YAxis tickLine={false} axisLine={false} fontSize={12} />
              <Tooltip />
              <Bar dataKey="risk" name="Risk score" radius={[6, 6, 0, 0]}>
                {riskBars.map((b, i) => (
                  <Cell key={i} fill={b.risk >= 60 ? COLORS.red : b.risk >= 35 ? COLORS.amber : COLORS.teal} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Spend by category" subtitle="Share of total, %">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={categorySpend} dataKey="value" nameKey="name" innerRadius="52%" outerRadius="80%" paddingAngle={2}>
                {categorySpend.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <section className="card">
        <div className="card-head">
          <div>
            <h3>Supplier comparison</h3>
            <p className="muted small">Key metrics side by side</p>
          </div>
          <button className="btn btn-small btn-ghost" onClick={() => downloadCSV('supplier-comparison.csv',
            suppliers.map((s) => ({ Supplier: s.name, City: s.city, State: s.state, Category: s.category, AvgUnitPriceINR: s.price, LeadTimeDays: s.leadTime, ReliabilityPct: s.reliability, QualityPct: s.quality, Risk: s.risk })))}>
            <Download size={15} /> Export CSV
          </button>
        </div>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr><th>Supplier</th><th>Location</th><th>Category</th><th>Lead time</th><th>Reliability</th><th>Risk</th></tr>
            </thead>
            <tbody>
              {suppliers.map((s) => (
                <tr key={s.id}>
                  <td><Link to="/suppliers" className="strong-link">{s.name}</Link></td>
                  <td>{s.city}, {s.state}</td>
                  <td>{s.category}</td>
                  <td>{s.leadTime} days</td>
                  <td>
                    <div className="meter"><span style={{ width: `${s.reliability}%` }} /></div>
                    <span className="small">{s.reliability}%</span>
                  </td>
                  <td><Badge level={riskLevel(s.risk)}>{riskLevel(s.risk)} · {s.risk}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
export default Dashboard
