import type { AppPreferences } from '../context/AppDataContextCore'

export function formatPreferenceDateTime(value: Date, preferences: AppPreferences) {
  if (preferences.dateFormat === 'yyyy-MM-dd') {
    const datePart = new Intl.DateTimeFormat('en-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(value)
    const timePart = new Intl.DateTimeFormat('en', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: preferences.timeFormat === '12-hour',
    }).format(value)
    return `${datePart} ${timePart}`
  }

  return new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: preferences.timeFormat === '12-hour',
  }).format(value)
}
