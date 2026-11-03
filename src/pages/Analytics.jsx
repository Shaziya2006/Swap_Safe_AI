import { useState } from 'react'
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, ComposedChart, Legend, Line, LineChart,
  Pie, PieChart, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis, ZAxis,
} from 'recharts'
import { Download, TrendingUp, PiggyBank, Truck, Gauge } from 'lucide-react'
import ChartCard from '../components/ChartCard'
import StatCard from '../components/StatCard'
import { months, riskTrend, spendTrend, suppliers } from '../data/mockData'
import { COLORS, PIE_COLORS, downloadCSV } from '../utils/helpers'

function Analytics() {
  const [region, setRegion] = useState('All')
  const data = suppliers.filter((s) => region === 'All' || s.region === region)

  const totalSpend = spendTrend.reduce((a, b) => a + b.spend, 0)
  const totalSavings = spendTrend.reduce((a, b) => a + b.savings, 0)
  const avgLead = data.length ? Math.round(data.reduce((a, b) => a + b.leadTime, 0) / data.length) : 0
  const avgRisk = data.length ? Math.round(data.reduce((a, b) => a + b.risk, 0) / data.length) : 0

  const otdSeries = months.map((m, i) => {
    const row = { month: m }
    data.forEach((s) => { row[s.name.split(' ')[0]] = s.otd[i] })
    return row
  })
  const lineColors = [COLORS.teal, COLORS.blue, COLORS.amber, COLORS.red, COLORS.violet, COLORS.navy, COLORS.grey, '#c26aa0']

  const costRisk = data.map((s) => ({ x: s.price, y: s.risk, z: s.capacity, name: s.name }))
  const countryMap = {}
  data.forEach((s) => { countryMap[s.state] = (countryMap[s.state] || 0) + 1 })
  const countryData = Object.entries(countryMap).map(([name, value]) => ({ name, value }))

  const savingsRate = spendTrend.map((m) => ({ ...m, rate: +((m.savings / m.spend) * 100).toFixed(1) }))
  const leadBars = [...data].sort((a, b) => a.leadTime - b.leadTime).map((s) => ({ name: s.name.split(' ')[0], days: s.leadTime }))

  return (
    <div className="page">
      <section className="card filters simple">
        <div className="segmented" role="group" aria-label="Region">
          {['All', 'North India', 'South India', 'West India', 'East India'].map((r) => (
            <button key={r} className={region === r ? 'active' : ''} onClick={() => setRegion(r)}>{r}</button>
          ))}
        </div>
        <button className="btn btn-small btn-ghost" onClick={() => downloadCSV('analytics-summary.csv', [
          ...spendTrend.map((m) => ({ Type: 'Monthly spend (₹ lakh)', Month: m.month, Spend: m.spend, Savings: m.savings })),
          ...data.map((s) => ({ Type: 'Supplier', Month: '', Spend: s.name, Savings: `risk ${s.risk}, lead ${s.leadTime}d` })),
        ])}>
          <Download size={15} /> Export CSV
        </button>
      </section>

      <div className="grid stats">
        <StatCard icon={TrendingUp} label="6-month spend" value={`₹${(totalSpend / 100).toFixed(2)} Cr`} hint="All categories" />
        <StatCard icon={PiggyBank} tone="amber" label="Savings found" value={`₹${totalSavings} L`} hint={`${((totalSavings / totalSpend) * 100).toFixed(1)}% of spend`} />
        <StatCard icon={Truck} tone="blue" label="Avg lead time" value={`${avgLead} days`} hint={`${data.length} suppliers`} />
        <StatCard icon={Gauge} tone={avgRisk >= 35 ? 'amber' : 'teal'} label="Avg risk score" value={avgRisk} hint="Lower is safer" />
      </div>

      <div className="grid two">
        <ChartCard title="Spend vs savings rate" subtitle="Bars: spend (₹ lakh). Line: savings rate (%)">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={savingsRate} margin={{ top: 8, right: 4, left: -12, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5ecef" vertical={false} />
              <XAxis dataKey="month" fontSize={12} tickLine={false} />
              <YAxis yAxisId="l" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis yAxisId="r" orientation="right" fontSize={12} tickLine={false} axisLine={false} unit="%" />
              <Tooltip /><Legend />
              <Bar yAxisId="l" dataKey="spend" name="Spend (₹ lakh)" fill={COLORS.teal} radius={[5, 5, 0, 0]} />
              <Line yAxisId="r" dataKey="rate" name="Savings rate" stroke={COLORS.amber} strokeWidth={2.5} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="On-time delivery by supplier" subtitle="%, last six months">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={otdSeries} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5ecef" />
              <XAxis dataKey="month" fontSize={12} tickLine={false} />
              <YAxis domain={[70, 100]} fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip />
              {data.map((s, i) => (
                <Line key={s.id} type="monotone" dataKey={s.name.split(' ')[0]} stroke={lineColors[i % lineColors.length]} strokeWidth={2} dot={false} />
              ))}
              <Legend />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid three">
        <ChartCard title="Price vs risk" subtitle="Bubble size is capacity">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 8, right: 12, left: -10, bottom: 14 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5ecef" />
              <XAxis type="number" dataKey="x" name="Avg price" unit="₹" fontSize={12} domain={[100, 600]} />
              <YAxis type="number" dataKey="y" name="Risk" fontSize={12} />
              <ZAxis type="number" dataKey="z" range={[70, 380]} name="Capacity" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter data={costRisk} fill={COLORS.teal} fillOpacity={0.7} />
            </ScatterChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Lead time ranking" subtitle="Days, shortest first">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={leadBars} layout="vertical" margin={{ left: 6, right: 12, top: 4, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5ecef" horizontal={false} />
              <XAxis type="number" fontSize={12} tickLine={false} />
              <YAxis type="category" dataKey="name" fontSize={12} width={72} tickLine={false} axisLine={false} />
              <Tooltip />
              <Bar dataKey="days" fill={COLORS.blue} radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Suppliers by state" subtitle="Concentration check">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={countryData} dataKey="value" nameKey="name" outerRadius="78%" paddingAngle={2}>
                {countryData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip /><Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <ChartCard title="Risk index over time" subtitle="Stacked contribution by type" className="wide">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={riskTrend} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5ecef" />
            <XAxis dataKey="month" fontSize={12} tickLine={false} />
            <YAxis fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip /><Legend />
            <Area type="monotone" dataKey="supply" stackId="1" name="Supply" stroke={COLORS.teal} fill={COLORS.teal} fillOpacity={0.55} />
            <Area type="monotone" dataKey="geopolitical" stackId="1" name="Geopolitical" stroke={COLORS.red} fill={COLORS.red} fillOpacity={0.5} />
            <Area type="monotone" dataKey="financial" stackId="1" name="Financial" stroke={COLORS.blue} fill={COLORS.blue} fillOpacity={0.5} />
            <Area type="monotone" dataKey="quality" stackId="1" name="Quality" stroke={COLORS.violet} fill={COLORS.violet} fillOpacity={0.5} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  )
}
export default Analytics
