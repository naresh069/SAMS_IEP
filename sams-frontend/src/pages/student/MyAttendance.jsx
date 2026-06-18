import { useEffect, useMemo, useState } from 'react'
import LoadingSpinner from '../../components/LoadingSpinner.jsx'
import DataTable from '../../components/DataTable.jsx'
import Pagination from '../../components/Pagination.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { attendanceService } from '../../services/attendanceService.js'
import { formatDate } from '../../utils/helpers.js'

const PAGE_SIZE = 10

export default function MyAttendance() {
  const { user } = useAuth()
  const [rows, setRows] = useState(null)
  const [filter, setFilter] = useState('')
  const [month, setMonth] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => { if (user) attendanceService.byStudent(user.id).then(setRows) }, [user])

  const filtered = useMemo(() => {
    if (!rows) return []
    return rows.filter((r) =>
      (!filter || r.status === filter) &&
      (!month || r.date.startsWith(month)),
    )
  }, [rows, filter, month])

  if (!rows) return <LoadingSpinner />

  const cols = [
    { key: 'date', label: 'Date', render: (r) => formatDate(r.date) },
    { key: 'class', label: 'Class' },
    { key: 'status', label: 'Status', render: (r) => <span className={r.status === 'PRESENT' ? 'badge-success' : 'badge-danger'}>{r.status}</span> },
  ]

  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="space-y-4">
      <div className="card p-4 flex flex-col sm:flex-row gap-3">
        <select className="input sm:w-40" value={filter} onChange={(e) => { setFilter(e.target.value); setPage(1) }}>
          <option value="">All Status</option>
          <option value="PRESENT">Present</option>
          <option value="ABSENT">Absent</option>
        </select>
        <input type="month" className="input sm:w-44" value={month} onChange={(e) => { setMonth(e.target.value); setPage(1) }} />
        <p className="ml-auto text-sm text-slate-500 self-center">{filtered.length} records</p>
      </div>
      <div className="card p-4"><DataTable columns={cols} rows={paged} /></div>
      <Pagination page={page} pageSize={PAGE_SIZE} total={filtered.length} onChange={setPage} />
    </div>
  )
}
