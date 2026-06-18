import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { authService } from '../../services/authService.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { AuthShell } from './TeacherLogin.jsx'

export default function TeacherRegister() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '', subject: '', phone: '' })
  const [loading, setLoading] = useState(false)

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { user, token } = await authService.registerTeacher(form)
      login(user, token)
      toast.success('Account created')
      navigate('/teacher/dashboard', { replace: true })
    } catch (err) {
      toast.error(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return <AuthShell title="Teacher Registration" subtitle="Create your teacher account.">
    <form onSubmit={onSubmit} className="space-y-3">
      <div><label className="label">Full Name</label><input className="input" required value={form.name} onChange={set('name')} /></div>
      <div><label className="label">Email</label><input className="input" type="email" required value={form.email} onChange={set('email')} /></div>
      <div><label className="label">Password</label><input className="input" type="password" required minLength={6} value={form.password} onChange={set('password')} /></div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className="label">Subject</label><input className="input" value={form.subject} onChange={set('subject')} /></div>
        <div><label className="label">Phone</label><input className="input" value={form.phone} onChange={set('phone')} /></div>
      </div>
      <button className="btn-primary w-full mt-2" disabled={loading}>{loading ? 'Creating…' : 'Create Account'}</button>
      <p className="text-sm text-center text-slate-500">
        Have an account? <Link to="/login/teacher" className="text-primary-700 font-medium">Sign in</Link>
      </p>
    </form>
  </AuthShell>
}
