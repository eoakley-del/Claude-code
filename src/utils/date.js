export function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

export function formatDate(dateStr) {
  if (!dateStr) return ''
  const [year, month, day] = dateStr.split('-')
  return `${month}/${day}/${year.slice(2)}`
}
