export function downloadCSV(filename, rows) {
  if (!rows.length) return
  const headers = Object.keys(rows[0])
  const escape = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`
  const csv = [headers.join(','), ...rows.map((r) => headers.map((h) => escape(r[h])).join(','))].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function riskLevel(score) {
  if (score >= 60) return 'High'
  if (score >= 35) return 'Medium'
  return 'Low'
}

// Indian digit grouping, e.g. ₹25,20,000
export function formatMoney(n) {
  return '₹' + Number(n).toLocaleString('en-IN')
}

// Compact Indian style: ₹4.5 L, ₹2.3 Cr
export function formatCompact(n) {
  const v = Number(n)
  if (Math.abs(v) >= 1e7) return '₹' + (v / 1e7).toFixed(2) + ' Cr'
  if (Math.abs(v) >= 1e5) return '₹' + (v / 1e5).toFixed(2) + ' L'
  return formatMoney(v)
}

export function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('') || 'U'
}

export function timeAgo(iso) {
  const diff = Math.max(0, Date.now() - new Date(iso).getTime())
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m} min ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h} h ago`
  return `${Math.floor(h / 24)} d ago`
}

export const COLORS = {
  teal: '#0f9d82',
  navy: '#0b2f3a',
  amber: '#e0a21b',
  red: '#d64545',
  blue: '#3b82c4',
  violet: '#7c6bd6',
  grey: '#8fa3ad',
}
export const PIE_COLORS = [COLORS.teal, COLORS.blue, COLORS.amber, COLORS.violet, COLORS.grey]
