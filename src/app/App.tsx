import { useState, useEffect, useCallback } from 'react'
import { ReactFlowProvider } from '@xyflow/react'
import { useShallow } from 'zustand/react/shallow'
import { FileOutput, Undo2, Redo2, Sun, Moon, Play, Search } from 'lucide-react'
import { Canvas } from '../components/Canvas'
import { Inspector } from '../components/Inspector'
import { ExportDrawer } from '../components/ExportDrawer'
import { ErrorBoundary } from '../components/ErrorBoundary'
import { OnboardingWizard } from '../components/OnboardingWizard'
import { CommandPalette } from '../components/CommandPalette'
import { QuickAddMenu } from '../components/QuickAddMenu'
import { useTemporalStore, useStore } from '../core/store'
import { useSettingsStore } from '../core/settings'
import { useUIStore } from '../core/ui-store'
import { useKeyboardShortcuts, SHORTCUT_KEYS } from '../hooks/useKeyboardShortcuts'
import type { DiagramNode, NodeType } from '../core/types'

const ONBOARDING_STORAGE_KEY = 'sketch2prompt:onboarding-completed'

export function App() {
  const [isExportOpen, setIsExportOpen] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(() => {
    if (typeof window === 'undefined') return false
    return localStorage.getItem(ONBOARDING_STORAGE_KEY) !== 'true'
  })
  const [isDark, setIsDark] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
      : false
  )

  const setNodes = useStore((state) => state.setNodes)
  const addNode = useStore((state) => state.addNode)
  const nodes = useStore((state) => state.nodes)
  const selectedNode = useStore((state) => state.nodes.find((n) => n.selected))
  const selectedEdge = useStore((state) => state.edges.find((e) => e.selected))
  const nodesCount = nodes.length

  const setProjectName = useSettingsStore((state) => state.setProjectName)

  const openCommandPalette = useUIStore((state) => state.openCommandPalette)
  const closeAllMenus = useUIStore((state) => state.closeAllMenus)
  const openQuickAdd = useUIStore((state) => state.openQuickAdd)
  const isCommandPaletteOpen = useUIStore((state) => state.isCommandPaletteOpen)
  const isQuickAddOpen = useUIStore((state) => state.isQuickAddOpen)

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
  const hasSelection = selectedNode ?? selectedEdge

  const getCenterPosition = useCallback(() => {
    if (nodes.length === 0) {
      return { x: 400, y: 300 }
    }
    const avgX = nodes.reduce((sum, n) => sum + n.position.x, 0) / nodes.length
    const avgY = nodes.reduce((sum, n) => sum + n.position.y, 0) / nodes.length
    return { x: avgX + 50, y: avgY + 50 }
  }, [nodes])

  const handleAddNode = useCallback(
    (type: NodeType) => {
      const position = getCenterPosition()
      addNode(type, position)
    },
    [addNode, getCenterPosition]
  )

  const handleToggleTheme = useCallback(() => {
    setIsDark((prev) => !prev)
  }, [])

  const handleOpenExport = useCallback(() => {
    setIsExportOpen(true)
  }, [])

  const handleShowOnboarding = useCallback(() => {
    setShowOnboarding(true)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  const handleOnboardingComplete = useCallback(
    (generatedNodes: DiagramNode[], title: string) => {
      setNodes(generatedNodes)
      setProjectName(title)
      localStorage.setItem(ONBOARDING_STORAGE_KEY, 'true')
      setShowOnboarding(false)
    },
    [setNodes, setProjectName]
  )

  const handleSkipOnboarding = useCallback(() => {
    localStorage.setItem(ONBOARDING_STORAGE_KEY, 'true')
    setShowOnboarding(false)
  }, [])

  useKeyboardShortcuts(
    [
      {
        key: SHORTCUT_KEYS.COMMAND_PALETTE,
        ctrl: true,
        action: () => { openCommandPalette() },
        description: 'Open command palette',
      },
      {
        key: SHORTCUT_KEYS.QUICK_ADD,
        action: () => { openQuickAdd() },
        description: 'Open quick add menu',
      },
      {
        key: '+',
        action: () => { openQuickAdd() },
        description: 'Open quick add menu',
      },
      {
        key: SHORTCUT_KEYS.UNDO,
        ctrl: true,
        action: () => { if (canUndo) undo() },
        description: 'Undo',
      },
      {
        key: SHORTCUT_KEYS.REDO,
        ctrl: true,
        shift: true,
        action: () => { if (canRedo) redo() },
        description: 'Redo',
      },
      {
        key: SHORTCUT_KEYS.EXPORT,
        ctrl: true,
        action: () => { handleOpenExport() },
        description: 'Open export drawer',
      },
      {
        key: SHORTCUT_KEYS.DUPLICATE,
        ctrl: true,
        action: () => { handleToggleTheme() },
        description: 'Toggle dark mode',
      },
      {
        key: SHORTCUT_KEYS.ESCAPE,
        action: () => {
          if (isCommandPaletteOpen || isQuickAddOpen) {
            closeAllMenus()
          } else if (showOnboarding) {
            handleSkipOnboarding()
          }
        },
        description: 'Close menus or skip onboarding',
        when: () => true,
      },
      {
        key: SHORTCUT_KEYS.ADD_FRONTEND,
        action: () => { handleAddNode('frontend') },
        description: 'Add frontend node',
      },
      {
        key: SHORTCUT_KEYS.ADD_BACKEND,
        action: () => { handleAddNode('backend') },
        description: 'Add backend node',
      },
      {
        key: SHORTCUT_KEYS.ADD_STORAGE,
        action: () => { handleAddNode('storage') },
        description: 'Add storage node',
      },
      {
        key: SHORTCUT_KEYS.ADD_AUTH,
        action: () => { handleAddNode('auth') },
        description: 'Add auth node',
      },
      {
        key: SHORTCUT_KEYS.ADD_EXTERNAL,
        action: () => { handleAddNode('external') },
        description: 'Add external node',
      },
      {
        key: SHORTCUT_KEYS.ADD_BACKGROUND,
        action: () => { handleAddNode('background') },
        description: 'Add background node',
      },
    ],
    !showOnboarding
  )

  return (
    <div className="flex h-screen flex-col bg-bg">
      <header className="flex h-14 items-center justify-between border-b border-slate-200/80 dark:border-slate-800 px-5 bg-white dark:bg-slate-900/50">
        <div className="flex items-center gap-5">
          <h1 className="text-lg font-semibold text-slate-800 dark:text-slate-100 tracking-tight">sketch2prompt</h1>

          <button
            onClick={() => { openCommandPalette() }}
            title="Search commands (Ctrl+K)"
            className="flex items-center gap-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-3 py-2 text-[13px] text-slate-500 dark:text-slate-400 transition-all duration-150 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">Search...</span>
            <kbd className="hidden rounded-md bg-white dark:bg-slate-900 px-2 py-0.5 font-mono text-[10px] text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700 sm:inline-block">
              Ctrl+K
            </kbd>
          </button>

          <div className="flex items-center gap-1 border-l border-slate-200 dark:border-slate-700 pl-4">
            <button
              onClick={() => { undo() }}
              disabled={!canUndo}
              title="Undo (Ctrl+Z)"
              className="rounded-lg p-2 text-slate-400 dark:text-slate-500 transition-all duration-150 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-300 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400 cursor-pointer"
            >
              <Undo2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => { redo() }}
              disabled={!canRedo}
              title="Redo (Ctrl+Shift+Z)"
              className="rounded-lg p-2 text-slate-400 dark:text-slate-500 transition-all duration-150 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-300 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400 cursor-pointer"
            >
              <Redo2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {nodesCount === 0 && (
            <button
              onClick={handleShowOnboarding}
              title="Start with guided setup"
              className="flex items-center gap-2 rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-3.5 py-2 text-[13px] font-medium text-cyan-600 dark:text-cyan-400 transition-all duration-150 hover:bg-cyan-500/20 hover:border-cyan-500/60 cursor-pointer"
            >
              <Play className="h-4 w-4" />
              Quick Start
            </button>
          )}
          <button
            onClick={handleToggleTheme}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="rounded-lg p-2 text-slate-400 dark:text-slate-500 transition-all duration-150 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button
            onClick={handleOpenExport}
            className="flex items-center gap-2 rounded-lg bg-blue-500 dark:bg-blue-600 px-4 py-2 text-[13px] font-medium text-white transition-all duration-150 hover:bg-blue-600 dark:hover:bg-blue-500 active:scale-[0.97] cursor-pointer shadow-sm"
          >
            <FileOutput className="h-4 w-4" />
            Export
          </button>
        </div>
      </header>

      <ErrorBoundary>
        <ReactFlowProvider>
          <main className="relative flex flex-1 overflow-hidden">
            <div className="flex-1">
              <Canvas colorMode={isDark ? 'dark' : 'light'} />
            </div>

            <aside
              className={`
                absolute right-0 top-0 h-full w-80
                border-l border-slate-200/80 dark:border-slate-800
                bg-white dark:bg-slate-900/80
                shadow-lg
                transition-transform duration-200 ease-out
                ${hasSelection ? 'translate-x-0' : 'translate-x-full'}
              `}
            >
              <Inspector />
            </aside>
          </main>
        </ReactFlowProvider>
      </ErrorBoundary>

      <ExportDrawer
        isOpen={isExportOpen}
        onClose={() => { setIsExportOpen(false) }}
      />

      <CommandPalette
        isDark={isDark}
        onToggleTheme={handleToggleTheme}
        onOpenExport={handleOpenExport}
        onShowOnboarding={handleShowOnboarding}
      />

      <QuickAddMenu />

      {showOnboarding && (
        <OnboardingWizard
          onComplete={handleOnboardingComplete}
          onSkip={handleSkipOnboarding}
        />
      )}
    </div>
  )
}
