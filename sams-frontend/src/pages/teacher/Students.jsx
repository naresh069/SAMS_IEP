import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Plus, Eye, Pencil, Trash2 } from 'lucide-react'
import SearchBar from '../../components/SearchBar.jsx'
import Pagination from '../../components/Pagination.jsx'
import Modal from '../../components/Modal.jsx'
import DataTable from '../../components/DataTable.jsx'
import { studentService } from '../../services/studentService.js'
import { CLASSES } from '../../data/mockData.js'

const PAGE_SIZE = 6

export default function Students() {
  const [students, setStudents] = useState([])
  const [q, setQ] = useState('')
  const [klass, setKlass] = useState('')
  const [sort, setSort] = useState('name')
  const [page, setPage] = useState(1)
  const [toDelete, setToDelete] = useState(null)

  const load = async () => setStudents(await studentService.list())
  useEffect(() => { load() }, [])

  const filtered = useMemo(() => {
    let r = students.filter((s) =>
      (!q || s.name.toLowerCase().includes(q.toLowerCase()) || s.rollNumber.toLowerCase().includes(q.toLowerCase())) &&
      (!klass || s.class === klass),
    )
    r.sort((a, b) => (sort === 'name' ? a.name.localeCompare(b.name) : a.rollNumber.localeCompare(b.rollNumber)))
    return r
  }, [students, q, klass, sort])

  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const confirmDelete = async () => {
    await studentService.remove(toDelete.id)
    toast.success('Student removed')
    setToDelete(null)
    load()
  }

  const columns = [
    { key: 'rollNumber', label: 'Roll' },
    { key: 'name', label: 'Name', render: (s) => <span className="font-medium">{s.name}</span> },
    { key: 'class', label: 'Class' },
    { key: 'email', label: 'Email' },
    {
      key: 'actions', label: 'Actions',
      render: (s) => (
        <div className="flex gap-1">
          <Link to={`/teacher/students/${s.id}`} className="p-1.5 rounded hover:bg-slate-100" title="View"><Eye size={16} /></Link>
          <Link to={`/teacher/students/${s.id}/edit`} className="p-1.5 rounded hover:bg-slate-100" title="Edit"><Pencil size={16} /></Link>
          <button onClick={() => setToDelete(s)} className="p-1.5 rounded hover:bg-red-50 text-danger" title="Delete"><Trash2 size={16} /></button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <h2 className="text-lg font-semibold">All Students ({filtered.length})</h2>
        <Link to="/teacher/students/new" className="btn-primary"><Plus size={16} /> Add Student</Link>
      </div>

      <div className="card p-4 flex flex-col md:flex-row gap-3">
        <div className="flex-1"><SearchBar value={q} onChange={(v) => { setQ(v); setPage(1) }} placeholder="Search by name or roll…" /></div>
        <select className="input md:w-44" value={klass} onChange={(e) => { setKlass(e.target.value); setPage(1) }}>
          <option value="">All Classes</option>
          {CLASSES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select className="input md:w-40" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="name">Sort: Name</option>
          <option value="roll">Sort: Roll No.</option>
        </select>
      </div>

      <div className="card p-4">
        <DataTable columns={columns} rows={paged} empty="No students found" />
      </div>

      <Pagination page={page} pageSize={PAGE_SIZE} total={filtered.length} onChange={setPage} />

      <Modal
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        title="Delete student?"
        footer={
          <>
            <button className="btn-outline" onClick={() => setToDelete(null)}>Cancel</button>
            <button className="btn-danger" onClick={confirmDelete}>Delete</button>
          </>
        }
      >
        <p className="text-sm text-slate-600">
          This will permanently remove <strong>{toDelete?.name}</strong> and their attendance records.
        </p>
      </Modal>
    </div>
  )
}
