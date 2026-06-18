export default function DataTable({ columns, rows, empty = 'No records' }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-slate-500 border-b">
            {columns.map((c) => (
              <th key={c.key} className="py-3 px-3 font-medium">{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr><td colSpan={columns.length} className="py-8 text-center text-slate-400">{empty}</td></tr>
          )}
          {rows.map((r, i) => (
            <tr key={r.id ?? i} className="border-b last:border-0 hover:bg-slate-50">
              {columns.map((c) => (
                <td key={c.key} className="py-3 px-3">{c.render ? c.render(r) : r[c.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
