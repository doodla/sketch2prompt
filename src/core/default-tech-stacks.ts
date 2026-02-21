import type { NodeType } from './types'

/**
 * Default tech stack per node type.
 * Most types start empty to encourage intentional selection via recommendations.
 * Frontend and backend have minimal defaults for common patterns.
 */
export const DEFAULT_TECH_STACKS: Record<NodeType, string[]> = {
  frontend: ['React', 'TypeScript'],
  backend: ['Node.js'],
  storage: [],
  auth: [],
  external: [],
  background: [],
  mindmap: [],
}

/**
 * Get default tech stack for a node type.
 * Returns a copy to prevent accidental mutation.
 */
export function getDefaultTechStack(type: NodeType): string[] {
  return [...DEFAULT_TECH_STACKS[type]]
}
