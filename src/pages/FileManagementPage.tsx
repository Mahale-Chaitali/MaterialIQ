import { useMemo } from 'react'
import { AlertCircle, CheckCircle2, FileCheck2, FileQuestion, RefreshCw } from 'lucide-react'
import { Badge } from '../components/ui/badge'
import { Card, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { FileUploadCard } from '../components/files/FileUploadCard'
import { fileRequirements } from '../data/fileRequirements'
import { useAppData } from '../context/useAppData'

const FRESHNESS_CHECKED_AT = Date.now()

export function FileManagementPage() {
  const { files, preferences, selectFile, removeFile, reportValidationFailure } = useAppData()

  const summary = useMemo(() => {
    const selected = Object.keys(files).length
    const needsRefresh = Object.values(files).filter(
      (file) => file && FRESHNESS_CHECKED_AT - file.lastModified > preferences.freshnessThresholdDays * 24 * 60 * 60 * 1000,
    ).length

    return {
      required: fileRequirements.length,
      selected,
      missing: fileRequirements.length - selected,
      needsRefresh,
    }
  }, [files, preferences.freshnessThresholdDays])

  const summaryItems = [
    {
      label: 'Required files',
      value: summary.required,
      detail: 'Inputs expected for this workflow',
      icon: FileQuestion,
      style: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Files selected',
      value: `${summary.selected} of ${summary.required}`,
      detail: 'Selected locally in this browser',
      icon: FileCheck2,
      style: 'bg-emerald-50 text-emerald-600',
    },
    {
      label: 'Missing files',
      value: summary.missing,
      detail: 'No file currently selected',
      icon: AlertCircle,
      style: 'bg-amber-50 text-amber-600',
    },
    {
      label: 'Files that need refreshing',
      value: summary.needsRefresh,
      detail: 'Last modified more than 30 days ago',
      icon: RefreshCw,
      style: 'bg-violet-50 text-violet-600',
    },
  ]

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <h2 className="text-[25px] font-bold tracking-[-0.04em] text-slate-900 sm:text-[28px]">File Management</h2>
            <Badge variant="info">Browser-only</Badge>
          </div>
          <p className="max-w-3xl text-sm leading-6 text-slate-500">
            Select the source files expected by the material workflow. Files stay in this browser session and are not uploaded.
          </p>
        </div>
      </div>

      <Card className="flex items-start gap-3 border-blue-100 bg-blue-50/70 p-4">
        <span className="mt-0.5 text-blue-600"><CheckCircle2 size={17} /></span>
        <div>
          <p className="text-xs font-semibold text-blue-900">File selection is not file analysis</p>
          <p className="mt-1 text-[11px] leading-5 text-blue-800">
            This page checks filename extensions only. It does not validate workbook or HTML contents, analyze material data,
            calculate shortages, or transmit files to a server.
          </p>
        </div>
      </Card>

      <section aria-label="File selection summary" className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {summaryItems.map(({ label, value, detail, icon: Icon, style }) => (
          <Card key={label} className="p-4 sm:p-5">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-500">{label}</p>
                <p className="mt-2 text-[25px] font-bold leading-none tracking-tight text-slate-900">{value}</p>
              </div>
              <span className={`grid size-9 shrink-0 place-items-center rounded-lg ${style}`}>
                <Icon size={18} />
              </span>
            </div>
            <p className="mt-3 text-[10px] text-slate-400">{detail}</p>
          </Card>
        ))}
      </section>

      <section aria-labelledby="required-files-heading">
        <Card className="mb-4 p-4 sm:p-5">
          <CardHeader className="flex-col gap-2 sm:flex-row sm:items-center">
            <div>
              <CardTitle id="required-files-heading">Required input files</CardTitle>
              <CardDescription className="mt-1">
                Allowed extensions are checked when a file is selected or dropped. File content is not inspected.
              </CardDescription>
            </div>
            <Badge variant="neutral" className="sm:ml-auto">6 expected inputs</Badge>
          </CardHeader>
        </Card>
        <div className="grid min-w-0 gap-4 lg:grid-cols-2">
          {fileRequirements.map((requirement) => {
            const file = files[requirement.id] ?? null
            const needsRefresh = Boolean(file && FRESHNESS_CHECKED_AT - file.lastModified > preferences.freshnessThresholdDays * 24 * 60 * 60 * 1000)

            return (
              <FileUploadCard
                key={requirement.id}
                requirement={requirement}
                file={file}
                needsRefresh={needsRefresh}
                onSelect={(selectedFile) => selectFile(requirement.id, selectedFile)}
                onRemove={() => removeFile(requirement.id)}
                onValidationError={(fileName, message) => reportValidationFailure(requirement.id, fileName, message)}
              />
            )
          })}
        </div>
      </section>

      <p className="text-[11px] leading-5 text-slate-400">
        “Needs refreshing” is based only on the selected file&apos;s browser-reported last-modified date being over {preferences.freshnessThresholdDays} days old.
        It does not indicate whether the data inside a file is current.
      </p>
    </div>
  )
}
