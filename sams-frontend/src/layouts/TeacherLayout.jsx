import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { LayoutDashboard, Users, ClipboardCheck, Pencil, FileBarChart, PieChart, User } from 'lucide-react'
import Sidebar from '../components/Sidebar.jsx'
import Navbar from '../components/Navbar.jsx'

const items = [
  { to: '/teacher/dashboard',         label: 'Dashboard',          icon: LayoutDashboard },
  { to: '/teacher/students',          label: 'Students',           icon: Users },
  { to: '/teacher/attendance/mark',   label: 'Mark Attendance',    icon: ClipboardCheck },
  { to: '/teacher/attendance/update', label: 'Update Attendance',  icon: Pencil },
  { to: '/teacher/reports',           label: 'Reports',            icon: FileBarChart },
  { to: '/teacher/analytics',         label: 'Analytics',          icon: PieChart },
  { to: '/teacher/profile',           label: 'Profile',            icon: User },
]

const titleFor = (path) => {
  const item = items.find((i) => path.startsWith(i.to))
  return item?.label ?? 'Teacher Portal'
}

export default function TeacherLayout() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar items={items} title="Teacher Portal" open={open} onClose={() => setOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onMenu={() => setOpen(true)} title={titleFor(pathname)} />
        <main className="flex-1 p-4 md:p-6"><Outlet /></main>
      </div>
    </div>
  )
}
