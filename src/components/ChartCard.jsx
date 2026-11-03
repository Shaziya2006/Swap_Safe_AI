function ChartCard({ title, subtitle, children, action, className = '' }) {
  return (
    <section className={`card chart-card ${className}`}>
      <div className="card-head">
        <div>
          <h3>{title}</h3>
          {subtitle && <p className="muted small">{subtitle}</p>}
        </div>
        {action}
      </div>
      <div className="chart-box">{children}</div>
    </section>
  )
}
export default ChartCard
