/** Utilidades de fechas del calendario (reutilizadas por CalendarPage y timeline). */

export function daysInMonth(yearMonth: string): number {
  const [y, m] = yearMonth.split('-').map(Number)
  return new Date(y, m, 0).getDate()
}

export function firstWeekday(yearMonth: string): number {
  const [y, m] = yearMonth.split('-').map(Number)
  return new Date(y, m - 1, 1).getDay()
}

export function pad(n: number): string {
  return String(n).padStart(2, '0')
}

export function formatMonthLabel(yearMonth: string): string {
  const [y, m] = yearMonth.split('-').map(Number)
  return new Date(y, m - 1, 1).toLocaleString('es', { month: 'long', year: 'numeric' })
}

export function prevMonth(yearMonth: string): string {
  const [y, m] = yearMonth.split('-').map(Number)
  const d = new Date(y, m - 2, 1)
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}`
}

export function nextMonth(yearMonth: string): string {
  const [y, m] = yearMonth.split('-').map(Number)
  const d = new Date(y, m, 1)
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}`
}

export function formatDayHeading(isoDate: string): string {
  return new Date(`${isoDate}T12:00`).toLocaleDateString('es', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

export function formatShortWeekday(isoDate: string): string {
  return new Date(`${isoDate}T12:00`).toLocaleDateString('es', { weekday: 'short' })
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10)
}

export const WEEKDAY_LABELS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'] as const

/** Lunes como inicio de semana (ISO común en ES). */
export function getWeekDates(anchorIso: string): string[] {
  const anchor = new Date(`${anchorIso}T12:00:00`)
  const day = anchor.getDay()
  const offset = day === 0 ? -6 : 1 - day
  const monday = new Date(anchor)
  monday.setDate(anchor.getDate() + offset)

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d.toISOString().slice(0, 10)
  })
}

export function addDays(isoDate: string, days: number): string {
  const d = new Date(`${isoDate}T12:00:00`)
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

export function formatWeekRange(weekDates: string[]): string {
  if (weekDates.length === 0) return ''
  const start = new Date(`${weekDates[0]}T12:00`)
  const end = new Date(`${weekDates[weekDates.length - 1]}T12:00`)
  const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' }
  return `${start.toLocaleDateString('es', opts)} – ${end.toLocaleDateString('es', { ...opts, year: 'numeric' })}`
}
