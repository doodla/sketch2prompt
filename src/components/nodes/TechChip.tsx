import { X } from 'lucide-react'
import type { NodeType } from '../../core/types'

interface TechChipProps {
  tech: string
  onRemove?: () => void
  readonly?: boolean
  variant?: NodeType
  fullWidth?: boolean
}

const CHIP_COLORS: Record<NodeType, {
  bg: string
  text: string
  border: string
  hoverBg: string
  hoverBorder: string
}> = {
  frontend: {
    bg: 'bg-blue-100/80 dark:bg-blue-900/40',
    text: 'text-blue-700 dark:text-blue-300',
    border: 'border-blue-200/80 dark:border-blue-700/50',
    hoverBg: 'hover:bg-blue-200/80 dark:hover:bg-blue-800/50',
    hoverBorder: 'hover:border-blue-300 dark:hover:border-blue-600',
  },
  backend: {
    bg: 'bg-emerald-100/80 dark:bg-emerald-900/40',
    text: 'text-emerald-700 dark:text-emerald-300',
    border: 'border-emerald-200/80 dark:border-emerald-700/50',
    hoverBg: 'hover:bg-emerald-200/80 dark:hover:bg-emerald-800/50',
    hoverBorder: 'hover:border-emerald-300 dark:hover:border-emerald-600',
  },
  storage: {
    bg: 'bg-amber-100/80 dark:bg-amber-900/40',
    text: 'text-amber-700 dark:text-amber-300',
    border: 'border-amber-200/80 dark:border-amber-700/50',
    hoverBg: 'hover:bg-amber-200/80 dark:hover:bg-amber-800/50',
    hoverBorder: 'hover:border-amber-300 dark:hover:border-amber-600',
  },
  auth: {
    bg: 'bg-violet-100/80 dark:bg-violet-900/40',
    text: 'text-violet-700 dark:text-violet-300',
    border: 'border-violet-200/80 dark:border-violet-700/50',
    hoverBg: 'hover:bg-violet-200/80 dark:hover:bg-violet-800/50',
    hoverBorder: 'hover:border-violet-300 dark:hover:border-violet-600',
  },
  external: {
    bg: 'bg-slate-100/80 dark:bg-slate-800/40',
    text: 'text-slate-700 dark:text-slate-300',
    border: 'border-slate-200/80 dark:border-slate-600/50',
    hoverBg: 'hover:bg-slate-200/80 dark:hover:bg-slate-700/50',
    hoverBorder: 'hover:border-slate-300 dark:hover:border-slate-500',
  },
  background: {
    bg: 'bg-orange-100/80 dark:bg-orange-900/40',
    text: 'text-orange-700 dark:text-orange-300',
    border: 'border-orange-200/80 dark:border-orange-700/50',
    hoverBg: 'hover:bg-orange-200/80 dark:hover:bg-orange-800/50',
    hoverBorder: 'hover:border-orange-300 dark:hover:border-orange-600',
  },
}

const DEFAULT_COLORS = {
  bg: 'bg-slate-100/80 dark:bg-slate-800/50',
  text: 'text-slate-700 dark:text-slate-300',
  border: 'border-slate-200/80 dark:border-slate-600/50',
  hoverBg: 'hover:bg-slate-200/80 dark:hover:bg-slate-700/50',
  hoverBorder: 'hover:border-slate-300 dark:hover:border-slate-500',
}

export function TechChip({ tech, onRemove, readonly = false, variant, fullWidth = false }: TechChipProps) {
  const colors = variant ? CHIP_COLORS[variant] : DEFAULT_COLORS

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-md px-2.5 py-1
        font-mono text-[11px] font-medium uppercase tracking-wide
        ${colors.bg}
        ${colors.text}
        border ${colors.border}
        transition-all duration-150
        ${!readonly && onRemove ? 'pr-1.5' : ''}
        ${!readonly ? `cursor-pointer ${colors.hoverBg} ${colors.hoverBorder}` : ''}
        ${fullWidth ? 'w-full justify-between' : ''}
      `}
    >
      <span className="truncate">{tech}</span>
      {!readonly && onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          onMouseDown={(e) => { e.stopPropagation(); }}
          className="
            flex-shrink-0 rounded p-0.5
            text-current opacity-60
            hover:opacity-100 hover:text-red-600 dark:hover:text-red-400
            hover:bg-red-100/60 dark:hover:bg-red-900/40
            transition-all duration-150
            focus:outline-none focus:ring-1 focus:ring-red-400/50
            cursor-pointer
          "
          aria-label={`Remove ${tech}`}
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </span>
  )
}
