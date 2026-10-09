import type { AnalysisMaterial } from '../data/materialAnalysis'

const headers = [
  'Material Code',
  'Material Description',
  'Project',
  'WBS Element',
  'Required Quantity',
  'Available Quantity',
  'PR Quantity',
  'PO Quantity',
  'Shortage Quantity (Demo)',
  'Responsibility',
  'Status',
]

function escapeCsv(value: string | number) {
  const stringValue = String(value)
  return `"${stringValue.replaceAll('"', '""')}"`
}

export function createMaterialCsv(materials: AnalysisMaterial[]) {
  const rows = materials.map((material) => [
    material.code,
    material.description,
    material.project,
    material.wbsElement,
    `${material.required} ${material.unit}`,
    `${material.available} ${material.unit}`,
    `${material.prQuantity} ${material.unit}`,
    `${material.poQuantity} ${material.unit}`,
    `${material.shortage} ${material.unit}`,
    material.responsibility,
    material.status,
  ])

  return [headers, ...rows].map((row) => row.map(escapeCsv).join(',')).join('\r\n')
}

export function downloadMaterialCsv(materials: AnalysisMaterial[]) {
  const blob = new Blob([`\uFEFF${createMaterialCsv(materials)}`], {
    type: 'text/csv;charset=utf-8',
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = 'material-analysis-demo.csv'
  document.body.append(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
