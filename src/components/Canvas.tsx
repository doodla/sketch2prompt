import { useCallback, useMemo } from 'react'
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  type Connection,
  type ColorMode,
  applyNodeChanges,
  applyEdgeChanges,
  useReactFlow,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useStore } from '../core/store'
import { nodeTypes } from './nodes'
import { QuickAddFAB } from './QuickAddFAB'
import { EmptyCanvasState } from './EmptyCanvasState'
import type { DiagramNode, DiagramEdge, NodeType } from '../core/types'

const NODE_TYPES_CYCLE: NodeType[] = [
  'frontend',
  'backend',
  'storage',
  'auth',
  'external',
  'background',
]

interface CanvasInnerProps {
  colorMode: ColorMode
}

function CanvasInner({ colorMode }: CanvasInnerProps) {
  const nodes = useStore((state) => state.nodes)
  const storeEdges = useStore((state) => state.edges)

  // Memoize edge transformation to prevent unnecessary callback recreation
  const edges = useMemo(
    () =>
      storeEdges.map((edge) => ({
        ...edge,
        label: edge.data?.label,
      })),
    [storeEdges]
  )
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

  const isEmpty = nodes.length === 0

  return (
    <>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDoubleClick={onDoubleClick}
        colorMode={colorMode}
        snapToGrid
        snapGrid={[16, 16]}
        fitView
        deleteKeyCode={['Backspace', 'Delete']}
        defaultEdgeOptions={{
          type: 'smoothstep',
          style: {
            stroke: 'var(--color-border)',
            strokeWidth: 1.5,
          },
          labelStyle: {
            fill: 'var(--color-text-secondary)',
            fontSize: 11,
            fontFamily: 'var(--font-family-mono)',
          },
          labelBgStyle: {
            fill: 'var(--color-surface-0)',
            fillOpacity: 0.9,
          },
          labelBgPadding: [6, 4] as [number, number],
          labelBgBorderRadius: 4,
        }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="var(--color-grid-line)"
          className="!bg-canvas-bg"
        />
        <Controls
          position="bottom-left"
          className="
            !bg-white dark:!bg-slate-900
            !border !border-slate-200 dark:!border-slate-700
            !rounded-lg !shadow-md
            !left-4 !bottom-4
            !overflow-hidden
            [&>button]:!bg-white dark:[&>button]:!bg-slate-900
            [&>button]:!border-0 [&>button]:!border-b [&>button]:!border-slate-200 dark:[&>button]:!border-slate-700
            [&>button]:!rounded-none
            [&>button:last-child]:!border-b-0
            [&>button]:!text-slate-600 dark:[&>button]:!text-slate-300
            [&>button:hover]:!bg-slate-100 dark:[&>button:hover]:!bg-slate-800
            [&>button]:!transition-colors [&>button]:!duration-150
          "
        />
        <MiniMap
          pannable
          zoomable
          nodeStrokeWidth={3}
          position="bottom-right"
          className="
            !bg-white/90 dark:!bg-slate-900/90
            !border !border-slate-200 dark:!border-slate-700
            !rounded-xl !shadow-md
            !right-4 !bottom-4
            backdrop-blur-sm
          "
          maskColor="rgba(0, 0, 0, 0.08)"
        />
      </ReactFlow>
      {isEmpty && <EmptyCanvasState />}
      <QuickAddFAB />
    </>
  )
}

interface CanvasProps {
  colorMode?: ColorMode
}

export function Canvas({ colorMode = 'light' }: CanvasProps) {
  return (
    <div className="h-full w-full bg-canvas-bg">
      <CanvasInner colorMode={colorMode} />
    </div>
  )
}
