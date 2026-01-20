import { useState, useCallback, useRef, useEffect } from 'react'
import { useStore } from '../core/store'
import { useSettingsStore } from '../core/settings'
import { createMindMapExpander } from '../core/mindmap-expander'
import type { MindMapExpansionRequest, MindMapExpansionResult } from '../core/types'

// Simple cache for expansion results (5 minute TTL)
const CACHE_TTL_MS = 5 * 60 * 1000
const expansionCache = new Map<string, { result: MindMapExpansionResult; timestamp: number }>()

/**
 * Create a cache key from expansion request
 */
function createCacheKey(request: MindMapExpansionRequest): string {
  return JSON.stringify({
    label: request.nodeLabel,
    description: request.nodeDescription,
    context: request.context,
    instructions: request.userInstructions,
  })
}

/**
 * Get cached result if available and not expired
 */
function getCachedResult(key: string): MindMapExpansionResult | null {
  const cached = expansionCache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.result
  }
  if (cached) {
    expansionCache.delete(key)
  }
  return null
}

/**
 * Store result in cache
 */
function setCachedResult(key: string, result: MindMapExpansionResult): void {
  expansionCache.set(key, { result, timestamp: Date.now() })

  // Clean up old cache entries periodically
  if (expansionCache.size > 50) {
    const now = Date.now()
    for (const [k, v] of expansionCache.entries()) {
      if (now - v.timestamp > CACHE_TTL_MS) {
        expansionCache.delete(k)
      }
    }
  }
}

/**
 * Hook for expanding mind map nodes with AI assistance
 * Includes request cancellation, debouncing, and caching
 */
export function useMindMapExpander(): {
  expandNode: (nodeId: string, userInstructions?: string) => Promise<MindMapExpansionResult | undefined>
  isExpanding: boolean
  error: string | null
  clearError: () => void
} {
  const [isExpanding, setIsExpanding] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Track abort controller for request cancellation
  const abortControllerRef = useRef<AbortController | null>(null)

  // Debounce timer
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  const nodes = useStore((state) => state.nodes)
  const updateNode = useStore((state) => state.updateNode)
  const apiKey = useSettingsStore((state) => state.apiKey)
  const apiProvider = useSettingsStore((state) => state.apiProvider)
  const modelId = useSettingsStore((state) => state.modelId)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [])

  const expandNode = useCallback(
    async (nodeId: string, userInstructions?: string) => {
      // Cancel any in-flight request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }

      // Clear debounce timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }

      const node = nodes.find((n) => n.id === nodeId)
      if (!node) {
        setError('Node not found in diagram. Please refresh and try again.')
        return
      }

      if (!apiKey || apiKey.trim().length === 0) {
        setError('API key not configured. Go to Settings and add your Anthropic or OpenAI API key.')
        return
      }

      if (!modelId || modelId.trim().length === 0) {
        setError('Model not configured. Go to Settings and select a model.')
        return
      }

      // Debounce rapid requests (300ms)
      return new Promise<MindMapExpansionResult | undefined>((resolve) => {
        debounceTimerRef.current = setTimeout(async () => {
          setIsExpanding(true)
          setError(null)

          // Create abort controller for this request
          const abortController = new AbortController()
          abortControllerRef.current = abortController

          try {
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

            // Check cache first
            const cacheKey = createCacheKey(request)
            const cachedResult = getCachedResult(cacheKey)

            if (cachedResult) {
              console.log('Using cached expansion result')

              // Update node with cached suggestions
              updateNode(nodeId, {
                meta: {
                  ...node.data.meta,
                  suggestions: [
                    ...(node.data.meta.suggestions ?? []),
                    ...cachedResult.suggestions,
                  ],
                },
              })

              setIsExpanding(false)
              resolve(cachedResult)
              return
            }

            // Make API request
            const expander = createMindMapExpander(apiKey, apiProvider, modelId)
            const result = await expander.expandNode(request)

            // Check if request was aborted
            if (abortController.signal.aborted) {
              console.log('Expansion request was aborted')
              setIsExpanding(false)
              resolve(undefined)
              return
            }

            // Cache the result
            setCachedResult(cacheKey, result)

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

            setIsExpanding(false)
            resolve(result)
          } catch (err) {
            // Don't show error if request was aborted
            if (abortController.signal.aborted) {
              console.log('Expansion request was aborted')
              setIsExpanding(false)
              resolve(undefined)
              return
            }

            // Provide specific error messages based on error type
            let errorMessage = 'Failed to expand node. Please try again.'
            if (err instanceof Error) {
              const message = err.message.toLowerCase()
              if (message.includes('api key') || message.includes('unauthorized') || message.includes('401')) {
                errorMessage = 'Invalid API key. Check your API key in Settings and try again.'
              } else if (message.includes('rate limit') || message.includes('429')) {
                errorMessage = 'Rate limit exceeded. Please wait a moment and try again.'
              } else if (message.includes('network') || message.includes('fetch')) {
                errorMessage = 'Network error. Check your internet connection and try again.'
              } else if (message.includes('timeout')) {
                errorMessage = 'Request timed out. The AI took too long to respond. Try again.'
              } else {
                errorMessage = `Error: ${err.message}`
              }
            }

            setError(errorMessage)
            console.error('Mind map expansion error:', err)
            setIsExpanding(false)
            resolve(undefined)
          }
        }, 300)
      })
    },
    [nodes, apiKey, apiProvider, modelId, updateNode]
  )

  return {
    expandNode,
    isExpanding,
    error,
    clearError: () => setError(null),
  }
}
