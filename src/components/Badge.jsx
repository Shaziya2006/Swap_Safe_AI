function Badge({ level, children }) {
  const key = String(level).toLowerCase().replace(/\s+/g, '-')
  return <span className={`badge badge-${key}`}>{children ?? level}</span>
}
export default Badge
