import { classNames } from '../utils/helpers.js'

export default function StatCard({ label, value, icon: Icon, tone = 'primary', sub }) {
  const tones = {
    primary: 'bg-primary-50 text-primary-700',
    success: 'bg-green-50 text-green-700',
    danger:  'bg-red-50 text-red-700',
    warning: 'bg-amber-50 text-amber-700',
    info:    'bg-blue-50 text-blue-700',
  }
  return (
    <div className="card p-5 flex items-center gap-4">
      <div className={classNames('w-12 h-12 rounded-xl flex items-center justify-center', tones[tone])}>
        {Icon && <Icon size={22} />}
      </div>
      <div className="flex-1">
        <p className="text-sm text-slate-500">{label}</p>
        <p className="text-2xl font-semibold text-slate-900">{value}</p>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}
