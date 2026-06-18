import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { authService } from '../../services/authService.js'
import { useAuth } from '../../context/AuthContext.jsx'

export default function TeacherLogin() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('teacher@sams.com')
  const [password, setPassword] = useState('teacher123')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { user, token } = await authService.loginTeacher(email, password)
      login(user, token)
      toast.success(`Welcome, ${user.name}`)
      navigate('/teacher/dashboard', { replace: true })
    } catch (err) {
      toast.error(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return <AuthShell title="Teacher Login" subtitle="Sign in to manage attendance and reports.">
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="label">Email</label>
        <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div>
        <label className="label">Password</label>
        <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>
      <button className="btn-primary w-full" disabled={loading}>{loading ? 'Signing in…' : 'Sign In'}</button>
      <p className="text-sm text-center text-slate-500">
        New teacher? <Link to="/register/teacher" className="text-primary-700 font-medium">Register</Link>
      </p>
      <p className="text-sm text-center text-slate-400">
        Are you a student? <Link to="/login/student" className="text-primary-700 font-medium">Student login</Link>
      </p>
    </form>
  </AuthShell>
}

export function AuthShell({ title, subtitle, children }) {
  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="hidden md:flex bg-gradient-hero text-white p-12 flex-col justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <div className="w-9 h-9 rounded-xl bg-white/20" /> SAMS
        </Link>
        <div>
          <h2 className="text-3xl font-extrabold leading-tight">Welcome back to SAMS.</h2>
          <p className="mt-3 text-white/85 max-w-sm">Mark, manage, and analyze student attendance — anywhere, on any device.</p>
        </div>
        <p className="text-white/60 text-sm">© {new Date().getFullYear()} SAMS</p>
      </div>
      <div className="flex items-center justify-center p-6 md:p-12 bg-white">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          <p className="text-slate-500 mt-1 mb-6 text-sm">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  )
}
