import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { studentService } from '../../services/studentService.js'
import { CLASSES } from '../../data/mockData.js'

const empty = { studentId: '', name: '', rollNumber: '', email: '', password: '', class: CLASSES[0], section: 'A', phone: '' }

export default function AddStudent() {
  const navigate = useNavigate()
  const [form, setForm] = useState(empty)
  const [loading, setLoading] = useState(false)
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { class: className, ...payload } = form
      await studentService.create({ ...payload, className })
      toast.success('Student added')
      navigate('/teacher/students')
    } catch (err) {
      toast.error(err.message || 'Failed to add student')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl">
      <div className="card p-6">
        <h2 className="font-semibold text-lg mb-4">Add New Student</h2>
        <form onSubmit={onSubmit} className="grid sm:grid-cols-2 gap-4">
          <div><label className="label">Student ID</label><input className="input" required value={form.studentId} onChange={set('studentId')} /></div>
          <div><label className="label">Roll Number</label><input className="input" required value={form.rollNumber} onChange={set('rollNumber')} /></div>
          <div className="sm:col-span-2"><label className="label">Full Name</label><input className="input" required value={form.name} onChange={set('name')} /></div>
          <div><label className="label">Email</label><input className="input" type="email" required value={form.email} onChange={set('email')} /></div>
          <div><label className="label">Password</label><input className="input" type="password" required minLength={6} value={form.password} onChange={set('password')} /></div>
          <div>
            <label className="label">Class</label>
            <select className="input" value={form.class} onChange={set('class')}>{CLASSES.map((c) => <option key={c}>{c}</option>)}</select>
          </div>
          <div><label className="label">Section</label><input className="input" value={form.section} onChange={set('section')} /></div>
          <div className="sm:col-span-2"><label className="label">Phone</label><input className="input" value={form.phone} onChange={set('phone')} /></div>
          <div className="sm:col-span-2 flex gap-2 justify-end">
            <button type="button" className="btn-outline" onClick={() => navigate(-1)}>Cancel</button>
            <button className="btn-primary" disabled={loading}>{loading ? 'Saving…' : 'Add Student'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
