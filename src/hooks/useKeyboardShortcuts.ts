import { useEffect, useCallback } from 'react'

export interface ShortcutDefinition {
  key: string
  ctrl?: boolean
  shift?: boolean
  alt?: boolean
  meta?: boolean
  action: () => void
  description: string
  /** Condition function - shortcut only fires when this returns true */
  when?: () => boolean
}

/**
 * Check if the current focus is on an input element where shortcuts should be blocked
 */
function isInputFocused(): boolean {
  const active = document.activeElement
  if (!active) return false

  const tagName = active.tagName.toLowerCase()
  if (tagName === 'input' || tagName === 'textarea') return true
  if (active.getAttribute('contenteditable') === 'true') return true

  return false
}

/**
 * Hook to register global keyboard shortcuts.
 * Shortcuts are automatically disabled when focus is on input/textarea elements.
 *
 * @param shortcuts Array of shortcut definitions
 * @param enabled Whether shortcuts are enabled (useful for conditional activation)
 */
export function useKeyboardShortcuts(
  shortcuts: ShortcutDefinition[],
  enabled: boolean = true
): void {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return

      // Don't fire shortcuts when typing in inputs (unless shortcut explicitly allows it)
      const inputFocused = isInputFocused()

      for (const shortcut of shortcuts) {
        // Check modifier keys
        const ctrlMatch = shortcut.ctrl
          ? event.ctrlKey || event.metaKey
          : !event.ctrlKey && !event.metaKey
        const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey
        const altMatch = shortcut.alt ? event.altKey : !event.altKey

        // For meta specifically (Mac Cmd key)
        const metaOnlyMatch = shortcut.meta ? event.metaKey : true

        // Check key match (case-insensitive)
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase()

        if (!keyMatch) continue
        if (!ctrlMatch || !shiftMatch || !altMatch || !metaOnlyMatch) continue

        // Check condition
        if (shortcut.when && !shortcut.when()) continue

        // Block shortcuts on inputs unless explicitly allowed by `when`
        if (inputFocused && !shortcut.when) continue

        // Execute action
        event.preventDefault()
        event.stopPropagation()
        shortcut.action()
        return
      }
    },
    [shortcuts, enabled]
  )

  useEffect(() => {
    if (!enabled) return

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown, enabled])
}

/**
 * Predefined common keyboard shortcuts for the application
 */
export const SHORTCUT_KEYS = {
  COMMAND_PALETTE: 'k',
  QUICK_ADD: 'n',
  UNDO: 'z',
  REDO: 'z', // with shift
  DELETE: 'Delete',
  BACKSPACE: 'Backspace',
  ESCAPE: 'Escape',
  SELECT_ALL: 'a',
  COPY: 'c',
  PASTE: 'v',
  DUPLICATE: 'd',
  EXPORT: 'e',

  // Node type shortcuts
  ADD_FRONTEND: '1',
  ADD_BACKEND: '2',
  ADD_STORAGE: '3',
  ADD_AUTH: '4',
  ADD_EXTERNAL: '5',
  ADD_BACKGROUND: '6',
} as const
