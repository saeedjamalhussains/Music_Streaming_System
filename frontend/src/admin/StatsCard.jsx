export default function StatsCard({ icon: Icon, label, value, color }) {
  return (
    <div className="admin-surface rounded-2xl p-5 transition-all hover:border-opacity-20" 
         style={{ borderColor: color }}>
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}15` }}>
          <Icon size={20} style={{ color }} />
        </div>
      </div>
      <p className="text-2xl font-bold" style={{ color: "var(--admin-text)" }}>{value}</p>
      <p className="text-xs mt-1" style={{ color: "var(--admin-muted)" }}>{label}</p>
    </div>
  )
}
