import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Users, UserCheck, UserX, Percent, Database, Plus, ClipboardCheck, FileBarChart } from 'lucide-react'
import StatCard from '../../components/StatCard.jsx'
import LoadingSpinner from '../../components/LoadingSpinner.jsx'
import AttendancePieChart from '../../components/charts/AttendancePieChart.jsx'
import MonthlyBarChart from '../../components/charts/MonthlyBarChart.jsx'
import { reportService } from '../../services/reportService.js'
import { attendanceService } from '../../services/attendanceService.js'
import { todayISO, formatDate } from '../../utils/helpers.js'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [monthly, setMonthly] = useState([])
  const [recent, setRecent] = useState([])

  useEffect(() => {
    (async () => {
      const [s, m, today] = await Promise.all([
        reportService.overview(),
        reportService.monthly(),
        attendanceService.byDate(todayISO()),
      ])
      setStats(s)
      setMonthly(m.slice(-6))
      setRecent(today.slice(0, 6))
    })()
  }, [])

  if (!stats) return <LoadingSpinner />

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard label="Total Students" value={stats.totalStudents} icon={Users} tone="primary" />
        <StatCard label="Present Today"  value={stats.present}       icon={UserCheck} tone="success" />
        <StatCard label="Absent Today"   value={stats.absent}        icon={UserX} tone="danger" />
        <StatCard label="Overall %"      value={`${stats.percent}%`} icon={Percent} tone="info" />
        <StatCard label="Records"        value={stats.totalRecords}  icon={Database} tone="warning" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="card p-5 lg:col-span-1">
          <h3 className="font-semibold mb-2">Today's Attendance</h3>
          <AttendancePieChart present={stats.present} absent={stats.absent} />
        </div>
        <div className="card p-5 lg:col-span-2">
          <h3 className="font-semibold mb-2">Last 6 Months</h3>
          <MonthlyBarChart data={monthly} />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="card p-5">
          <h3 className="font-semibold mb-3">Quick Actions</h3>
          <div className="space-y-2">
            <Link to="/teacher/attendance/mark" className="btn-primary w-full"><ClipboardCheck size={16} /> Mark Attendance</Link>
            <Link to="/teacher/students/new"    className="btn-outline w-full"><Plus size={16} /> Add Student</Link>
            <Link to="/teacher/reports"         className="btn-outline w-full"><FileBarChart size={16} /> View Reports</Link>
          </div>
        </div>
        <div className="card p-5 lg:col-span-2">
          <h3 className="font-semibold mb-3">Recent — {formatDate(todayISO())}</h3>
          {recent.length === 0 ? (
            <p className="text-sm text-slate-500">No attendance marked yet today.</p>
          ) : (
            <ul className="divide-y">
              {recent.map((r) => (
                <li key={r.id} className="py-2.5 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-800">{r.studentName}</p>
                    <p className="text-xs text-slate-500">{r.class}</p>
                  </div>
                  <span className={r.status === 'PRESENT' ? 'badge-success' : 'badge-danger'}>{r.status}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
