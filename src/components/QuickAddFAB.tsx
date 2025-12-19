import { useState, useRef, useEffect, useCallback } from 'react'
import { Plus, ChevronDown } from 'lucide-react'
import { useReactFlow } from '@xyflow/react'
import { useStore } from '@/core/store'
import { NODE_OPTIONS } from '@/core/node-options'
import type { NodeType } from '@/core/types'

// Color mappings for each node type
const NODE_COLORS: Record<NodeType, {
  bg: string
  bgHover: string
  text: string
  border: string
  icon: string
}> = {
  frontend: {
    bg: 'bg-blue-50 dark:bg-blue-950/40',
    bgHover: 'hover:bg-blue-100 dark:hover:bg-blue-900/50',
    text: 'text-blue-700 dark:text-blue-300',
    border: 'border-blue-200/60 dark:border-blue-700/40',
    icon: 'text-blue-500 dark:text-blue-400',
  },
  backend: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    bgHover: 'hover:bg-emerald-100 dark:hover:bg-emerald-900/50',
    text: 'text-emerald-700 dark:text-emerald-300',
    border: 'border-emerald-200/60 dark:border-emerald-700/40',
    icon: 'text-emerald-500 dark:text-emerald-400',
  },
  storage: {
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    bgHover: 'hover:bg-amber-100 dark:hover:bg-amber-900/50',
    text: 'text-amber-700 dark:text-amber-300',
    border: 'border-amber-200/60 dark:border-amber-700/40',
    icon: 'text-amber-500 dark:text-amber-400',
  },
  auth: {
    bg: 'bg-violet-50 dark:bg-violet-950/40',
    bgHover: 'hover:bg-violet-100 dark:hover:bg-violet-900/50',
    text: 'text-violet-700 dark:text-violet-300',
    border: 'border-violet-200/60 dark:border-violet-700/40',
    icon: 'text-violet-500 dark:text-violet-400',
  },
  external: {
    bg: 'bg-cyan-50 dark:bg-cyan-950/40',
    bgHover: 'hover:bg-cyan-100 dark:hover:bg-cyan-900/50',
    text: 'text-cyan-700 dark:text-cyan-300',
    border: 'border-cyan-200/60 dark:border-cyan-700/40',
    icon: 'text-cyan-500 dark:text-cyan-400',
  },
  background: {
    bg: 'bg-orange-50 dark:bg-orange-950/40',
    bgHover: 'hover:bg-orange-100 dark:hover:bg-orange-900/50',
    text: 'text-orange-700 dark:text-orange-300',
    border: 'border-orange-200/60 dark:border-orange-700/40',
    icon: 'text-orange-500 dark:text-orange-400',
  },
}

export function QuickAddFAB() {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const addNode = useStore((state) => state.addNode)
  const nodes = useStore((state) => state.nodes)
  const { screenToFlowPosition } = useReactFlow()

  // Handle adding node with position calculation
  const handleAddNode = useCallback((type: NodeType) => {
    let position = { x: 400, y: 300 }

    if (nodes.length > 0) {
      const avgX = nodes.reduce((sum, n) => sum + n.position.x, 0) / nodes.length
      const avgY = nodes.reduce((sum, n) => sum + n.position.y, 0) / nodes.length
      position = { x: avgX + 80, y: avgY + 80 }
    } else {
      try {
        position = screenToFlowPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
      } catch {
        position = { x: 400, y: 300 }
      }
    }

    addNode(type, position)
    setIsOpen(false)
  }, [nodes, screenToFlowPosition, addNode])

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => { document.removeEventListener('mousedown', handleClickOutside) }
  }, [isOpen])

  // Keyboard shortcuts when open
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
        return
      }

      const numKey = parseInt(e.key)
      if (numKey >= 1 && numKey <= 6) {
        e.preventDefault()
        const option = NODE_OPTIONS[numKey - 1]
        if (option) {
          handleAddNode(option.type)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => { window.removeEventListener('keydown', handleKeyDown) }
  }, [isOpen, handleAddNode])

  return (
    <div ref={menuRef} className="absolute top-4 left-4 z-20">
      {/* Trigger Button */}
      <button
        onClick={() => { setIsOpen(!isOpen) }}
        className={`
          flex items-center gap-2 px-3.5 py-2.5
          rounded-xl
          bg-white dark:bg-slate-900
          border border-slate-200 dark:border-slate-700
          shadow-md hover:shadow-lg
          transition-all duration-200
          cursor-pointer
          ${isOpen ? 'ring-2 ring-blue-500/30 border-blue-300 dark:border-blue-600' : 'hover:border-slate-300 dark:hover:border-slate-600'}
        `}
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <Plus className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-45' : ''} text-slate-600 dark:text-slate-300`} />
        <span className="font-medium text-[13px] text-slate-700 dark:text-slate-200">
          Components
        </span>
        <ChevronDown className={`h-3.5 w-3.5 text-slate-400 dark:text-slate-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="
            absolute top-full left-0 mt-2
            w-72
            bg-white dark:bg-slate-900
            border border-slate-200 dark:border-slate-700
            rounded-xl
            shadow-xl
            overflow-hidden
            dropdown-animate
          "
          role="menu"
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
            <p className="font-mono text-[10px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Add Component
            </p>
          </div>

          {/* Options List */}
          <div className="p-2">
            {NODE_OPTIONS.map((option) => {
              const Icon = option.icon
              const colors = NODE_COLORS[option.type]

              return (
                <button
                  key={option.type}
                  onClick={() => { handleAddNode(option.type) }}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5
                    rounded-lg
                    ${colors.bg} ${colors.bgHover}
                    border ${colors.border}
                    transition-all duration-150
                    cursor-pointer
                    group
                    mb-1.5 last:mb-0
                  `}
                  role="menuitem"
                >
                  {/* Icon */}
                  <div className={`flex-shrink-0 ${colors.icon}`}>
                    <Icon className="h-5 w-5" />
                  </div>

                  {/* Label & Description */}
                  <div className="flex-1 text-left">
                    <div className={`font-medium text-[13px] ${colors.text}`}>
                      {option.label}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                      {option.description}
                    </div>
                  </div>

                  {/* Keyboard Shortcut */}
                  <kbd className="
                    flex-shrink-0
                    px-2 py-1
                    rounded-md
                    bg-white/60 dark:bg-slate-800/60
                    border border-slate-200/60 dark:border-slate-600/40
                    font-mono text-[10px] text-slate-500 dark:text-slate-400
                    opacity-60 group-hover:opacity-100
                    transition-opacity duration-150
                  ">
                    {option.shortcut}
                  </kbd>
                </button>
              )
            })}
          </div>

          {/* Footer Hint */}
          <div className="px-4 py-2.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
            <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center">
              Press <kbd className="px-1.5 py-0.5 rounded bg-slate-200/60 dark:bg-slate-700/60 font-mono text-[9px]">1</kbd>-<kbd className="px-1.5 py-0.5 rounded bg-slate-200/60 dark:bg-slate-700/60 font-mono text-[9px]">6</kbd> or double-click canvas
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
