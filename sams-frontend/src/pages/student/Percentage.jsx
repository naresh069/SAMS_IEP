import { useEffect, useState } from 'react'
import LoadingSpinner from '../../components/LoadingSpinner.jsx'
import CircularProgress from '../../components/charts/CircularProgress.jsx'
import AttendancePieChart from '../../components/charts/AttendancePieChart.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { studentService } from '../../services/studentService.js'
import { attendanceService } from '../../services/attendanceService.js'

export default function Percentage() {
  const { user } = useAuth()
  const [summary, setSummary] = useState(null)
  const [byMonth, setByMonth] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) return
    (async () => {
      setLoading(true)
      setError('')
      try {
        const [s, rec] = await Promise.all([studentService.summary(user.id), attendanceService.byStudent(user.id)])
        setSummary(s)
        const m = {}
        for (const r of rec) {
          const k = r.date.slice(0, 7)
          m[k] ||= { present: 0, total: 0 }
          m[k].total++
          if (r.status === 'PRESENT') m[k].present++
        }
        setByMonth(Object.entries(m).sort().map(([month, v]) => ({
          month, percent: Math.round((v.present / v.total) * 100),
        })))
      } catch (err) {
        setError(err.message || 'Unable to load percentage details.')
        setSummary({ total: 0, present: 0, absent: 0, percent: 0 })
        setByMonth([])
      } finally {
        setLoading(false)
      }
    })()
  }, [user])

  if (loading) return <LoadingSpinner />

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <div className="card p-6 flex flex-col items-center justify-center">
          <CircularProgress value={summary.percent} size={200} />
          <p className="text-sm text-slate-500 mt-3">
            {summary.present} out of {summary.total} classes
          </p>
        </div>
        <div className="card p-5">
          <h3 className="font-semibold mb-2">Present vs Absent</h3>
          <AttendancePieChart present={summary.present} absent={summary.absent} />
        </div>
      </div>

      <div className="card p-5">
        <h3 className="font-semibold mb-3">Monthly Breakdown</h3>
        <div className="space-y-3">
          {byMonth.map((m) => (
            <div key={m.month}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">{m.month}</span>
                <span className="text-slate-500">{m.percent}%</span>
              </div>
              <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${m.percent}%`,
                    background: m.percent >= 75 ? '#16a34a' : m.percent >= 50 ? '#f59e0b' : '#dc2626',
                    transition: 'width 600ms ease',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
