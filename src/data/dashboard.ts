export type MaterialStatus = 'Available' | 'Partial' | 'Shortage'

export interface DemoMaterial {
  code: string
  description: string
  group: string
  project: string
  required: number
  available: number
  shortage: number
  unit: string
  status: MaterialStatus
  priority: 'High' | 'Medium' | 'Low'
  procurementPending: boolean
  procurementStatus: 'Requested' | 'In review' | 'Ordered' | 'Not started'
}

interface DemoProject {
  name: string
  materials: DemoMaterial[]
}

const northPlant: DemoMaterial[] = [
  { code: 'MTR-4402', description: 'Stainless steel pipe, 4 in SCH 40', group: 'Piping', project: 'North Plant Expansion', required: 240, available: 80, shortage: 160, unit: 'm', status: 'Partial', priority: 'High', procurementPending: true, procurementStatus: 'In review' },
  { code: 'ELC-1830', description: 'Motor control center, 480V', group: 'Electrical', project: 'North Plant Expansion', required: 3, available: 1, shortage: 2, unit: 'ea', status: 'Partial', priority: 'High', procurementPending: true, procurementStatus: 'Requested' },
  { code: 'INS-2091', description: 'Pressure transmitter, 0–400 PSI', group: 'Instrumentation', project: 'North Plant Expansion', required: 18, available: 12, shortage: 6, unit: 'ea', status: 'Partial', priority: 'Medium', procurementPending: true, procurementStatus: 'Ordered' },
  { code: 'PMP-7714', description: 'Centrifugal pump, 15 HP', group: 'Mechanical', project: 'North Plant Expansion', required: 2, available: 0, shortage: 2, unit: 'ea', status: 'Shortage', priority: 'High', procurementPending: true, procurementStatus: 'Requested' },
  { code: 'VAL-3310', description: 'Gate valve, 4 in, Class 300', group: 'Piping', project: 'North Plant Expansion', required: 12, available: 12, shortage: 0, unit: 'ea', status: 'Available', priority: 'Low', procurementPending: false, procurementStatus: 'Not started' },
  { code: 'CAB-5080', description: 'Shielded control cable, 2 pair', group: 'Electrical', project: 'North Plant Expansion', required: 850, available: 0, shortage: 850, unit: 'm', status: 'Shortage', priority: 'High', procurementPending: true, procurementStatus: 'In review' },
  { code: 'BRG-1176', description: 'Pillow block bearing, 40 mm', group: 'Mechanical', project: 'North Plant Expansion', required: 8, available: 8, shortage: 0, unit: 'ea', status: 'Available', priority: 'Low', procurementPending: false, procurementStatus: 'Not started' },
  { code: 'SNS-6240', description: 'Level switch, stainless steel', group: 'Instrumentation', project: 'North Plant Expansion', required: 6, available: 3, shortage: 3, unit: 'ea', status: 'Partial', priority: 'Medium', procurementPending: false, procurementStatus: 'Not started' },
]

const waterTreatment: DemoMaterial[] = [
  { code: 'ELC-1830', description: 'Motor control center, 480V', group: 'Electrical', project: 'Water Treatment Phase II', required: 4, available: 0, shortage: 4, unit: 'ea', status: 'Shortage', priority: 'High', procurementPending: true, procurementStatus: 'Requested' },
  { code: 'PMP-6621', description: 'Vertical turbine pump, 25 HP', group: 'Mechanical', project: 'Water Treatment Phase II', required: 3, available: 2, shortage: 1, unit: 'ea', status: 'Partial', priority: 'High', procurementPending: true, procurementStatus: 'In review' },
  { code: 'PIP-3008', description: 'HDPE pipe, 200 mm', group: 'Piping', project: 'Water Treatment Phase II', required: 320, available: 320, shortage: 0, unit: 'm', status: 'Available', priority: 'Low', procurementPending: false, procurementStatus: 'Not started' },
  { code: 'INS-4100', description: 'Flow meter, electromagnetic 6 in', group: 'Instrumentation', project: 'Water Treatment Phase II', required: 5, available: 2, shortage: 3, unit: 'ea', status: 'Partial', priority: 'Medium', procurementPending: true, procurementStatus: 'Ordered' },
  { code: 'VAL-2240', description: 'Butterfly valve, 8 in', group: 'Piping', project: 'Water Treatment Phase II', required: 14, available: 0, shortage: 14, unit: 'ea', status: 'Shortage', priority: 'High', procurementPending: true, procurementStatus: 'In review' },
  { code: 'CAB-5080', description: 'Shielded control cable, 2 pair', group: 'Electrical', project: 'Water Treatment Phase II', required: 460, available: 460, shortage: 0, unit: 'm', status: 'Available', priority: 'Low', procurementPending: false, procurementStatus: 'Not started' },
  { code: 'SNS-7142', description: 'pH analyzer probe assembly', group: 'Instrumentation', project: 'Water Treatment Phase II', required: 4, available: 3, shortage: 1, unit: 'ea', status: 'Partial', priority: 'Medium', procurementPending: false, procurementStatus: 'Not started' },
]

const coolingTower: DemoMaterial[] = [
  { code: 'PMP-7714', description: 'Centrifugal pump, 15 HP', group: 'Mechanical', project: 'Cooling Tower Retrofit', required: 2, available: 0, shortage: 2, unit: 'ea', status: 'Shortage', priority: 'High', procurementPending: true, procurementStatus: 'Requested' },
  { code: 'PIP-1188', description: 'Carbon steel pipe, 6 in SCH 40', group: 'Piping', project: 'Cooling Tower Retrofit', required: 180, available: 110, shortage: 70, unit: 'm', status: 'Partial', priority: 'High', procurementPending: true, procurementStatus: 'Ordered' },
  { code: 'FAN-3302', description: 'Axial cooling tower fan, 2.4 m', group: 'Mechanical', project: 'Cooling Tower Retrofit', required: 3, available: 3, shortage: 0, unit: 'ea', status: 'Available', priority: 'Low', procurementPending: false, procurementStatus: 'Not started' },
  { code: 'ELC-4501', description: 'Variable frequency drive, 30 kW', group: 'Electrical', project: 'Cooling Tower Retrofit', required: 2, available: 1, shortage: 1, unit: 'ea', status: 'Partial', priority: 'Medium', procurementPending: true, procurementStatus: 'In review' },
  { code: 'INS-2091', description: 'Pressure transmitter, 0–400 PSI', group: 'Instrumentation', project: 'Cooling Tower Retrofit', required: 8, available: 0, shortage: 8, unit: 'ea', status: 'Shortage', priority: 'High', procurementPending: true, procurementStatus: 'Requested' },
  { code: 'VAL-3310', description: 'Gate valve, 4 in, Class 300', group: 'Piping', project: 'Cooling Tower Retrofit', required: 6, available: 6, shortage: 0, unit: 'ea', status: 'Available', priority: 'Low', procurementPending: false, procurementStatus: 'Not started' },
]

export const demoProjects: DemoProject[] = [
  { name: 'All projects', materials: [...northPlant, ...waterTreatment, ...coolingTower] },
  { name: 'North Plant Expansion', materials: northPlant },
  { name: 'Water Treatment Phase II', materials: waterTreatment },
  { name: 'Cooling Tower Retrofit', materials: coolingTower },
]

export const demoSources = [
  { name: 'ZPP7', updated: 'Oct 9, 2026 · 08:15 AM (example)', status: 'Ready' },
  { name: 'MB52 HTML', updated: 'Oct 9, 2026 · 08:20 AM (example)', status: 'Ready' },
  { name: 'PR', updated: 'Oct 8, 2026 · 04:42 PM (example)', status: 'Review' },
  { name: 'VA05', updated: 'Oct 9, 2026 · 07:55 AM (example)', status: 'Ready' },
  { name: 'DCN', updated: 'Oct 7, 2026 · 02:10 PM (example)', status: 'Review' },
  { name: 'Material Scope', updated: 'Oct 6, 2026 · 11:30 AM (example)', status: 'Pending' },
] as const
