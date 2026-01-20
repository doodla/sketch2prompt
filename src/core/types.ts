import type { Node, Edge, XYPosition } from '@xyflow/react'

export const NODE_TYPES = {
  frontend: 'frontend',
  backend: 'backend',
  storage: 'storage',
  auth: 'auth',
  external: 'external',
  background: 'background',
  mindmap: 'mindmap',
} as const

export type NodeType = (typeof NODE_TYPES)[keyof typeof NODE_TYPES]

export type NodeMeta = {
  description?: string
  techStack?: string[]
  // Mind map specific fields
  parentId?: string
  childIds?: string[]
  isExpanded?: boolean
  suggestions?: AISuggestion[]
  comments?: string[]
  level?: number // abstraction level for consistent AI expansion
}

export type DiagramNodeData = {
  label: string
  type: NodeType
  meta: NodeMeta
}

export type DiagramNode = Node<DiagramNodeData, NodeType>

export type DiagramEdgeData = {
  label?: string
}

export type DiagramEdge = Edge<DiagramEdgeData>

export type Diagram = {
  version: '1.0'
  createdAt: string
  nodes: DiagramNode[]
  edges: DiagramEdge[]
}

export type SerializedNode = {
  id: string
  type: NodeType
  position: XYPosition
  data: DiagramNodeData
}

export type SerializedEdge = {
  id: string
  source: string
  target: string
  sourceHandle?: string | null
  targetHandle?: string | null
  data?: DiagramEdgeData
}

export type SerializedDiagram = {
  version: '1.0'
  createdAt: string
  nodes: SerializedNode[]
  edges: SerializedEdge[]
}

export type RecommendationCategory = 'managed' | 'self-hosted'

export interface TechRecommendation {
  name: string
  category: RecommendationCategory
  hasFreeTier: boolean
}

// Mind Map AI Expansion Types
export type SuggestionType = 'new_node' | 'edit_node' | 'edit_label' | 'edit_description' | 'add_children'
export type SuggestionStatus = 'pending' | 'accepted' | 'rejected' | 'edited'

/**
 * Child node information for mind map expansion
 */
export type MindMapChild = {
  label: string
  description?: string
}

/**
 * AI suggestion for mind map expansion
 *
 * The metadata field structure depends on the suggestion type:
 * - 'add_children': { children: MindMapChild[] }
 * - 'edit_description': { description: string }
 * - 'edit_label': { label: string }
 * - 'new_node': { label: string; description?: string; position?: XYPosition }
 */
export type AISuggestion = {
  id: string
  type: SuggestionType
  status: SuggestionStatus
  content: string
  nodeId?: string
  metadata?: {
    label?: string
    description?: string
    position?: XYPosition
    children?: MindMapChild[]
  }
  timestamp: string
}

export type MindMapExpansionRequest = {
  nodeId: string
  nodeLabel: string
  nodeDescription?: string
  context: {
    parentLabel?: string
    siblingLabels?: string[]
    currentLevel: number
  }
  userInstructions?: string
}

export type MindMapExpansionResult = {
  suggestions: AISuggestion[]
  reasoning?: string
}
