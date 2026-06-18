import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { LayoutDashboard, CalendarCheck, Percent, BarChart3, User } from 'lucide-react'
import Sidebar from '../components/Sidebar.jsx'
import Navbar from '../components/Navbar.jsx'

const items = [
  { to: '/student/dashboard',  label: 'Dashboard',     icon: LayoutDashboard },
  { to: '/student/attendance', label: 'My Attendance', icon: CalendarCheck },
  { to: '/student/percentage', label: 'Percentage',    icon: Percent },
  { to: '/student/analytics',  label: 'Analytics',     icon: BarChart3 },
  { to: '/student/profile',    label: 'Profile',       icon: User },
]

const titleFor = (path) => items.find((i) => path.startsWith(i.to))?.label ?? 'Student Portal'

export default function StudentLayout() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar items={items} title="Student Portal" open={open} onClose={() => setOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onMenu={() => setOpen(true)} title={titleFor(pathname)} />
        <main className="flex-1 p-4 md:p-6"><Outlet /></main>
      </div>
    </div>
  )
}
