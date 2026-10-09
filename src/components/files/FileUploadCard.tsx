import { useRef, useState } from 'react'
import { FileSpreadsheet, FileText, HardDrive, RefreshCw, Trash2, UploadCloud } from 'lucide-react'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import type { FileRequirement } from '../../data/fileRequirements'
import { cn } from '../../lib/utils'

interface FileUploadCardProps {
  requirement: FileRequirement
  file: File | null
  needsRefresh: boolean
  onSelect: (file: File) => void
  onRemove: () => void
  onValidationError: (fileName: string, message: string) => void
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

function formatModifiedDate(file: File) {
  if (!file.lastModified) return null

  return new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(file.lastModified))
}

export function FileUploadCard({
  requirement,
  file,
  needsRefresh,
  onSelect,
  onRemove,
  onValidationError,
}: FileUploadCardProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState('')
  const FileIcon = requirement.id === 'mb52' ? FileText : FileSpreadsheet
  const modifiedDate = file ? formatModifiedDate(file) : null

  const chooseFile = (candidate?: File) => {
    if (!candidate) return

    const extension = candidate.name.match(/\.[^.]+$/)?.[0].toLowerCase()
    if (!extension || !requirement.extensions.includes(extension)) {
      setError(
        `Unsupported file type. Choose ${requirement.extensions.join(' or ')} for ${requirement.name}.`,
      )
      onValidationError(
        candidate.name,
        `Unsupported extension. Expected ${requirement.extensions.join(' or ')}.`,
      )
      return
    }

    setError('')
    onSelect(candidate)
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    chooseFile(event.currentTarget.files?.[0])
    event.currentTarget.value = ''
  }

  return (
    <Card
      aria-label={`Upload ${requirement.name}`}
      className={cn(
        'min-w-0 p-4 transition-colors sm:p-5',
        dragging && 'border-blue-400 bg-blue-50/50',
      )}
      onDragEnter={(event) => {
        event.preventDefault()
        setDragging(true)
      }}
      onDragOver={(event) => event.preventDefault()}
      onDragLeave={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setDragging(false)
      }}
      onDrop={(event) => {
        event.preventDefault()
        setDragging(false)
        chooseFile(event.dataTransfer.files[0])
      }}
      role="region"
    >
      <input
        ref={inputRef}
        id={`file-input-${requirement.id}`}
        aria-label={`Select ${requirement.name} file`}
        accept={requirement.extensions.join(',')}
        className="sr-only"
        onChange={handleInputChange}
        type="file"
      />
      <div className="flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-600">
          <FileIcon size={19} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-slate-800">{requirement.name}</h3>
            {requirement.id === 'dcn' && <Badge variant="neutral">Usage to confirm</Badge>}
          </div>
          <p className="mt-1 text-xs leading-5 text-slate-500">{requirement.purpose}</p>
          <p className="mt-2 text-[10px] font-medium text-slate-400">
            Supported: {requirement.extensions.join(', ')}
          </p>
        </div>
      </div>

      <div
        className={cn(
          'mt-4 rounded-lg border border-dashed px-3 py-4 text-center transition-colors',
          dragging ? 'border-blue-400 bg-blue-50' : 'border-slate-200 bg-slate-50/70',
        )}
      >
        <UploadCloud size={19} className="mx-auto text-slate-400" />
        <p className="mt-1.5 text-[11px] text-slate-500">
          Drop a file here or{' '}
          <label
            htmlFor={`file-input-${requirement.id}`}
            className="cursor-pointer font-semibold text-blue-600 hover:text-blue-700"
          >
            browse
          </label>
        </p>
        <p className="mt-1 text-[10px] text-slate-400">Selected in this browser only — not sent to a server</p>
      </div>

      <div className="mt-4 min-h-[74px] rounded-lg border border-slate-100 px-3 py-2.5">
        {file ? (
          <div className="flex items-start gap-2.5">
            <span className="mt-0.5 text-emerald-600"><FileIcon size={16} /></span>
            <div className="min-w-0 flex-1">
              <p className="break-all text-xs font-semibold text-slate-700">{file.name}</p>
              <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] text-slate-400">
                <span className="inline-flex items-center gap-1"><HardDrive size={11} />{formatFileSize(file.size)}</span>
                {modifiedDate && <span>Modified {modifiedDate}</span>}
              </p>
              <p className="mt-1 text-[10px] text-slate-500">
                {needsRefresh ? 'Selected locally — needs refreshing' : 'Selected locally — not uploaded'}
              </p>
            </div>
            <Badge variant={needsRefresh ? 'warning' : 'info'}>
              {needsRefresh ? 'Refresh' : 'Selected'}
            </Badge>
          </div>
        ) : (
          <div className="flex h-full min-h-[48px] items-center justify-between gap-2">
            <span className="text-xs text-slate-400">No file selected</span>
            <Badge variant="neutral">Not selected</Badge>
          </div>
        )}
      </div>

      {error && <p role="alert" className="mt-2 text-[11px] font-medium text-rose-600">{error}</p>}

      <div className="mt-3 flex items-center justify-between gap-2">
        <p className="text-[10px] text-slate-400">
          {file ? 'File content has not been validated.' : 'Extension check only; content is not validated.'}
        </p>
        <div className="flex shrink-0 gap-1">
          {file && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              aria-label={`Remove ${requirement.name} file`}
              className="h-8 px-2 text-slate-500"
              onClick={() => {
                setError('')
                onRemove()
              }}
            >
              <Trash2 size={13} /> <span className="hidden sm:inline">Remove</span>
            </Button>
          )}
          <Button
            type="button"
            variant={file ? 'secondary' : 'primary'}
            size="sm"
            aria-label={`${file ? 'Replace' : 'Upload'} ${requirement.name} file`}
            onClick={() => inputRef.current?.click()}
          >
            {file ? <RefreshCw size={13} /> : <UploadCloud size={14} />}
            {file ? 'Replace' : 'Upload'}
          </Button>
        </div>
      </div>
    </Card>
  )
}
