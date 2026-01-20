import { useState, useCallback } from 'react'
import { useStore } from '../core/store'
import { useSettingsStore } from '../core/settings'
import { createMindMapExpander } from '../core/mindmap-expander'
import type { MindMapExpansionRequest } from '../core/types'

export function useMindMapExpander() {
  const [isExpanding, setIsExpanding] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const nodes = useStore((state) => state.nodes)
  const updateNode = useStore((state) => state.updateNode)
  const apiKey = useSettingsStore((state) => state.apiKey)
  const apiProvider = useSettingsStore((state) => state.apiProvider)
  const modelId = useSettingsStore((state) => state.modelId)

  const expandNode = useCallback(
    async (nodeId: string, userInstructions?: string) => {
      const node = nodes.find((n) => n.id === nodeId)
      if (!node) {
        setError('Node not found')
        return
      }

      if (!apiKey) {
        setError('API key not configured. Please add an API key in settings.')
        return
      }

      setIsExpanding(true)
      setError(null)

      try {
        const expander = createMindMapExpander(apiKey, apiProvider, modelId)

        // Build expansion request
        const parentNode = node.data.meta.parentId
          ? nodes.find((n) => n.id === node.data.meta.parentId)
          : undefined

        const siblingNodes = nodes.filter(
          (n) => n.data.meta.parentId === node.data.meta.parentId && n.id !== nodeId
        )

        const request: MindMapExpansionRequest = {
          nodeId,
          nodeLabel: node.data.label,
          nodeDescription: node.data.meta.description,
          context: {
            parentLabel: parentNode?.data.label,
            siblingLabels: siblingNodes.map((n) => n.data.label),
            currentLevel: node.data.meta.level ?? 0,
          },
          userInstructions,
        }

        const result = await expander.expandNode(request)

        // Update node with suggestions
        updateNode(nodeId, {
          meta: {
            ...node.data.meta,
            suggestions: [
              ...(node.data.meta.suggestions ?? []),
              ...result.suggestions,
            ],
          },
        })

        return result
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to expand node'
        setError(errorMessage)
        console.error('Mind map expansion error:', err)
      } finally {
        setIsExpanding(false)
      }
    },
    [nodes, apiKey, apiProvider, modelId, updateNode]
  )

  return {
    expandNode,
    isExpanding,
    error,
  }
}
