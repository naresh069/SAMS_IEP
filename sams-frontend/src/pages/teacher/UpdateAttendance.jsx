import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import SearchBar from '../../components/SearchBar.jsx'
import LoadingSpinner from '../../components/LoadingSpinner.jsx'
import { studentService } from '../../services/studentService.js'
import { attendanceService } from '../../services/attendanceService.js'
import { todayISO, formatDate } from '../../utils/helpers.js'
import { CLASSES } from '../../data/mockData.js'

export default function UpdateAttendance() {
  const [date, setDate] = useState(todayISO())
  const [klass, setKlass] = useState(CLASSES[0])
  const [q, setQ] = useState('')
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(false)

  const load = async (d, c) => {
    setLoading(true)
    try {
      const [students, attendance] = await Promise.all([
        studentService.list(),
        attendanceService.byDate(d, c),
      ])
      const classStudents = students.filter((s) => s.class === c)
      const merged = classStudents.map((student) => {
        const existing = attendance.find((r) => Number(r.studentId) === Number(student.id))
        return {
          id: existing?.id ?? null,
          studentId: student.id,
          studentName: student.name,
          rollNumber: student.rollNumber,
          class: student.class,
          date: d,
          status: existing?.status ?? 'PRESENT',
          saved: Boolean(existing),
        }
      })
      setRecords(merged)
    } catch (err) {
      toast.error(err.message || 'Unable to load attendance')
      setRecords([])
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => { load(date, klass) }, [date, klass])

  const filtered = records.filter((r) =>
    !q || r.studentName.toLowerCase().includes(q.toLowerCase()) || r.rollNumber?.toLowerCase().includes(q.toLowerCase()),
  )

  const setStatus = async (r, next) => {
    try {
      if (r.id) {
        const updated = await attendanceService.update(r.id, next)
        setRecords((rs) => rs.map((x) => x.studentId === r.studentId ? { ...x, ...updated, status: next, saved: true } : x))
      } else {
        const [created] = await attendanceService.saveBulk(
          [{ studentId: r.studentId, date, status: next }],
          { date, className: klass },
        )
        setRecords((rs) => rs.map((x) => x.studentId === r.studentId ? { ...x, ...created, status: next, saved: true } : x))
      }
      toast.success('Updated')
    } catch (err) {
      toast.error(err.message || 'Update failed')
    }
  }

  return (
    <div className="space-y-4">
      <div className="card p-4 grid sm:grid-cols-3 gap-3">
        <div>
          <label className="label">Date</label>
          <input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div>
          <label className="label">Class</label>
          <select className="input" value={klass} onChange={(e) => setKlass(e.target.value)}>
            {CLASSES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Search Student</label>
          <SearchBar value={q} onChange={setQ} placeholder="Search by name or roll…" />
        </div>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="card p-4">
          <p className="text-sm text-slate-500 mb-3">{filtered.length} students in {klass} on {formatDate(date)}</p>
          <ul className="divide-y">
            {filtered.length === 0 && <p className="text-center py-6 text-slate-400 text-sm">No students found.</p>}
            {filtered.map((r) => (
              <li key={r.studentId} className="py-3 flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium">{r.studentName}</p>
                  <p className="text-xs text-slate-500">{r.rollNumber} · {r.class} · {r.saved ? 'Saved' : 'Not saved yet'}</p>
                </div>
                <div className="flex gap-2">
                  {['PRESENT', 'ABSENT'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setStatus(r, status)}
                      className={
                        'px-3 py-1.5 rounded-lg text-sm font-medium border transition ' +
                        (r.status === status
                          ? status === 'PRESENT'
                            ? 'bg-green-600 text-white border-green-600'
                            : 'bg-red-600 text-white border-red-600'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50')
                      }
                    >
                      {status === 'PRESENT' ? 'Present' : 'Absent'}
                    </button>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
