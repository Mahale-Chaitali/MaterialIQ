import { useMemo, useState } from 'react'
import {
  Building2,
  Check,
  ClipboardList,
  Download,
  Mail,
  Printer,
  Search,
  Users,
  X,
} from 'lucide-react'
import type { AnalysisMaterial, Responsibility } from '../data/materialAnalysis'
import { analysisMaterials, analysisProjects } from '../data/materialAnalysis'
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
import { downloadResponsibilityCsv } from '../lib/responsibilityCsv'

type ResponsibilityView = 'ABB' | 'Vendor'

function selectedMaterialSummary(materials: AnalysisMaterial[]) {
  return materials.map((material) =>
    `${material.code} — ${material.description}; ${material.project}; ${material.required} ${material.unit} required`,
  ).join('\n')
}

function PreviewDialog({
  responsibility,
  materials,
  vendor,
  onClose,
}: {
  responsibility: ResponsibilityView
  materials: AnalysisMaterial[]
  vendor: string
  onClose: () => void
}) {
  const audience = responsibility === 'ABB' ? 'ABB' : vendor

  return (
    <OverlayDialog title="List preview" onClose={onClose}>
      <p className="text-xs leading-5 text-slate-500">
        DEMO material requirement list for <strong className="text-slate-700">{audience}</strong>.
        Responsibility assignments are provisional examples pending review of the official Material Scope file and mentor confirmation.
      </p>
      <SelectedMaterialsTable materials={materials} />
      <div className="mt-4 flex justify-end">
        <Button type="button" variant="secondary" size="sm" onClick={onClose}>Close preview</Button>
      </div>
    </OverlayDialog>
  )
}

function EmailDraftDialog({
  responsibility,
  materials,
  vendor,
  onClose,
}: {
  responsibility: ResponsibilityView
  materials: AnalysisMaterial[]
  vendor: string
  onClose: () => void
}) {
  const audience = responsibility === 'ABB' ? 'ABB' : vendor
  const [recipient, setRecipient] = useState('')
  const [subject, setSubject] = useState(`Demo material requirements — ${audience}`)
  const [summary, setSummary] = useState(selectedMaterialSummary(materials))

  return (
    <OverlayDialog title="Email draft" onClose={onClose}>
      <p className="text-xs leading-5 text-slate-500">
        Draft only. No email will be sent. Contact details have not been provided; add a verified recipient before using this draft.
      </p>
      <div className="mt-4 space-y-3">
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-slate-600">Recipient</span>
          <Input aria-label="Email recipient" placeholder="Recipient email not provided" value={recipient} onChange={(event) => setRecipient(event.target.value)} />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-slate-600">Subject</span>
          <Input aria-label="Email subject" value={subject} onChange={(event) => setSubject(event.target.value)} />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-slate-600">Material summary</span>
          <textarea
            aria-label="Email material summary"
            className="min-h-36 w-full rounded-lg border border-slate-200 bg-white p-3 text-xs leading-5 text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            value={summary}
            onChange={(event) => setSummary(event.target.value)}
          />
        </label>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <span className="text-[10px] text-slate-400">{recipient.trim() ? 'Recipient entered by you' : 'Recipient not provided'}</span>
        <Button type="button" variant="secondary" size="sm" onClick={onClose}>Close draft</Button>
      </div>
    </OverlayDialog>
  )
}

function OverlayDialog({
  title,
  children,
  onClose,
}: {
  title: string
  children: React.ReactNode
  onClose: () => void
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-3 sm:p-5"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section aria-labelledby="vendor-dialog-title" aria-modal="true" className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-6" role="dialog">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-blue-600">DEMO LIST</p>
            <h2 id="vendor-dialog-title" className="mt-1 text-lg font-bold text-slate-900">{title}</h2>
          </div>
          <Button type="button" variant="ghost" size="icon" aria-label={`Close ${title}`} className="size-8" onClick={onClose}><X size={17} /></Button>
        </div>
        {children}
      </section>
    </div>
  )
}

function SelectedMaterialsTable({ materials }: { materials: AnalysisMaterial[] }) {
  if (materials.length === 0) {
    return <p className="mt-4 rounded-lg bg-slate-50 p-4 text-xs text-slate-500">No materials selected.</p>
  }

  return (
    <div className="mt-4 overflow-x-auto rounded-lg border border-slate-200">
      <Table>
        <TableHead><TableRow><TableHeader>Material</TableHeader><TableHeader>Project / WBS</TableHeader><TableHeader>Required quantity (demo)</TableHeader></TableRow></TableHead>
        <TableBody>
          {materials.map((material) => (
            <TableRow key={`${material.project}-${material.code}`}>
              <TableCell className="min-w-[220px]">
                <p className="text-xs font-semibold text-slate-800">{material.code}</p>
                <p className="mt-1 text-[10px] text-slate-500">{material.description}</p>
              </TableCell>
              <TableCell className="min-w-[180px] text-xs text-slate-600">{material.project}<br /><span className="text-[10px] text-slate-400">{material.wbsElement}</span></TableCell>
              <TableCell className="whitespace-nowrap text-xs font-semibold text-slate-700">{material.required} {material.unit}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export function VendorManagementPage() {
  const [responsibility, setResponsibility] = useState<Responsibility>('ABB')
  const [vendor, setVendor] = useState('Vendor not specified')
  const [project, setProject] = useState('All projects')
  const [query, setQuery] = useState('')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [dialog, setDialog] = useState<'preview' | 'email' | null>(null)

  const responsibilityMaterials = useMemo(
    () => analysisMaterials.filter((material) => material.responsibility === responsibility),
    [responsibility],
  )

  const visibleMaterials = useMemo(() => {
    const search = query.trim().toLowerCase()
    return responsibilityMaterials.filter((material) => {
      const matchesProject = project === 'All projects' || material.project === project
      const matchesSearch = !search || [
        material.code,
        material.description,
        material.project,
        material.wbsElement,
        material.group,
      ].some((value) => value.toLowerCase().includes(search))
      return matchesProject && matchesSearch
    })
  }, [project, query, responsibilityMaterials])

  const selectedMaterials = useMemo(
    () => responsibilityMaterials.filter((material) => selectedIds.has(materialId(material))),
    [responsibilityMaterials, selectedIds],
  )
  const allVisibleSelected = visibleMaterials.length > 0
    && visibleMaterials.every((material) => selectedIds.has(materialId(material)))

  const setSelected = (material: AnalysisMaterial, checked: boolean) => {
    const id = materialId(material)
    setSelectedIds((current) => {
      const next = new Set(current)
      if (checked) next.add(id)
      else next.delete(id)
      return next
    })
  }

  const toggleAllVisible = (checked: boolean) => {
    setSelectedIds((current) => {
      const next = new Set(current)
      visibleMaterials.forEach((material) => {
        if (checked) next.add(materialId(material))
        else next.delete(materialId(material))
      })
      return next
    })
  }

  const openPrintReport = () => window.print()
  const onExport = () => downloadResponsibilityCsv(selectedMaterials, responsibility)
  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <h2 className="text-[25px] font-bold tracking-[-0.04em] text-slate-900 sm:text-[28px]">ABB &amp; Vendor Management</h2>
            <Badge variant="warning">DEMO DATA</Badge>
          </div>
          <p className="max-w-3xl text-sm leading-6 text-slate-500">
            Prepare responsibility-specific material requirement lists. Demo assignments must be reconciled with the official Material Scope file and confirmed with your mentor.
          </p>
        </div>
      </div>

      <Card className="flex items-start gap-3 border-amber-100 bg-amber-50/70 p-4">
        <span className="mt-0.5 text-amber-700"><Users size={16} /></span>
        <div>
          <p className="text-xs font-semibold text-amber-900">Responsibility and contact data are provisional</p>
          <p className="mt-1 text-[11px] leading-5 text-amber-800">
            ABB/Vendor assignments below are demo labels based on sample records, not final responsibility rules.
            No vendor names or email addresses have been supplied. Verify the official Scope file and add confirmed contacts before external use.
          </p>
        </div>
      </Card>

      <section aria-label="Responsibility lists" className="grid gap-4 sm:grid-cols-2">
        <ResponsibilityCard
          active={responsibility === 'ABB'}
          label="ABB responsibility list"
          count={analysisMaterials.filter((item) => item.responsibility === 'ABB').length}
          onClick={() => setResponsibility('ABB')}
          icon={Building2}
        />
        <ResponsibilityCard
          active={responsibility === 'Vendor'}
          label="Vendor responsibility list"
          count={analysisMaterials.filter((item) => item.responsibility === 'Vendor').length}
          onClick={() => setResponsibility('Vendor')}
          icon={Users}
        />
      </section>

      {responsibility === 'Vendor' && (
        <Card className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div>
            <p className="text-xs font-semibold text-slate-800">Vendor selector</p>
            <p className="mt-1 text-[11px] text-slate-500">No vendor names are available. Assign a verified vendor after the Scope file is confirmed.</p>
          </div>
          <select
            aria-label="Vendor selector"
            className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 sm:w-72"
            value={vendor}
            onChange={(event) => setVendor(event.target.value)}
          >
            <option>Vendor not specified</option>
          </select>
        </Card>
      )}

      <Card className="p-4 sm:p-5">
        <CardHeader className="mb-4 flex-col gap-2 sm:flex-row sm:items-center">
          <div>
            <CardTitle>{responsibility} materials</CardTitle>
            <CardDescription className="mt-1">Select rows to prepare a {responsibility}-specific demo requirement list.</CardDescription>
          </div>
          <Badge variant="neutral" className="sm:ml-auto">{visibleMaterials.length} visible · {selectedMaterials.length} selected</Badge>
        </CardHeader>
        <div className="grid gap-2 sm:grid-cols-2">
          <label className="relative">
            <span className="sr-only">Search responsibility materials</span>
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input aria-label="Search responsibility materials" placeholder="Search code, description, WBS..." value={query} onChange={(event) => setQuery(event.target.value)} className="h-9 pl-9 text-xs" />
          </label>
          <label>
            <span className="sr-only">Filter responsibility materials by project</span>
            <select
              aria-label="Filter responsibility materials by project"
              className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              value={project}
              onChange={(event) => setProject(event.target.value)}
            >
              <option>All projects</option>
              {analysisProjects.map((name) => <option key={name}>{name}</option>)}
            </select>
          </label>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHead>
              <TableRow className="border-b border-slate-100 hover:bg-transparent">
                <TableHeader className="w-10">
                  <input
                    aria-label="Select all visible materials"
                    checked={allVisibleSelected}
                    className="size-4 rounded border-slate-300 accent-blue-600"
                    onChange={(event) => toggleAllVisible(event.target.checked)}
                    type="checkbox"
                  />
                </TableHeader>
                <TableHeader>Material code</TableHeader>
                <TableHeader className="min-w-[210px]">Material description</TableHeader>
                <TableHeader className="min-w-[170px]">Project</TableHeader>
                <TableHeader>WBS element</TableHeader>
                <TableHeader>Group</TableHeader>
                <TableHeader className="whitespace-nowrap text-right">Required quantity (demo)</TableHeader>
                <TableHeader>Responsibility</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {visibleMaterials.map((material) => {
                const id = materialId(material)
                return (
                  <TableRow key={id}>
                    <TableCell>
                      <input
                        aria-label={`Select ${material.code} for ${material.project}`}
                        checked={selectedIds.has(id)}
                        className="size-4 rounded border-slate-300 accent-blue-600"
                        onChange={(event) => setSelected(material, event.target.checked)}
                        type="checkbox"
                      />
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-xs font-semibold text-blue-700">{material.code}</TableCell>
                    <TableCell className="min-w-[210px] text-xs text-slate-700">{material.description}</TableCell>
                    <TableCell className="min-w-[170px] text-xs text-slate-600">{material.project}</TableCell>
                    <TableCell className="whitespace-nowrap text-xs text-slate-500">{material.wbsElement}</TableCell>
                    <TableCell className="text-xs text-slate-600">{material.group}</TableCell>
                    <TableCell className="whitespace-nowrap text-right text-xs font-medium text-slate-700">{material.required} {material.unit}</TableCell>
                    <TableCell><Badge variant={responsibility === 'ABB' ? 'info' : 'neutral'}>{responsibility}</Badge></TableCell>
                  </TableRow>
                )
              })}
              {visibleMaterials.length === 0 && (
                <TableRow><TableCell colSpan={8} className="py-10 text-center text-xs text-slate-500">No demo materials match these filters.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 px-4 py-3 text-[10px] text-slate-400 sm:px-5">
          <span>Showing {visibleMaterials.length} of {responsibilityMaterials.length} demo responsibility records.</span>
          <span>Required quantities are examples; no official scope calculation is applied.</span>
        </div>
      </Card>

      <Card className="p-4 sm:p-5">
        <CardHeader className="flex-col gap-2 sm:flex-row sm:items-center">
          <div>
            <CardTitle>Selected-material summary</CardTitle>
            <CardDescription className="mt-1">
              {selectedMaterials.length} selected for {responsibility === 'ABB' ? 'ABB' : vendor}.
              {responsibility === 'Vendor' && ' Vendor identity and email are not provided.'}
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2 sm:ml-auto">
            <Button type="button" variant="secondary" size="sm" disabled={!selectedMaterials.length} onClick={() => setDialog('preview')}>
              <ClipboardList size={14} /> Preview list
            </Button>
            <Button type="button" variant="secondary" size="sm" disabled={!selectedMaterials.length} onClick={onExport}>
              <Download size={14} /> Export CSV
            </Button>
            <Button type="button" variant="secondary" size="sm" disabled={!selectedMaterials.length} onClick={openPrintReport}>
              <Printer size={14} /> Print / PDF
            </Button>
            <Button type="button" size="sm" disabled={!selectedMaterials.length} onClick={() => setDialog('email')}>
              <Mail size={14} /> Prepare email draft
            </Button>
          </div>
        </CardHeader>
        {selectedMaterials.length ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {selectedMaterials.map((material) => (
              <span key={materialId(material)} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[10px] text-slate-600">
                <Check size={12} className="text-emerald-600" /> {material.code} · {material.required} {material.unit}
              </span>
            ))}
          </div>
        ) : (
          <p className="mt-3 rounded-lg bg-slate-50 p-3 text-xs text-slate-500">Select one or more materials above to build a list.</p>
        )}
      </Card>

      <div className="rounded-lg border border-slate-200 bg-white p-4 text-[11px] leading-5 text-slate-500">
        <strong className="text-slate-700">Before sharing:</strong> verify every responsibility assignment against the official Material Scope file and confirm the final rules with your mentor.
        Add real vendor details when supplied. Email drafts are never sent by this application.
      </div>

      <div id="responsibility-print-report" className="hidden">
        <h1>Material Requirement List — {responsibility}</h1>
        <p>DEMO DATA — Prepared from sample records. Confirm scope assignments against the official Scope file.</p>
        {responsibility === 'Vendor' && <p>Vendor: {vendor}. Vendor name and contact details have not been provided.</p>}
        <p>Materials selected: {selectedMaterials.length}</p>
        <table>
          <thead><tr><th>Material Code</th><th>Description</th><th>Project</th><th>WBS Element</th><th>Material Group</th><th>Required Quantity (Demo)</th><th>Responsibility (Demo)</th></tr></thead>
          <tbody>{selectedMaterials.map((material) => <tr key={materialId(material)}><td>{material.code}</td><td>{material.description}</td><td>{material.project}</td><td>{material.wbsElement}</td><td>{material.group}</td><td>{material.required} {material.unit}</td><td>{responsibility}</td></tr>)}</tbody>
        </table>
        <p>These sample quantities are not official calculations. PR/PO values are not treated as physically available stock.</p>
      </div>

      {dialog === 'preview' && (
        <PreviewDialog responsibility={responsibility} materials={selectedMaterials} vendor={vendor} onClose={() => setDialog(null)} />
      )}
      {dialog === 'email' && (
        <EmailDraftDialog responsibility={responsibility} materials={selectedMaterials} vendor={vendor} onClose={() => setDialog(null)} />
      )}
    </div>
  )
}

function ResponsibilityCard({
  active,
  label,
  count,
  onClick,
  icon: Icon,
}: {
  active: boolean
  label: string
  count: number
  onClick: () => void
  icon: typeof Building2
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={`flex items-center gap-4 rounded-xl border p-4 text-left transition-colors sm:p-5 ${active ? 'border-blue-300 bg-blue-50/60 ring-1 ring-blue-100' : 'border-slate-200 bg-white hover:border-slate-300'}`}
      onClick={onClick}
    >
      <span className={`grid size-11 shrink-0 place-items-center rounded-xl ${active ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}><Icon size={20} /></span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-slate-800">{label}</span>
        <span className="mt-1 block text-[11px] text-slate-500">{count} sample materials</span>
      </span>
      <Badge variant={active ? 'info' : 'neutral'}>{active ? 'Selected' : 'View list'}</Badge>
    </button>
  )
}

function materialId(material: AnalysisMaterial) {
  return `${material.project}::${material.code}`
}
