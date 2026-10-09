import { AlertTriangle, Clock3, FileQuestion, RefreshCw, ShieldAlert } from 'lucide-react'
import { Badge } from '../components/ui/badge'
import { Card, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { fileRequirements } from '../data/fileRequirements'
import { useAppData } from '../context/useAppData'
import { formatPreferenceDateTime } from '../lib/dateFormatting'

const FRESHNESS_CHECKED_AT = Date.now()

function modifiedIsStale(file: File, thresholdDays: number) {
  return FRESHNESS_CHECKED_AT - file.lastModified > thresholdDays * 24 * 60 * 60 * 1000
}

export function DataFreshnessPage() {
  const { files, validationFailures, preferences, clearValidationFailures } = useAppData()
  const selectedCount = Object.keys(files).length
  const missing = fileRequirements.filter((item) => !files[item.id])
  const stale = fileRequirements.filter((item) => {
    const file = files[item.id]
    return file ? modifiedIsStale(file, preferences.freshnessThresholdDays) : false
  })

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-[25px] font-bold tracking-[-0.04em] text-slate-900 sm:text-[28px]">Data Freshness</h2>
        <Badge variant="warning">Session status</Badge>
      </div>
      <p className="-mt-4 max-w-3xl text-sm leading-6 text-slate-500">
        Review files selected in this browser session and extension-validation failures. This page does not monitor incoming files or verify source-system data.
      </p>

      <Card className="flex items-start gap-3 border-amber-200 bg-amber-50/80 p-4">
        <span className="mt-0.5 text-amber-700"><ShieldAlert size={17} /></span>
        <div>
          <p className="text-xs font-semibold text-amber-900">Data currency cannot be verified</p>
          <p className="mt-1 text-[11px] leading-5 text-amber-800">
            Files are only selected locally; their contents are not inspected. The app cannot tell whether SAP, email, or another source has newer data.
            No automatic monitoring or processing is configured.
          </p>
        </div>
      </Card>

      <section aria-label="Data freshness summary" className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <Summary label="Required inputs" value={fileRequirements.length} detail="Defined for the demo workflow" icon={FileQuestion} />
        <Summary label="Missing files" value={missing.length} detail="Not selected in this app session" icon={AlertTriangle} />
        <Summary label="Needs refreshing" value={stale.length} detail={`Older than ${preferences.freshnessThresholdDays} days by file metadata`} icon={RefreshCw} />
        <Summary label="Validation failures" value={validationFailures.length} detail="Unsupported extensions in this session" icon={ShieldAlert} />
      </section>

      <Card className="p-4 sm:p-5">
        <CardHeader className="flex-col gap-2 sm:flex-row sm:items-center">
          <div>
            <CardTitle>Required file status</CardTitle>
            <CardDescription className="mt-1">Last-modified date is supplied by the selected local file, not an external source.</CardDescription>
          </div>
          <Badge variant="neutral" className="sm:ml-auto">{selectedCount} of {fileRequirements.length} selected</Badge>
        </CardHeader>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[680px] border-collapse text-left text-xs">
            <thead className="border-y border-slate-100 bg-slate-50 text-[10px] uppercase tracking-wide text-slate-500">
              <tr><th className="px-3 py-3">Required input</th><th className="px-3 py-3">Session selection</th><th className="px-3 py-3">Last modified</th><th className="px-3 py-3">Freshness status</th><th className="px-3 py-3">Purpose</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {fileRequirements.map((item) => {
                const file = files[item.id]
                const isStale = file ? modifiedIsStale(file, preferences.freshnessThresholdDays) : false
                return (
                  <tr key={item.id}>
                    <td className="whitespace-nowrap px-3 py-3 font-semibold text-slate-700">{item.name}</td>
                    <td className="max-w-[220px] break-all px-3 py-3 text-slate-600">{file?.name ?? 'Missing — no selection'}</td>
                    <td className="whitespace-nowrap px-3 py-3 text-slate-500">{file?.lastModified ? formatPreferenceDateTime(new Date(file.lastModified), preferences) : 'Not available'}</td>
                    <td className="px-3 py-3">
                      {file
                        ? <Badge variant={isStale ? 'warning' : 'success'}>{isStale ? 'Needs refreshing' : 'Within demo threshold'}</Badge>
                        : <Badge variant="danger">Missing</Badge>}
                    </td>
                    <td className="max-w-[240px] px-3 py-3 leading-5 text-slate-500">{item.purpose}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-[10px] leading-5 text-slate-400">
          Refresh flags compare browser-reported last-modified metadata with the {preferences.freshnessThresholdDays}-day demo threshold. A fresh timestamp does not validate file contents.
        </p>
      </Card>

      <Card className="p-4 sm:p-5">
        <CardHeader>
          <div><CardTitle>Validation failures</CardTitle><CardDescription className="mt-1">Extension checks performed during this browser session.</CardDescription></div>
          {validationFailures.length > 0 && <Button type="button" variant="ghost" size="sm" onClick={clearValidationFailures}>Clear history</Button>}
        </CardHeader>
        {validationFailures.length > 0 ? (
          <ul className="mt-4 space-y-2">
            {validationFailures.map((failure) => {
              const requirement = fileRequirements.find((item) => item.id === failure.id)
              return (
                <li key={`${failure.id}-${failure.occurredAt}`} className="flex flex-col justify-between gap-2 rounded-lg border border-rose-100 bg-rose-50/50 p-3 sm:flex-row sm:items-center">
                  <div className="flex items-start gap-2">
                    <AlertTriangle size={14} className="mt-0.5 shrink-0 text-rose-600" />
                    <div>
                      <p className="text-xs font-semibold text-rose-800">{requirement?.name ?? failure.id}: {failure.fileName}</p>
                      <p className="mt-1 text-[11px] text-rose-700">{failure.message}</p>
                    </div>
                  </div>
                  <span className="whitespace-nowrap text-[10px] text-slate-400">{formatPreferenceDateTime(new Date(failure.occurredAt), preferences)}</span>
                </li>
              )
            })}
          </ul>
        ) : (
          <p className="mt-4 rounded-lg bg-slate-50 p-3 text-xs text-slate-500">No extension-validation failures recorded in this app session.</p>
        )}
        <p className="mt-3 text-[10px] text-slate-400">An accepted extension only confirms the filename suffix; workbook and HTML content are not validated.</p>
      </Card>

      <Card className="flex items-start gap-3 p-4 sm:p-5">
        <span className="mt-0.5 text-slate-500"><Clock3 size={17} /></span>
        <div>
          <CardTitle>Last successful processing</CardTitle>
          <CardDescription className="mt-1">Unavailable — no file-processing workflow is connected.</CardDescription>
          <p className="mt-2 text-[10px] leading-5 text-slate-400">Selecting files does not count as processing. No analysis or material calculations are claimed.</p>
        </div>
      </Card>
      <p role="status" className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-[11px] leading-5 text-slate-500">
        Notifications are shown in this page only. Browser notifications, incoming-email monitoring, SAP monitoring, and automatic file updates are not enabled.
      </p>
    </div>
  )
}

function Summary({
  label,
  value,
  detail,
  icon: Icon,
}: {
  label: string
  value: number
  detail: string
  icon: typeof FileQuestion
}) {
  return (
    <Card className="p-4 sm:p-5">
      <div className="flex items-start justify-between gap-2">
        <div><p className="text-xs font-medium text-slate-500">{label}</p><p className="mt-2 text-[25px] font-bold leading-none text-slate-900">{value}</p></div>
        <span className="grid size-9 place-items-center rounded-lg bg-slate-100 text-slate-600"><Icon size={17} /></span>
      </div>
      <p className="mt-3 text-[10px] text-slate-400">{detail}</p>
    </Card>
  )
}
