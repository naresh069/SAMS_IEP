import { useEffect, useState } from 'react'
import { Trophy, AlertTriangle } from 'lucide-react'
import LoadingSpinner from '../../components/LoadingSpinner.jsx'
import TrendLineChart from '../../components/charts/TrendLineChart.jsx'
import CircularProgress from '../../components/charts/CircularProgress.jsx'
import { reportService } from '../../services/reportService.js'

export default function Analytics() {
  const [stats, setStats] = useState(null)
  const [trend, setTrend] = useState([])
  const [board, setBoard] = useState(null)
  useEffect(() => {
    (async () => {
      const [s, t, b] = await Promise.all([reportService.overview(), reportService.trend(), reportService.leaderboard()])
      setStats(s); setTrend(t); setBoard(b)
    })()
  }, [])

  if (!stats || !board) return <LoadingSpinner />

  return (
    <div className="space-y-4">
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="card p-5 flex flex-col items-center justify-center">
          <CircularProgress value={stats.percent} />
          <p className="text-sm text-slate-500 mt-2">Overall Attendance</p>
        </div>
        <div className="card p-5 lg:col-span-2">
          <h3 className="font-semibold mb-2">Last 14 Days Trend</h3>
          <TrendLineChart data={trend} />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <List title="Top Attendance" icon={Trophy} tone="text-green-600" items={board.top} />
        <List title="Needs Attention"  icon={AlertTriangle} tone="text-red-600"   items={board.bottom} />
      </div>
    </div>
  )
}

function List({ title, icon: Icon, tone, items }) {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-3">
        <Icon className={tone} size={18} /><h3 className="font-semibold">{title}</h3>
      </div>
      <ul className="divide-y">
        {items.map((s) => (
          <li key={s.id} className="py-2.5 flex items-center justify-between">
            <div>
              <p className="font-medium">{s.name}</p>
              <p className="text-xs text-slate-500">{s.class}</p>
            </div>
            <span className={s.percent >= 75 ? 'badge-success' : s.percent >= 50 ? 'badge-info' : 'badge-danger'}>{s.percent}%</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
