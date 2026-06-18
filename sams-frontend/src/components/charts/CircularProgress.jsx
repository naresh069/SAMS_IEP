export default function CircularProgress({ value = 0, size = 160, stroke = 14 }) {
  const radius = (size - stroke) / 2
  const c = 2 * Math.PI * radius
  const offset = c - (value / 100) * c
  const color = value >= 75 ? '#16a34a' : value >= 50 ? '#f59e0b' : '#dc2626'
  return (
    <div className="relative inline-flex" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="#e2e8f0" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          stroke={color} strokeWidth={stroke} fill="none"
          strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 600ms ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold" style={{ color }}>{value}%</span>
        <span className="text-xs text-slate-500">Attendance</span>
      </div>
    </div>
  )
}
