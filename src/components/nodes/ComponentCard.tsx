import { Handle, Position, type NodeProps } from '@xyflow/react'
import {
  Monitor,
  Server,
  Database,
  ShieldCheck,
  Cloud,
  Cog,
} from 'lucide-react'
import type { DiagramNode, NodeType } from '../../core/types'
import { NODE_COLORS, TYPE_LABELS } from './node-styles'
import { InlineTechInput } from './InlineTechInput'
import { RecommendationChip } from './RecommendationChip'
import { NodeActions } from './NodeActions'
import { useStore } from '../../core/store'
import { getRecommendations } from '../../core/tech-recommendations'

const TYPE_ICONS: Record<NodeType, React.ComponentType<{ className?: string }>> = {
  frontend: Monitor,
  backend: Server,
  storage: Database,
  auth: ShieldCheck,
  external: Cloud,
  background: Cog,
}

export function ComponentCard({ id, data, selected }: NodeProps<DiagramNode>) {
  const colors = NODE_COLORS[data.type]
  const Icon = TYPE_ICONS[data.type]
  const typeLabel = TYPE_LABELS[data.type]
  const techStack = data.meta.techStack ?? []
  const recommendations = getRecommendations(data.type)

  const updateNode = useStore((state) => state.updateNode)

  const handleAddTech = (tech: string) => {
    updateNode(id, {
      meta: {
        ...data.meta,
        techStack: [...techStack, tech],
      },
    })
  }

  const handleRemoveTech = (techToRemove: string) => {
    updateNode(id, {
      meta: {
        ...data.meta,
        techStack: techStack.filter((t) => t !== techToRemove),
      },
    })
  }

  return (
    <>
      <NodeActions nodeId={id} selected={selected} />

      {/* Target handle at top */}
      <Handle
        type="target"
        position={Position.Top}
        className={`
          !w-3.5 !h-3.5 !rounded-sm !border-2
          !border-slate-300 dark:!border-slate-500
          ${colors.handleBg}
          transition-all duration-150
          hover:!scale-125 hover:!border-slate-400 dark:hover:!border-slate-400
          cursor-crosshair
        `}
      />

      <div
        role="article"
        aria-label={`${typeLabel} component: ${data.label}`}
        className={`
          relative min-w-52 max-w-72 rounded-xl overflow-hidden
          transition-all duration-200 ease-out
          cursor-pointer
          ${selected ? 'corner-brackets active' : ''}
          bg-white dark:bg-surface-0
          border border-slate-200/80 dark:border-slate-700/50
          ${selected
            ? `ring-2 ${colors.ring} shadow-[var(--shadow-card-selected)] ${colors.glowIntense}`
            : `shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-1 ${colors.glow}`
          }
        `}
      >
        {/* Type indicator bar - gradient strip with glow */}
        <div
          className={`h-1.5 w-full bg-gradient-to-r ${colors.gradientFrom} ${colors.gradientTo}`}
          aria-hidden="true"
        />

        {/* Card content - increased padding */}
        <div className="px-4 py-3">
          {/* Header: Icon + Type Label - better sizing */}
          <div className="flex items-center gap-2 mb-2.5">
            <Icon className={`h-4 w-4 ${colors.textType} flex-shrink-0`} />
            <span className={`font-mono text-[11px] font-semibold uppercase tracking-wide ${colors.textType}`}>
              {typeLabel}
            </span>
          </div>

          {/* Label - larger, more prominent */}
          <div className="font-mono text-[15px] font-semibold text-slate-800 dark:text-slate-100 leading-snug tracking-tight">
            {data.label}
          </div>

          {/* Description (truncated) - better contrast */}
          {data.meta.description && (
            <div className="mt-2 text-[13px] text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
              {data.meta.description}
            </div>
          )}

          {/* Recommendations section - only for applicable node types */}
          {recommendations.length > 0 && (
            <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-700/40">
              <div className="font-mono text-[10px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                Recommendations
              </div>
              <div className="flex flex-wrap gap-1.5">
                {recommendations.map((rec) => (
                  <RecommendationChip
                    key={rec.name}
                    recommendation={rec}
                    isAdded={techStack.includes(rec.name)}
                    onAdd={() => handleAddTech(rec.name)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Inline Tech Stack Input - more spacing */}
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/40">
            <InlineTechInput
              nodeType={data.type}
              techStack={techStack}
              onAdd={handleAddTech}
              onRemove={handleRemoveTech}
              maxVisible={4}
            />
          </div>
        </div>
      </div>

      {/* Source handle at bottom */}
      <Handle
        type="source"
        position={Position.Bottom}
        className={`
          !w-3.5 !h-3.5 !rounded-sm !border-2
          !border-slate-300 dark:!border-slate-500
          ${colors.handleBg}
          transition-all duration-150
          hover:!scale-125 hover:!border-slate-400 dark:hover:!border-slate-400
          cursor-crosshair
        `}
      />
    </>
  )
}
