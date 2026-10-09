import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './layouts/AppLayout'
import { DashboardPage } from './pages/DashboardPage'
import { DataFreshnessPage } from './pages/DataFreshnessPage'
import { FileManagementPage } from './pages/FileManagementPage'
import { MaterialAnalysisPage } from './pages/MaterialAnalysisPage'
import { ProcurementPage } from './pages/ProcurementPage'
import { ReportsPage } from './pages/ReportsPage'
import { SettingsPage } from './pages/SettingsPage'
import { VendorManagementPage } from './pages/VendorManagementPage'
import { PlaceholderPage } from './pages/PlaceholderPage'
import { navigationItems } from './data/navigation'

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        {navigationItems.slice(1).map((item) => (
          <Route
            key={item.path}
            path={item.path.slice(1)}
            element={
              item.path === '/file-management'
                ? <FileManagementPage />
                : item.path === '/material-analysis'
                  ? <MaterialAnalysisPage />
                  : item.path === '/procurement'
                    ? <ProcurementPage />
                    : item.path === '/vendors'
                      ? <VendorManagementPage />
                      : item.path === '/reports'
                        ? <ReportsPage />
                        : item.path === '/settings'
                          ? <SettingsPage />
                          : item.path === '/data-freshness'
                            ? <DataFreshnessPage />
                : <PlaceholderPage title={item.label} description={item.description} />
            }
          />
        ))}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App
