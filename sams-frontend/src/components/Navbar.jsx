import { Menu, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { initials } from '../utils/helpers.js'

export default function Navbar({ onMenu, title }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
  }
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center px-4 md:px-6 gap-3">
      <button className="md:hidden p-2 -ml-2 rounded hover:bg-slate-100" onClick={onMenu}>
        <Menu size={20} />
      </button>
      <h1 className="font-semibold text-slate-800">{title}</h1>
      <div className="ml-auto flex items-center gap-3">
        <div className="hidden sm:block text-right">
          <p className="text-sm font-medium leading-tight">{user?.name}</p>
          <p className="text-xs text-slate-500">{user?.role}</p>
        </div>
        <div className="w-9 h-9 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-semibold">
          {initials(user?.name)}
        </div>
        <button onClick={handleLogout} className="btn-outline px-3 py-1.5 text-sm">
          <LogOut size={16} /> <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  )
}
