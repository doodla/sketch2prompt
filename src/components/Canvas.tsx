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
import { ArrowLeft } from 'lucide-react'
import { useStore } from '../core/store'
import { useUIStore } from '../core/ui-store'
import { nodeTypes } from './nodes'
import { QuickAddFAB } from './QuickAddFAB'
import { EmptyCanvasState } from './EmptyCanvasState'
import type {
  DiagramNode,
  DiagramNodeData,
  DiagramEdge,
  NodeType,
} from '../core/types'

const NODE_TYPES_CYCLE: NodeType[] = [
  'frontend',
  'backend',
  'storage',
  'auth',
  'external',
  'background',
  'mindmap',
]

interface CanvasInnerProps {
  colorMode: ColorMode
}

/**
 * Helper function to get all descendant IDs of a node
 */
function getDescendantIds(nodeId: string, allNodes: DiagramNode[]): Set<string> {
  const descendants = new Set<string>()
  const queue = [nodeId]

  while (queue.length > 0) {
    const currentId = queue.shift()!
    descendants.add(currentId)

    const childIds = allNodes.find(n => n.id === currentId)?.data.meta.childIds ?? []
    queue.push(...childIds)
  }

  return descendants
}

function CanvasInner({ colorMode }: CanvasInnerProps) {
  const allNodes = useStore((state) => state.nodes)
  const storeEdges = useStore((state) => state.edges)
  const setNodes = useStore((state) => state.setNodes)
  const setEdges = useStore((state) => state.setEdges)
  const addEdgeToStore = useStore((state) => state.addEdge)
  const addNode = useStore((state) => state.addNode)
  const { screenToFlowPosition } = useReactFlow()

  // Mind map drill-down state
  const focusedMindMapNodeId = useUIStore((state) => state.focusedMindMapNodeId)
  const clearMindMapFocus = useUIStore((state) => state.clearMindMapFocus)

  // Filter nodes and edges when drill-down is active
  const { nodes, edges: filteredEdges } = useMemo(() => {
    if (!focusedMindMapNodeId) {
      // No focus - show all nodes
      return {
        nodes: allNodes,
        edges: storeEdges.map((edge) => ({
          ...edge,
          label: edge.data?.label,
        })),
      }
    }

    // Get focused node and all its descendants
    const visibleNodeIds = getDescendantIds(focusedMindMapNodeId, allNodes)

    // Filter nodes
    const filteredNodes = allNodes.filter(n => visibleNodeIds.has(n.id))

    // Filter edges - only show edges between visible nodes
    const filteredEdges = storeEdges
      .filter(e => visibleNodeIds.has(e.source) && visibleNodeIds.has(e.target))
      .map((edge) => ({
        ...edge,
        label: edge.data?.label,
      }))

    return { nodes: filteredNodes, edges: filteredEdges }
  }, [focusedMindMapNodeId, allNodes, storeEdges])

  // Get focused node for displaying breadcrumb
  const focusedNode = focusedMindMapNodeId
    ? allNodes.find(n => n.id === focusedMindMapNodeId)
    : null

  const onNodesChange: OnNodesChange<DiagramNode> = useCallback(
    (changes) => {
      setNodes(applyNodeChanges(changes, nodes))
    },
    [nodes, setNodes]
  )

  const onEdgesChange: OnEdgesChange<DiagramEdge> = useCallback(
    (changes) => {
      setEdges(applyEdgeChanges(changes, filteredEdges))
    },
    [filteredEdges, setEdges]
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
        edges={filteredEdges}
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
          gap={24}
          size={1.5}
          color="var(--color-grid-line)"
          className="!bg-[var(--color-workshop-bg)]"
        />
        <Controls
          position="bottom-left"
          className="
            !bg-[var(--color-workshop-surface)]
            !border !border-[var(--color-workshop-border)]
            !rounded-lg !shadow-lg
            !left-4 !bottom-4
            !overflow-hidden
            [&>button]:!bg-[var(--color-workshop-surface)]
            [&>button]:!border-0 [&>button]:!border-b [&>button]:!border-[var(--color-workshop-border)]
            [&>button]:!rounded-none
            [&>button:last-child]:!border-b-0
            [&>button]:!text-[var(--color-workshop-text-muted)]
            [&>button:hover]:!bg-[var(--color-workshop-elevated)]
            [&>button:hover]:!text-[var(--color-workshop-text)]
            [&>button]:!transition-all [&>button]:!duration-150
            [&>button>svg]:!fill-current
          "
        />
        <MiniMap
          pannable
          zoomable
          nodeStrokeWidth={3}
          position="bottom-right"
          className="
            !bg-[var(--color-workshop-surface)]/95
            !border !border-[var(--color-workshop-border)]
            !rounded-xl !shadow-lg
            !right-4 !bottom-4
            backdrop-blur-sm
          "
          maskColor="rgba(9, 9, 11, 0.6)"
          nodeColor={(node) => {
            const colors: Record<string, string> = {
              frontend: '#A78BFA',
              backend: '#60A5FA',
              storage: '#2DD4BF',
              auth: '#F472B6',
              external: '#FBBF24',
              background: '#A8A29E',
            }
            const nodeData = node.data as DiagramNodeData | undefined
            const nodeType = nodeData?.type
            return (nodeType && colors[nodeType]) ?? '#A8A29E'
          }}
        />
      </ReactFlow>
      {isEmpty && <EmptyCanvasState />}
      <QuickAddFAB />

      {/* Mind map drill-down back button */}
      {focusedNode && (
        <div className="absolute top-4 left-4 z-10 flex items-center gap-3 px-4 py-2.5 rounded-lg bg-[var(--color-workshop-elevated)] border border-[var(--color-workshop-border)] shadow-lg">
          <button
            onClick={clearMindMapFocus}
            className="flex items-center gap-2 text-sm font-medium text-[var(--color-workshop-text)] hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            title="Return to full view"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </button>
          <div className="h-4 w-px bg-[var(--color-workshop-border)]" />
          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--color-workshop-text-muted)]">Focused on:</span>
            <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
              {focusedNode.data.label}
            </span>
          </div>
        </div>
      )}
    </>
  )
}

interface CanvasProps {
  colorMode?: ColorMode
}

export function Canvas({ colorMode = 'light' }: CanvasProps) {
  return (
    <div className="h-full w-full bg-[var(--color-workshop-bg)]">
      <CanvasInner colorMode={colorMode} />
    </div>
  )
}
