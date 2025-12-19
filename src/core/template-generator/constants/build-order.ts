import type { NodeType } from '../../types'

// Type-based build order (matches export-prompt.ts)
export const BUILD_ORDER: NodeType[] = [
  'storage',    // Data models first
  'auth',       // Auth before features
  'backend',    // API before UI
  'frontend',   // UI after API
  'external',   // Integrations
  'background', // Background jobs
]
