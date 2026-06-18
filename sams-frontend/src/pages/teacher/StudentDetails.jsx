import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Mail, Phone, GraduationCap, Hash } from 'lucide-react'
import LoadingSpinner from '../../components/LoadingSpinner.jsx'
import DataTable from '../../components/DataTable.jsx'
import CircularProgress from '../../components/charts/CircularProgress.jsx'
import { studentService } from '../../services/studentService.js'
import { attendanceService } from '../../services/attendanceService.js'
import { initials, formatDate } from '../../utils/helpers.js'

export default function StudentDetails() {
  const { id } = useParams()
  const [student, setStudent] = useState(null)
  const [summary, setSummary] = useState(null)
  const [records, setRecords] = useState([])

  useEffect(() => {
    (async () => {
      const [s, sum, recs] = await Promise.all([
        studentService.get(id),
        studentService.summary(id),
        attendanceService.byStudent(id),
      ])
      setStudent(s); setSummary(sum); setRecords(recs.slice(0, 10))
    })()
  }, [id])

  if (!student || !summary) return <LoadingSpinner />

  const columns = [
    { key: 'date', label: 'Date', render: (r) => formatDate(r.date) },
    { key: 'status', label: 'Status', render: (r) => (
      <span className={r.status === 'PRESENT' ? 'badge-success' : 'badge-danger'}>{r.status}</span>
    )},
  ]

  return (
    <div className="space-y-4">
      <div className="card p-6 flex flex-col md:flex-row gap-6 items-start">
        <div className="w-20 h-20 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-2xl font-bold">
          {initials(student.name)}
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold">{student.name}</h2>
          <p className="text-slate-500 text-sm">Student ID: {student.studentId}</p>
          <div className="grid sm:grid-cols-2 gap-3 mt-4 text-sm">
            <p className="flex items-center gap-2"><Hash size={14} /> Roll: {student.rollNumber}</p>
            <p className="flex items-center gap-2"><GraduationCap size={14} /> Class: {student.class} / {student.section}</p>
            <p className="flex items-center gap-2"><Mail size={14} /> {student.email}</p>
            <p className="flex items-center gap-2"><Phone size={14} /> {student.phone || '—'}</p>
          </div>
        </div>
        <Link to={`/teacher/students/${id}/edit`} className="btn-outline">Edit</Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="card p-5 flex flex-col items-center justify-center">
          <CircularProgress value={summary.percent} />
        </div>
        <div className="card p-5 lg:col-span-2 grid grid-cols-3 gap-4 items-center">
          <Stat label="Total"   value={summary.total}   />
          <Stat label="Present" value={summary.present} tone="text-green-600" />
          <Stat label="Absent"  value={summary.absent}  tone="text-red-600" />
        </div>
      </div>

      <div className="card p-5">
        <h3 className="font-semibold mb-3">Recent Records</h3>
        <DataTable columns={columns} rows={records} />
      </div>
    </div>
  )
}

function Stat({ label, value, tone = 'text-slate-800' }) {
  return (
    <div className="text-center">
      <p className={`text-3xl font-bold ${tone}`}>{value}</p>
      <p className="text-xs uppercase tracking-wider text-slate-500 mt-1">{label}</p>
    </div>
  )
}
