import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarClock, FileCog, Save, Settings2 } from 'lucide-react'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { fileRequirements } from '../data/fileRequirements'
import { useAppData } from '../context/useAppData'

export function SettingsPage() {
  const { preferences, preferenceWarning, updatePreferences } = useAppData()
  const [thresholdInput, setThresholdInput] = useState(String(preferences.freshnessThresholdDays))
  const [message, setMessage] = useState('')
  const parsedThreshold = Number(thresholdInput)
  const thresholdValid = Number.isInteger(parsedThreshold) && parsedThreshold >= 1 && parsedThreshold <= 365

  const saveThreshold = () => {
    if (!thresholdValid) {
      setMessage('Enter a whole number from 1 to 365 days.')
      return
    }
    updatePreferences({ freshnessThresholdDays: parsedThreshold })
    setMessage(`Demo freshness threshold set to ${parsedThreshold} days for this app session.`)
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-[25px] font-bold tracking-[-0.04em] text-slate-900 sm:text-[28px]">Settings</h2>
        <Badge variant="info">Demo preferences</Badge>
      </div>
      <p className="-mt-4 max-w-3xl text-sm leading-6 text-slate-500">
        Configure display preferences and demo freshness behavior. These settings do not connect to SAP, email, or incoming file systems.
      </p>

      <Card className="p-4 sm:p-5">
        <CardHeader>
          <div className="flex items-start gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-600"><Settings2 size={18} /></span>
            <div><CardTitle>Display preferences</CardTitle><CardDescription className="mt-1">Applies to dates shown on the Data Freshness page.</CardDescription></div>
          </div>
        </CardHeader>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label>
            <span className="mb-1.5 block text-xs font-medium text-slate-600">Date display</span>
            <select
              aria-label="Date display preference"
              className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              value={preferences.dateFormat}
              onChange={(event) => updatePreferences({ dateFormat: event.target.value as typeof preferences.dateFormat })}
            >
              <option value="MMM d, yyyy">Oct 9, 2026</option>
              <option value="yyyy-MM-dd">2026-10-09</option>
            </select>
          </label>
          <label>
            <span className="mb-1.5 block text-xs font-medium text-slate-600">Time display</span>
            <select
              aria-label="Time display preference"
              className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              value={preferences.timeFormat}
              onChange={(event) => updatePreferences({ timeFormat: event.target.value as typeof preferences.timeFormat })}
            >
              <option value="12-hour">12-hour (e.g. 2:30 PM)</option>
              <option value="24-hour">24-hour (e.g. 14:30)</option>
            </select>
          </label>
        </div>
      </Card>

      <Card className="p-4 sm:p-5">
        <CardHeader>
          <div className="flex items-start gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-amber-50 text-amber-600"><CalendarClock size={18} /></span>
            <div><CardTitle>Demo freshness threshold</CardTitle><CardDescription className="mt-1">Selected files older than this many days are flagged for refresh.</CardDescription></div>
          </div>
        </CardHeader>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end">
          <label className="w-full sm:max-w-xs">
            <span className="mb-1.5 block text-xs font-medium text-slate-600">Threshold in days (1–365)</span>
            <Input aria-label="Freshness threshold days" type="number" min={1} max={365} step={1} value={thresholdInput} onChange={(event) => setThresholdInput(event.target.value)} />
          </label>
          <Button type="button" size="sm" onClick={saveThreshold}><Save size={14} /> Apply threshold</Button>
        </div>
        {!thresholdValid && thresholdInput !== '' && <p role="alert" className="mt-2 text-xs text-rose-600">Enter a whole number from 1 to 365 days.</p>}
        {message && <p role="status" className="mt-3 text-xs text-blue-700">{message}</p>}
        {preferenceWarning && <p role="alert" className="mt-2 text-xs text-amber-700">{preferenceWarning}</p>}
        <p className="mt-3 text-[10px] leading-5 text-slate-400">
          The threshold uses the browser-reported last-modified date of files selected during this app session. It cannot verify whether a file&apos;s contents or source system data are current.
        </p>
      </Card>

      <Card className="p-4 sm:p-5">
        <CardHeader>
          <div className="flex items-start gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-violet-50 text-violet-600"><FileCog size={18} /></span>
            <div><CardTitle>File update requirements</CardTitle><CardDescription className="mt-1">Expected input types and current demo freshness rule.</CardDescription></div>
          </div>
        </CardHeader>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left text-xs">
            <thead className="border-y border-slate-100 bg-slate-50 text-[10px] uppercase tracking-wide text-slate-500">
              <tr><th className="px-3 py-2.5">Required input</th><th className="px-3 py-2.5">Purpose</th><th className="px-3 py-2.5">Allowed extension</th><th className="px-3 py-2.5">Demo refresh rule</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {fileRequirements.map((file) => (
                <tr key={file.id}>
                  <td className="px-3 py-3 font-medium text-slate-700">{file.name}</td>
                  <td className="px-3 py-3 text-slate-500">{file.purpose}</td>
                  <td className="px-3 py-3 text-slate-500">{file.extensions.join(', ')}</td>
                  <td className="px-3 py-3 whitespace-nowrap text-slate-500">Flag after {preferences.freshnessThresholdDays} days</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="flex flex-col justify-between gap-3 p-4 sm:flex-row sm:items-center sm:p-5">
        <div><CardTitle>Current file freshness</CardTitle><CardDescription className="mt-1">Review missing files and browser-session selections.</CardDescription></div>
        <Link
          to="/data-freshness"
          className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50"
        >
          Open Data Freshness
        </Link>
      </Card>
    </div>
  )
}
