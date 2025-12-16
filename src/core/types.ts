import type { Node, Edge, XYPosition } from '@xyflow/react'

export const NODE_TYPES = {
  frontend: 'frontend',
  backend: 'backend',
  storage: 'storage',
  auth: 'auth',
  external: 'external',
  background: 'background',
} as const

export type NodeType = (typeof NODE_TYPES)[keyof typeof NODE_TYPES]

export type NodeMeta = {
  description?: string
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
