import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { FileRequirementId } from '../data/fileRequirements'
import { AppDataContext } from './AppDataContextCore'
import type { AppPreferences, AppDataContextValue, FileValidationFailure } from './AppDataContextCore'

const defaultPreferences: AppPreferences = {
  dateFormat: 'MMM d, yyyy',
  timeFormat: '12-hour',
  freshnessThresholdDays: 30,
}

function readPreferences(): AppPreferences {
  try {
    const stored = localStorage.getItem('materialiq-demo-preferences')
    if (!stored) return defaultPreferences

    const parsed: unknown = JSON.parse(stored)
    if (typeof parsed !== 'object' || parsed === null) return defaultPreferences

    const values = parsed as Partial<AppPreferences>
    return {
      dateFormat: values.dateFormat === 'yyyy-MM-dd' ? 'yyyy-MM-dd' : 'MMM d, yyyy',
      timeFormat: values.timeFormat === '24-hour' ? '24-hour' : '12-hour',
      freshnessThresholdDays:
        typeof values.freshnessThresholdDays === 'number'
        && Number.isFinite(values.freshnessThresholdDays)
        && values.freshnessThresholdDays >= 1
        && values.freshnessThresholdDays <= 365
          ? Math.round(values.freshnessThresholdDays)
          : defaultPreferences.freshnessThresholdDays,
    }
  } catch {
    return defaultPreferences
  }
}

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [files, setFiles] = useState<Partial<Record<FileRequirementId, File>>>({})
  const [validationFailures, setValidationFailures] = useState<FileValidationFailure[]>([])
  const [preferences, setPreferences] = useState<AppPreferences>(readPreferences)
  const [preferenceWarning, setPreferenceWarning] = useState<string | null>(null)

  const value = useMemo<AppDataContextValue>(() => ({
    files,
    validationFailures,
    preferences,
    preferenceWarning,
    selectFile: (id, file) => {
      setFiles((current) => ({ ...current, [id]: file }))
      setValidationFailures((current) => current.filter((failure) => failure.id !== id))
    },
    removeFile: (id) => {
      setFiles((current) => {
        const next = { ...current }
        delete next[id]
        return next
      })
    },
    reportValidationFailure: (id, fileName, message) => {
      const occurredAt = new Date().toISOString()
      setValidationFailures((current) => [
        { id, fileName, message, occurredAt },
        ...current.filter((failure) => failure.id !== id),
      ])
    },
    clearValidationFailures: () => setValidationFailures([]),
    updatePreferences: (updates) => {
      const next = { ...preferences, ...updates }
      setPreferences(next)
      try {
        localStorage.setItem('materialiq-demo-preferences', JSON.stringify(next))
        setPreferenceWarning(null)
      } catch {
        setPreferenceWarning('Settings are active for this session, but browser storage could not save them.')
      }
    },
  }), [files, preferences, preferenceWarning, validationFailures])

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
}
