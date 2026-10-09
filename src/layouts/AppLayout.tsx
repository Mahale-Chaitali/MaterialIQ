import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { AppDataProvider } from '../context/AppDataContext'

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const closeSidebar = () => setSidebarOpen(false)

  return (
    <div className="app-shell min-h-screen bg-slate-50">
      <button
        type="button"
        aria-label="Dismiss navigation overlay"
        tabIndex={sidebarOpen ? 0 : -1}
        className={`mobile-overlay${sidebarOpen ? ' is-visible' : ''}`}
        onClick={closeSidebar}
      />
      <Sidebar open={sidebarOpen} onNavigate={closeSidebar} onClose={closeSidebar} />
      <AppDataProvider>
        <div className="main-area">
          <Header onMenuClick={() => setSidebarOpen(true)} />
          <main className="page-content">
            <Outlet />
          </main>
        </div>
      </AppDataProvider>
    </div>
  )
}
