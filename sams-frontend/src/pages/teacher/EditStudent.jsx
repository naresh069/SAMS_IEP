import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import LoadingSpinner from '../../components/LoadingSpinner.jsx'
import { studentService } from '../../services/studentService.js'
import { CLASSES } from '../../data/mockData.js'

export default function EditStudent() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => { studentService.get(id).then(setForm) }, [id])
  if (!form) return <LoadingSpinner />

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await studentService.update(id, form)
      toast.success('Student updated')
      navigate('/teacher/students')
    } catch (err) {
      toast.error(err.message || 'Update failed')
    } finally { setSaving(false) }
  }

  return (
    <div className="max-w-3xl">
      <div className="card p-6">
        <h2 className="font-semibold text-lg mb-4">Edit Student</h2>
        <form onSubmit={onSubmit} className="grid sm:grid-cols-2 gap-4">
          <div><label className="label">Student ID</label><input className="input" value={form.studentId} onChange={set('studentId')} /></div>
          <div><label className="label">Roll Number</label><input className="input" value={form.rollNumber} onChange={set('rollNumber')} /></div>
          <div className="sm:col-span-2"><label className="label">Full Name</label><input className="input" value={form.name} onChange={set('name')} /></div>
          <div><label className="label">Email</label><input className="input" type="email" value={form.email} onChange={set('email')} /></div>
          <div><label className="label">Phone</label><input className="input" value={form.phone || ''} onChange={set('phone')} /></div>
          <div>
            <label className="label">Class</label>
            <select className="input" value={form.class} onChange={set('class')}>{CLASSES.map((c) => <option key={c}>{c}</option>)}</select>
          </div>
          <div><label className="label">Section</label><input className="input" value={form.section} onChange={set('section')} /></div>
          <div className="sm:col-span-2 flex gap-2 justify-end">
            <button type="button" className="btn-outline" onClick={() => navigate(-1)}>Cancel</button>
            <button className="btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save Changes'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
