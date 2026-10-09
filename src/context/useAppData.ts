import { useContext } from 'react'
import { AppDataContext } from './AppDataContextCore'

export function useAppData() {
  const context = useContext(AppDataContext)
  if (!context) {
    throw new Error('useAppData must be used within AppDataProvider')
  }
  return context
}
