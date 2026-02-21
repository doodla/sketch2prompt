import { create } from 'zustand'
import type { XYPosition } from '@xyflow/react'
import type { DiagramNode } from './types'

export type ContextMenuContext = 'canvas' | 'node' | 'edge'

interface ContextMenuState {
  position: { x: number; y: number } | null
  context: ContextMenuContext | null
  targetId: string | undefined
}

interface UIState {
  // Command palette
  isCommandPaletteOpen: boolean
  openCommandPalette: () => void
  closeCommandPalette: () => void
  toggleCommandPalette: () => void

  // Context menu
  contextMenu: ContextMenuState
  openContextMenu: (
    context: ContextMenuContext,
    position: { x: number; y: number },
    targetId?: string
  ) => void
  closeContextMenu: () => void

  // Quick add menu
  isQuickAddOpen: boolean
  quickAddPosition: XYPosition | null
  openQuickAdd: (position?: XYPosition) => void
  closeQuickAdd: () => void

  // Selection tracking (mirrors React Flow selection for UI purposes)
  selectedNodeIds: string[]
  setSelectedNodeIds: (ids: string[]) => void

  // Clipboard for copy/paste
  clipboard: DiagramNode[]
  copyToClipboard: (nodes: DiagramNode[]) => void
  clearClipboard: () => void

  // Suggestion panel for mind map AI suggestions
  suggestionPanelNodeId: string | null
  openSuggestionPanel: (nodeId: string) => void
  closeSuggestionPanel: () => void

  // Close all menus (useful for Escape key)
  closeAllMenus: () => void
}

const initialContextMenu: ContextMenuState = {
  position: null,
  context: null,
  targetId: undefined,
}

export const useUIStore = create<UIState>()((set) => ({
  // Command palette
  isCommandPaletteOpen: false,
  openCommandPalette: () => {
    set({
      isCommandPaletteOpen: true,
      isQuickAddOpen: false,
      contextMenu: initialContextMenu,
    })
  },
  closeCommandPalette: () => {
    set({ isCommandPaletteOpen: false })
  },
  toggleCommandPalette: () => {
    set((state) => ({
      isCommandPaletteOpen: !state.isCommandPaletteOpen,
      isQuickAddOpen: false,
      contextMenu: initialContextMenu,
    }))
  },

  // Context menu
  contextMenu: initialContextMenu,
  openContextMenu: (context, position, targetId) => {
    set({
      contextMenu: { position, context, targetId },
      isCommandPaletteOpen: false,
      isQuickAddOpen: false,
    })
  },
  closeContextMenu: () => {
    set({ contextMenu: initialContextMenu })
  },

  // Quick add menu
  isQuickAddOpen: false,
  quickAddPosition: null,
  openQuickAdd: (position) => {
    set({
      isQuickAddOpen: true,
      quickAddPosition: position ?? null,
      isCommandPaletteOpen: false,
      contextMenu: initialContextMenu,
    })
  },
  closeQuickAdd: () => {
    set({ isQuickAddOpen: false, quickAddPosition: null })
  },

  // Selection tracking
  selectedNodeIds: [],
  setSelectedNodeIds: (ids) => {
    set({ selectedNodeIds: ids })
  },

  // Clipboard
  clipboard: [],
  copyToClipboard: (nodes) => {
    set({ clipboard: nodes })
  },
  clearClipboard: () => {
    set({ clipboard: [] })
  },

  // Suggestion panel
  suggestionPanelNodeId: null,
  openSuggestionPanel: (nodeId) => {
    set({ suggestionPanelNodeId: nodeId })
  },
  closeSuggestionPanel: () => {
    set({ suggestionPanelNodeId: null })
  },

  // Close all menus
  closeAllMenus: () => {
    set({
      isCommandPaletteOpen: false,
      isQuickAddOpen: false,
      quickAddPosition: null,
      contextMenu: initialContextMenu,
      suggestionPanelNodeId: null,
    })
  },
}))
