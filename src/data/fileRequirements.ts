export type FileRequirementId =
  | 'zpp7'
  | 'mb52'
  | 'pr'
  | 'va05'
  | 'dcn'
  | 'material-scope'

export interface FileRequirement {
  id: FileRequirementId
  name: string
  purpose: string
  extensions: readonly string[]
}

export const fileRequirements: readonly FileRequirement[] = [
  {
    id: 'zpp7',
    name: 'ZPP7 NEW Excel',
    purpose: 'Main project material requirement information',
    extensions: ['.xls', '.xlsx'],
  },
  {
    id: 'mb52',
    name: 'MB52 HTML',
    purpose: 'Warehouse stock information',
    extensions: ['.html', '.htm'],
  },
  {
    id: 'pr',
    name: 'PR Excel',
    purpose: 'Purchase requisition information',
    extensions: ['.xls', '.xlsx'],
  },
  {
    id: 'va05',
    name: 'VA05 Excel',
    purpose: 'Sales-order information',
    extensions: ['.xls', '.xlsx'],
  },
  {
    id: 'dcn',
    name: 'DCN Excel',
    purpose: 'Engineering/document change information — usage to be confirmed',
    extensions: ['.xls', '.xlsx'],
  },
  {
    id: 'material-scope',
    name: 'Material Scope Excel',
    purpose: 'ABB versus vendor responsibility',
    extensions: ['.xls', '.xlsx'],
  },
]
