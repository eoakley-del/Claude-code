export function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

export function formatDate(dateStr) {
  if (!dateStr) return ''
  const [year, month, day] = dateStr.split('-')
  return `${month}/${day}/${year.slice(2)}`
}

export function matchesDateFilter(taskDate, mode, exactDate) {
  if (mode === 'any') return true
  if (!taskDate) return false
  if (mode === 'onOrBeforeToday') return taskDate <= todayISO()
  if (mode === 'exact') return Boolean(exactDate) && taskDate === exactDate
  return true
}
