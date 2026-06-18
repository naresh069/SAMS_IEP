import { useEffect, useState } from 'react'
import LoadingSpinner from '../../components/LoadingSpinner.jsx'
import DataTable from '../../components/DataTable.jsx'
import MonthlyBarChart from '../../components/charts/MonthlyBarChart.jsx'
import { reportService } from '../../services/reportService.js'
import { attendanceService } from '../../services/attendanceService.js'
import { studentService } from '../../services/studentService.js'
import { todayISO, formatDate } from '../../utils/helpers.js'

const TABS = ['Daily', 'Monthly', 'Per-Student']

export default function Reports() {
  const [tab, setTab] = useState('Daily')
  return (
    <div className="space-y-4">
      <div className="flex gap-2 border-b">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={
              'px-4 py-2 text-sm font-medium border-b-2 -mb-px transition ' +
              (tab === t ? 'border-primary text-primary-700' : 'border-transparent text-slate-500 hover:text-slate-700')
            }
          >{t}</button>
        ))}
      </div>
      {tab === 'Daily' && <DailyReport />}
      {tab === 'Monthly' && <MonthlyReport />}
      {tab === 'Per-Student' && <PerStudentReport />}
    </div>
  )
}

function DailyReport() {
  const [date, setDate] = useState(todayISO())
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  useEffect(() => { setLoading(true); attendanceService.byDate(date).then((r) => { setRows(r); setLoading(false) }) }, [date])
  const cols = [
    { key: 'studentName', label: 'Student' },
    { key: 'class', label: 'Class' },
    { key: 'status', label: 'Status', render: (r) => <span className={r.status === 'PRESENT' ? 'badge-success' : 'badge-danger'}>{r.status}</span> },
  ]
  return (
    <div className="space-y-3">
      <div className="card p-4 max-w-xs">
        <label className="label">Date</label>
        <input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>
      {loading ? <LoadingSpinner /> : (
        <div className="card p-4">
          <p className="text-sm text-slate-500 mb-2">{rows.length} records on {formatDate(date)}</p>
          <DataTable columns={cols} rows={rows} />
        </div>
      )}
    </div>
  )
}

function MonthlyReport() {
  const [data, setData] = useState([])
  useEffect(() => { reportService.monthly().then(setData) }, [])
  const cols = [
    { key: 'month', label: 'Month' },
    { key: 'present', label: 'Present' },
    { key: 'absent', label: 'Absent' },
    { key: 'total', label: 'Total' },
    { key: 'percent', label: '%', render: (r) => `${Math.round((r.present / r.total) * 100)}%` },
  ]
  return (
    <div className="space-y-4">
      <div className="card p-5"><MonthlyBarChart data={data} /></div>
      <div className="card p-4"><DataTable columns={cols} rows={data} /></div>
    </div>
  )
}

function PerStudentReport() {
  const [rows, setRows] = useState([])
  useEffect(() => {
    (async () => {
      const list = await studentService.list()
      const out = await Promise.all(list.map(async (s) => ({ ...s, ...(await studentService.summary(s.id)) })))
      setRows(out)
    })()
  }, [])
  const cols = [
    { key: 'name', label: 'Name' },
    { key: 'class', label: 'Class' },
    { key: 'present', label: 'Present' },
    { key: 'absent', label: 'Absent' },
    { key: 'percent', label: 'Attendance %', render: (r) =>
      <span className={r.percent >= 75 ? 'badge-success' : r.percent >= 50 ? 'badge-info' : 'badge-danger'}>{r.percent}%</span>
    },
  ]
  return <div className="card p-4"><DataTable columns={cols} rows={rows} /></div>
}
