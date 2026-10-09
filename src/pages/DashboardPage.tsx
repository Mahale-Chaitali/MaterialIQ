import { useMemo, useState } from 'react'
import {
  AlertTriangle,
  Boxes,
  Check,
  ChevronDown,
  Clock3,
  Database,
  Layers3,
  PackageCheck,
  RefreshCw,
  Search,
  ShoppingCart,
  X,
} from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
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
import {
  demoProjects,
  demoSources,
  type DemoMaterial,
  type MaterialStatus,
} from '../data/dashboard'

const statusStyles: Record<MaterialStatus, 'success' | 'warning' | 'danger'> = {
  Available: 'success',
  Partial: 'warning',
  Shortage: 'danger',
}

const statusColors: Record<MaterialStatus, string> = {
  Available: '#10b981',
  Partial: '#f59e0b',
  Shortage: '#ef4444',
}

const procurementColors = ['#2563eb', '#8b5cf6', '#f59e0b', '#10b981']

function MaterialDetail({ material, onClose }: { material: DemoMaterial; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        aria-labelledby="material-detail-title"
        aria-modal="true"
        className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl sm:p-6"
        role="dialog"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">DEMO MATERIAL RECORD</p>
            <h2 id="material-detail-title" className="mt-1 text-xl font-bold tracking-tight text-slate-900">{material.code}</h2>
          </div>
          <Button type="button" variant="ghost" size="icon" aria-label="Close material details" className="size-8" onClick={onClose}>
            <X size={17} />
          </Button>
        </div>
        <p className="mt-4 text-sm font-medium text-slate-800">{material.description}</p>
        <dl className="mt-5 grid grid-cols-2 gap-3">
          {[
            ['Project', material.project],
            ['Material group', material.group],
            ['Required quantity', `${material.required} ${material.unit}`],
            ['Available quantity', `${material.available} ${material.unit}`],
            ['Shortage quantity', `${material.shortage} ${material.unit}`],
            ['Procurement pending', material.procurementPending ? 'Yes (demo)' : 'No (demo)'],
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg bg-slate-50 p-3">
              <dt className="text-[11px] text-slate-500">{label}</dt>
              <dd className="mt-1 text-sm font-semibold text-slate-800">{value}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-4 flex items-center gap-3">
          <Badge variant={statusStyles[material.status]}>{material.status}</Badge>
          <Badge variant={material.priority === 'High' ? 'danger' : material.priority === 'Medium' ? 'warning' : 'neutral'}>
            {material.priority} priority
          </Badge>
        </div>
        <p className="mt-4 text-[11px] leading-5 text-slate-500">
          Demonstration values for UI preview only. They are not live inventory, procurement, or shortage calculations.
        </p>
      </section>
    </div>
  )
}

function SummaryCard({
  label,
  value,
  caption,
  icon: Icon,
  iconClass,
}: {
  label: string
  value: number
  caption: string
  icon: typeof Boxes
  iconClass: string
}) {
  return (
    <Card className="p-4 sm:p-5">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-[27px] font-bold leading-none tracking-tight text-slate-900">{value}</p>
        </div>
        <span className={`grid size-9 shrink-0 place-items-center rounded-lg ${iconClass}`}>
          <Icon size={18} />
        </span>
      </div>
      <p className="mt-3 text-[10px] text-slate-400">{caption}</p>
    </Card>
  )
}

export function DashboardPage() {
  const [project, setProject] = useState('All projects')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All statuses')
  const [selectedMaterial, setSelectedMaterial] = useState<DemoMaterial | null>(null)
  const [refreshMessage, setRefreshMessage] = useState('')
  const [refreshCount, setRefreshCount] = useState(0)

  const materials = useMemo(
    () => demoProjects.find((item) => item.name === project)?.materials ?? [],
    [project],
  )

  const summary = useMemo(() => ({
    total: materials.length,
    available: materials.filter((material) => material.status === 'Available').length,
    partial: materials.filter((material) => material.status === 'Partial').length,
    shortage: materials.filter((material) => material.status === 'Shortage').length,
    procurement: materials.filter((material) => material.procurementPending).length,
  }), [materials])

  const attentionMaterials = useMemo(
    () => materials.filter((material) => material.status !== 'Available' || material.procurementPending),
    [materials],
  )

  const filteredMaterials = useMemo(() => {
    const query = search.trim().toLowerCase()
    return attentionMaterials.filter((material) => {
      const matchesQuery = !query || [material.code, material.description, material.group, material.project]
        .some((value) => value.toLowerCase().includes(query))
      const matchesStatus = statusFilter === 'All statuses' || material.status === statusFilter
      return matchesQuery && matchesStatus
    })
  }, [attentionMaterials, search, statusFilter])

  const statusData = [
    { name: 'Available', value: summary.available },
    { name: 'Partial', value: summary.partial },
    { name: 'Shortage', value: summary.shortage },
  ]
  const groupTotals = materials.reduce<Record<string, number>>((totals, material) => {
    if (material.shortage > 0) totals[material.group] = (totals[material.group] ?? 0) + material.shortage
    return totals
  }, {})
  const shortageByGroup = Object.entries(groupTotals).map(([group, quantity]) => ({ group, quantity }))
  const procurementData = [
    { name: 'Requested', value: materials.filter((item) => item.procurementStatus === 'Requested').length },
    { name: 'In review', value: materials.filter((item) => item.procurementStatus === 'In review').length },
    { name: 'Ordered', value: materials.filter((item) => item.procurementStatus === 'Ordered').length },
    { name: 'Not started', value: materials.filter((item) => item.procurementStatus === 'Not started').length },
  ]

  const refreshDemo = () => {
    setRefreshCount((count) => count + 1)
    setRefreshMessage('Demo display refreshed. No external files or live systems were checked.')
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <h2 className="text-[24px] font-bold tracking-[-0.04em] text-slate-900 sm:text-[28px]">Material Management Dashboard</h2>
            <Badge variant="warning" className="uppercase tracking-wide">Demo data</Badge>
          </div>
          <p className="text-sm text-slate-500">A sample view of material availability, shortage exposure, and procurement activity.</p>
        </div>
        <div className="flex flex-wrap items-end gap-2">
          <label className="min-w-[190px] flex-1 sm:flex-none">
            <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-slate-400">Project</span>
            <span className="relative block">
              <select
                aria-label="Project selector"
                className="h-10 w-full appearance-none rounded-lg border border-slate-200 bg-white pl-3 pr-9 text-xs font-medium text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 sm:w-56"
                value={project}
                onChange={(event) => setProject(event.target.value)}
              >
                {demoProjects.map((item) => <option key={item.name}>{item.name}</option>)}
              </select>
              <ChevronDown aria-hidden="true" size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </span>
          </label>
          <div className="min-w-[135px]">
            <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-slate-400">Current data date</span>
            <span className="flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700">
              <Clock3 size={14} className="text-slate-400" /> Oct 9, 2026
            </span>
          </div>
          <Button type="button" variant="secondary" size="default" aria-label="Refresh demo dashboard" onClick={refreshDemo}>
            <RefreshCw size={15} /> <span className="hidden sm:inline">Refresh</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-blue-100 bg-blue-50/70 px-3 py-2 text-[11px] text-blue-800">
        <span><strong>DEMO DATA</strong> — All figures and source statuses on this page are examples, not live data or official shortage calculations.</span>
        {refreshMessage && <span role="status" className="font-medium">{refreshMessage} {refreshCount > 1 ? `(refresh ${refreshCount})` : ''}</span>}
      </div>

      <section aria-label="Material summary" className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
        <SummaryCard label="Total Materials" value={summary.total} caption="Distinct demo material records" icon={Boxes} iconClass="bg-blue-50 text-blue-600" />
        <SummaryCard label="Available Materials" value={summary.available} caption="Demo status: fully available" icon={PackageCheck} iconClass="bg-emerald-50 text-emerald-600" />
        <SummaryCard label="Partial Availability" value={summary.partial} caption="Demo status: partial availability" icon={Layers3} iconClass="bg-amber-50 text-amber-600" />
        <SummaryCard label="Shortage Materials" value={summary.shortage} caption="Demo status: no available quantity" icon={AlertTriangle} iconClass="bg-rose-50 text-rose-600" />
        <SummaryCard label="Pending Procurement" value={summary.procurement} caption="Demo records with procurement pending" icon={ShoppingCart} iconClass="bg-violet-50 text-violet-600" />
      </section>

      <section aria-label="Demo material charts" className="grid gap-4 xl:grid-cols-3">
        <Card className="min-w-0 p-4 sm:p-5">
          <CardHeader>
            <div>
              <CardTitle>Material status distribution</CardTitle>
              <CardDescription className="mt-1">Demo record count by sample status</CardDescription>
            </div>
          </CardHeader>
          <div className="relative mt-2 h-[210px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={57} outerRadius={82} paddingAngle={3} stroke="none">
                  {statusData.map((item) => <Cell key={item.name} fill={statusColors[item.name as MaterialStatus]} />)}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value} demo records`, name]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-slate-900">{summary.total}</span>
              <span className="text-[10px] text-slate-400">demo materials</span>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
            {statusData.map((item) => (
              <span key={item.name} className="flex items-center gap-1.5 text-[10px] text-slate-500">
                <span className="size-2 rounded-full" style={{ backgroundColor: statusColors[item.name as MaterialStatus] }} />
                {item.name} <strong className="text-slate-700">{item.value}</strong>
              </span>
            ))}
          </div>
        </Card>

        <Card className="min-w-0 p-4 sm:p-5">
          <CardHeader>
            <div>
              <CardTitle>Shortage quantity by material group</CardTitle>
              <CardDescription className="mt-1">Sample quantity values; source row units vary</CardDescription>
            </div>
          </CardHeader>
          <div className="mt-3 h-[240px]" role="img" aria-label="Bar chart of demo shortage quantity by material group">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={shortageByGroup} margin={{ top: 8, right: 8, bottom: 0, left: -15 }}>
                <CartesianGrid stroke="#edf1f6" strokeDasharray="3 4" vertical={false} />
                <XAxis dataKey="group" tick={{ fill: '#718096', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94a0b4', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(value) => [`${value} demo quantity`, 'Shortage']} />
                <Bar dataKey="quantity" fill="#ef6b72" radius={[5, 5, 0, 0]} maxBarSize={42} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="min-w-0 p-4 sm:p-5">
          <CardHeader>
            <div>
              <CardTitle>Procurement status overview</CardTitle>
              <CardDescription className="mt-1">Demo records grouped by sample workflow stage</CardDescription>
            </div>
          </CardHeader>
          <div className="mt-3 h-[240px]" role="img" aria-label="Bar chart of demo procurement status">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={procurementData} layout="vertical" margin={{ top: 4, right: 10, bottom: 0, left: 4 }}>
                <CartesianGrid stroke="#edf1f6" strokeDasharray="3 4" horizontal={false} />
                <XAxis type="number" allowDecimals={false} tick={{ fill: '#94a0b4', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" width={72} tick={{ fill: '#718096', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(value) => [`${value} demo records`, 'Materials']} />
                <Bar dataKey="value" radius={[0, 5, 5, 0]} maxBarSize={22}>
                  {procurementData.map((item, index) => <Cell key={item.name} fill={procurementColors[index]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </section>

      <section aria-label="Priority materials" className="space-y-3">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-semibold text-slate-900">Priority materials</h3>
              <Badge variant="warning">DEMO DATA</Badge>
            </div>
            <p className="mt-1 text-xs text-slate-500">Illustrative material rows for review. Quantities are sample values only.</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <label className="relative min-w-0 sm:w-64">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input aria-label="Search priority materials" placeholder="Search code or description" value={search} onChange={(event) => setSearch(event.target.value)} className="h-9 pl-9 text-xs" />
            </label>
            <label>
              <span className="sr-only">Filter by status</span>
              <select
                aria-label="Filter by status"
                className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 sm:w-40"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
              >
                <option>All statuses</option>
                <option>Available</option>
                <option>Partial</option>
                <option>Shortage</option>
              </select>
            </label>
          </div>
        </div>
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHead>
                <TableRow className="border-b border-slate-100 hover:bg-transparent">
                  <TableHeader className="whitespace-nowrap">Material Code</TableHeader>
                  <TableHeader className="min-w-[190px]">Description</TableHeader>
                  <TableHeader className="whitespace-nowrap text-right">Required Qty</TableHeader>
                  <TableHeader className="whitespace-nowrap text-right">Available Qty</TableHeader>
                  <TableHeader className="whitespace-nowrap text-right">Shortage Qty</TableHeader>
                  <TableHeader>Status</TableHeader>
                  <TableHeader>Priority</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredMaterials.map((material) => (
                  <TableRow key={`${material.project}-${material.code}`}>
                    <TableCell className="whitespace-nowrap">
                      <button type="button" className="font-semibold text-blue-700 hover:text-blue-900 hover:underline" onClick={() => setSelectedMaterial(material)}>
                        {material.code}
                      </button>
                    </TableCell>
                    <TableCell className="min-w-[190px]">
                      <p className="text-xs font-medium text-slate-800">{material.description}</p>
                      <p className="mt-1 text-[10px] text-slate-400">{material.group} · {material.project}</p>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-right text-xs text-slate-600">{material.required} {material.unit}</TableCell>
                    <TableCell className="whitespace-nowrap text-right text-xs text-slate-600">{material.available} {material.unit}</TableCell>
                    <TableCell className="whitespace-nowrap text-right text-xs font-semibold text-slate-700">{material.shortage} {material.unit}</TableCell>
                    <TableCell><Badge variant={statusStyles[material.status]}>{material.status}</Badge></TableCell>
                    <TableCell>
                      <Badge variant={material.priority === 'High' ? 'danger' : material.priority === 'Medium' ? 'warning' : 'neutral'}>
                        {material.priority}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredMaterials.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="py-10 text-center text-xs text-slate-500">
                      No demo materials match the selected search and status.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 px-4 py-3 text-[10px] text-slate-400 sm:px-5">
            <span>Showing {filteredMaterials.length} of {attentionMaterials.length} attention items</span>
            <span>Quantities are illustrative and are not calculated by an official shortage formula.</span>
          </div>
        </Card>
      </section>

      <section aria-labelledby="freshness-heading">
        <Card className="p-4 sm:p-5">
          <CardHeader className="flex-col gap-2 sm:flex-row sm:items-center">
            <div>
              <CardTitle id="freshness-heading">Data freshness</CardTitle>
              <CardDescription className="mt-1">Example input timestamps and statuses only — no files have been checked.</CardDescription>
            </div>
            <Badge variant="neutral" className="sm:ml-auto"><Database size={12} /> DEMO INPUTS</Badge>
          </CardHeader>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {demoSources.map((source) => (
              <div key={source.name} className="flex min-w-0 items-center justify-between gap-3 rounded-lg border border-slate-100 bg-slate-50/70 px-3 py-2.5">
                <div className="flex min-w-0 items-center gap-2.5">
                  <span className={`grid size-7 shrink-0 place-items-center rounded-md ${source.status === 'Ready' ? 'bg-emerald-50 text-emerald-600' : source.status === 'Review' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-500'}`}>
                    {source.status === 'Ready' ? <Check size={14} /> : source.status === 'Review' ? <AlertTriangle size={14} /> : <Clock3 size={14} />}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-slate-700">{source.name}</p>
                    <p className="mt-0.5 truncate text-[10px] text-slate-400">{source.updated}</p>
                  </div>
                </div>
                <Badge variant={source.status === 'Ready' ? 'success' : source.status === 'Review' ? 'warning' : 'neutral'}>{source.status}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {selectedMaterial && <MaterialDetail material={selectedMaterial} onClose={() => setSelectedMaterial(null)} />}
    </div>
  )
}
