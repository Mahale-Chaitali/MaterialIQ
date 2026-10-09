import { cva, type VariantProps } from 'class-variance-authority'
import type { HTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

const badgeVariants = cva('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold', {
  variants: {
    variant: {
      success: 'bg-emerald-50 text-emerald-700',
      warning: 'bg-amber-50 text-amber-700',
      danger: 'bg-rose-50 text-rose-700',
      info: 'bg-blue-50 text-blue-700',
      neutral: 'bg-slate-100 text-slate-600',
    },
  },
  defaultVariants: {
    variant: 'neutral',
  },
})

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}
