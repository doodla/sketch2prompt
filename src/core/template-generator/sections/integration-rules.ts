import type { DiagramNode, DiagramEdge, NodeType } from '../../types'

/**
 * Infer communication pattern from node types
 */
export function inferCommunicationPattern(sourceType: NodeType, targetType: NodeType): string {
  if (sourceType === 'frontend' && targetType === 'backend') {
    return 'HTTP REST/GraphQL'
  }
  if (sourceType === 'backend' && targetType === 'storage') {
    return 'ORM/Query builder'
  }
  if (sourceType === 'backend' && targetType === 'auth') {
    return 'Middleware/SDK'
  }
  if (sourceType === 'backend' && targetType === 'external') {
    return 'HTTP/SDK'
  }
  if (sourceType === 'backend' && targetType === 'background') {
    return 'Job queue'
  }
  if (sourceType === 'background' && targetType === 'storage') {
    return 'Direct DB access'
  }

  return '# AI: Define pattern'
}

/**
 * Generate Integration Rules section
 */
export function generateIntegrationRules(nodes: DiagramNode[], edges: DiagramEdge[]): string {
  if (edges.length === 0) {
    return `## Integration Rules

No component integrations defined yet.

# AI: Define how components should communicate once edges are added.`
  }

  const nodeMap = new Map(nodes.map((n) => [n.id, n]))

  // Build communication patterns table
  const tableHeader = `| From | To | Pattern | Notes |
|------|----|---------|-------|`

  const tableRows = edges.map((edge) => {
    const source = nodeMap.get(edge.source)
    const target = nodeMap.get(edge.target)

    if (!source || !target) {
      return ''
    }

    const pattern = inferCommunicationPattern(source.data.type, target.data.type)
    const notes = edge.data?.label || '# AI: Describe integration details'

    return `| ${source.data.label} | ${target.data.label} | ${pattern} | ${notes} |`
  })

  const filteredRows = tableRows.filter((row) => row !== '')

  const communicationPatterns = `### Communication Patterns

${tableHeader}
${filteredRows.join('\n')}

# AI: Review and refine integration patterns based on actual requirements.`

  const sharedContracts = `### Shared Contracts

# AI: Document shared types, API contracts, or data shapes that multiple components use.

Example:
- API response types defined in \`/src/types/api.ts\`
- Frontend and backend share TypeScript types
- Use Zod schemas for runtime validation`

  const forbiddenIntegrations = `### Forbidden Integrations

# AI: Add explicit rules about what components MUST NOT directly access.

Examples:
- Frontend MUST NOT directly access database — all data through backend API
- Background jobs MUST NOT import UI components — separate concerns`

  return `## Integration Rules

${communicationPatterns}

${sharedContracts}

${forbiddenIntegrations}`
}
