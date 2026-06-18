import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { authService } from '../../services/authService.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { AuthShell } from './TeacherLogin.jsx'

export default function StudentLogin() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('student@sams.com')
  const [password, setPassword] = useState('student123')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { user, token } = await authService.loginStudent(email, password)
      login(user, token)
      toast.success(`Welcome, ${user.name}`)
      navigate('/student/dashboard', { replace: true })
    } catch (err) {
      toast.error(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return <AuthShell title="Student Login" subtitle="Sign in to view your attendance.">
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
      <p className="text-sm text-center text-slate-400">
        Are you a teacher? <Link to="/login/teacher" className="text-primary-700 font-medium">Teacher login</Link>
      </p>
    </form>
  </AuthShell>
}
