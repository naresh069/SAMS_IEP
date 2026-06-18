import { Inbox } from 'lucide-react'
export default function EmptyState({ title = 'No data', message = '' }) {
  return (
    <div className="text-center py-12 text-slate-500">
      <Inbox className="mx-auto mb-3 text-slate-300" size={40} />
      <p className="font-medium text-slate-700">{title}</p>
      {message && <p className="text-sm mt-1">{message}</p>}
    </div>
  )
}
