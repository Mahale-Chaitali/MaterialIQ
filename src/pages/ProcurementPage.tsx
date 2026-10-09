import { useMemo, useState } from 'react'
import {
  AlertTriangle,
  CalendarDays,
  ClipboardList,
  FileText,
  PackageCheck,
  Search,
  ShoppingCart,
  X,
} from 'lucide-react'
import type { ProcurementRecord, ProcurementStatus, ProcurementView } from '../data/procurement'
import {
  PROCUREMENT_DEMO_AS_OF,
  procurementProjects,
  procurementRecords,
  procurementStatuses,
} from '../data/procurement'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table'

type DateBasis = 'requirementDate' | 'expectedDeliveryDate'

const statusStyles: Record<ProcurementStatus, 'success' | 'warning' | 'danger' | 'info' | 'neutral'> = {
  'In Review': 'info',
  Approved: 'success',
  'Partially Ordered': 'warning',
  Ordered: 'info',
  'Potentially Overdue': 'danger',
  'Pending Requirement': 'neutral',
}

const views: { id: ProcurementView; label: string; icon: typeof ClipboardList }[] = [
  { id: 'pr', label: 'Purchase Requisitions (PR)', icon: ClipboardList },
  { id: 'po', label: 'Purchase Orders (PO)', icon: ShoppingCart },
  { id: 'pending', label: 'Pending material requirements', icon: PackageCheck },
]

function formatDate(date: string | null) {
  if (!date) return null
  return new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${date}T00:00:00Z`))
}

function isPotentiallyOverdue(record: ProcurementRecord) {
  return Boolean(
    record.expectedDeliveryDate
    && record.expectedDeliveryDate < PROCUREMENT_DEMO_AS_OF
    && record.procurementStatus !== 'Pending Requirement',
  )
}

function MissingDate({ label }: { label: string }) {
  return <span aria-label={`${label} not provided`} className="inline-flex items-center gap-1 whitespace-nowrap text-[11px] font-medium text-amber-700"><AlertTriangle size={12} />Not provided</span>
}

function ProcurementDetailPanel({ record, onClose }: { record: ProcurementRecord; onClose: () => void }) {
  const overdue = isPotentiallyOverdue(record)

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-950/40"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
      onKeyDown={(event) => {
        if (event.key === 'Escape') onClose()
      }}
    >
      <section
        aria-labelledby="procurement-detail-heading"
        aria-modal="true"
        className="flex h-full w-full max-w-xl flex-col overflow-y-auto bg-white shadow-2xl"
        role="dialog"
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-200 bg-white px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-blue-600">Demo procurement record</p>
            <h2 id="procurement-detail-heading" className="mt-1 text-lg font-bold text-slate-900">{record.materialCode}</h2>
            <p className="mt-1 text-xs leading-5 text-slate-500">{record.description}</p>
          </div>
          <Button type="button" variant="ghost" size="icon" aria-label="Close procurement detail" className="size-8 shrink-0" onClick={onClose}>
            <X size={17} />
          </Button>
        </div>
        <div className="space-y-5 p-5 sm:p-6">
          <div className="flex flex-wrap gap-2">
            <Badge variant="warning">DEMO DATA</Badge>
            <Badge variant={statusStyles[record.procurementStatus]}>{record.procurementStatus}</Badge>
            {overdue && <Badge variant="danger">Potentially overdue</Badge>}
          </div>

          <DetailSection title="References and material">
            <DetailValue label="PR number" value={record.prNumber ?? 'Not provided'} missing={!record.prNumber} />
            <DetailValue label="PO number" value={record.poNumber ?? 'Not provided'} missing={!record.poNumber} />
            <DetailValue label="Material code" value={record.materialCode} />
            <DetailValue label="Description" value={record.description} />
            <DetailValue label="Project" value={record.project} />
            <DetailValue label="WBS element" value={record.wbsElement} />
            <DetailValue label="Material group" value={record.group} />
          </DetailSection>

          <DetailSection title="Quantities — demo values">
            <DetailValue label="Requested quantity" value={quantity(record.requestedQuantity, record.unit)} missing={record.requestedQuantity === null} />
            <DetailValue label="Ordered quantity" value={quantity(record.orderedQuantity, record.unit)} missing={record.orderedQuantity === null} />
            <DetailValue label="Open quantity" value={quantity(record.openQuantity, record.unit)} missing={record.openQuantity === null} />
          </DetailSection>

          <DetailSection title="Dates and procurement status">
            <DetailValue label="Requirement date" value={formatDate(record.requirementDate) ?? 'Not provided'} missing={!record.requirementDate} />
            <DetailValue label="Expected delivery date" value={formatDate(record.expectedDeliveryDate) ?? 'Not provided'} missing={!record.expectedDeliveryDate} />
            <DetailValue label="Procurement status" value={record.procurementStatus} />
            <DetailValue label="Demo date reference" value={formatDate(PROCUREMENT_DEMO_AS_OF) ?? ''} />
          </DetailSection>

          <section>
            <h3 className="mb-2 text-xs font-semibold text-slate-800">Source-file references</h3>
            <div className="flex flex-wrap gap-1.5">
              {record.sourceFiles.map((source) => <Badge key={source} variant="info"><FileText size={11} />{source}</Badge>)}
            </div>
            <p className="mt-2 text-[10px] leading-4 text-slate-500">These source references are examples; no source files have been read.</p>
          </section>

          <section>
            <h3 className="mb-2 text-xs font-semibold text-slate-800">Notes</h3>
            <ul className="space-y-2">
              {record.notes.map((note) => <li key={note} className="flex gap-2 text-[11px] leading-5 text-slate-600"><span className="mt-1.5 size-1 shrink-0 rounded-full bg-blue-500" />{note}</li>)}
            </ul>
          </section>

          <div className="rounded-lg border border-amber-100 bg-amber-50/70 p-3 text-[10px] leading-5 text-amber-900">
            PR and PO quantities do not establish physically available stock. Potentially overdue labels are based only on example dates and the demo reference date; verify actual delivery and receipt information.
          </div>
        </div>
      </section>
    </div>
  )
}

function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="mb-2 text-xs font-semibold text-slate-800">{title}</h3>
      <dl className="grid grid-cols-2 gap-2 sm:grid-cols-3">{children}</dl>
    </section>
  )
}

function DetailValue({ label, value, missing = false }: { label: string; value: string; missing?: boolean }) {
  return (
    <div className="min-w-0 rounded-lg bg-slate-50 px-3 py-2.5">
      <dt className="text-[10px] text-slate-400">{label}</dt>
      <dd className={`mt-1 break-words text-xs font-medium ${missing ? 'text-amber-700' : 'text-slate-700'}`}>{value}</dd>
    </div>
  )
}

function quantity(value: number | null, unit: string) {
  return value === null ? 'Not provided' : `${value} ${unit}`
}

export function ProcurementPage() {
  const [view, setView] = useState<ProcurementView>('pr')
  const [query, setQuery] = useState('')
  const [project, setProject] = useState('All projects')
  const [status, setStatus] = useState('All statuses')
  const [dateBasis, setDateBasis] = useState<DateBasis>('requirementDate')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [selectedRecord, setSelectedRecord] = useState<ProcurementRecord | null>(null)

  const viewRecords = useMemo(() => procurementRecords.filter((record) => {
    if (view === 'pr') return record.prNumber !== null
    if (view === 'po') return record.poNumber !== null
    return record.procurementStatus === 'Pending Requirement'
  }), [view])

  const displayedRecords = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return viewRecords.filter((record) => {
      const matchesQuery = !normalizedQuery || [
        record.prNumber ?? '',
        record.poNumber ?? '',
        record.materialCode,
        record.description,
        record.project,
        record.wbsElement,
      ].some((value) => value.toLowerCase().includes(normalizedQuery))
      const matchesProject = project === 'All projects' || record.project === project
      const matchesStatus = status === 'All statuses'
        || record.procurementStatus === status
        || (status === 'Potentially Overdue' && isPotentiallyOverdue(record))
      const dateValue = record[dateBasis]
      const matchesStart = !dateFrom || Boolean(dateValue && dateValue >= dateFrom)
      const matchesEnd = !dateTo || Boolean(dateValue && dateValue <= dateTo)

      return matchesQuery && matchesProject && matchesStatus && matchesStart && matchesEnd
    })
  }, [dateBasis, dateFrom, dateTo, project, query, status, viewRecords])

  const overdueCount = viewRecords.filter(isPotentiallyOverdue).length
  const missingDatesCount = viewRecords.filter((record) => !record.requirementDate || !record.expectedDeliveryDate).length

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <h2 className="text-[25px] font-bold tracking-[-0.04em] text-slate-900 sm:text-[28px]">Procurement</h2>
            <Badge variant="warning">DEMO DATA</Badge>
          </div>
          <p className="max-w-3xl text-sm leading-6 text-slate-500">
            Review sample requisitions, orders, and pending requirements. Dates and quantities are illustrative, not connected to procurement systems.
          </p>
        </div>
        <Badge variant="neutral"><CalendarDays size={12} /> Demo as of {formatDate(PROCUREMENT_DEMO_AS_OF)}</Badge>
      </div>

      <Card className="flex items-start gap-3 border-blue-100 bg-blue-50/70 p-4">
        <span className="mt-0.5 text-blue-600"><AlertTriangle size={16} /></span>
        <div>
          <p className="text-xs font-semibold text-blue-900">Procurement quantities are not stock availability</p>
          <p className="mt-1 text-[11px] leading-5 text-blue-800">
            PR, PO, open quantity, status, and dates are separate demo fields. Missing information is shown as “Not provided.”
            An order or requisition does not mean materials have been physically received.
          </p>
        </div>
      </Card>

      <section aria-label="Procurement overview" className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <SummaryCard label="Purchase requisitions" value={procurementRecords.filter((record) => record.prNumber).length} detail="Demo records with a PR reference" icon={ClipboardList} />
        <SummaryCard label="Purchase orders" value={procurementRecords.filter((record) => record.poNumber).length} detail="Demo records with a PO reference" icon={ShoppingCart} />
        <SummaryCard label="Pending requirements" value={procurementRecords.filter((record) => record.procurementStatus === 'Pending Requirement').length} detail="No PR number assigned in demo" icon={PackageCheck} />
      </section>

      <Card className="overflow-hidden">
        <div className="flex overflow-x-auto border-b border-slate-200 px-3 pt-2 sm:px-5" role="tablist" aria-label="Procurement sections">
          {views.map(({ id, label, icon: Icon }) => {
            const count = procurementRecords.filter((record) => {
              if (id === 'pr') return record.prNumber !== null
              if (id === 'po') return record.poNumber !== null
              return record.procurementStatus === 'Pending Requirement'
            }).length
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={view === id}
                className={`flex shrink-0 items-center gap-2 border-b-2 px-3 py-3 text-xs font-semibold transition-colors sm:px-4 ${view === id ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                onClick={() => setView(id)}
              >
                <Icon size={15} /> {label} <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${view === id ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>{count}</span>
              </button>
            )
          })}
        </div>

        <div className="p-4 sm:p-5">
          <CardHeader className="mb-4 flex-col gap-2 sm:flex-row sm:items-center">
            <div>
              <CardTitle>{views.find((item) => item.id === view)?.label}</CardTitle>
              <CardDescription className="mt-1">
                {displayedRecords.length} of {viewRecords.length} demo records
                {` · ${overdueCount} potentially overdue · ${missingDatesCount} with at least one missing date`}
              </CardDescription>
            </div>
            {overdueCount > 0 && <Badge variant="danger" className="sm:ml-auto"><AlertTriangle size={12} /> {overdueCount} potentially overdue</Badge>}
          </CardHeader>

          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
            <label className="relative sm:col-span-2 xl:col-span-1">
              <span className="sr-only">Search procurement records</span>
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input aria-label="Search procurement records" placeholder="Search PR, PO, material..." value={query} onChange={(event) => setQuery(event.target.value)} className="h-9 pl-9 text-xs" />
            </label>
            <label>
              <span className="sr-only">Filter procurement by project</span>
              <select aria-label="Filter procurement by project" className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" value={project} onChange={(event) => setProject(event.target.value)}>
                <option>All projects</option>
                {procurementProjects.map((name) => <option key={name}>{name}</option>)}
              </select>
            </label>
            <label>
              <span className="sr-only">Filter procurement by status</span>
              <select aria-label="Filter procurement by status" className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" value={status} onChange={(event) => setStatus(event.target.value)}>
                <option>All statuses</option>
                {procurementStatuses.map((item) => <option key={item}>{item}</option>)}
                {!procurementStatuses.includes('Potentially Overdue') && <option>Potentially Overdue</option>}
              </select>
            </label>
            <label>
              <span className="sr-only">Date filter applies to</span>
              <select aria-label="Date filter applies to" className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" value={dateBasis} onChange={(event) => setDateBasis(event.target.value as DateBasis)}>
                <option value="requirementDate">Requirement date</option>
                <option value="expectedDeliveryDate">Expected delivery</option>
              </select>
            </label>
            <div className="grid grid-cols-2 gap-2 sm:col-span-2 xl:col-span-1">
              <label>
                <span className="sr-only">Date from</span>
                <Input aria-label="Date from" type="date" value={dateFrom} onChange={(event) => setDateFrom(event.target.value)} className="h-9 px-2 text-[10px]" />
              </label>
              <label>
                <span className="sr-only">Date to</span>
                <Input aria-label="Date to" type="date" value={dateTo} onChange={(event) => setDateTo(event.target.value)} className="h-9 px-2 text-[10px]" />
              </label>
            </div>
          </div>
          <p className="mt-2 text-[10px] text-slate-400">
            Date range uses the selected date field. Records with no date in that field are excluded only while a date range is active.
          </p>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHead>
              <TableRow className="border-y border-slate-100 hover:bg-transparent">
                <TableHeader className="whitespace-nowrap">PR Number</TableHeader>
                <TableHeader className="whitespace-nowrap">PO Number</TableHeader>
                <TableHeader className="whitespace-nowrap">Material Code</TableHeader>
                <TableHeader className="min-w-[190px]">Material Description</TableHeader>
                <TableHeader className="min-w-[170px]">Project</TableHeader>
                <TableHeader className="whitespace-nowrap">WBS Element</TableHeader>
                <TableHeader className="whitespace-nowrap text-right">Requested Qty</TableHeader>
                <TableHeader className="whitespace-nowrap text-right">Ordered Qty</TableHeader>
                <TableHeader className="whitespace-nowrap text-right">Open Qty</TableHeader>
                <TableHeader className="whitespace-nowrap">Requirement Date</TableHeader>
                <TableHeader className="whitespace-nowrap">Expected Delivery</TableHeader>
                <TableHeader className="whitespace-nowrap">Procurement Status</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedRecords.map((record) => {
                const overdue = isPotentiallyOverdue(record)
                return (
                  <TableRow
                    key={record.id}
                    aria-label={`${record.prNumber ?? 'No PR'} ${record.poNumber ?? 'No PO'} ${record.materialCode} ${record.project}`}
                    className="cursor-pointer"
                    onClick={() => setSelectedRecord(record)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        setSelectedRecord(record)
                      }
                    }}
                    tabIndex={0}
                  >
                    <TableCell className="whitespace-nowrap text-xs font-medium text-slate-700">{record.prNumber ?? <MissingDate label="PR number" />}</TableCell>
                    <TableCell className="whitespace-nowrap text-xs font-medium text-slate-700">{record.poNumber ?? <MissingDate label="PO number" />}</TableCell>
                    <TableCell className="whitespace-nowrap font-semibold text-blue-700">{record.materialCode}</TableCell>
                    <TableCell className="min-w-[190px] text-xs text-slate-700">{record.description}</TableCell>
                    <TableCell className="min-w-[170px] text-xs text-slate-600">{record.project}</TableCell>
                    <TableCell className="whitespace-nowrap text-xs text-slate-500">{record.wbsElement}</TableCell>
                    <TableCell className="whitespace-nowrap text-right text-xs text-slate-600">{quantity(record.requestedQuantity, record.unit)}</TableCell>
                    <TableCell className="whitespace-nowrap text-right text-xs text-slate-600">{quantity(record.orderedQuantity, record.unit)}</TableCell>
                    <TableCell className="whitespace-nowrap text-right text-xs text-slate-600">{quantity(record.openQuantity, record.unit)}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      {record.requirementDate ? <span className="text-xs text-slate-600">{formatDate(record.requirementDate)}</span> : <MissingDate label="requirement date" />}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {record.expectedDeliveryDate ? (
                        <span className={`text-xs ${overdue ? 'font-semibold text-rose-700' : 'text-slate-600'}`}>
                          {formatDate(record.expectedDeliveryDate)}{overdue && <span className="ml-1 text-[9px]">(past demo date)</span>}
                        </span>
                      ) : <MissingDate label="delivery date" />}
                    </TableCell>
                    <TableCell>
                      <Badge variant={overdue ? 'danger' : statusStyles[record.procurementStatus]}>
                        {overdue ? 'Potentially overdue' : record.procurementStatus}
                      </Badge>
                    </TableCell>
                  </TableRow>
                )
              })}
              {displayedRecords.length === 0 && (
                <TableRow>
                  <TableCell colSpan={12} className="py-12 text-center text-xs text-slate-500">
                    No demo procurement records match the selected search and filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 px-4 py-3 text-[10px] text-slate-400 sm:px-5">
          <span>Click or focus a record and press Enter to view details.</span>
          <span>Missing dates are not estimated. Overdue is a demo-only flag.</span>
        </div>
      </Card>

      {selectedRecord && <ProcurementDetailPanel record={selectedRecord} onClose={() => setSelectedRecord(null)} />}
    </div>
  )
}

function SummaryCard({
  label,
  value,
  detail,
  icon: Icon,
}: {
  label: string
  value: number
  detail: string
  icon: typeof ClipboardList
}) {
  return (
    <Card className="p-4 sm:p-5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-[27px] font-bold leading-none text-slate-900">{value}</p>
        </div>
        <span className="grid size-9 place-items-center rounded-lg bg-blue-50 text-blue-600"><Icon size={18} /></span>
      </div>
      <p className="mt-3 text-[10px] text-slate-400">{detail}</p>
    </Card>
  )
}
