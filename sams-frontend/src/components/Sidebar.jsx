import { NavLink } from 'react-router-dom'
import { classNames } from '../utils/helpers.js'

export default function Sidebar({ items, title, open, onClose }) {
  return (
    <>
      <div
        className={classNames(
          'fixed inset-0 bg-slate-900/40 z-30 md:hidden transition-opacity',
          open ? 'opacity-100' : 'opacity-0 pointer-events-none',
        )}
        onClick={onClose}
      />
      <aside
        className={classNames(
          'fixed md:static top-0 left-0 h-full w-64 bg-white border-r border-slate-200 z-40 transform transition-transform',
          open ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        )}
      >
        <div className="h-16 flex items-center px-5 border-b">
          <div className="w-8 h-8 rounded-lg bg-gradient-hero" />
          <span className="ml-2 font-bold text-slate-800">SAMS</span>
        </div>
        <p className="px-5 mt-4 mb-2 text-xs uppercase tracking-wider text-slate-400">{title}</p>
        <nav className="px-3 space-y-1">
          {items.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              end={it.end}
              onClick={onClose}
              className={({ isActive }) =>
                classNames(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50',
                )
              }
            >
              {it.icon && <it.icon size={18} />} {it.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  )
}
