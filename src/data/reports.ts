import { analysisMaterials } from './materialAnalysis'
import { PROCUREMENT_DEMO_AS_OF, procurementRecords } from './procurement'

export type ReportType = 'material-status' | 'shortage' | 'procurement' | 'responsibility'

export interface ReportRow {
  id: string
  project: string
  reportDate: string | null
  values: Record<string, string | number>
}

export interface ReportDefinition {
  id: ReportType
  label: string
  description: string
  columns: string[]
  rows: ReportRow[]
}

function reportRow(
  id: string,
  project: string,
  reportDate: string | null,
  values: Record<string, string | number>,
): ReportRow {
  return { id, project, reportDate, values }
}

const materialStatusRows = analysisMaterials.map((material) => reportRow(
  `${material.project}-${material.code}`,
  material.project,
  PROCUREMENT_DEMO_AS_OF,
  {
    'Material Code': material.code,
    Description: material.description,
    'Material Group': material.group,
    'Required Qty (Demo)': `${material.required} ${material.unit}`,
    'Available Qty (Demo)': `${material.available} ${material.unit}`,
    'Status (Demo)': material.status,
  },
))

const shortageRows = analysisMaterials
  .filter((material) => material.shortage > 0)
  .map((material) => reportRow(
    `${material.project}-${material.code}`,
    material.project,
    PROCUREMENT_DEMO_AS_OF,
    {
      'Material Code': material.code,
      Description: material.description,
      'Material Group': material.group,
      'Shortage Qty (Demo)': `${material.shortage} ${material.unit}`,
      'Available Qty (Demo)': `${material.available} ${material.unit}`,
      Responsibility: material.responsibility,
    },
  ))

const procurementRows = procurementRecords.map((record) => reportRow(
  record.id,
  record.project,
  record.expectedDeliveryDate ?? record.requirementDate,
  {
    'PR Number': record.prNumber ?? 'Not provided',
    'PO Number': record.poNumber ?? 'Not provided',
    'Material Code': record.materialCode,
    Description: record.description,
    'Requested Qty (Demo)': record.requestedQuantity === null ? 'Not provided' : `${record.requestedQuantity} ${record.unit}`,
    'Ordered Qty (Demo)': record.orderedQuantity === null ? 'Not provided' : `${record.orderedQuantity} ${record.unit}`,
    Status: record.procurementStatus,
  },
))

const responsibilityRows = analysisMaterials.map((material) => reportRow(
  `${material.project}-${material.code}`,
  material.project,
  PROCUREMENT_DEMO_AS_OF,
  {
    'Material Code': material.code,
    Description: material.description,
    'Material Group': material.group,
    'Required Qty (Demo)': `${material.required} ${material.unit}`,
    'Responsibility (Demo)': material.responsibility,
    'Scope Source': 'Material Scope Excel (example)',
  },
))

export const reportDefinitions: ReportDefinition[] = [
  {
    id: 'material-status',
    label: 'Material status report',
    description: 'Demo material records grouped by sample availability status.',
    columns: ['Material Code', 'Description', 'Material Group', 'Required Qty (Demo)', 'Available Qty (Demo)', 'Status (Demo)'],
    rows: materialStatusRows,
  },
  {
    id: 'shortage',
    label: 'Shortage report',
    description: 'Demo shortage values supplied directly as examples; no official shortage formula is applied.',
    columns: ['Material Code', 'Description', 'Material Group', 'Shortage Qty (Demo)', 'Available Qty (Demo)', 'Responsibility'],
    rows: shortageRows,
  },
  {
    id: 'procurement',
    label: 'Procurement report',
    description: 'Demo PR and PO fields. Procurement quantities are not considered physically available stock.',
    columns: ['PR Number', 'PO Number', 'Material Code', 'Description', 'Requested Qty (Demo)', 'Ordered Qty (Demo)', 'Status'],
    rows: procurementRows,
  },
  {
    id: 'responsibility',
    label: 'ABB/Vendor responsibility report',
    description: 'Provisional sample responsibility labels. Confirm all assignments against the official Scope file and mentor guidance.',
    columns: ['Material Code', 'Description', 'Material Group', 'Required Qty (Demo)', 'Responsibility (Demo)', 'Scope Source'],
    rows: responsibilityRows,
  },
]
