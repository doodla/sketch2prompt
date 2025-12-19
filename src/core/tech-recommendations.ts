import type { NodeType, TechRecommendation } from './types'

/**
 * Curated tech recommendations per node type.
 * Framed as "Managed vs Self-Hosted" to express responsibility boundaries.
 * Only applies to node types where this distinction is meaningful.
 */
export const RECOMMENDATIONS: Partial<Record<NodeType, TechRecommendation[]>> = {
  auth: [
    { name: 'Supabase Auth', category: 'managed', hasFreeTier: true },
    { name: 'Keycloak', category: 'self-hosted', hasFreeTier: true },
  ],
  storage: [
    { name: 'Supabase', category: 'managed', hasFreeTier: true },
    { name: 'PostgreSQL', category: 'self-hosted', hasFreeTier: true },
  ],
  background: [
    { name: 'Inngest', category: 'managed', hasFreeTier: true },
    { name: 'BullMQ', category: 'self-hosted', hasFreeTier: true },
  ],
}

export function getRecommendations(nodeType: NodeType): TechRecommendation[] {
  return RECOMMENDATIONS[nodeType] ?? []
}
