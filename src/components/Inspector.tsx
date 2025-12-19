import { useState, useRef, useEffect } from 'react'
import { Plus, RotateCcw, ChevronDown } from 'lucide-react'
import { useStore } from '../core/store'
import type { DiagramNode, DiagramEdge, NodeType } from '../core/types'
import { TechChip } from './nodes/TechChip'
import { getDefaultTechStack } from '../core/default-tech-stacks'
import { getTechSuggestions } from '../core/tech-suggestions'

const TYPE_STYLES: Record<NodeType, { bg: string; text: string; label: string }> = {
  frontend: { bg: 'bg-blue-100/90 dark:bg-blue-900/50', text: 'text-blue-700 dark:text-blue-300', label: 'Frontend' },
  backend: { bg: 'bg-emerald-100/90 dark:bg-emerald-900/50', text: 'text-emerald-700 dark:text-emerald-300', label: 'Backend' },
  storage: { bg: 'bg-amber-100/90 dark:bg-amber-900/50', text: 'text-amber-700 dark:text-amber-300', label: 'Storage' },
  auth: { bg: 'bg-violet-100/90 dark:bg-violet-900/50', text: 'text-violet-700 dark:text-violet-300', label: 'Auth' },
  external: { bg: 'bg-slate-100/90 dark:bg-slate-800/50', text: 'text-slate-700 dark:text-slate-300', label: 'External' },
  background: { bg: 'bg-orange-100/90 dark:bg-orange-900/50', text: 'text-orange-700 dark:text-orange-300', label: 'Background' },
}

function EmptyState() {
  return (
    <div className="flex h-full items-center justify-center p-8">
      <div className="text-center">
        <p className="font-mono text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed">
          Select a node or edge<br />to edit properties
        </p>
      </div>
    </div>
  )
}

function TypeBadge({ type }: { type: NodeType }) {
  const style = TYPE_STYLES[type]
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-wide ${style.bg} ${style.text}`}>
      {style.label}
    </span>
  )
}

interface NodeInspectorProps {
  node: DiagramNode
}

function NodeInspector({ node }: NodeInspectorProps) {
  const updateNode = useStore((state) => state.updateNode)
  const [newTech, setNewTech] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const techStack = node.data.meta.techStack ?? []

  // Get filtered suggestions
  const suggestions = getTechSuggestions(node.data.type, newTech, techStack)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => { document.removeEventListener('mousedown', handleClickOutside); }
  }, [])

  // Reset selection when suggestions change
  useEffect(() => {
    setSelectedIndex(0)
  }, [suggestions.length, newTech])

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNode(node.id, { label: e.target.value })
  }

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateNode(node.id, { meta: { ...node.data.meta, description: e.target.value } })
  }

  const handleRemoveTech = (techToRemove: string) => {
    updateNode(node.id, {
      meta: {
        ...node.data.meta,
        techStack: techStack.filter((t) => t !== techToRemove),
      },
    })
  }

  const handleAddTech = (techName?: string) => {
    const trimmed = (techName ?? newTech).trim()
    if (trimmed && !techStack.includes(trimmed)) {
      updateNode(node.id, {
        meta: {
          ...node.data.meta,
          techStack: [...techStack, trimmed],
        },
      })
      setNewTech('')
      setShowSuggestions(false)
      setSelectedIndex(0)
    }
  }

  const handleClearAll = () => {
    updateNode(node.id, {
      meta: {
        ...node.data.meta,
        techStack: [],
      },
    })
  }

  const handleResetDefaults = () => {
    updateNode(node.id, {
      meta: {
        ...node.data.meta,
        techStack: getDefaultTechStack(node.data.type),
      },
    })
  }

  return (
    <div className="space-y-6 p-5 custom-scrollbar overflow-y-auto h-full">
      {/* Header with Type Badge */}
      <div className="pb-2">
        <TypeBadge type={node.data.type} />
      </div>

      {/* Label Field */}
      <div>
        <label htmlFor="node-label" className="mb-2 block font-mono text-[11px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Label
        </label>
        <input
          id="node-label"
          type="text"
          value={node.data.label}
          onChange={handleLabelChange}
          className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 px-3.5 py-2.5 font-mono text-[14px] text-slate-800 dark:text-slate-100
            focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-3 focus:ring-blue-500/20 dark:focus:ring-blue-400/20
            transition-all duration-150 cursor-text
            hover:border-slate-300 dark:hover:border-slate-600"
        />
      </div>

      {/* Description Field */}
      <div>
        <label htmlFor="node-description" className="mb-2 block font-mono text-[11px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Description
        </label>
        <textarea
          id="node-description"
          value={node.data.meta.description ?? ''}
          onChange={handleDescriptionChange}
          placeholder="Optional notes about this component..."
          rows={3}
          className="w-full resize-none rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 px-3.5 py-2.5 text-[14px] text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500
            focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-3 focus:ring-blue-500/20 dark:focus:ring-blue-400/20
            transition-all duration-150 cursor-text
            hover:border-slate-300 dark:hover:border-slate-600"
        />
      </div>

      {/* Tech Stack Section */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <label className="font-mono text-[11px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">Tech Stack</label>
          <div className="flex items-center gap-2">
            <button
              onClick={handleResetDefaults}
              className="p-2 rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-150 cursor-pointer"
              title="Reset to defaults"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
            {techStack.length > 0 && (
              <button
                onClick={handleClearAll}
                className="px-2.5 py-1.5 rounded-lg font-mono text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-all duration-150 cursor-pointer"
              >
                Clear all
              </button>
            )}
          </div>
        </div>

        {/* Tech chips */}
        <div className="flex flex-col gap-2 mb-4 min-h-[32px]">
          {techStack.length === 0 ? (
            <span className="text-[13px] text-slate-400 dark:text-slate-500 italic py-1">No tech specified (blank slate)</span>
          ) : (
            techStack.map((tech) => (
              <TechChip
                key={tech}
                tech={tech}
                onRemove={() => { handleRemoveTech(tech); }}
                fullWidth={true}
              />
            ))
          )}
        </div>

        {/* Add tech input with dropdown */}
        <div className="relative">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                value={newTech}
                onChange={(e) => {
                  setNewTech(e.target.value)
                  setShowSuggestions(true)
                }}
                onFocus={() => { setShowSuggestions(true); }}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown') {
                    e.preventDefault()
                    setSelectedIndex((i) => Math.min(i + 1, suggestions.length - 1))
                  } else if (e.key === 'ArrowUp') {
                    e.preventDefault()
                    setSelectedIndex((i) => Math.max(i - 1, 0))
                  } else if (e.key === 'Enter') {
                    e.preventDefault()
                    if (suggestions.length > 0 && showSuggestions) {
                      handleAddTech(suggestions[selectedIndex]?.name)
                    } else {
                      handleAddTech()
                    }
                  } else if (e.key === 'Escape') {
                    setShowSuggestions(false)
                  }
                }}
                placeholder="Add technology..."
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 px-3.5 py-2.5 pr-9 font-mono text-[13px] text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500
                  focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-3 focus:ring-blue-500/20 dark:focus:ring-blue-400/20
                  transition-all duration-150 cursor-text
                  hover:border-slate-300 dark:hover:border-slate-600"
              />
              <ChevronDown
                className={`absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500 transition-transform duration-150 ${showSuggestions ? 'rotate-180' : ''}`}
              />
            </div>
            <button
              onClick={() => { handleAddTech(); }}
              disabled={!newTech.trim()}
              className="px-3.5 py-2.5 rounded-lg bg-blue-500 dark:bg-blue-600 text-white font-mono text-[12px] font-medium
                disabled:opacity-40 disabled:cursor-not-allowed
                hover:bg-blue-600 dark:hover:bg-blue-500 active:scale-[0.97]
                transition-all duration-150 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          {/* Suggestions dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div
              ref={dropdownRef}
              className="absolute z-50 mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-lg overflow-hidden dropdown-animate"
            >
              <div className="max-h-52 overflow-y-auto custom-scrollbar">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={suggestion.name}
                    onClick={() => { handleAddTech(suggestion.name); }}
                    onMouseEnter={() => { setSelectedIndex(index); }}
                    className={`
                      w-full flex items-center justify-between px-4 py-2.5 text-left transition-colors duration-100 cursor-pointer
                      ${index === selectedIndex ? 'bg-slate-100 dark:bg-slate-800' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}
                    `}
                  >
                    <span className="font-mono text-[13px] text-slate-700 dark:text-slate-200">{suggestion.name}</span>
                    <span className="font-mono text-[10px] uppercase tracking-wide text-slate-400 dark:text-slate-500">
                      {suggestion.category}
                    </span>
                  </button>
                ))}
              </div>
              {newTech.trim() && !suggestions.some(s => s.name.toLowerCase() === newTech.toLowerCase()) && (
                <div className="border-t border-slate-200 dark:border-slate-700 px-4 py-3">
                  <button
                    onClick={() => { handleAddTech(); }}
                    className="w-full text-left font-mono text-[12px] text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                  >
                    Press <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px]">Enter</kbd> to add "<span className="text-slate-700 dark:text-slate-200">{newTech}</span>"
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

interface EdgeInspectorProps {
  edge: DiagramEdge
}

function EdgeInspector({ edge }: EdgeInspectorProps) {
  const updateEdge = useStore((state) => state.updateEdge)

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateEdge(edge.id, { label: e.target.value })
  }

  return (
    <div className="space-y-6 p-5 custom-scrollbar overflow-y-auto h-full">
      {/* Header with Edge Badge */}
      <div className="pb-2">
        <span className="inline-flex items-center rounded-lg px-3 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-wide bg-slate-100/90 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300">
          Connection
        </span>
      </div>

      {/* Label Field */}
      <div>
        <label htmlFor="edge-label" className="mb-2 block font-mono text-[11px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Label (optional)
        </label>
        <input
          id="edge-label"
          type="text"
          value={edge.data?.label ?? ''}
          onChange={handleLabelChange}
          placeholder="e.g., API calls, data flow..."
          className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 px-3.5 py-2.5 font-mono text-[14px] text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500
            focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-3 focus:ring-blue-500/20 dark:focus:ring-blue-400/20
            transition-all duration-150 cursor-text
            hover:border-slate-300 dark:hover:border-slate-600"
        />
      </div>
    </div>
  )
}

export function Inspector() {
  const selectedNode = useStore((state) => state.nodes.find((n) => n.selected))
  const selectedEdge = useStore((state) => state.edges.find((e) => e.selected))

  if (selectedNode) {
    return <NodeInspector node={selectedNode} />
  }

  if (selectedEdge) {
    return <EdgeInspector edge={selectedEdge} />
  }

  return <EmptyState />
}