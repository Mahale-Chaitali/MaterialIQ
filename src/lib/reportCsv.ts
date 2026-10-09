import type { ReportDefinition, ReportRow } from '../data/reports'

function escapeCsv(value: string | number) {
  return `"${String(value).replaceAll('"', '""')}"`
}

export function createReportCsv(report: ReportDefinition, rows: ReportRow[]) {
  const headers = ['DEMO REPORT', 'Project', 'Report Date (Demo)', ...report.columns]
  const values = rows.map((row) => [
    'DEMO',
    row.project,
    row.reportDate ?? 'Not provided',
    ...report.columns.map((column) => row.values[column] ?? ''),
  ])

  return [headers, ...values].map((line) => line.map(escapeCsv).join(',')).join('\r\n')
}

export function downloadReportCsv(report: ReportDefinition, rows: ReportRow[]) {
  const blob = new Blob([`\uFEFF${createReportCsv(report, rows)}`], {
    type: 'text/csv;charset=utf-8',
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = `${report.id}-demo.csv`
  document.body.append(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
