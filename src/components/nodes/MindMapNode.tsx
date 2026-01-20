import { Handle, Position, type NodeProps } from '@xyflow/react'
import {
  Sparkles,
  ChevronRight,
  MessageSquare,
  Loader2,
  X,
} from 'lucide-react'
import type { DiagramNode } from '../../core/types'
import { NodeActions } from './NodeActions'
import { useUIStore } from '../../core/ui-store'
import { useMindMapExpander } from '../../hooks/useMindMapExpander'

const MINDMAP_COLORS = {
  bg: 'bg-[var(--color-workshop-elevated)]',
  border: 'border-[var(--color-workshop-border)]',
  borderAccent: 'border-[var(--color-wizard-accent)]',
  text: 'text-[var(--color-workshop-text)]',
  textMuted: 'text-[var(--color-workshop-text-muted)]',
  textSubtle: 'text-[var(--color-workshop-text-subtle)]',
  gradientFrom: 'from-indigo-500',
  gradientTo: 'to-purple-500',
  ring: 'ring-indigo-400/50',
  handleBg: 'bg-indigo-500',
  glowColor: 'rgba(99, 102, 241, 0.3)',
}

/**
 * Mind Map Node Component
 * Displays hierarchical mind map nodes with AI expansion capabilities
 */
export function MindMapNode({ id, data, selected }: NodeProps<DiagramNode>) {
  const openSuggestionPanel = useUIStore((state) => state.openSuggestionPanel)
  const focusOnMindMapNode = useUIStore((state) => state.focusOnMindMapNode)
  const { expandNode, isExpanding, error } = useMindMapExpander()

  const childCount = data.meta.childIds?.length ?? 0
  const suggestions = data.meta.suggestions ?? []
  const pendingSuggestions = suggestions.filter(s => s.status === 'pending')
  const comments = data.meta.comments ?? []
  const level = data.meta.level ?? 0

  /**
   * Expand node with AI suggestions
   */
  const handleExpand = async () => {
    const result = await expandNode(id)
    if (result && result.suggestions.length > 0) {
      openSuggestionPanel(id)
    }
  }

  /**
   * Drill down to focus on this node's children
   * Filters the canvas to show only descendants
   */
  const handleDrillDown = () => {
    if (childCount > 0) {
      focusOnMindMapNode(id)
    }
  }

  return (
    <>
      <NodeActions nodeId={id} selected={selected} />

      {/* Target handle at left */}
      <Handle
        type="target"
        position={Position.Left}
        className={`
          !w-3 !h-3 !rounded-full !border-2
          !border-[var(--color-workshop-border-accent)]
          ${MINDMAP_COLORS.handleBg}
          transition-all duration-200
          hover:!scale-150 hover:!border-[var(--color-wizard-accent)] hover:!shadow-[0_0_8px_var(--color-wizard-accent)]
          cursor-crosshair
        `}
      />

      <div
        role="article"
        aria-label={`Mind map node: ${data.label}`}
        className={`
          relative min-w-64 max-w-96 rounded-xl
          transition-all duration-300 ease-out
          cursor-pointer
          ${selected ? 'corner-brackets active' : ''}
          ${MINDMAP_COLORS.bg}
          ${MINDMAP_COLORS.border}
          ${selected
            ? `ring-2 ${MINDMAP_COLORS.ring} shadow-[0_0_0_1px_var(--color-wizard-accent),0_8px_32px_rgba(99,102,241,0.2),0_4px_12px_rgba(0,0,0,0.3)]`
            : `shadow-[var(--shadow-card)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.35),0_4px_8px_rgba(0,0,0,0.2)] hover:-translate-y-1.5 hover:border-[var(--color-workshop-border-accent)]`
          }
        `}
        style={{
          marginLeft: `${level * 16}px`, // Indent based on level
        }}
      >
        {/* Type indicator bar - mind map gradient */}
        <div
          className={`h-1 w-full bg-gradient-to-r ${MINDMAP_COLORS.gradientFrom} ${MINDMAP_COLORS.gradientTo} ${selected ? 'h-1.5' : ''} transition-all duration-200`}
          style={{
            boxShadow: selected ? `0 2px 8px ${MINDMAP_COLORS.glowColor}` : 'none'
          }}
          aria-hidden="true"
        />

        {/* Card content */}
        <div className="px-4 py-3.5">
          {/* Header: Level badge + Stats */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className={`px-2 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider bg-gradient-to-br ${MINDMAP_COLORS.gradientFrom}/20 ${MINDMAP_COLORS.gradientTo}/20 text-indigo-600 dark:text-indigo-400`}>
                Level {level}
              </div>
              {childCount > 0 && (
                <div className={`px-2 py-1 rounded-md text-[10px] font-mono ${MINDMAP_COLORS.textSubtle} bg-[var(--color-workshop-base)]`}>
                  {childCount} child{childCount !== 1 ? 'ren' : ''}
                </div>
              )}
            </div>

            {/* Status indicators */}
            <div className="flex items-center gap-1.5">
              {pendingSuggestions.length > 0 && (
                <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-amber-500/20 text-amber-600 dark:text-amber-400">
                  <Sparkles className="h-3 w-3" />
                  <span className="text-[10px] font-mono font-bold">{pendingSuggestions.length}</span>
                </div>
              )}
              {comments.length > 0 && (
                <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-blue-500/20 text-blue-600 dark:text-blue-400">
                  <MessageSquare className="h-3 w-3" />
                  <span className="text-[10px] font-mono font-bold">{comments.length}</span>
                </div>
              )}
            </div>
          </div>

          {/* Label - prominent */}
          <div
            className={`text-[15px] font-semibold ${MINDMAP_COLORS.text} leading-tight tracking-tight`}
            style={{ fontFamily: 'var(--font-family-display)' }}
          >
            {data.label}
          </div>

          {/* Description */}
          {data.meta.description && (
            <div className={`mt-2.5 text-[13px] ${MINDMAP_COLORS.textMuted} leading-relaxed`}>
              {data.meta.description}
            </div>
          )}

          {/* Actions */}
          <div className="mt-4 pt-3 border-t border-[var(--color-workshop-border)] flex items-center gap-2">
            {/* Expand button */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleExpand()
              }}
              disabled={isExpanding}
              className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                text-[12px] font-medium
                transition-all duration-200
                ${isExpanding
                  ? 'bg-indigo-500/20 text-indigo-400 cursor-wait'
                  : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:shadow-lg hover:scale-105 active:scale-95'
                }
              `}
              title="Let AI expand this node"
            >
              {isExpanding ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Expanding...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>AI Expand</span>
                </>
              )}
            </button>

            {/* Drill down button */}
            {childCount > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleDrillDown()
                }}
                className={`
                  flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                  text-[12px] font-medium
                  bg-[var(--color-workshop-base)] ${MINDMAP_COLORS.text}
                  border ${MINDMAP_COLORS.border}
                  hover:bg-[var(--color-workshop-elevated)] hover:border-[var(--color-workshop-border-accent)]
                  transition-all duration-200
                  hover:scale-105 active:scale-95
                `}
                title="View child nodes"
              >
                <ChevronRight className="h-3.5 w-3.5" />
                <span>Explore</span>
              </button>
            )}
          </div>

          {/* Error message */}
          {error && (
            <div className="mt-3 pt-3 border-t border-[var(--color-workshop-border)]">
              <div className="flex items-start gap-2 p-3 rounded-md bg-red-500/10 border border-red-500/30 text-red-800 dark:text-red-200">
                <X className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="text-sm font-semibold mb-1">Expansion Failed</div>
                  <div className="text-xs leading-relaxed">{error}</div>
                </div>
              </div>
            </div>
          )}

          {/* Pending suggestions preview */}
          {pendingSuggestions.length > 0 && (
            <div className="mt-3 pt-3 border-t border-[var(--color-workshop-border)]">
              <div className="font-mono text-[9px] font-bold uppercase tracking-widest text-[var(--color-workshop-text-subtle)] mb-2">
                AI Suggestions ({pendingSuggestions.length})
              </div>
              <div className="space-y-1.5">
                {pendingSuggestions.slice(0, 2).map((suggestion) => (
                  <button
                    key={suggestion.id}
                    onClick={(e) => {
                      e.stopPropagation()
                      openSuggestionPanel(id)
                    }}
                    className="w-full text-left text-[11px] p-2 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20 transition-colors"
                  >
                    {suggestion.content}
                  </button>
                ))}
                {pendingSuggestions.length > 2 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      openSuggestionPanel(id)
                    }}
                    className="w-full text-[10px] text-center text-[var(--color-workshop-text-subtle)] hover:text-[var(--color-workshop-text)] transition-colors"
                  >
                    +{pendingSuggestions.length - 2} more
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Source handle at right */}
      <Handle
        type="source"
        position={Position.Right}
        className={`
          !w-3 !h-3 !rounded-full !border-2
          !border-[var(--color-workshop-border-accent)]
          ${MINDMAP_COLORS.handleBg}
          transition-all duration-200
          hover:!scale-150 hover:!border-[var(--color-wizard-accent)] hover:!shadow-[0_0_8px_var(--color-wizard-accent)]
          cursor-crosshair
        `}
      />
    </>
  )
}
