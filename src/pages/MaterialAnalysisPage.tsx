import { useMemo, useState } from 'react'
import {
  AlertTriangle,
  Boxes,
  Download,
  FileText,
  Search,
  X,
} from 'lucide-react'
import type { AnalysisMaterial, AvailabilityStatus } from '../data/materialAnalysis'
import {
  analysisGroups,
  analysisMaterials,
  analysisProjects,
  analysisSourceFiles,
} from '../data/materialAnalysis'
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
import { downloadMaterialCsv } from '../lib/materialCsv'

const statusStyles: Record<AvailabilityStatus, 'success' | 'warning' | 'danger'> = {
  Available: 'success',
  Partial: 'warning',
  Shortage: 'danger',
}

interface MaterialDetailPanelProps {
  material: AnalysisMaterial
  onClose: () => void
}

function MaterialDetailPanel({ material, onClose }: MaterialDetailPanelProps) {
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
        aria-labelledby="analysis-detail-title"
        aria-modal="true"
        className="flex h-full w-full max-w-xl flex-col overflow-y-auto bg-white shadow-2xl"
        role="dialog"
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-200 bg-white px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-blue-600">Demo material detail</p>
              <Badge variant="neutral">Not analyzed</Badge>
            </div>
            <h2 id="analysis-detail-title" className="text-lg font-bold text-slate-900">{material.code}</h2>
            <p className="mt-1 text-xs leading-5 text-slate-500">{material.description}</p>
          </div>
          <Button type="button" variant="ghost" size="icon" aria-label="Close material detail" className="size-8 shrink-0" onClick={onClose}>
            <X size={17} />
          </Button>
        </div>

        <div className="space-y-5 p-5 sm:p-6">
          <div className="flex flex-wrap gap-2">
            <Badge variant={statusStyles[material.status]}>{material.status}</Badge>
            <Badge variant={material.responsibility === 'ABB' ? 'info' : 'neutral'}>{material.responsibility} responsibility</Badge>
            <Badge variant="warning">DEMO</Badge>
          </div>

          <section aria-labelledby="material-info-heading">
            <h3 id="material-info-heading" className="mb-2 text-xs font-semibold text-slate-800">Material information</h3>
            <dl className="grid grid-cols-2 gap-2">
              <DetailValue label="Material code" value={material.code} />
              <DetailValue label="Material group" value={material.group} />
              <DetailValue label="Project" value={material.project} />
              <DetailValue label="WBS element" value={material.wbsElement} />
              <DetailValue label="Unit" value={material.unit} />
              <DetailValue label="Description" value={material.description} />
            </dl>
          </section>

          <section aria-labelledby="quantity-heading">
            <h3 id="quantity-heading" className="mb-2 text-xs font-semibold text-slate-800">Quantity summary — demo values</h3>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              <DetailValue label="Required" value={`${material.required} ${material.unit}`} />
              <DetailValue label="Available" value={`${material.available} ${material.unit}`} />
              <DetailValue label="Shortage (sample)" value={`${material.shortage} ${material.unit}`} />
            </div>
            <p className="mt-2 text-[10px] leading-4 text-slate-500">
              Shortage is a supplied demonstration value, not a calculation using an official company formula.
            </p>
          </section>

          <section aria-labelledby="stock-heading">
            <h3 id="stock-heading" className="mb-2 text-xs font-semibold text-slate-800">Stock information</h3>
            <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
              <p className="text-xs font-medium text-slate-700">{material.available} {material.unit} shown as available</p>
              <p className="mt-1 text-[10px] leading-4 text-slate-500">Warehouse quantity is a demo value. Stock reservations and allocation rules are not modeled.</p>
            </div>
          </section>

          <section aria-labelledby="procurement-heading">
            <h3 id="procurement-heading" className="mb-2 text-xs font-semibold text-slate-800">PR / PO information</h3>
            <div className="grid grid-cols-2 gap-2">
              <DetailValue label="PR quantity (reference only)" value={`${material.prQuantity} ${material.unit}`} />
              <DetailValue label="PO quantity (reference only)" value={`${material.poQuantity} ${material.unit}`} />
            </div>
            <p className="mt-2 text-[10px] leading-4 text-amber-700">
              PR and PO quantities are not automatically treated as available stock.
            </p>
          </section>

          <section aria-labelledby="scope-heading">
            <h3 id="scope-heading" className="mb-2 text-xs font-semibold text-slate-800">Scope responsibility</h3>
            <div className="rounded-lg border border-slate-100 p-3">
              <p className="text-xs font-semibold text-slate-800">{material.responsibility}</p>
              <p className="mt-1 text-[10px] text-slate-500">Illustrative responsibility from demo Material Scope values.</p>
            </div>
          </section>

          <section aria-labelledby="sources-heading">
            <h3 id="sources-heading" className="mb-2 text-xs font-semibold text-slate-800">Source-file references</h3>
            <div className="flex flex-wrap gap-1.5">
              {analysisSourceFiles.map((source) => (
                <Badge key={source} variant={material.sourceFiles.includes(source) ? 'info' : 'neutral'}>
                  <FileText size={11} /> {source}
                </Badge>
              ))}
            </div>
            <p className="mt-2 text-[10px] leading-4 text-slate-500">References are illustrative; source files are not connected or analyzed.</p>
          </section>

          <section aria-labelledby="notes-heading">
            <h3 id="notes-heading" className="mb-2 text-xs font-semibold text-slate-800">Notes and unresolved questions</h3>
            <ul className="space-y-2">
              {material.notes.map((note) => (
                <li key={note} className="flex gap-2 text-[11px] leading-5 text-slate-600">
                  <span className="mt-1.5 size-1 shrink-0 rounded-full bg-blue-500" />{note}
                </li>
              ))}
              {material.unresolvedQuestions.map((question) => (
                <li key={question} className="flex gap-2 text-[11px] leading-5 text-amber-800">
                  <AlertTriangle size={13} className="mt-1 shrink-0" />{question}
                </li>
              ))}
              {material.unresolvedQuestions.length === 0 && (
                <li className="text-[11px] text-slate-500">No unresolved demo questions listed.</li>
              )}
            </ul>
          </section>
        </div>
      </section>
    </div>
  )
}

function DetailValue({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-lg bg-slate-50 px-3 py-2.5">
      <dt className="text-[10px] text-slate-400">{label}</dt>
      <dd className="mt-1 break-words text-xs font-medium text-slate-700">{value}</dd>
    </div>
  )
}

export function MaterialAnalysisPage() {
  const [query, setQuery] = useState('')
  const [project, setProject] = useState('All projects')
  const [group, setGroup] = useState('All groups')
  const [status, setStatus] = useState('All statuses')
  const [responsibility, setResponsibility] = useState('All responsibilities')
  const [shortageOnly, setShortageOnly] = useState(false)
  const [selectedMaterial, setSelectedMaterial] = useState<AnalysisMaterial | null>(null)

  const displayedMaterials = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return analysisMaterials.filter((material) => {
      const matchesQuery = !normalizedQuery || [
        material.code,
        material.description,
        material.project,
        material.wbsElement,
        material.group,
      ].some((value) => value.toLowerCase().includes(normalizedQuery))
      return matchesQuery
        && (project === 'All projects' || material.project === project)
        && (group === 'All groups' || material.group === group)
        && (status === 'All statuses' || material.status === status)
        && (responsibility === 'All responsibilities' || material.responsibility === responsibility)
        && (!shortageOnly || material.shortage > 0)
    })
  }, [group, project, query, responsibility, shortageOnly, status])

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <h2 className="text-[25px] font-bold tracking-[-0.04em] text-slate-900 sm:text-[28px]">Material Analysis</h2>
            <Badge variant="warning">DEMO DATA</Badge>
          </div>
          <p className="max-w-3xl text-sm leading-6 text-slate-500">
            Browse illustrative material requirements, stock, procurement, and scope records across sample projects.
          </p>
        </div>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => downloadMaterialCsv(displayedMaterials)}
          disabled={displayedMaterials.length === 0}
        >
          <Download size={15} /> Export displayed CSV
        </Button>
      </div>

      <Card className="flex items-start gap-3 border-amber-100 bg-amber-50/70 p-4">
        <span className="mt-0.5 text-amber-700"><AlertTriangle size={16} /></span>
        <div>
          <p className="text-xs font-semibold text-amber-900">Demo quantities — no official shortage formula applied</p>
          <p className="mt-1 text-[11px] leading-5 text-amber-800">
            Required, available, PR, PO, and shortage quantities are example values. Shortage is explicitly supplied as demo data;
            PR and PO quantities are shown separately and are not automatically added to available stock.
          </p>
        </div>
      </Card>

      <Card className="p-4 sm:p-5">
        <CardHeader className="mb-4 flex-col gap-2 sm:flex-row sm:items-center">
          <div>
            <CardTitle>Material register</CardTitle>
            <CardDescription className="mt-1">Search and combine filters to inspect the displayed demo records.</CardDescription>
          </div>
          <Badge variant="neutral" className="sm:ml-auto"><Boxes size={12} /> {displayedMaterials.length} of {analysisMaterials.length} demo rows</Badge>
        </CardHeader>
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
          <label className="relative sm:col-span-2 xl:col-span-1">
            <span className="sr-only">Search materials</span>
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input aria-label="Search materials" placeholder="Search code, WBS, description" value={query} onChange={(event) => setQuery(event.target.value)} className="h-9 pl-9 text-xs" />
          </label>
          <FilterSelect label="Filter by project" value={project} onChange={setProject}>
            <option>All projects</option>
            {analysisProjects.map((item) => <option key={item}>{item}</option>)}
          </FilterSelect>
          <FilterSelect label="Filter by material group" value={group} onChange={setGroup}>
            <option>All groups</option>
            {analysisGroups.map((item) => <option key={item}>{item}</option>)}
          </FilterSelect>
          <FilterSelect label="Filter by availability status" value={status} onChange={setStatus}>
            <option>All statuses</option>
            <option>Available</option>
            <option>Partial</option>
            <option>Shortage</option>
          </FilterSelect>
          <FilterSelect label="Filter by responsibility" value={responsibility} onChange={setResponsibility}>
            <option>All responsibilities</option>
            <option>ABB</option>
            <option>Vendor</option>
          </FilterSelect>
        </div>
        <label className="mt-3 inline-flex cursor-pointer items-center gap-2 text-xs text-slate-600">
          <input
            aria-label="Shortage only"
            checked={shortageOnly}
            className="size-4 rounded border-slate-300 text-blue-600 accent-blue-600 focus:ring-blue-500"
            onChange={(event) => setShortageOnly(event.target.checked)}
            type="checkbox"
          />
          Shortage only
        </label>
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHead>
              <TableRow className="border-b border-slate-100 hover:bg-transparent">
                <TableHeader className="whitespace-nowrap">Material Code</TableHeader>
                <TableHeader className="min-w-[200px]">Material Description</TableHeader>
                <TableHeader className="min-w-[175px]">Project</TableHeader>
                <TableHeader className="whitespace-nowrap">WBS Element</TableHeader>
                <TableHeader className="whitespace-nowrap text-right">Required Quantity</TableHeader>
                <TableHeader className="whitespace-nowrap text-right">Available Quantity</TableHeader>
                <TableHeader className="whitespace-nowrap text-right">PR Quantity</TableHeader>
                <TableHeader className="whitespace-nowrap text-right">PO Quantity</TableHeader>
                <TableHeader className="whitespace-nowrap text-right">Shortage Quantity</TableHeader>
                <TableHeader>Responsibility</TableHeader>
                <TableHeader>Status</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedMaterials.map((material) => (
                <TableRow
                  key={`${material.project}-${material.code}`}
                  aria-label={`${material.code} ${material.description}`}
                  className="cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500"
                  onClick={() => setSelectedMaterial(material)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      setSelectedMaterial(material)
                    }
                  }}
                  tabIndex={0}
                >
                  <TableCell className="whitespace-nowrap font-semibold text-blue-700">{material.code}</TableCell>
                  <TableCell className="min-w-[200px] text-xs font-medium text-slate-700">{material.description}</TableCell>
                  <TableCell className="min-w-[175px] text-xs text-slate-600">{material.project}</TableCell>
                  <TableCell className="whitespace-nowrap text-xs text-slate-500">{material.wbsElement}</TableCell>
                  <QuantityCell value={material.required} unit={material.unit} />
                  <QuantityCell value={material.available} unit={material.unit} />
                  <QuantityCell value={material.prQuantity} unit={material.unit} />
                  <QuantityCell value={material.poQuantity} unit={material.unit} />
                  <QuantityCell value={material.shortage} unit={material.unit} emphasized={material.shortage > 0} />
                  <TableCell><Badge variant={material.responsibility === 'ABB' ? 'info' : 'neutral'}>{material.responsibility}</Badge></TableCell>
                  <TableCell><Badge variant={statusStyles[material.status]}>{material.status}</Badge></TableCell>
                </TableRow>
              ))}
              {displayedMaterials.length === 0 && (
                <TableRow>
                  <TableCell colSpan={11} className="py-12 text-center text-xs text-slate-500">
                    No demo materials match the selected search and filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 px-4 py-3 text-[10px] text-slate-400 sm:px-5">
          <span>Click or focus a row and press Enter to view material details.</span>
          <span>PR and PO quantities do not imply stock availability.</span>
        </div>
      </Card>

      {selectedMaterial && (
        <MaterialDetailPanel material={selectedMaterial} onClose={() => setSelectedMaterial(null)} />
      )}
    </div>
  )
}

function QuantityCell({
  value,
  unit,
  emphasized = false,
}: {
  value: number
  unit: string
  emphasized?: boolean
}) {
  return (
    <TableCell className={`whitespace-nowrap text-right text-xs ${emphasized ? 'font-semibold text-rose-700' : 'text-slate-600'}`}>
      {value} {unit}
    </TableCell>
  )
}

function FilterSelect({
  label,
  value,
  onChange,
  children,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  children: React.ReactNode
}) {
  return (
    <label>
      <span className="sr-only">{label}</span>
      <select
        aria-label={label}
        className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        {children}
      </select>
    </label>
  )
}
