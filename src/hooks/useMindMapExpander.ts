import { useState, useCallback, useRef, useEffect } from 'react'
import { useStore } from '../core/store'
import { useSettingsStore } from '../core/settings'
import { createMindMapExpander } from '../core/mindmap-expander'
import type { MindMapExpansionRequest } from '../core/types'

export function useMindMapExpander() {
  const [isExpanding, setIsExpanding] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Hold the AbortController for the current in-flight request
  const abortControllerRef = useRef<AbortController | null>(null)

  const apiKey = useSettingsStore((state) => state.apiKey)
  const apiProvider = useSettingsStore((state) => state.apiProvider)
  const modelId = useSettingsStore((state) => state.modelId)
  const updateNode = useStore((state) => state.updateNode)

  // Cancel any in-flight request when the component unmounts
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort()
    }
  }, [])

  const expandNode = useCallback(
    async (nodeId: string, userInstructions?: string) => {
      // Read node fresh from store at call time (not from a stale closure)
      const node = useStore.getState().nodes.find((n) => n.id === nodeId)
      if (!node) {
        setError('Node not found')
        return
      }

      if (!apiKey) {
        setError('API key not configured. Please add an API key in settings.')
        return
      }

      // Cancel any previous in-flight request before starting a new one
      abortControllerRef.current?.abort()
      const controller = new AbortController()
      abortControllerRef.current = controller

      setIsExpanding(true)
      setError(null)

      try {
        const expander = createMindMapExpander(apiKey, apiProvider, modelId)

        // Build expansion request using the freshly-read node
        const allNodes = useStore.getState().nodes
        const parentNode = node.data.meta.parentId
          ? allNodes.find((n) => n.id === node.data.meta.parentId)
          : undefined

        const siblingNodes = allNodes.filter(
          (n) =>
            n.data.meta.parentId === node.data.meta.parentId &&
            n.id !== nodeId
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

        const result = await expander.expandNode(request, controller.signal)

        // If aborted while awaiting, don't update state
        if (controller.signal.aborted) return

        // Read fresh suggestions from store to avoid overwriting concurrent updates
        const freshSuggestions =
          useStore.getState().nodes.find((n) => n.id === nodeId)?.data.meta
            .suggestions ?? []

        updateNode(nodeId, {
          meta: {
            suggestions: [...freshSuggestions, ...result.suggestions],
          },
        })

        return result
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return
        const message =
          err instanceof Error ? err.message : 'Failed to expand node'
        setError(message)
        console.error('Mind map expansion error:', err)
      } finally {
        // Only clear loading state if this controller is still current
        if (abortControllerRef.current === controller) {
          setIsExpanding(false)
        }
      }
    },
    [apiKey, apiProvider, modelId, updateNode]
  )

  const cancelExpansion = useCallback(() => {
    abortControllerRef.current?.abort()
    setIsExpanding(false)
  }, [])

  return {
    expandNode,
    cancelExpansion,
    isExpanding,
    error,
  }
}
