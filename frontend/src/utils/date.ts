export function formatDate(dateIso: string): string {
  const date = new Date(dateIso)
  return new Intl.DateTimeFormat('ru-RU', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

export function toDateTimeLocalValue(dateIso?: string): string {
  const date = dateIso ? new Date(dateIso) : new Date()
  const offset = date.getTimezoneOffset()
  const normalized = new Date(date.getTime() - offset * 60_000)
  return normalized.toISOString().slice(0, 16)
}
