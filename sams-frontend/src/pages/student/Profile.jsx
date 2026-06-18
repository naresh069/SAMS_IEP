import { useState } from 'react'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext.jsx'
import { initials } from '../../utils/helpers.js'

export default function Profile() {
  const { user, updateUser } = useAuth()
  const [form, setForm] = useState({
    name: user?.name || '', email: user?.email || '', phone: user?.phone || '',
  })

  const save = (e) => {
    e.preventDefault()
    updateUser(form)
    toast.success('Profile updated')
  }

  return (
    <div className="grid lg:grid-cols-3 gap-4 max-w-5xl">
      <div className="card p-6 text-center">
        <div className="w-20 h-20 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-2xl font-bold mx-auto">
          {initials(user?.name)}
        </div>
        <h2 className="font-semibold mt-3">{user?.name}</h2>
        <p className="text-sm text-slate-500">{user?.email}</p>
        <span className="badge-info mt-2 inline-block">{user?.role}</span>
        <div className="mt-4 text-left text-sm space-y-1 border-t pt-4">
          <p><span className="text-slate-500">Roll:</span> {user?.rollNumber}</p>
          <p><span className="text-slate-500">Class:</span> {user?.class}</p>
          <p><span className="text-slate-500">Section:</span> {user?.section}</p>
        </div>
      </div>

      <form className="card p-6 space-y-3 lg:col-span-2" onSubmit={save}>
        <h3 className="font-semibold">Edit Profile</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          <div><label className="label">Name</label><input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div><label className="label">Email</label><input className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
          <div className="sm:col-span-2"><label className="label">Phone</label><input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
        </div>
        <div className="flex justify-end"><button className="btn-primary">Save Changes</button></div>
      </form>
    </div>
  )
}
