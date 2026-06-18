export default function LoadingSpinner({ label = 'Loading…' }) {
  return (
    <div className="flex items-center justify-center gap-2 py-8 text-slate-500">
      <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      {label}
    </div>
  )
}
