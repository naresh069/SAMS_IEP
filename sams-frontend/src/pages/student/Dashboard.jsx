import { useEffect, useState } from 'react'
import { CalendarCheck, UserCheck, UserX, Percent } from 'lucide-react'
import StatCard from '../../components/StatCard.jsx'
import LoadingSpinner from '../../components/LoadingSpinner.jsx'
import CircularProgress from '../../components/charts/CircularProgress.jsx'
import TrendLineChart from '../../components/charts/TrendLineChart.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { attendanceService } from '../../services/attendanceService.js'
import { studentService } from '../../services/studentService.js'
import { todayISO, formatDate } from '../../utils/helpers.js'

export default function Dashboard() {
  const { user } = useAuth()
  const [summary, setSummary] = useState(null)
  const [today, setToday] = useState(null)
  const [trend, setTrend] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) return
    (async () => {
      setLoading(true)
      setError('')
      try {
        const [s, records] = await Promise.all([
          studentService.summary(user.id),
          attendanceService.byStudent(user.id),
        ])
        setSummary(s)
        setToday(records.find((r) => r.date === todayISO()) ?? null)
        const last14 = records.slice(0, 14).reverse().map((r) => ({
          date: r.date.slice(5), percent: r.status === 'PRESENT' ? 100 : 0,
        }))
        setTrend(last14)
      } catch (err) {
        setError(err.message || 'Unable to load attendance summary.')
        setSummary({ total: 0, present: 0, absent: 0, percent: 0 })
        setToday(null)
        setTrend([])
      } finally {
        setLoading(false)
      }
    })()
  }, [user])

  if (loading) return <LoadingSpinner />

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Classes" value={summary.total}   icon={CalendarCheck} tone="primary" />
        <StatCard label="Present"       value={summary.present} icon={UserCheck}     tone="success" />
        <StatCard label="Absent"        value={summary.absent}  icon={UserX}         tone="danger" />
        <StatCard label="Attendance"    value={`${summary.percent}%`} icon={Percent} tone="info" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="card p-5 flex flex-col items-center justify-center">
          <CircularProgress value={summary.percent} />
          <p className="text-xs text-slate-500 mt-2">Your Attendance</p>
        </div>
        <div className="card p-5 lg:col-span-2">
          <h3 className="font-semibold mb-2">Today — {formatDate(todayISO())}</h3>
          {today ? (
            <p className="mt-2">You were marked <span className={today.status === 'PRESENT' ? 'badge-success' : 'badge-danger'}>{today.status}</span>.</p>
          ) : (
            <p className="text-slate-500 text-sm mt-2">No attendance recorded today.</p>
          )}
          <h3 className="font-semibold mt-5 mb-1">Recent Pattern</h3>
          <TrendLineChart data={trend} />
        </div>
      </div>
    </div>
  )
}
