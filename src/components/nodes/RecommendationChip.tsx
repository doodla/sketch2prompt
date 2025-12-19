import { Plus, Check } from 'lucide-react'
import type { TechRecommendation } from '../../core/types'

interface RecommendationChipProps {
  recommendation: TechRecommendation
  isAdded: boolean
  onAdd: () => void
}

const CATEGORY_LABELS: Record<TechRecommendation['category'], string> = {
  managed: 'Managed',
  'self-hosted': 'Self-Hosted',
}

export function RecommendationChip({
  recommendation,
  isAdded,
  onAdd,
}: RecommendationChipProps) {
  const categoryLabel = CATEGORY_LABELS[recommendation.category]

  return (
    <div
      className={`
        inline-flex items-center gap-1.5 rounded-md px-2 py-1
        bg-slate-50 dark:bg-slate-800/30
        border border-slate-200 dark:border-slate-700
        transition-all duration-150
      `}
    >
      <div className="flex flex-col min-w-0">
        <span className="font-mono text-[10px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
          {categoryLabel}:
        </span>
        <span className="font-mono text-[11px] font-medium text-slate-600 dark:text-slate-300 truncate">
          {recommendation.name}
        </span>
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          if (!isAdded) {
            onAdd()
          }
        }}
        onMouseDown={(e) => {
          e.stopPropagation()
        }}
        disabled={isAdded}
        className={`
          flex-shrink-0 rounded p-0.5 ml-0.5
          transition-all duration-150
          focus:outline-none focus:ring-1 focus:ring-slate-400/50
          ${
            isAdded
              ? 'text-emerald-500 dark:text-emerald-400 cursor-default'
              : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 cursor-pointer'
          }
        `}
        aria-label={isAdded ? `${recommendation.name} added` : `Add ${recommendation.name}`}
      >
        {isAdded ? (
          <Check className="h-3 w-3" />
        ) : (
          <Plus className="h-3 w-3" />
        )}
      </button>
    </div>
  )
}
