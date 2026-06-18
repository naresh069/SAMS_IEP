export const todayISO = () => new Date().toISOString().slice(0, 10)

export const formatDate = (iso) => {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

export const initials = (name = '') =>
  name.split(' ').map((s) => s[0]).filter(Boolean).slice(0, 2).join('').toUpperCase()

export const classNames = (...xs) => xs.filter(Boolean).join(' ')
