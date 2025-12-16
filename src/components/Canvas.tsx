import { useCallback } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  type Connection,
  applyNodeChanges,
  applyEdgeChanges,
  useReactFlow,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useStore } from '../core/store'
import type { DiagramNode, DiagramEdge, NodeType } from '../core/types'

const NODE_TYPES_CYCLE: NodeType[] = [
  'frontend',
  'backend',
  'storage',
  'auth',
  'external',
  'background',
]

function CanvasInner() {
  const nodes = useStore((state) => state.nodes)
  const edges = useStore((state) => state.edges)
  const setNodes = useStore((state) => state.setNodes)
  const setEdges = useStore((state) => state.setEdges)
  const addEdgeToStore = useStore((state) => state.addEdge)
  const addNode = useStore((state) => state.addNode)
  const { screenToFlowPosition } = useReactFlow()

  const onNodesChange: OnNodesChange<DiagramNode> = useCallback(
    (changes) => {
      setNodes(applyNodeChanges(changes, nodes))
    },
    [nodes, setNodes]
  )

  const onEdgesChange: OnEdgesChange<DiagramEdge> = useCallback(
    (changes) => {
      setEdges(applyEdgeChanges(changes, edges))
    },
    [edges, setEdges]
  )

  const onConnect: OnConnect = useCallback(
    (connection: Connection) => {
      if (connection.source && connection.target) {
        addEdgeToStore(connection.source, connection.target)
      }
    },
    [addEdgeToStore]
  )

  // Temporary: double-click to add node for testing
  const onDoubleClick = useCallback(
    (event: React.MouseEvent) => {
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })
      const index = nodes.length % NODE_TYPES_CYCLE.length
      const nodeType = NODE_TYPES_CYCLE[index] ?? 'frontend'
      addNode(nodeType, position)
    },
    [screenToFlowPosition, addNode, nodes.length]
  )

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onDoubleClick={onDoubleClick}
      snapToGrid
      snapGrid={[16, 16]}
      fitView
      deleteKeyCode={['Backspace', 'Delete']}
      defaultEdgeOptions={{
        type: 'smoothstep',
      }}
    >
      <Background gap={16} size={1} />
      <Controls />
    </ReactFlow>
  )
}

export function Canvas() {
  return (
    <div className="h-full w-full">
      <CanvasInner />
    </div>
  )
}
