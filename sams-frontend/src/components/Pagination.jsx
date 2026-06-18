export default function Pagination({ page, pageSize, total, onChange }) {
  const pages = Math.max(1, Math.ceil(total / pageSize))
  return (
    <div className="flex items-center justify-between text-sm text-slate-600">
      <p>
        Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total}
      </p>
      <div className="flex gap-2">
        <button className="btn-outline px-3 py-1" disabled={page <= 1} onClick={() => onChange(page - 1)}>
          Prev
        </button>
        <span className="px-3 py-1">{page} / {pages}</span>
        <button className="btn-outline px-3 py-1" disabled={page >= pages} onClick={() => onChange(page + 1)}>
          Next
        </button>
      </div>
    </div>
  )
}
