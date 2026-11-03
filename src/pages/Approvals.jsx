import { useState } from 'react'
import { CheckCircle2, XCircle, HelpCircle, Download, History } from 'lucide-react'
import Badge from '../components/Badge'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'
import { downloadCSV, formatMoney } from '../utils/helpers'

function Approvals() {
  const { approvals, history, decide, toast } = useApp()
  const { user } = useAuth()
  const [comments, setComments] = useState({})

  const act = (id, decision, needsComment) => {
    const comment = (comments[id] || '').trim()
    if (needsComment && !comment) {
      toast('Add a comment so the requester knows why.', 'warn')
      return
    }
    decide(id, decision, comment, user.name)
    setComments((c) => ({ ...c, [id]: '' }))
  }

  return (
    <div className="page">
      <div className="section-head">
        <h2>Waiting for your decision <span className="count">{approvals.length}</span></h2>
      </div>

      {approvals.length === 0 && (
        <div className="card empty">
          <CheckCircle2 size={30} className="good" />
          <p><strong>No pending requests.</strong></p>
          <p className="muted">New requests from Component Analysis will appear here.</p>
        </div>
      )}

      <div className="approval-list">
        {approvals.map((a) => (
          <article key={a.id} className="card approval">
            <div className="approval-top">
              <div>
                <p className="muted small">{a.id} · submitted {a.submitted} · {a.requester}</p>
                <h3>{a.title}</h3>
              </div>
              <Badge level={a.risk}>{a.risk} risk</Badge>
            </div>
            <p>{a.summary}</p>
            <div className="kv three">
              <div><span>Supplier</span><strong>{a.supplier}</strong></div>
              <div><span>Order value</span><strong>{formatMoney(a.value)}</strong></div>
              <div><span>Est. savings</span><strong className={a.savings > 0 ? 'good' : ''}>{formatMoney(a.savings)}</strong></div>
            </div>
            <label className="field">
              <span>Decision comment</span>
              <textarea rows={2} value={comments[a.id] || ''} onChange={(e) => setComments({ ...comments, [a.id]: e.target.value })} placeholder="Required for reject or more information" />
            </label>
            <div className="btn-row">
              <button className="btn btn-primary" onClick={() => act(a.id, 'Approved', false)}><CheckCircle2 size={17} /> Approve</button>
              <button className="btn btn-danger" onClick={() => act(a.id, 'Rejected', true)}><XCircle size={17} /> Reject</button>
              <button className="btn btn-ghost" onClick={() => act(a.id, 'More information requested', true)}><HelpCircle size={17} /> Ask for more info</button>
            </div>
          </article>
        ))}
      </div>

      <section className="card">
        <div className="card-head">
          <h3><History size={18} /> Decision history</h3>
          <button className="btn btn-small btn-ghost" onClick={() => downloadCSV('decision-history.csv', history.map((h) => ({ Request: h.request, Decision: h.decision, DecidedBy: h.by, Comment: h.comment, Date: h.date })))}>
            <Download size={15} /> Export CSV
          </button>
        </div>
        <ul className="history">
          {history.map((h) => (
            <li key={h.id}>
              <div className="history-top">
                <strong>{h.request}</strong>
                <Badge level={h.decision === 'Approved' ? 'Approved' : h.decision === 'Rejected' ? 'High' : 'Medium'}>{h.decision}</Badge>
              </div>
              <p className="muted small">{h.by} · {h.date}</p>
              <p>{h.comment}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
export default Approvals
