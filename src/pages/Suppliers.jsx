import { useMemo, useState } from 'react'
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts'
import { Search, Star, StarOff, MapPin, Mail, BadgeCheck, LayoutGrid, Rows3, Download } from 'lucide-react'
import Modal from '../components/Modal'
import Badge from '../components/Badge'
import { suppliers, months } from '../data/mockData'
import { useApp } from '../context/AppContext'
import { COLORS, downloadCSV, riskLevel } from '../utils/helpers'

const sorters = {
  risk: (a, b) => a.risk - b.risk,
  price: (a, b) => a.price - b.price,
  leadTime: (a, b) => a.leadTime - b.leadTime,
  reliability: (a, b) => b.reliability - a.reliability,
  name: (a, b) => a.name.localeCompare(b.name),
}

function Suppliers() {
  const { shortlist, toggleShortlist, toast, addActivity } = useApp()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [region, setRegion] = useState('All')
  const [sortBy, setSortBy] = useState('risk')
  const [view, setView] = useState('grid')
  const [onlyShortlist, setOnlyShortlist] = useState(false)
  const [selected, setSelected] = useState(null)

  const categories = ['All', ...new Set(suppliers.map((s) => s.category))]
  const regions = ['All', ...new Set(suppliers.map((s) => s.region))]

  const list = useMemo(() => {
    const q = query.trim().toLowerCase()
    return suppliers
      .filter((s) => (category === 'All' || s.category === category))
      .filter((s) => (region === 'All' || s.region === region))
      .filter((s) => !onlyShortlist || shortlist.includes(s.id))
      .filter((s) => !q || `${s.name} ${s.country} ${s.category}`.toLowerCase().includes(q))
      .sort(sorters[sortBy])
  }, [query, category, region, sortBy, onlyShortlist, shortlist])

  const reset = () => { setQuery(''); setCategory('All'); setRegion('All'); setSortBy('risk'); setOnlyShortlist(false) }

  const radarData = selected && [
    { metric: 'Reliability', value: selected.reliability },
    { metric: 'Quality', value: selected.quality },
    { metric: 'Capacity', value: selected.capacity },
    { metric: 'Speed', value: Math.max(0, 100 - selected.leadTime * 2) },
    { metric: 'Safety', value: 100 - selected.risk },
  ]
  const otdData = selected && selected.otd.map((v, i) => ({ month: months[i], otd: v }))

  const contact = (s) => {
    addActivity(`Requested a quote from ${s.name}`)
    toast(`Quote request prepared for ${s.name}.`)
  }

  return (
    <div className="page">
      <section className="card filters">
        <label className="search">
          <Search size={17} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name, city, state or category" aria-label="Search suppliers" />
        </label>
        <select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Category">
          {categories.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select value={region} onChange={(e) => setRegion(e.target.value)} aria-label="Region">
          {regions.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} aria-label="Sort by">
          <option value="risk">Sort: lowest risk</option>
          <option value="price">Sort: lowest price</option>
          <option value="leadTime">Sort: shortest lead time</option>
          <option value="reliability">Sort: best reliability</option>
          <option value="name">Sort: name A–Z</option>
        </select>
        <div className="filter-row">
          <label className="check">
            <input type="checkbox" checked={onlyShortlist} onChange={(e) => setOnlyShortlist(e.target.checked)} />
            Shortlist only ({shortlist.length})
          </label>
          <div className="segmented" role="group" aria-label="View">
            <button className={view === 'grid' ? 'active' : ''} onClick={() => setView('grid')} aria-label="Card view"><LayoutGrid size={16} /></button>
            <button className={view === 'table' ? 'active' : ''} onClick={() => setView('table')} aria-label="Table view"><Rows3 size={16} /></button>
          </div>
          <button className="btn btn-small btn-ghost" onClick={reset}>Reset</button>
          <button className="btn btn-small btn-ghost" onClick={() => downloadCSV('suppliers.csv', list.map((s) => ({ ID: s.id, Name: s.name, City: s.city, State: s.state, Category: s.category, AvgUnitPriceINR: s.price, LeadTimeDays: s.leadTime, Reliability: s.reliability, Risk: s.risk })))}>
            <Download size={15} /> Export
          </button>
        </div>
      </section>

      <p className="muted small">{list.length} supplier{list.length !== 1 && 's'} shown</p>

      {list.length === 0 && (
        <div className="empty card">
          <p><strong>No suppliers match these filters.</strong></p>
          <p className="muted">Clear a filter or search term to see more results.</p>
          <button className="btn btn-primary" onClick={reset}>Clear filters</button>
        </div>
      )}

      {view === 'grid' && list.length > 0 && (
        <div className="grid cards">
          {list.map((s) => (
            <article key={s.id} className="card supplier-card">
              <div className="supplier-top">
                <div>
                  <h3>{s.name}</h3>
                  <p className="muted small"><MapPin size={13} /> {s.city}, {s.state} · {s.category}</p>
                </div>
                <button className={`icon-btn star ${shortlist.includes(s.id) ? 'on' : ''}`} onClick={() => toggleShortlist(s.id)} aria-label={shortlist.includes(s.id) ? 'Remove from shortlist' : 'Add to shortlist'}>
                  {shortlist.includes(s.id) ? <Star size={18} fill="currentColor" /> : <StarOff size={18} />}
                </button>
              </div>
              <div className="kv">
                <div><span>Avg price</span><strong>₹{s.price}</strong></div>
                <div><span>Lead time</span><strong>{s.leadTime}d</strong></div>
                <div><span>Reliability</span><strong>{s.reliability}%</strong></div>
              </div>
              <div className="supplier-foot">
                <Badge level={riskLevel(s.risk)}>{riskLevel(s.risk)} risk · {s.risk}</Badge>
                <button className="btn btn-small btn-primary" onClick={() => setSelected(s)}>View details</button>
              </div>
            </article>
          ))}
        </div>
      )}

      {view === 'table' && list.length > 0 && (
        <section className="card">
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>Supplier</th><th>Location</th><th>Avg price</th><th>Lead time</th><th>Reliability</th><th>Risk</th><th></th></tr></thead>
              <tbody>
                {list.map((s) => (
                  <tr key={s.id}>
                    <td><strong>{s.name}</strong><div className="muted small">{s.category}</div></td>
                    <td>{s.city}, {s.state}</td>
                    <td>₹{s.price}</td>
                    <td>{s.leadTime} days</td>
                    <td>{s.reliability}%</td>
                    <td><Badge level={riskLevel(s.risk)}>{s.risk}</Badge></td>
                    <td><button className="btn btn-small btn-ghost" onClick={() => setSelected(s)}>Details</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {selected && (
        <Modal
          title={selected.name}
          onClose={() => setSelected(null)}
          footer={
            <>
              <button className="btn btn-ghost" onClick={() => toggleShortlist(selected.id)}>
                {shortlist.includes(selected.id) ? 'Remove from shortlist' : 'Add to shortlist'}
              </button>
              <button className="btn btn-primary" onClick={() => { contact(selected); setSelected(null) }}>
                <Mail size={16} /> Request quote
              </button>
            </>
          }
        >
          <div className="detail-meta">
            <Badge level={selected.status}>{selected.status}</Badge>
            <span className="muted"><MapPin size={14} /> {selected.city}, {selected.state} ({selected.region})</span>
            <span className="muted">{selected.contact}</span>
          </div>
          <div className="kv four">
            <div><span>Avg price</span><strong>₹{selected.price}</strong></div>
            <div><span>Lead time</span><strong>{selected.leadTime} days</strong></div>
            <div><span>Quality</span><strong>{selected.quality}%</strong></div>
            <div><span>Capacity</span><strong>{selected.capacity}%</strong></div>
          </div>
          <div className="grid two compact">
            <div>
              <h4>Performance profile</h4>
              <div className="mini-chart">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData} outerRadius="70%">
                    <PolarGrid stroke="#d8e3e7" />
                    <PolarAngleAxis dataKey="metric" fontSize={11} />
                    <Radar dataKey="value" stroke={COLORS.teal} fill={COLORS.teal} fillOpacity={0.35} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div>
              <h4>On-time delivery, %</h4>
              <div className="mini-chart">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={otdData} margin={{ left: -20, right: 8, top: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5ecef" />
                    <XAxis dataKey="month" fontSize={11} tickLine={false} />
                    <YAxis domain={[70, 100]} fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Line type="monotone" dataKey="otd" name="On-time %" stroke={COLORS.navy} strokeWidth={2.5} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          <h4>Certifications</h4>
          <div className="chips">
            {selected.certs.map((c) => <span key={c} className="chip"><BadgeCheck size={14} /> {c}</span>)}
          </div>
        </Modal>
      )}
    </div>
  )
}
export default Suppliers
