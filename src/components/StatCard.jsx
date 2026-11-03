function StatCard({ icon: Icon, label, value, hint, tone = 'teal', onClick }) {
  const Tag = onClick ? 'button' : 'div'
  return (
    <Tag className={`stat-card tone-${tone} ${onClick ? 'clickable' : ''}`} onClick={onClick}>
      <span className="stat-icon">{Icon && <Icon size={20} />}</span>
      <span className="stat-body">
        <span className="stat-label">{label}</span>
        <span className="stat-value">{value}</span>
        {hint && <span className="stat-hint">{hint}</span>}
      </span>
    </Tag>
  )
}
export default StatCard
