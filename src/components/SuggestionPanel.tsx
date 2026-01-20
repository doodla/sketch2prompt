import { useState } from 'react'
import { Check, X, Edit3, Sparkles, ChevronDown, ChevronUp } from 'lucide-react'
import type { AISuggestion } from '../core/types'
import { useStore } from '../core/store'

interface SuggestionPanelProps {
  nodeId: string
  suggestions: AISuggestion[]
  onClose: () => void
}

export function SuggestionPanel({ nodeId, suggestions, onClose }: SuggestionPanelProps) {
  const [expandedSuggestions, setExpandedSuggestions] = useState<Set<string>>(
    new Set(suggestions.map(s => s.id))
  )
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editedContent, setEditedContent] = useState<string>('')
  const updateNode = useStore((state) => state.updateNode)
  const addNode = useStore((state) => state.addNode)
  const addEdge = useStore((state) => state.addEdge)
  const nodes = useStore((state) => state.nodes)

  const currentNode = nodes.find(n => n.id === nodeId)
  if (!currentNode) return null

  const pendingSuggestions = suggestions.filter(s => s.status === 'pending')

  const toggleExpanded = (id: string) => {
    setExpandedSuggestions(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const handleAccept = (suggestion: AISuggestion) => {
    if (suggestion.type === 'add_children' && suggestion.metadata?.children) {
      // Add child nodes
      const children = suggestion.metadata.children
      const currentX = currentNode.position.x
      const currentY = currentNode.position.y
      const childIds: string[] = []

      children.forEach((child, index) => {
        // addNode now returns the created node ID
        const childId = addNode('mindmap', {
          x: currentX + 300,
          y: currentY + index * 120,
        }, {
          label: child.label,
          description: child.description,
          parentId: nodeId,
          level: (currentNode.data.meta.level ?? 0) + 1,
        })
        childIds.push(childId)

        // Create edge from parent to child
        addEdge(nodeId, childId)
      })

      // Update parent node with child IDs and mark suggestion as accepted
      updateNode(nodeId, {
        meta: {
          ...currentNode.data.meta,
          childIds: [...(currentNode.data.meta.childIds ?? []), ...childIds],
          suggestions: suggestions.map(s =>
            s.id === suggestion.id ? { ...s, status: 'accepted' as const } : s
          ),
        },
      })
    } else if (suggestion.type === 'edit_description' && suggestion.metadata?.description) {
      // Update description
      updateNode(nodeId, {
        meta: {
          ...currentNode.data.meta,
          description: suggestion.metadata.description,
          suggestions: suggestions.map(s =>
            s.id === suggestion.id ? { ...s, status: 'accepted' as const } : s
          ),
        },
      })
    }

    onClose()
  }

  const handleReject = (suggestion: AISuggestion) => {
    updateNode(nodeId, {
      meta: {
        ...currentNode.data.meta,
        suggestions: suggestions.map(s =>
          s.id === suggestion.id ? { ...s, status: 'rejected' as const } : s
        ),
      },
    })
  }

  const handleEdit = (suggestion: AISuggestion) => {
    setEditingId(suggestion.id)
    setEditedContent(suggestion.content)
  }

  const handleSaveEdit = (suggestion: AISuggestion) => {
    // Save edited suggestion
    updateNode(nodeId, {
      meta: {
        ...currentNode.data.meta,
        suggestions: suggestions.map(s =>
          s.id === suggestion.id
            ? { ...s, content: editedContent, status: 'edited' as const }
            : s
        ),
      },
    })
    setEditingId(null)
  }

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-[var(--color-workshop-elevated)] border-l border-[var(--color-workshop-border)] shadow-2xl z-50 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-[var(--color-workshop-border)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-indigo-500" />
          <h2 className="text-lg font-semibold text-[var(--color-workshop-text)]">
            AI Suggestions
          </h2>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-md hover:bg-[var(--color-workshop-base)] text-[var(--color-workshop-text-muted)] transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {pendingSuggestions.length === 0 ? (
          <div className="text-center py-8 text-[var(--color-workshop-text-muted)]">
            No pending suggestions
          </div>
        ) : (
          pendingSuggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className="rounded-lg border border-[var(--color-workshop-border)] bg-[var(--color-workshop-base)] overflow-hidden"
            >
              {/* Suggestion header */}
              <div
                className="p-3 flex items-center justify-between cursor-pointer hover:bg-[var(--color-workshop-elevated)] transition-colors"
                onClick={() => toggleExpanded(suggestion.id)}
              >
                <div className="flex items-center gap-2 flex-1">
                  <div className="text-xs font-mono px-2 py-1 rounded bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
                    {suggestion.type.replace('_', ' ')}
                  </div>
                  <span className="text-sm text-[var(--color-workshop-text)] font-medium truncate">
                    {suggestion.content}
                  </span>
                </div>
                {expandedSuggestions.has(suggestion.id) ? (
                  <ChevronUp className="h-4 w-4 text-[var(--color-workshop-text-muted)]" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-[var(--color-workshop-text-muted)]" />
                )}
              </div>

              {/* Expanded content */}
              {expandedSuggestions.has(suggestion.id) && (
                <div className="p-3 pt-0 space-y-3">
                  {/* Suggestion details */}
                  {editingId === suggestion.id ? (
                    <div className="space-y-2">
                      <textarea
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        className="w-full px-3 py-2 rounded-md bg-[var(--color-workshop-elevated)] border border-[var(--color-workshop-border)] text-[var(--color-workshop-text)] text-sm resize-none"
                        rows={4}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSaveEdit(suggestion)}
                          className="flex-1 px-3 py-1.5 rounded-md bg-indigo-500 text-white text-sm font-medium hover:bg-indigo-600 transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="flex-1 px-3 py-1.5 rounded-md bg-[var(--color-workshop-base)] text-[var(--color-workshop-text)] text-sm font-medium hover:bg-[var(--color-workshop-elevated)] border border-[var(--color-workshop-border)] transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Children preview */}
                      {suggestion.type === 'add_children' && suggestion.metadata?.children && (
                        <div className="space-y-2">
                          <div className="text-xs font-mono uppercase tracking-wide text-[var(--color-workshop-text-subtle)]">
                            Proposed Children
                          </div>
                          <div className="space-y-1">
                            {suggestion.metadata.children.map((child, index) => (
                              <div
                                key={index}
                                className="p-2 rounded-md bg-[var(--color-workshop-elevated)] border border-[var(--color-workshop-border)]"
                              >
                                <div className="text-sm font-medium text-[var(--color-workshop-text)]">
                                  {child.label}
                                </div>
                                {child.description && (
                                  <div className="text-xs text-[var(--color-workshop-text-muted)] mt-1">
                                    {child.description}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Description preview */}
                      {suggestion.type === 'edit_description' && suggestion.metadata?.description && (
                        <div className="space-y-2">
                          <div className="text-xs font-mono uppercase tracking-wide text-[var(--color-workshop-text-subtle)]">
                            Proposed Description
                          </div>
                          <div className="p-2 rounded-md bg-[var(--color-workshop-elevated)] border border-[var(--color-workshop-border)] text-sm text-[var(--color-workshop-text)]">
                            {suggestion.metadata.description}
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-2 pt-2">
                        <button
                          onClick={() => handleAccept(suggestion)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition-colors"
                        >
                          <Check className="h-3.5 w-3.5" />
                          Accept
                        </button>
                        <button
                          onClick={() => handleEdit(suggestion)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleReject(suggestion)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-red-500/80 text-white text-sm font-medium hover:bg-red-600 transition-colors"
                        >
                          <X className="h-3.5 w-3.5" />
                          Reject
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
