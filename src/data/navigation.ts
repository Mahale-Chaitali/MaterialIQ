import {
  Boxes,
  BriefcaseBusiness,
  ChartNoAxesCombined,
  Clock4,
  FileStack,
  LayoutDashboard,
  Settings2,
  ShoppingCart,
  Truck,
} from 'lucide-react'
import type { NavigationItem } from '../types/navigation'

export const navigationItems: NavigationItem[] = [
  {
    label: 'Dashboard',
    path: '/',
    description: 'A demo overview of project materials, shortages, and procurement activity.',
    icon: LayoutDashboard,
  },
  {
    label: 'Projects',
    path: '/projects',
    description: 'Create and track material readiness across all active projects.',
    icon: BriefcaseBusiness,
  },
  {
    label: 'Material Analysis',
    path: '/material-analysis',
    description: 'Compare requirements, available stock, and project-level shortages.',
    icon: ChartNoAxesCombined,
  },
  {
    label: 'File Management',
    path: '/file-management',
    description: 'Organize and review bills of materials, drawings, and project documents.',
    icon: FileStack,
  },
  {
    label: 'Procurement',
    path: '/procurement',
    description: 'Monitor purchase requests, open orders, and incoming deliveries.',
    icon: ShoppingCart,
  },
  {
    label: 'ABB & Vendor Management',
    path: '/vendors',
    description: 'Manage ABB, vendor, and supplier information in one workspace.',
    icon: Truck,
  },
  {
    label: 'Reports',
    path: '/reports',
    description: 'Build and review material availability and shortage reports.',
    icon: Boxes,
  },
  {
    label: 'Settings',
    path: '/settings',
    description: 'Configure workspace preferences, team access, and notifications.',
    icon: Settings2,
  },
  {
    label: 'Data Freshness',
    path: '/data-freshness',
    description: 'Review required files, demo freshness flags, and validation notifications.',
    icon: Clock4,
  },
]
