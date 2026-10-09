import { useMemo, useState } from 'react'
import { Download, FileBarChart2, Search } from 'lucide-react'
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
import { reportDefinitions, type ReportType } from '../data/reports'
import { downloadReportCsv } from '../lib/reportCsv'

const tabs: { id: ReportType; label: string }[] = reportDefinitions.map(({ id, label }) => ({ id, label }))
const projects = [...new Set(reportDefinitions.flatMap((report) => report.rows.map((row) => row.project)))]

export function ReportsPage() {
  const [reportId, setReportId] = useState<ReportType>('material-status')
  const [project, setProject] = useState('All projects')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [query, setQuery] = useState('')

  const report = reportDefinitions.find((item) => item.id === reportId) ?? reportDefinitions[0]

  const displayedRows = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return report.rows.filter((row) => {
      const projectMatches = project === 'All projects' || row.project === project
      const fromMatches = !dateFrom || Boolean(row.reportDate && row.reportDate >= dateFrom)
      const toMatches = !dateTo || Boolean(row.reportDate && row.reportDate <= dateTo)
      const queryMatches = !normalizedQuery || [
        row.project,
        ...Object.values(row.values).map(String),
      ].some((value) => value.toLowerCase().includes(normalizedQuery))
      return projectMatches && fromMatches && toMatches && queryMatches
    })
  }, [dateFrom, dateTo, project, query, report])

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <h2 className="text-[25px] font-bold tracking-[-0.04em] text-slate-900 sm:text-[28px]">Reports</h2>
            <Badge variant="warning">DEMO DATA</Badge>
          </div>
          <p className="max-w-3xl text-sm leading-6 text-slate-500">
            Preview and export sample material, shortage, procurement, and responsibility reports.
          </p>
        </div>
        <Button type="button" variant="secondary" size="sm" disabled={displayedRows.length === 0} onClick={() => downloadReportCsv(report, displayedRows)}>
          <Download size={15} /> Export filtered CSV
        </Button>
      </div>

      <Card className="flex items-start gap-3 border-amber-100 bg-amber-50/70 p-4">
        <span className="mt-0.5 text-amber-700"><FileBarChart2 size={16} /></span>
        <div>
          <p className="text-xs font-semibold text-amber-900">Sample reports — not official calculations</p>
          <p className="mt-1 text-[11px] leading-5 text-amber-800">
            Report values are demonstration records. Shortages are provided as sample values; PR/PO quantities are not treated as available stock, and responsibility assignments require Scope-file and mentor confirmation.
          </p>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="flex min-w-0 overflow-x-auto border-b border-slate-200 px-2 pt-2 sm:px-4" role="tablist" aria-label="Report types">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={reportId === tab.id}
              className={`shrink-0 border-b-2 px-3 py-3 text-xs font-semibold transition-colors sm:px-4 ${reportId === tab.id ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
              onClick={() => setReportId(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="p-4 sm:p-5">
          <CardHeader className="mb-4 flex-col gap-2 sm:flex-row sm:items-center">
            <div>
              <CardTitle>{report.label}</CardTitle>
              <CardDescription className="mt-1">{report.description}</CardDescription>
            </div>
            <Badge variant="neutral" className="sm:ml-auto">{displayedRows.length} demo rows</Badge>
          </CardHeader>
          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
            <label className="relative sm:col-span-2 xl:col-span-1">
              <span className="sr-only">Search report rows</span>
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input aria-label="Search report rows" placeholder="Search displayed report" value={query} onChange={(event) => setQuery(event.target.value)} className="h-9 pl-9 text-xs" />
            </label>
            <label>
              <span className="sr-only">Filter report by project</span>
              <select aria-label="Filter report by project" className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" value={project} onChange={(event) => setProject(event.target.value)}>
                <option>All projects</option>
                {projects.map((name) => <option key={name}>{name}</option>)}
              </select>
            </label>
            <label>
              <span className="sr-only">Report date from</span>
              <Input aria-label="Report date from" type="date" value={dateFrom} onChange={(event) => setDateFrom(event.target.value)} className="h-9 px-2 text-[10px]" />
            </label>
            <label>
              <span className="sr-only">Report date to</span>
              <Input aria-label="Report date to" type="date" value={dateTo} onChange={(event) => setDateTo(event.target.value)} className="h-9 px-2 text-[10px]" />
            </label>
          </div>
          <p className="mt-2 text-[10px] text-slate-400">
            Dates are sample report dates. For the demo procurement report filter only, expected-delivery date falls back to requirement date when missing; this is not a confirmed VA05 or business rule.
          </p>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHead>
              <TableRow className="border-y border-slate-100 hover:bg-transparent">
                <TableHeader className="whitespace-nowrap">Project</TableHeader>
                <TableHeader className="whitespace-nowrap">Report date (demo)</TableHeader>
                {report.columns.map((column) => <TableHeader key={column} className="min-w-[130px]">{column}</TableHeader>)}
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedRows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="min-w-[170px] text-xs text-slate-600">{row.project}</TableCell>
                  <TableCell className="whitespace-nowrap text-xs text-slate-500">{row.reportDate ?? 'Not provided'}</TableCell>
                  {report.columns.map((column) => (
                    <TableCell key={column} className="min-w-[130px] text-xs text-slate-700">
                      {row.values[column] ?? 'Not provided'}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
              {displayedRows.length === 0 && (
                <TableRow><TableCell colSpan={report.columns.length + 2} className="py-10 text-center text-xs text-slate-500">No demo rows match the selected project, dates, and search.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="border-t border-slate-100 px-4 py-3 text-[10px] text-slate-400 sm:px-5">
          CSV export includes the currently selected report and filters, and marks all data as DEMO.
        </div>
      </Card>
    </div>
  )
}
