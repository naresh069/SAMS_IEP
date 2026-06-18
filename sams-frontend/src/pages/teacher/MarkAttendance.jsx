import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { Check, X, Save } from 'lucide-react'
import LoadingSpinner from '../../components/LoadingSpinner.jsx'
import { studentService } from '../../services/studentService.js'
import { attendanceService } from '../../services/attendanceService.js'
import { CLASSES } from '../../data/mockData.js'
import { todayISO } from '../../utils/helpers.js'

export default function MarkAttendance() {
  const [date, setDate] = useState(todayISO())
  const [klass, setKlass] = useState(CLASSES[0])
  const [students, setStudents] = useState([])
  const [marks, setMarks] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    (async () => {
      setLoading(true)
      try {
        const [all, existing] = await Promise.all([
          studentService.list(),
          attendanceService.byDate(date, klass),
        ])
        const filtered = all.filter((s) => s.class === klass)
        setStudents(filtered)
        const m = {}
        for (const s of filtered) {
          const ex = existing.find((r) => Number(r.studentId) === Number(s.id))
          m[s.id] = ex?.status ?? 'PRESENT'
        }
        setMarks(m)
      } catch (err) {
        toast.error(err.message || 'Unable to load students')
        setStudents([])
        setMarks({})
      } finally {
        setLoading(false)
      }
    })()
  }, [date, klass])

  const counts = useMemo(() => {
    const v = Object.values(marks)
    return { p: v.filter((x) => x === 'PRESENT').length, a: v.filter((x) => x === 'ABSENT').length }
  }, [marks])

  const setAll = (status) => setMarks(Object.fromEntries(students.map((s) => [s.id, status])))

  const save = async () => {
    setSaving(true)
    try {
      const payload = students.map((s) => ({ studentId: s.id, date, status: marks[s.id] }))
      await attendanceService.saveBulk(payload, { date, className: klass })
      setMarks(Object.fromEntries(payload.map((r) => [r.studentId, r.status])))
      toast.success('Attendance saved')
    } catch (err) {
      toast.error(err.message || 'Save failed')
    } finally { setSaving(false) }
  }

  return (
    <div className="space-y-4">
      <div className="card p-4 grid sm:grid-cols-4 gap-3">
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
        <div className="sm:col-span-2 flex items-end gap-2 justify-end">
          <button className="btn-outline" onClick={() => setAll('PRESENT')}><Check size={16} /> All Present</button>
          <button className="btn-outline" onClick={() => setAll('ABSENT')}><X size={16} /> All Absent</button>
        </div>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="card p-4">
          <div className="flex justify-between mb-3 text-sm text-slate-600">
            <p>{students.length} students in {klass}</p>
            <p><span className="text-green-600 font-semibold">{counts.p}</span> Present · <span className="text-red-600 font-semibold">{counts.a}</span> Absent</p>
          </div>
          <ul className="divide-y">
            {students.map((s) => (
              <li key={s.id} className="py-3 flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium">{s.name}</p>
                  <p className="text-xs text-slate-500">{s.rollNumber}</p>
                </div>
                <div className="flex gap-2">
                  {['PRESENT', 'ABSENT'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setMarks({ ...marks, [s.id]: st })}
                      className={
                        'px-3 py-1.5 rounded-lg text-sm font-medium border transition ' +
                        (marks[s.id] === st
                          ? st === 'PRESENT'
                            ? 'bg-green-600 text-white border-green-600'
                            : 'bg-red-600 text-white border-red-600'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50')
                      }
                    >
                      {st === 'PRESENT' ? 'Present' : 'Absent'}
                    </button>
                  ))}
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-end">
            <button className="btn-primary" disabled={saving || students.length === 0} onClick={save}>
              <Save size={16} /> {saving ? 'Saving…' : 'Save Attendance'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
