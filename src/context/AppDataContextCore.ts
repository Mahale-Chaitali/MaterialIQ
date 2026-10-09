import { createContext } from 'react'
import type { FileRequirementId } from '../data/fileRequirements'

export type DateDisplayFormat = 'MMM d, yyyy' | 'yyyy-MM-dd'
export type TimeDisplayFormat = '12-hour' | '24-hour'

export interface AppPreferences {
  dateFormat: DateDisplayFormat
  timeFormat: TimeDisplayFormat
  freshnessThresholdDays: number
}

export interface FileValidationFailure {
  id: string
  fileName: string
  message: string
  occurredAt: string
}

export interface AppDataContextValue {
  files: Partial<Record<FileRequirementId, File>>
  validationFailures: FileValidationFailure[]
  preferences: AppPreferences
  preferenceWarning: string | null
  selectFile: (id: FileRequirementId, file: File) => void
  removeFile: (id: FileRequirementId) => void
  reportValidationFailure: (id: FileRequirementId, fileName: string, message: string) => void
  clearValidationFailures: () => void
  updatePreferences: (updates: Partial<AppPreferences>) => void
}

export const AppDataContext = createContext<AppDataContextValue | null>(null)
