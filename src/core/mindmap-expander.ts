import OpenAI from 'openai'
import type {
  MindMapExpansionRequest,
  MindMapExpansionResult,
  AISuggestion,
} from './types'
import { createClient, callAI } from './ai-generator/client'
import type { AIProvider } from './ai-generator/types'

/**
 * AI-powered mind map node expander
 * Maintains same level of abstraction while expanding nodes
 */
export class MindMapExpander {
  private client: OpenAI
  private modelId: string

  constructor(apiKey: string, provider: AIProvider, modelId: string) {
    this.client = createClient(apiKey, provider)
    this.modelId = modelId
  }

  /**
   * Expand a mind map node with AI suggestions
   * Keeps same abstraction level as the parent node
   */
  async expandNode(
    request: MindMapExpansionRequest
  ): Promise<MindMapExpansionResult> {
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
   * Build prompt for AI expansion
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

**Output format** (use exactly this structure):

CHILDREN:
- [Child 1 Label]: [Brief description]
- [Child 2 Label]: [Brief description]
- [Child 3 Label]: [Brief description]

EDIT_DESCRIPTION:
[Optional: Improved description for the current node]

REASONING:
[Brief explanation of your suggestions]`
  }

  /**
   * Get abstraction guidance based on current level
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
   */
  private parseExpansionResponse(
    response: string,
    nodeId: string
  ): MindMapExpansionResult {
    const suggestions: AISuggestion[] = []
    const timestamp = new Date().toISOString()

    // Extract CHILDREN section
    const childrenMatch = response.match(/CHILDREN:\s*([\s\S]*?)(?=EDIT_DESCRIPTION:|REASONING:|$)/i)
    if (childrenMatch) {
      const childrenText = childrenMatch[1].trim()
      const childLines = childrenText.split('\n').filter(line => line.trim().startsWith('-'))

      const children = childLines.map(line => {
        // Parse "- [Label]: [Description]"
        const match = line.match(/^-\s*(?:\[([^\]]+)\]|([^:]+)):\s*(.*)$/)
        if (match) {
          const label = (match[1] || match[2]).trim()
          const description = match[3].trim()
          return { label, description }
        }
        // Fallback: just take the line content
        return { label: line.replace(/^-\s*/, '').trim() }
      }).filter(child => child.label)

      if (children.length > 0) {
        suggestions.push({
          id: `suggestion-${Date.now()}-children`,
          type: 'add_children',
          status: 'pending',
          content: `Add ${children.length} child nodes`,
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
      if (description && description.toLowerCase() !== 'none' && description.length > 0) {
        suggestions.push({
          id: `suggestion-${Date.now()}-desc`,
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
 */
export function createMindMapExpander(
  apiKey: string,
  provider: AIProvider,
  modelId: string
): MindMapExpander {
  return new MindMapExpander(apiKey, provider, modelId)
}
