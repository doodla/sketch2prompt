import OpenAI from 'openai'
import type {
  MindMapExpansionRequest,
  MindMapExpansionResult,
  AISuggestion,
} from './types'
import { createClient, callAI } from './ai-generator/client'
import type { AIProvider } from './ai-generator/types'

/** Maximum allowed depth for mind map hierarchy */
const MAX_MIND_MAP_DEPTH = 10

/** Minimum label length for validation */
const MIN_LABEL_LENGTH = 1

/** Maximum label length for validation */
const MAX_LABEL_LENGTH = 100

/**
 * AI-powered mind map node expander
 * Maintains same level of abstraction while expanding nodes
 *
 * @example
 * ```ts
 * const expander = new MindMapExpander(apiKey, 'anthropic', 'claude-3-sonnet')
 * const result = await expander.expandNode({
 *   nodeId: '123',
 *   nodeLabel: 'User Experience',
 *   context: { currentLevel: 0 }
 * })
 * ```
 */
export class MindMapExpander {
  private client: OpenAI
  private modelId: string

  /**
   * Create a new MindMapExpander instance
   * @param apiKey - API key for the AI provider
   * @param provider - AI provider ('anthropic' or 'openai')
   * @param modelId - Model identifier to use
   */
  constructor(apiKey: string, provider: AIProvider, modelId: string) {
    this.client = createClient(apiKey, provider)
    this.modelId = modelId
  }

  /**
   * Expand a mind map node with AI suggestions
   * Keeps same abstraction level as sibling nodes
   *
   * @param request - Expansion request with node context
   * @returns Expansion result with suggestions and reasoning
   * @throws Error if API call fails or response is invalid
   */
  async expandNode(
    request: MindMapExpansionRequest
  ): Promise<MindMapExpansionResult> {
    // Validate maximum depth
    if (request.context.currentLevel >= MAX_MIND_MAP_DEPTH) {
      throw new Error(
        `Maximum mind map depth of ${MAX_MIND_MAP_DEPTH} levels reached. Cannot expand further.`
      )
    }

    // Validate label
    if (!request.nodeLabel || request.nodeLabel.trim().length === 0) {
      throw new Error('Node label cannot be empty')
    }

    const prompt = this.buildExpansionPrompt(request)

    try {
      const response = await callAI(
        this.client,
        prompt,
        this.modelId,
        'mind map expansion'
      )

      return this.parseExpansionResponse(response, request.nodeId)
    } catch (error) {
      console.error('Mind map expansion failed:', error)
      throw error
    }
  }

  /**
   * Build prompt for AI expansion with JSON output
   * Emphasizes maintaining abstraction level
   */
  private buildExpansionPrompt(request: MindMapExpansionRequest): string {
    const { nodeLabel, nodeDescription, context, userInstructions } = request

    const parentContext = context.parentLabel
      ? `This node is a child of: "${context.parentLabel}"`
      : 'This is a root-level node'

    const siblingContext =
      context.siblingLabels && context.siblingLabels.length > 0
        ? `\nSibling nodes at the same level: ${context.siblingLabels.join(', ')}`
        : ''

    const abstractionGuidance = this.getAbstractionGuidance(context.currentLevel)

    return `You are an AI assistant helping to expand a mind map for project planning and visualization.

**Task**: Expand the following node by suggesting child nodes and/or edits to the current node.

**Current Node**:
- Label: "${nodeLabel}"
${nodeDescription ? `- Description: "${nodeDescription}"` : ''}

**Context**:
- ${parentContext}${siblingContext}
- Current abstraction level: ${context.currentLevel}

**Abstraction Guidance**:
${abstractionGuidance}

${userInstructions ? `**User Instructions**: ${userInstructions}\n` : ''}

**Your task**:
1. Suggest 3-5 child nodes that break down "${nodeLabel}" into logical sub-components
2. Keep all suggestions at the SAME level of abstraction (one level deeper than current)
3. Each child node should be a clear, distinct aspect or phase
4. Optionally suggest edits to the current node's description for clarity
5. Be concise and actionable

**CRITICAL: You MUST respond with valid JSON only. No other text before or after the JSON.**

**Output format** (JSON only):
{
  "children": [
    {"label": "Child 1 Label", "description": "Brief description"},
    {"label": "Child 2 Label", "description": "Brief description"},
    {"label": "Child 3 Label", "description": "Brief description"}
  ],
  "editDescription": "Optional: Improved description for the current node, or null if no edit needed",
  "reasoning": "Brief explanation of your suggestions"
}`
  }

  /**
   * Get abstraction guidance based on current level
   * Provides level-specific examples to help AI maintain consistent abstraction
   *
   * @param level - Current abstraction level (0 = root, higher = more specific)
   * @returns Guidance string with examples for the level
   */
  private getAbstractionGuidance(level: number): string {
    if (level === 0) {
      return `Level 0 (Root): High-level themes, major phases, or core pillars.
Examples: "User Experience", "Technical Infrastructure", "Go-to-Market Strategy"`
    } else if (level === 1) {
      return `Level 1: Key capabilities or major features within a theme.
Examples: If parent is "User Experience", children might be "Onboarding Flow", "Core Interactions", "Settings & Preferences"`
    } else if (level === 2) {
      return `Level 2: Specific features or components.
Examples: If parent is "Onboarding Flow", children might be "Welcome Screen", "Account Creation", "Tutorial Walkthrough"`
    } else {
      return `Level ${level}: Very specific implementation details or sub-tasks.
Keep breaking down into concrete, actionable items.`
    }
  }

  /**
   * Parse AI response into structured suggestions
   * Handles both JSON and legacy text format for backwards compatibility
   */
  private parseExpansionResponse(
    response: string,
    nodeId: string
  ): MindMapExpansionResult {
    const suggestions: AISuggestion[] = []
    const timestamp = new Date().toISOString()

    try {
      // Try JSON parsing first (preferred format)
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])

        // Validate required structure
        if (!parsed || typeof parsed !== 'object') {
          throw new Error('Invalid JSON structure')
        }

        // Process children with validation
        if (Array.isArray(parsed.children) && parsed.children.length > 0) {
          const validChildren = parsed.children
            .filter((child: any) => {
              // Must be object with label
              if (!child || typeof child !== 'object' || !child.label) {
                return false
              }
              // Label must be string
              if (typeof child.label !== 'string') {
                return false
              }
              return true
            })
            .map((child: any) => {
              const label = String(child.label).trim()
              const description = child.description && typeof child.description === 'string'
                ? String(child.description).trim()
                : undefined

              return {
                label,
                description: description && description.length > 0 ? description : undefined,
              }
            })
            .filter(child => {
              // Validate label length
              return (
                child.label.length >= MIN_LABEL_LENGTH &&
                child.label.length <= MAX_LABEL_LENGTH
              )
            })

          // Limit to reasonable number of children (max 10)
          const limitedChildren = validChildren.slice(0, 10)

          if (limitedChildren.length > 0) {
            suggestions.push({
              id: `suggestion-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              type: 'add_children',
              status: 'pending',
              content: `Add ${limitedChildren.length} child node${limitedChildren.length !== 1 ? 's' : ''}`,
              nodeId,
              metadata: { children: limitedChildren },
              timestamp,
            })
          } else if (parsed.children.length > 0) {
            // AI returned children but none were valid
            console.warn('AI returned children but none passed validation')
          }
        }

        // Process description edit with validation
        if (parsed.editDescription &&
            typeof parsed.editDescription === 'string' &&
            parsed.editDescription.toLowerCase() !== 'none' &&
            parsed.editDescription.toLowerCase() !== 'null' &&
            parsed.editDescription.trim().length > 0) {
          const description = parsed.editDescription.trim()

          // Validate description length (reasonable limits)
          if (description.length >= 10 && description.length <= 500) {
            suggestions.push({
              id: `suggestion-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              type: 'edit_description',
              status: 'pending',
              content: description,
              nodeId,
              metadata: { description },
              timestamp,
            })
          } else {
            console.warn(`Description length ${description.length} outside valid range (10-500)`)
          }
        }

        const reasoning = parsed.reasoning && typeof parsed.reasoning === 'string'
          ? parsed.reasoning.trim()
          : undefined

        return { suggestions, reasoning }
      }

      throw new Error('No JSON found in response')
    } catch (error) {
      // Fallback to legacy text parsing if JSON parsing fails
      console.warn('JSON parsing failed, falling back to text parsing:', error)
      return this.parseLegacyTextFormat(response, nodeId, timestamp)
    }
  }

  /**
   * Legacy text format parser (fallback)
   * @deprecated Use JSON format instead
   */
  private parseLegacyTextFormat(
    response: string,
    nodeId: string,
    timestamp: string
  ): MindMapExpansionResult {
    const suggestions: AISuggestion[] = []

    // Extract CHILDREN section
    const childrenMatch = response.match(/CHILDREN:\s*([\s\S]*?)(?=EDIT_DESCRIPTION:|REASONING:|$)/i)
    if (childrenMatch) {
      const childrenText = childrenMatch[1].trim()
      const childLines = childrenText.split('\n').filter(line => line.trim().startsWith('-'))

      const children = childLines
        .map(line => {
          const match = line.match(/^-\s*(?:\[([^\]]+)\]|([^:]+)):\s*(.*)$/)
          if (match) {
            const label = (match[1] || match[2]).trim()
            const description = match[3].trim()
            return { label, description: description || undefined }
          }
          return { label: line.replace(/^-\s*/, '').trim() }
        })
        .filter(child => child.label && child.label.length > 0)

      if (children.length > 0) {
        suggestions.push({
          id: `suggestion-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: 'add_children',
          status: 'pending',
          content: `Add ${children.length} child node${children.length !== 1 ? 's' : ''}`,
          nodeId,
          metadata: { children },
          timestamp,
        })
      }
    }

    // Extract EDIT_DESCRIPTION section
    const descMatch = response.match(/EDIT_DESCRIPTION:\s*([\s\S]*?)(?=REASONING:|$)/i)
    if (descMatch) {
      const description = descMatch[1].trim()
      if (description &&
          description.toLowerCase() !== 'none' &&
          description.toLowerCase() !== 'null' &&
          description.length > 0) {
        suggestions.push({
          id: `suggestion-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: 'edit_description',
          status: 'pending',
          content: description,
          nodeId,
          metadata: { description },
          timestamp,
        })
      }
    }

    // Extract REASONING section
    const reasoningMatch = response.match(/REASONING:\s*([\s\S]*?)$/i)
    const reasoning = reasoningMatch ? reasoningMatch[1].trim() : undefined

    return { suggestions, reasoning }
  }
}

/**
 * Create a mind map expander instance
 *
 * @param apiKey - API key for the AI provider
 * @param provider - AI provider ('anthropic' or 'openai')
 * @param modelId - Model identifier to use
 * @returns New MindMapExpander instance
 *
 * @example
 * ```ts
 * const expander = createMindMapExpander(
 *   process.env.ANTHROPIC_API_KEY,
 *   'anthropic',
 *   'claude-3-sonnet-20240229'
 * )
 * ```
 */
export function createMindMapExpander(
  apiKey: string,
  provider: AIProvider,
  modelId: string
): MindMapExpander {
  return new MindMapExpander(apiKey, provider, modelId)
}
