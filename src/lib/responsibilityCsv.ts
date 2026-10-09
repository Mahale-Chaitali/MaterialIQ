import type { AnalysisMaterial, Responsibility } from '../data/materialAnalysis'

const headers = [
  'Demo Data',
  'Responsibility',
  'Material Code',
  'Material Description',
  'Project',
  'WBS Element',
  'Material Group',
  'Required Quantity (Demo)',
  'Unit',
]

function escapeCsv(value: string | number) {
  return `"${String(value).replaceAll('"', '""')}"`
}

export function createResponsibilityCsv(
  materials: AnalysisMaterial[],
  responsibility: Responsibility,
) {
  const rows = materials.map((material) => [
    'DEMO',
    responsibility,
    material.code,
    material.description,
    material.project,
    material.wbsElement,
    material.group,
    material.required,
    material.unit,
  ])

  return [headers, ...rows].map((row) => row.map(escapeCsv).join(',')).join('\r\n')
}

export function downloadResponsibilityCsv(
  materials: AnalysisMaterial[],
  responsibility: Responsibility,
) {
  const blob = new Blob([`\uFEFF${createResponsibilityCsv(materials, responsibility)}`], {
    type: 'text/csv;charset=utf-8',
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = `${responsibility.toLowerCase()}-material-requirements-demo.csv`
  document.body.append(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
