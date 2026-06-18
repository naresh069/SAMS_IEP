import { Link } from 'react-router-dom'
import { GraduationCap, Users, BarChart3, ShieldCheck, ClipboardCheck, Smartphone } from 'lucide-react'

const features = [
  { icon: ClipboardCheck, title: 'One-Click Attendance', desc: 'Mark a whole class present or absent in seconds.' },
  { icon: BarChart3, title: 'Insightful Analytics', desc: 'Track trends, percentages and top performers.' },
  { icon: ShieldCheck, title: 'Role-Based Access', desc: 'Separate, secure portals for teachers and students.' },
  { icon: Smartphone, title: 'Fully Responsive', desc: 'Works perfectly on phone, tablet, and desktop.' },
  { icon: Users, title: 'Student Management', desc: 'Add, edit and search students with rich profiles.' },
  { icon: GraduationCap, title: 'Student Self-Service', desc: 'Students view their own history and percentage.' },
]

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-hero" />
          <span className="font-bold text-lg text-slate-800">SAMS</span>
        </div>
        <nav className="flex items-center gap-3">
          <Link to="/login/student" className="btn-outline">Student Login</Link>
          <Link to="/login/teacher" className="btn-primary">Teacher Login</Link>
        </nav>
      </header>

      <section className="bg-gradient-hero text-white">
        <div className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              Student Attendance,<br />Reimagined.
            </h1>
            <p className="mt-4 text-white/90 text-lg max-w-md">
              A modern web platform for teachers and students to manage attendance, track progress, and generate insightful reports.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/login/teacher" className="bg-white text-primary-700 font-semibold px-5 py-2.5 rounded-lg hover:bg-slate-100 transition">
                I'm a Teacher
              </Link>
              <Link to="/login/student" className="bg-white/10 border border-white/30 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-white/20 transition">
                I'm a Student
              </Link>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="grid grid-cols-2 gap-4">
                <Stat label="Students" value="450+" />
                <Stat label="Attendance Rate" value="92%" />
                <Stat label="Classes" value="24" />
                <Stat label="Records" value="12K+" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16 w-full">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 text-center">Everything you need, in one place</h2>
        <p className="text-slate-500 text-center mt-2">Designed for educators, loved by students.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
          {features.map((f) => (
            <div key={f.title} className="card p-6 hover:shadow-elegant transition-shadow">
              <div className="w-11 h-11 rounded-lg bg-primary-50 text-primary-700 flex items-center justify-center mb-3">
                <f.icon size={22} />
              </div>
              <h3 className="font-semibold text-slate-900">{f.title}</h3>
              <p className="text-sm text-slate-500 mt-1">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-6 text-sm text-slate-500 flex flex-col sm:flex-row justify-between gap-2">
          <p>© {new Date().getFullYear()} SAMS — Student Attendance Management System</p>
          <p>Built with React, Vite, and Tailwind CSS</p>
        </div>
      </footer>
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className="bg-white/10 rounded-xl p-4 text-center border border-white/20">
      <p className="text-3xl font-bold">{value}</p>
      <p className="text-xs uppercase tracking-wider text-white/80 mt-1">{label}</p>
    </div>
  )
}
