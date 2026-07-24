const TODAY_TIME_ZONE = 'America/New_York'

export function todayISO() {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: TODAY_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date())
  const get = (type) => parts.find((p) => p.type === type).value
  return `${get('year')}-${get('month')}-${get('day')}`
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
