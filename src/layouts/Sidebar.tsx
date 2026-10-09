import { X } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { navigationItems } from '../data/navigation'
import { Button } from '../components/ui/button'
import { cn } from '../lib/utils'

interface SidebarProps {
  open: boolean
  onNavigate: () => void
  onClose: () => void
}

export function Sidebar({ open, onNavigate, onClose }: SidebarProps) {
  return (
    <aside className={cn('sidebar fixed inset-y-0 left-0 z-40 flex flex-col border-r border-slate-200', open && 'is-open')}>
      <div className="flex h-[76px] items-center justify-between border-b border-slate-100 px-6">
        <NavLink to="/" aria-label="MaterialIQ home" className="flex items-center gap-3" onClick={onNavigate}>
          <span className="grid size-9 place-items-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/20">
            <span className="text-lg font-bold leading-none">M</span>
          </span>
          <span>
            <span className="block text-[17px] font-bold tracking-[-0.04em] text-slate-900">Material<span className="text-blue-600">IQ</span></span>
            <span className="mt-0.5 block text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-400">Supply intelligence</span>
          </span>
        </NavLink>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Close navigation"
          className="size-8 lg:hidden"
          onClick={onClose}
        >
          <X size={18} />
        </Button>
      </div>

      <nav aria-label="Main navigation" className="flex-1 px-3 py-7">
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Workspace</p>
        <div className="space-y-1">
          {navigationItems.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/'}
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  'group flex min-h-10 items-center gap-3 rounded-lg px-3 text-[13px] font-medium transition-colors',
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={17} strokeWidth={isActive ? 2.2 : 1.8} className={isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'} />
                  <span>{label}</span>
                  {label === 'Material Analysis' && (
                    <span className="ml-auto rounded-full bg-rose-100 px-1.5 py-0.5 text-[10px] font-bold text-rose-700">12</span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      <div className="border-t border-slate-100 p-4">
        <div className="rounded-xl bg-slate-50 p-3.5">
          <div className="mb-2 flex items-center justify-between text-xs font-semibold text-slate-700">
            <span>Demo storage estimate</span>
            <span>68%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full w-[68%] rounded-full bg-blue-600" />
          </div>
          <p className="mt-2 text-[10px] text-slate-500">Sample value · not connected to storage</p>
        </div>
        <div className="mt-4 flex items-center gap-2 px-1 text-[10px] text-slate-400">
          <span className="size-1.5 rounded-full bg-slate-400" />
          Backend services not connected
        </div>
      </div>
    </aside>
  )
}
