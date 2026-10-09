import { Bell, ChevronDown, Menu, Search } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { navigationItems } from '../data/navigation'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'

interface HeaderProps {
  onMenuClick: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const { pathname } = useLocation()
  const currentPage = navigationItems.find((item) => item.path === pathname)?.label ?? 'Dashboard'

  return (
    <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-9">
      <div className="flex min-w-0 items-center gap-3">
        <Button type="button" variant="ghost" size="icon" aria-label="Open navigation" className="size-9 lg:hidden" onClick={onMenuClick}>
          <Menu size={19} />
        </Button>
        <div className="hidden items-center gap-2 text-xs text-slate-400 sm:flex">
          <span>Workspace</span>
          <span className="text-slate-300">/</span>
        </div>
        <h1 className="truncate text-sm font-semibold text-slate-800">{currentPage}</h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <label className="relative hidden w-60 md:block">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input aria-label="Global search unavailable" placeholder="Global search not connected" className="h-9 border-slate-100 bg-slate-50 pl-9 text-xs" disabled />
        </label>
        <Button type="button" variant="ghost" size="icon" aria-label="Notifications are not enabled" title="Notifications are not enabled" className="size-9" disabled>
          <Bell size={18} />
        </Button>
        <span className="hidden h-8 w-px bg-slate-200 sm:block" />
        <div className="flex items-center gap-2 rounded-lg p-1.5 text-left">
          <span className="grid size-8 place-items-center rounded-full bg-amber-100 text-[11px] font-bold text-amber-800">DU</span>
          <span className="hidden sm:block">
            <span className="block text-xs font-semibold leading-4 text-slate-800">Demo User</span>
            <span className="block text-[10px] leading-4 text-slate-400">Sample account</span>
          </span>
          <ChevronDown size={14} className="hidden text-slate-400 sm:block" />
        </div>
      </div>
    </header>
  )
}
