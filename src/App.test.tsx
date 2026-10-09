import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { AppRoutes } from './App'
import { navigationItems } from './data/navigation'
import { analysisMaterials } from './data/materialAnalysis'
import { createMaterialCsv } from './lib/materialCsv'
import { createResponsibilityCsv } from './lib/responsibilityCsv'
import { reportDefinitions } from './data/reports'
import { createReportCsv } from './lib/reportCsv'

function renderAt(path = '/') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AppRoutes />
    </MemoryRouter>,
  )
}

describe('MaterialIQ application', () => {
  it('renders the dashboard and application shell without crashing', () => {
    renderAt()

    expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Material Management Dashboard' })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Material summary' })).toBeInTheDocument()
  })

  it('shows every requested sidebar navigation link', () => {
    renderAt()
    const navigation = screen.getByRole('navigation', { name: 'Main navigation' })

    for (const item of navigationItems) {
      expect(within(navigation).getByRole('link', { name: new RegExp(item.label) })).toBeInTheDocument()
    }
  })

  it.each(navigationItems.map(({ label, path }) => [label, path]))(
    'opens the correct page for %s',
    (label, path) => {
      renderAt(path)
      if (path === '/') {
        expect(screen.getByRole('heading', { level: 2, name: 'Material Management Dashboard' })).toBeInTheDocument()
      } else if (path === '/file-management') {
        expect(screen.getByRole('heading', { level: 2, name: 'File Management' })).toBeInTheDocument()
      } else if (path === '/material-analysis') {
        expect(screen.getByRole('heading', { level: 2, name: 'Material Analysis' })).toBeInTheDocument()
      } else if (path === '/procurement') {
        expect(screen.getByRole('heading', { level: 2, name: 'Procurement' })).toBeInTheDocument()
      } else if (path === '/vendors') {
        expect(screen.getByRole('heading', { level: 2, name: 'ABB & Vendor Management' })).toBeInTheDocument()
      } else if (path === '/reports') {
        expect(screen.getByRole('heading', { level: 2, name: 'Reports' })).toBeInTheDocument()
      } else if (path === '/settings') {
        expect(screen.getByRole('heading', { level: 2, name: 'Settings' })).toBeInTheDocument()
      } else if (path === '/data-freshness') {
        expect(screen.getByRole('heading', { level: 2, name: 'Data Freshness' })).toBeInTheDocument()
      } else {
        expect(screen.getByRole('heading', { level: 2, name: label })).toBeInTheDocument()
        expect(screen.getByText(`${label} workspace`)).toBeInTheDocument()
      }
    },
  )

  it('provides a working compact-screen navigation toggle', () => {
    renderAt()
    const sidebar = screen.getByRole('navigation', { name: 'Main navigation' }).parentElement
    const openButton = screen.getByRole('button', { name: 'Open navigation' })

    fireEvent.click(openButton)
    expect(sidebar).toHaveClass('is-open')

    fireEvent.click(screen.getByRole('button', { name: 'Close navigation' }))
    expect(sidebar).not.toHaveClass('is-open')
  })

  it('returns to the dashboard from a placeholder workspace', () => {
    renderAt('/projects')

    fireEvent.click(screen.getByRole('button', { name: 'Explore dashboard' }))

    expect(screen.getByRole('heading', { level: 2, name: 'Material Management Dashboard' })).toBeInTheDocument()
  })

  it('changes the demo summary when the project selector changes', () => {
    renderAt()

    fireEvent.change(screen.getByRole('combobox', { name: 'Project selector' }), {
      target: { value: 'North Plant Expansion' },
    })

    expect(screen.getByText('8', { selector: 'p' })).toBeInTheDocument()
    expect(screen.getByText('North Plant Expansion', { selector: 'option:checked' })).toBeInTheDocument()
    expect(screen.queryByText('PMP-6621')).not.toBeInTheDocument()
  })

  it('filters priority materials by search and status', () => {
    renderAt()

    fireEvent.change(screen.getByRole('textbox', { name: 'Search priority materials' }), {
      target: { value: 'MTR-4402' },
    })
    expect(screen.getByRole('button', { name: 'MTR-4402' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'ELC-1830' })).not.toBeInTheDocument()

    fireEvent.change(screen.getByRole('textbox', { name: 'Search priority materials' }), {
      target: { value: '' },
    })
    fireEvent.change(screen.getByRole('combobox', { name: 'Filter by status' }), {
      target: { value: 'Shortage' },
    })

    expect(screen.getAllByText('Shortage').length).toBeGreaterThan(0)
    expect(screen.queryByRole('button', { name: 'VAL-3310' })).not.toBeInTheDocument()
  })

  it('opens and closes a material detail view', () => {
    renderAt()

    fireEvent.click(screen.getByRole('button', { name: 'MTR-4402' }))

    expect(screen.getByRole('dialog', { name: 'MTR-4402' })).toBeInTheDocument()
    expect(screen.getByText('DEMO MATERIAL RECORD')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Close material details' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('shows an explicit demo message when refreshed', () => {
    renderAt()

    fireEvent.click(screen.getByRole('button', { name: 'Refresh demo dashboard' }))

    expect(screen.getByRole('status')).toHaveTextContent('No external files or live systems were checked')
  })

  it('labels source freshness as examples and includes every requested input', () => {
    renderAt()

    for (const source of ['ZPP7', 'MB52 HTML', 'PR', 'VA05', 'DCN', 'Material Scope']) {
      expect(screen.getByText(source)).toBeInTheDocument()
    }
    expect(screen.getByText(/no files have been checked/i)).toBeInTheDocument()
    expect(screen.getAllByText(/example\)/).length).toBeGreaterThan(0)
  })

  it('shows all required file inputs and initial summary', async () => {
    renderAt('/file-management')

    expect(screen.getByRole('heading', { level: 2, name: 'File Management' })).toBeInTheDocument()
    expect(screen.getAllByText('Required files').length).toBeGreaterThan(0)
    expect(screen.getAllByText('6').length).toBeGreaterThan(0)
    for (const fileName of ['ZPP7 NEW Excel', 'MB52 HTML', 'PR Excel', 'VA05 Excel', 'DCN Excel', 'Material Scope Excel']) {
      expect(screen.getByRole('heading', { name: fileName })).toBeInTheDocument()
    }
  })

  it('selects a supported file locally and reports filename, size, and modified date', () => {
    renderAt('/file-management')
    const file = new File(['demo workbook'], 'zpp7.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      lastModified: Date.now(),
    })
    const input = screen.getByLabelText('Select ZPP7 NEW Excel file')

    fireEvent.change(input, { target: { files: [file] } })

    expect(screen.getByText('zpp7.xlsx')).toBeInTheDocument()
    expect(screen.getByText('13 B')).toBeInTheDocument()
    expect(screen.getByText('Selected locally — not uploaded')).toBeInTheDocument()
    expect(screen.getByText('Files selected')).toBeInTheDocument()
    expect(screen.getByText('1 of 6')).toBeInTheDocument()
    expect(screen.getByText(/File content has not been validated/)).toBeInTheDocument()
  })

  it('rejects an unsupported extension without selecting the file', () => {
    renderAt('/file-management')
    const file = new File(['not a workbook'], 'requirements.csv', { type: 'text/csv' })

    fireEvent.change(screen.getByLabelText('Select ZPP7 NEW Excel file'), {
      target: { files: [file] },
    })

    expect(screen.getByRole('alert')).toHaveTextContent('Unsupported file type')
    expect(screen.getAllByText('Not selected')).toHaveLength(6)
    expect(screen.getByText('0 of 6')).toBeInTheDocument()
  })

  it('allows HTML files for MB52 and Excel files for the other inputs', () => {
    renderAt('/file-management')
    const htmlFile = new File(['<html></html>'], 'stock.HTML', { type: 'text/html' })
    const xlsFile = new File(['demo'], 'scope.xls', { type: 'application/vnd.ms-excel' })

    fireEvent.change(screen.getByLabelText('Select MB52 HTML file'), {
      target: { files: [htmlFile] },
    })
    fireEvent.change(screen.getByLabelText('Select Material Scope Excel file'), {
      target: { files: [xlsFile] },
    })

    expect(screen.getByText('stock.HTML')).toBeInTheDocument()
    expect(screen.getByText('scope.xls')).toBeInTheDocument()
    expect(screen.getByText('2 of 6')).toBeInTheDocument()
  })

  it('supports drag and drop, replace, and remove actions', () => {
    renderAt('/file-management')
    const dropzone = screen.getByRole('region', { name: 'Upload ZPP7 NEW Excel' })
    const firstFile = new File(['first'], 'first.xlsx', { lastModified: Date.now() })
    const replacement = new File(['replacement'], 'replacement.xls', { lastModified: Date.now() })

    fireEvent.drop(dropzone, { dataTransfer: { files: [firstFile] } })
    expect(screen.getByText('first.xlsx')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Replace ZPP7 NEW Excel file' }))
    fireEvent.change(screen.getByLabelText('Select ZPP7 NEW Excel file'), {
      target: { files: [replacement] },
    })
    expect(screen.getByText('replacement.xls')).toBeInTheDocument()
    expect(screen.queryByText('first.xlsx')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Remove ZPP7 NEW Excel file' }))
    expect(screen.queryByText('replacement.xls')).not.toBeInTheDocument()
    expect(screen.getByText('0 of 6')).toBeInTheDocument()
  })

  it('counts selected files over 30 days old as needing refresh', () => {
    renderAt('/file-management')
    const oldFile = new File(['old'], 'old.xlsx', {
      lastModified: Date.now() - 31 * 24 * 60 * 60 * 1000,
    })

    fireEvent.change(screen.getByLabelText('Select ZPP7 NEW Excel file'), {
      target: { files: [oldFile] },
    })

    expect(screen.getAllByText(/needs refreshing/i).length).toBeGreaterThan(0)
    expect(within(screen.getByRole('region', { name: 'File selection summary' })).getByText('1')).toBeInTheDocument()
    expect(screen.getByText(/more than 30 days ago/)).toBeInTheDocument()
  })

  it('renders demo material data and labels PR/PO and shortage values carefully', () => {
    renderAt('/material-analysis')

    expect(screen.getByText('DEMO DATA')).toBeInTheDocument()
    expect(screen.getByText(/no official shortage formula applied/i)).toBeInTheDocument()
    expect(screen.getByText(/not automatically added to available stock/i)).toBeInTheDocument()
    expect(screen.getByRole('row', { name: /MTR-4402/ })).toBeInTheDocument()
    expect(screen.getByText('Required Quantity')).toBeInTheDocument()
    expect(screen.getByText('Responsibility')).toBeInTheDocument()
  })

  it('filters material rows by project, group, status, responsibility, and shortage only', () => {
    renderAt('/material-analysis')

    fireEvent.change(screen.getByRole('combobox', { name: 'Filter by project' }), {
      target: { value: 'Water Treatment Phase II' },
    })
    fireEvent.change(screen.getByRole('combobox', { name: 'Filter by material group' }), {
      target: { value: 'Piping' },
    })
    fireEvent.change(screen.getByRole('combobox', { name: 'Filter by availability status' }), {
      target: { value: 'Shortage' },
    })
    fireEvent.change(screen.getByRole('combobox', { name: 'Filter by responsibility' }), {
      target: { value: 'Vendor' },
    })
    fireEvent.click(screen.getByRole('checkbox', { name: 'Shortage only' }))

    expect(screen.getByRole('row', { name: /VAL-2240/ })).toBeInTheDocument()
    expect(screen.queryByRole('row', { name: /PIP-3008/ })).not.toBeInTheDocument()
    expect(screen.queryByRole('row', { name: /PMP-7714/ })).not.toBeInTheDocument()
  })

  it('searches material code and WBS values', () => {
    renderAt('/material-analysis')

    fireEvent.change(screen.getByRole('textbox', { name: 'Search materials' }), {
      target: { value: 'WT.2400.0080' },
    })
    expect(screen.getByRole('row', { name: /INS-4100/ })).toBeInTheDocument()
    expect(screen.queryByRole('row', { name: /ELC-1830/ })).not.toBeInTheDocument()
  })

  it('opens a material detail panel with references and unresolved questions', () => {
    renderAt('/material-analysis')
    fireEvent.click(screen.getByRole('row', { name: /MTR-4402/ }))

    expect(screen.getByRole('dialog', { name: 'MTR-4402' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Quantity summary — demo values' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Stock information' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'PR / PO information' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Scope responsibility' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Source-file references' })).toBeInTheDocument()
    expect(screen.getByText(/Confirm whether project-specific reserved stock/)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Close material detail' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('creates a CSV with headers and only the selected material records', () => {
    const csv = createMaterialCsv([analysisMaterials[0]])

    expect(csv).toContain('"Material Code","Material Description","Project"')
    expect(csv).toContain('"MTR-4402"')
    expect(csv).toContain('"Shortage Quantity (Demo)"')
    expect(csv).not.toContain('"ELC-1830"')
  })

  it('renders procurement sections and clearly marks missing fields and demo assumptions', () => {
    renderAt('/procurement')

    expect(screen.getByRole('tab', { name: /Purchase Requisitions/ })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tab', { name: /Purchase Orders/ })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /Pending material requirements/ })).toBeInTheDocument()
    expect(screen.getByText('PR-261001')).toBeInTheDocument()
    expect(screen.getByText('PO-780041')).toBeInTheDocument()
    expect(screen.getAllByText('Not provided').length).toBeGreaterThan(0)
    expect(screen.getByText(/not stock availability/i)).toBeInTheDocument()
  })

  it('switches between PR, PO, and pending requirement records', () => {
    renderAt('/procurement')

    fireEvent.click(screen.getByRole('tab', { name: /Purchase Orders/ }))
    expect(screen.getByRole('row', { name: /PO-780041/ })).toBeInTheDocument()
    expect(screen.queryByRole('row', { name: /PR-260910/ })).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('tab', { name: /Pending material requirements/ }))
    expect(screen.getByRole('row', { name: /SNS-6240/ })).toBeInTheDocument()
    expect(screen.getAllByText('Pending Requirement').length).toBeGreaterThan(0)
  })

  it('searches and filters procurement rows by project, status, and date range', () => {
    renderAt('/procurement')

    fireEvent.change(screen.getByRole('textbox', { name: 'Search procurement records' }), {
      target: { value: 'INS-2091' },
    })
    expect(screen.getByRole('row', { name: /INS-2091/ })).toBeInTheDocument()
    expect(screen.queryByRole('row', { name: /MTR-4402/ })).not.toBeInTheDocument()

    fireEvent.change(screen.getByRole('textbox', { name: 'Search procurement records' }), {
      target: { value: '' },
    })
    fireEvent.change(screen.getByRole('combobox', { name: 'Filter procurement by project' }), {
      target: { value: 'North Plant Expansion' },
    })
    fireEvent.change(screen.getByRole('combobox', { name: 'Filter procurement by status' }), {
      target: { value: 'Potentially Overdue' },
    })
    fireEvent.change(screen.getByRole('combobox', { name: 'Date filter applies to' }), {
      target: { value: 'expectedDeliveryDate' },
    })
    fireEvent.change(screen.getByLabelText('Date to'), {
      target: { value: '2026-10-08' },
    })

    expect(screen.getByRole('row', { name: /INS-2091/ })).toBeInTheDocument()
    expect(screen.queryByRole('row', { name: /MTR-4402/ })).not.toBeInTheDocument()
  })

  it('opens procurement details and shows unknown dates and quantities without inference', () => {
    renderAt('/procurement')
    fireEvent.click(screen.getByRole('row', { name: /PR-261014/ }))

    expect(screen.getByRole('dialog', { name: 'ELC-1830' })).toBeInTheDocument()
    expect(screen.getByText('Expected delivery date')).toBeInTheDocument()
    expect(screen.getAllByText('Not provided').length).toBeGreaterThan(0)
    expect(screen.getByText(/does not mean materials have been physically received/i)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Close procurement detail' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('highlights potentially overdue sample dates relative to the fixed demo date', () => {
    renderAt('/procurement')

    expect(screen.getAllByText(/past demo date/).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/potentially overdue/i).length).toBeGreaterThan(0)
  })

  it('renders ABB and Vendor responsibility lists with demo warnings and no invented contacts', () => {
    renderAt('/vendors')

    expect(screen.getByRole('heading', { level: 2, name: 'ABB & Vendor Management' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /ABB responsibility list/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Vendor responsibility list/ })).toBeInTheDocument()
    expect(screen.getByText(/final responsibility rules/i)).toBeInTheDocument()
    expect(screen.queryByText(/@/)).not.toBeInTheDocument()
  })

  it('filters ABB/vendor lists by project and material search', () => {
    renderAt('/vendors')

    fireEvent.click(screen.getByRole('button', { name: /Vendor responsibility list/ }))
    fireEvent.change(screen.getByRole('textbox', { name: 'Search responsibility materials' }), {
      target: { value: 'MTR-4402' },
    })
    expect(screen.getByText('MTR-4402')).toBeInTheDocument()
    expect(screen.queryByText('INS-2091')).not.toBeInTheDocument()

    expect(screen.getByRole('combobox', { name: 'Vendor selector' })).toHaveValue('Vendor not specified')
    fireEvent.change(screen.getByRole('textbox', { name: 'Search responsibility materials' }), {
      target: { value: '' },
    })
    fireEvent.change(screen.getByRole('combobox', { name: 'Filter responsibility materials by project' }), {
      target: { value: 'Water Treatment Phase II' },
    })
    expect(screen.getByText('INS-4100')).toBeInTheDocument()
    expect(screen.queryByText('MTR-4402')).not.toBeInTheDocument()
  })

  it('selects materials and builds a responsibility-specific preview', () => {
    renderAt('/vendors')
    fireEvent.click(screen.getByRole('checkbox', { name: 'Select ELC-1830 for North Plant Expansion' }))

    expect(screen.getByText(/1 selected for ABB/)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Preview list' }))

    expect(screen.getByRole('dialog', { name: 'List preview' })).toBeInTheDocument()
    expect(within(screen.getByRole('dialog')).getByText('ELC-1830')).toBeInTheDocument()
    expect(within(screen.getByRole('dialog')).getByText(/provisional examples/i)).toBeInTheDocument()
  })

  it('supports select-all visible and deselection', () => {
    renderAt('/vendors')
    fireEvent.click(screen.getByRole('checkbox', { name: 'Select all visible materials' }))

    expect(screen.getByText(/8 selected for ABB/)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('checkbox', { name: 'Select all visible materials' }))
    expect(screen.getByText(/0 selected for ABB/)).toBeInTheDocument()
  })

  it('opens an editable email draft without sending and does not invent recipient details', () => {
    renderAt('/vendors')
    fireEvent.click(screen.getByRole('checkbox', { name: 'Select ELC-1830 for North Plant Expansion' }))
    fireEvent.click(screen.getByRole('button', { name: 'Prepare email draft' }))

    expect(screen.getByRole('dialog', { name: 'Email draft' })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Email recipient' })).toHaveValue('')
    expect(screen.getByRole('textbox', { name: 'Email subject' })).toHaveValue('Demo material requirements — ABB')
    expect((screen.getByRole('textbox', { name: 'Email material summary' }) as HTMLTextAreaElement).value).toContain('ELC-1830')
    expect(screen.getByText(/No email will be sent/)).toBeInTheDocument()
  })

  it('prepares a print report and calls the browser print workflow', () => {
    const printSpy = vi.spyOn(window, 'print').mockImplementation(() => {})
    renderAt('/vendors')
    fireEvent.click(screen.getByRole('checkbox', { name: 'Select ELC-1830 for North Plant Expansion' }))

    expect(document.getElementById('responsibility-print-report')).toHaveTextContent(/Material Requirement List — ABB/)
    expect(document.getElementById('responsibility-print-report')).toHaveTextContent(/official Scope file/)
    fireEvent.click(screen.getByRole('button', { name: 'Print / PDF' }))

    expect(printSpy).toHaveBeenCalledOnce()
    printSpy.mockRestore()
  })

  it('exports only selected records and marks the CSV as demo data', () => {
    const csv = createResponsibilityCsv([analysisMaterials[1]], 'ABB')

    expect(csv).toContain('"Demo Data","Responsibility","Material Code"')
    expect(csv).toContain('"DEMO","ABB","ELC-1830"')
    expect(csv).not.toContain('"MTR-4402"')
  })

  it('renders report types, applies project and date filters, and exports DEMO rows', () => {
    renderAt('/reports')

    expect(screen.getByRole('tab', { name: 'Material status report' })).toHaveAttribute('aria-selected', 'true')
    fireEvent.change(screen.getByRole('combobox', { name: 'Filter report by project' }), {
      target: { value: 'North Plant Expansion' },
    })
    fireEvent.change(screen.getByLabelText('Report date from'), {
      target: { value: '2026-10-09' },
    })
    fireEvent.change(screen.getByLabelText('Report date to'), {
      target: { value: '2026-10-09' },
    })
    expect(screen.getByRole('row', { name: /MTR-4402/ })).toBeInTheDocument()
    expect(screen.queryByRole('row', { name: /PMP-6621/ })).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('tab', { name: 'Shortage report' }))
    expect(screen.getByRole('row', { name: /MTR-4402/ })).toBeInTheDocument()
    expect(screen.getByText(/no official shortage formula/i)).toBeInTheDocument()

    const csv = createReportCsv(reportDefinitions[1], reportDefinitions[1].rows.slice(0, 1))
    expect(csv).toContain('"DEMO"')
    expect(csv).toContain('"Shortage Qty (Demo)"')
  })

  it('changes display preferences and applies a configurable demo freshness threshold', () => {
    renderAt('/settings')

    fireEvent.change(screen.getByRole('combobox', { name: 'Date display preference' }), {
      target: { value: 'yyyy-MM-dd' },
    })
    fireEvent.change(screen.getByRole('combobox', { name: 'Time display preference' }), {
      target: { value: '24-hour' },
    })
    fireEvent.change(screen.getByRole('spinbutton', { name: 'Freshness threshold days' }), {
      target: { value: '14' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Apply threshold' }))
    expect(screen.getByRole('status')).toHaveTextContent('14 days')
    expect(screen.getAllByText(/Flag after 14 days/).length).toBe(6)
    fireEvent.click(screen.getByRole('link', { name: 'Open Data Freshness' }))
    expect(screen.getByText(/Refresh flags compare browser-reported last-modified metadata with the 14-day demo threshold/)).toBeInTheDocument()
  })

  it('shows missing inputs and extension-validation failures without claiming verification', () => {
    renderAt('/file-management')
    const invalidFile = new File(['bad'], 'scope.csv', { type: 'text/csv' })
    fireEvent.change(screen.getByLabelText('Select Material Scope Excel file'), {
      target: { files: [invalidFile] },
    })
    fireEvent.click(screen.getByRole('link', { name: 'Data Freshness' }))

    expect(screen.getByRole('heading', { level: 2, name: 'Data Freshness' })).toBeInTheDocument()
    expect(screen.getByText('Material Scope Excel: scope.csv')).toBeInTheDocument()
    expect(screen.getAllByText(/Unsupported extension/).length).toBeGreaterThan(0)
    expect(screen.getByText(/Data currency cannot be verified/)).toBeInTheDocument()
    expect(screen.getByText(/Unavailable — no file-processing workflow is connected/)).toBeInTheDocument()
    expect(screen.getByText(/incoming-email monitoring, SAP monitoring/)).toBeInTheDocument()
  })

  it('shares a selected file with freshness status during route navigation', () => {
    renderAt('/file-management')
    const recentFile = new File(['sample'], 'stock.html', {
      lastModified: Date.now(),
      type: 'text/html',
    })
    fireEvent.change(screen.getByLabelText('Select MB52 HTML file'), {
      target: { files: [recentFile] },
    })
    fireEvent.click(screen.getByRole('link', { name: 'Data Freshness' }))

    expect(screen.getByText('stock.html')).toBeInTheDocument()
    expect(screen.getByText('Within demo threshold')).toBeInTheDocument()
    expect(screen.getAllByText('Missing — no selection').length).toBeGreaterThan(0)
  })

  it('applies the settings threshold to the same selected file in Data Freshness', () => {
    renderAt('/file-management')
    const oldFile = new File(['old'], 'stock.html', {
      lastModified: Date.now() - 20 * 24 * 60 * 60 * 1000,
      type: 'text/html',
    })
    fireEvent.change(screen.getByLabelText('Select MB52 HTML file'), {
      target: { files: [oldFile] },
    })
    fireEvent.click(screen.getByRole('link', { name: 'Settings' }))
    fireEvent.change(screen.getByRole('spinbutton', { name: 'Freshness threshold days' }), {
      target: { value: '10' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Apply threshold' }))
    fireEvent.click(screen.getByRole('link', { name: 'Open Data Freshness' }))

    expect(screen.getAllByText('Needs refreshing').length).toBeGreaterThan(0)
    expect(screen.getByText(/10-day demo threshold/)).toBeInTheDocument()
  })
})
