import { useEffect, useState } from 'react'
import LoadingSpinner from '../../components/LoadingSpinner.jsx'
import TrendLineChart from '../../components/charts/TrendLineChart.jsx'
import MonthlyBarChart from '../../components/charts/MonthlyBarChart.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { attendanceService } from '../../services/attendanceService.js'

export default function Analytics() {
  const { user } = useAuth()
  const [trend, setTrend] = useState([])
  const [monthly, setMonthly] = useState([])

  useEffect(() => {
    if (!user) return
    (async () => {
      const rec = await attendanceService.byStudent(user.id)
      const dayMap = {}
      for (const r of rec) {
        dayMap[r.date] = r.status === 'PRESENT' ? 100 : 0
      }
      setTrend(
        Object.entries(dayMap).sort().slice(-14).map(([date, percent]) => ({ date: date.slice(5), percent })),
      )
      const m = {}
      for (const r of rec) {
        const k = r.date.slice(0, 7)
        m[k] ||= { month: k, present: 0, absent: 0 }
        m[k][r.status === 'PRESENT' ? 'present' : 'absent']++
      }
      setMonthly(Object.values(m).sort((a, b) => a.month.localeCompare(b.month)))
    })()
  }, [user])

  if (!trend.length) return <LoadingSpinner />

  return (
    <div className="space-y-4">
      <div className="card p-5">
        <h3 className="font-semibold mb-2">Last 14 Days</h3>
        <TrendLineChart data={trend} />
      </div>
      <div className="card p-5">
        <h3 className="font-semibold mb-2">Monthly Comparison</h3>
        <MonthlyBarChart data={monthly} />
      </div>
    </div>
  )
}
