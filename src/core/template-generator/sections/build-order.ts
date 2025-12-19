import type { DiagramNode, NodeType } from '../../types'
import { BUILD_ORDER } from '../constants'

/**
 * Generate Build Order section
 */
export function generateBuildOrderSection(nodes: DiagramNode[]): string {
  const nodesByType = new Map<NodeType, DiagramNode[]>()
  for (const node of nodes) {
    const existing = nodesByType.get(node.data.type) ?? []
    nodesByType.set(node.data.type, [...existing, node])
  }

  const phases: { name: string; components: string[] }[] = []

  // Foundation phase
  phases.push({
    name: 'Phase 1: Foundation',
    components: ['Project setup, tooling, and dependencies'],
  })

  // Type-based phases with pre-assigned phase numbers
  const buildPhaseMap: Record<NodeType, { name: string; rationale: string }> = {
    storage: {
      name: 'Phase 2: Storage',
      rationale: 'Schema and data models first (everything depends on data)',
    },
    auth: {
      name: 'Phase 3: Authentication',
      rationale: 'Auth before protected features',
    },
    backend: {
      name: 'Phase 4: Backend',
      rationale: 'Business logic and API endpoints',
    },
    frontend: {
      name: 'Phase 5: Frontend',
      rationale: 'UI consuming the backend API',
    },
    external: {
      name: 'Phase 6: Integration',
      rationale: 'Third-party service connections',
    },
    background: {
      name: 'Phase 7: Background Jobs',
      rationale: 'Asynchronous processing',
    },
  }

  for (const type of BUILD_ORDER) {
    const typeNodes = nodesByType.get(type)
    if (typeNodes && typeNodes.length > 0) {
      const phase = buildPhaseMap[type]
      const componentItems = typeNodes.map((node) => `- [ ] [${node.id}] ${node.data.label} — ${phase.rationale}`)
      phases.push({
        name: phase.name,
        components: componentItems,
      })
    }
  }

  // Polish phase - number is based on how many phases we've added
  const polishPhaseNum = phases.length + 1
  phases.push({
    name: `Phase ${String(polishPhaseNum)}: Polish`,
    components: [
      '- [ ] Error handling standardization',
      '- [ ] Performance optimization',
      '- [ ] Monitoring and logging',
      '- [ ] # AI: Add project-specific polish tasks',
    ],
  })

  const phaseSections = phases.map((phase) => `### ${phase.name}\n${phase.components.join('\n')}`).join('\n\n')

  return `## Build Order

Implementation sequence based on dependency graph:

${phaseSections}`
}
