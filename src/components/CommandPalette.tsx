import { useCallback, useEffect, useMemo } from 'react'
import { Command } from 'cmdk'
import {
  Undo2,
  Redo2,
  FileOutput,
  Sun,
  Moon,
  Trash2,
  Maximize2,
  Search,
} from 'lucide-react'
import { useUIStore } from '../core/ui-store'
import { useStore, useTemporalStore } from '../core/store'
import { useShallow } from 'zustand/react/shallow'
import type { NodeType } from '../core/types'
import { NODE_OPTIONS } from '../core/node-options'

interface CommandPaletteProps {
  isDark: boolean
  onToggleTheme: () => void
  onOpenExport: () => void
  onShowOnboarding: () => void
}

interface CommandItem {
  id: string
  label: string
  icon: React.ReactNode
  shortcut?: string
  action: () => void
  group: 'node' | 'action' | 'view'
}

const NODE_ICON_MAP: Record<NodeType, React.ReactNode> = Object.fromEntries(
  NODE_OPTIONS.map((option) => [
    option.type,
    <option.icon key={option.type} className="h-4 w-4" />,
  ])
) as Record<NodeType, React.ReactNode>

export function CommandPalette({
  isDark,
  onToggleTheme,
  onOpenExport,
  onShowOnboarding,
}: CommandPaletteProps) {
  const isOpen = useUIStore((state) => state.isCommandPaletteOpen)
  const closeCommandPalette = useUIStore((state) => state.closeCommandPalette)

  const addNode = useStore((state) => state.addNode)
  const clear = useStore((state) => state.clear)
  const nodes = useStore((state) => state.nodes)

  const { undo, redo, pastStates, futureStates } = useTemporalStore(
    useShallow((state) => ({
      undo: state.undo,
      redo: state.redo,
      pastStates: state.pastStates,
      futureStates: state.futureStates,
    }))
  )

  const canUndo = pastStates.length > 0
  const canRedo = futureStates.length > 0

  // Calculate center position for new nodes
  const getCenterPosition = useCallback(() => {
    // Default center if no nodes exist
    if (nodes.length === 0) {
      return { x: 400, y: 300 }
    }
    // Calculate average position of existing nodes
    const avgX = nodes.reduce((sum, n) => sum + n.position.x, 0) / nodes.length
    const avgY = nodes.reduce((sum, n) => sum + n.position.y, 0) / nodes.length
    // Offset slightly from center
    return { x: avgX + 50, y: avgY + 50 }
  }, [nodes])

  const handleAddNode = useCallback(
    (type: NodeType) => {
      const position = getCenterPosition()
      addNode(type, position)
      closeCommandPalette()
    },
    [addNode, getCenterPosition, closeCommandPalette]
  )

  const commands = useMemo<CommandItem[]>(
    () => [
      // Node commands
      {
        id: 'add-frontend',
        label: 'Add Frontend',
        icon: NODE_ICON_MAP.frontend,
        shortcut: '1',
        action: () => { handleAddNode('frontend') },
        group: 'node',
      },
      {
        id: 'add-backend',
        label: 'Add Backend',
        icon: NODE_ICON_MAP.backend,
        shortcut: '2',
        action: () => { handleAddNode('backend') },
        group: 'node',
      },
      {
        id: 'add-storage',
        label: 'Add Storage',
        icon: NODE_ICON_MAP.storage,
        shortcut: '3',
        action: () => { handleAddNode('storage') },
        group: 'node',
      },
      {
        id: 'add-auth',
        label: 'Add Auth',
        icon: NODE_ICON_MAP.auth,
        shortcut: '4',
        action: () => { handleAddNode('auth') },
        group: 'node',
      },
      {
        id: 'add-external',
        label: 'Add External',
        icon: NODE_ICON_MAP.external,
        shortcut: '5',
        action: () => { handleAddNode('external') },
        group: 'node',
      },
      {
        id: 'add-background',
        label: 'Add Background',
        icon: NODE_ICON_MAP.background,
        shortcut: '6',
        action: () => { handleAddNode('background') },
        group: 'node',
      },
      // Action commands
      {
        id: 'undo',
        label: 'Undo',
        icon: <Undo2 className="h-4 w-4" />,
        shortcut: 'Ctrl+Z',
        action: () => {
          if (canUndo) undo()
          closeCommandPalette()
        },
        group: 'action',
      },
      {
        id: 'redo',
        label: 'Redo',
        icon: <Redo2 className="h-4 w-4" />,
        shortcut: 'Ctrl+Shift+Z',
        action: () => {
          if (canRedo) redo()
          closeCommandPalette()
        },
        group: 'action',
      },
      {
        id: 'export',
        label: 'Export',
        icon: <FileOutput className="h-4 w-4" />,
        shortcut: 'Ctrl+E',
        action: () => {
          onOpenExport()
          closeCommandPalette()
        },
        group: 'action',
      },
      {
        id: 'clear-canvas',
        label: 'Clear Canvas',
        icon: <Trash2 className="h-4 w-4" />,
        action: () => {
          clear()
          closeCommandPalette()
        },
        group: 'action',
      },
      {
        id: 'guided-setup',
        label: 'Guided Setup',
        icon: <Maximize2 className="h-4 w-4" />,
        action: () => {
          onShowOnboarding()
          closeCommandPalette()
        },
        group: 'action',
      },
      // View commands
      {
        id: 'toggle-theme',
        label: isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode',
        icon: isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />,
        shortcut: 'Ctrl+D',
        action: () => {
          onToggleTheme()
          closeCommandPalette()
        },
        group: 'view',
      },
    ],
    [
      handleAddNode,
      canUndo,
      canRedo,
      undo,
      redo,
      closeCommandPalette,
      onOpenExport,
      onShowOnboarding,
      isDark,
      onToggleTheme,
      clear,
    ]
  )

  const nodeCommands = commands.filter((c) => c.group === 'node')
  const actionCommands = commands.filter((c) => c.group === 'action')
  const viewCommands = commands.filter((c) => c.group === 'view')

  // Close on escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeCommandPalette()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, closeCommandPalette])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={closeCommandPalette}
      />

      {/* Command palette */}
      <Command
        className="relative w-full max-w-lg overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900"
        loop
      >
        <div className="flex items-center gap-2 border-b border-gray-200 px-4 dark:border-gray-700">
          <Search className="h-4 w-4 text-gray-400" />
          <Command.Input
            placeholder="Search commands..."
            className="h-12 w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400 dark:text-gray-100 dark:placeholder:text-gray-500"
            autoFocus
          />
          <kbd className="hidden rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[10px] text-gray-500 dark:bg-gray-800 dark:text-gray-400 sm:inline-block">
            Esc
          </kbd>
        </div>

        <Command.List className="max-h-[300px] overflow-y-auto p-2">
          <Command.Empty className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">
            No results found.
          </Command.Empty>

          {/* Nodes group */}
          <Command.Group
            heading="Add Component"
            className="[&_[cmdk-group-heading]]:mb-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-gray-500 [&_[cmdk-group-heading]]:dark:text-gray-400"
          >
            {nodeCommands.map((cmd) => (
              <Command.Item
                key={cmd.id}
                value={cmd.label}
                onSelect={cmd.action}
                className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-sm text-gray-700 aria-selected:bg-gray-100 dark:text-gray-200 dark:aria-selected:bg-gray-800"
              >
                <span className="text-gray-400 dark:text-gray-500">
                  {cmd.icon}
                </span>
                <span className="flex-1">{cmd.label}</span>
                {cmd.shortcut && (
                  <kbd className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[10px] text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                    {cmd.shortcut}
                  </kbd>
                )}
              </Command.Item>
            ))}
          </Command.Group>

          {/* Actions group */}
          <Command.Group
            heading="Actions"
            className="mt-2 [&_[cmdk-group-heading]]:mb-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-gray-500 [&_[cmdk-group-heading]]:dark:text-gray-400"
          >
            {actionCommands.map((cmd) => (
              <Command.Item
                key={cmd.id}
                value={cmd.label}
                onSelect={cmd.action}
                className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-sm text-gray-700 aria-selected:bg-gray-100 dark:text-gray-200 dark:aria-selected:bg-gray-800"
              >
                <span className="text-gray-400 dark:text-gray-500">
                  {cmd.icon}
                </span>
                <span className="flex-1">{cmd.label}</span>
                {cmd.shortcut && (
                  <kbd className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[10px] text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                    {cmd.shortcut}
                  </kbd>
                )}
              </Command.Item>
            ))}
          </Command.Group>

          {/* View group */}
          <Command.Group
            heading="View"
            className="mt-2 [&_[cmdk-group-heading]]:mb-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-gray-500 [&_[cmdk-group-heading]]:dark:text-gray-400"
          >
            {viewCommands.map((cmd) => (
              <Command.Item
                key={cmd.id}
                value={cmd.label}
                onSelect={cmd.action}
                className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-sm text-gray-700 aria-selected:bg-gray-100 dark:text-gray-200 dark:aria-selected:bg-gray-800"
              >
                <span className="text-gray-400 dark:text-gray-500">
                  {cmd.icon}
                </span>
                <span className="flex-1">{cmd.label}</span>
                {cmd.shortcut && (
                  <kbd className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[10px] text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                    {cmd.shortcut}
                  </kbd>
                )}
              </Command.Item>
            ))}
          </Command.Group>
        </Command.List>

        <div className="border-t border-gray-200 px-4 py-2 dark:border-gray-700">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            <kbd className="font-mono">Enter</kbd> to select{' '}
            <span className="mx-2 text-gray-300 dark:text-gray-600">|</span>
            <kbd className="font-mono">Arrows</kbd> to navigate{' '}
            <span className="mx-2 text-gray-300 dark:text-gray-600">|</span>
            <kbd className="font-mono">Esc</kbd> to close
          </p>
        </div>
      </Command>
    </div>
  )
}
