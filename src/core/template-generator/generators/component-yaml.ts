import { dump } from 'js-yaml'
import type { DiagramNode, DiagramEdge } from '../../types'
import {
  DEFAULT_RESPONSIBILITIES,
  DEFAULT_TECH_STACK,
  ENHANCED_ANTI_RESPONSIBILITIES,
  TYPE_LABELS,
  TYPE_DESCRIPTIONS,
} from '../constants'
import { generateTypeSpecificFields } from '../sections'

/**
 * Generate component YAML template with enhanced anti-responsibilities
 */
export function generateComponentYamlTemplate(
  node: DiagramNode,
  edges: DiagramEdge[],
  allNodes: DiagramNode[],
): string {
  const nodeMap = new Map(allNodes.map((n) => [n.id, n]))

  // Find connected nodes
  const connectedEdges = edges.filter((e) => e.source === node.id || e.target === node.id)

  const integrationPoints = connectedEdges
    .map((edge) => {
      const isSource = edge.source === node.id
      const connectedId = isSource ? edge.target : edge.source
      const connectedNode = nodeMap.get(connectedId)

      if (!connectedNode) {
        return null
      }

      const direction = isSource ? 'outbound' : 'inbound'

      return {
        component: connectedNode.data.label,
        direction,
        purpose: edge.data?.label || '# AI: Why this integration exists',
        contract: {
          request: '# AI: Request shape',
          response: '# AI: Response shape',
        },
      }
    })
    .filter(
      (ip): ip is { component: string; direction: string; purpose: string; contract: { request: string; response: string } } =>
        ip !== null,
    )

  // Build anti-responsibilities as string array with pattern and reason
  const antiResponsibilities = ENHANCED_ANTI_RESPONSIBILITIES[node.data.type]
    .map((ar) => `${ar.pattern} — ${ar.reason}`)
    .concat(['# AI: Add component-specific boundaries'])

  // Build YAML object with enhanced structure
  const yamlData = {
    spec_version: '1.0',
    component_id: node.id,
    name: node.data.label,
    type: node.data.type,
    description:
      node.data.meta.description ||
      '# AI: Add 2-3 sentence description based on component name and type.\n' +
        `This is a ${TYPE_LABELS[node.data.type]} component responsible for ${TYPE_DESCRIPTIONS[node.data.type].toLowerCase()}.`,
    responsibilities: DEFAULT_RESPONSIBILITIES[node.data.type].concat([
      '# AI: Elaborate based on project context and integrations',
    ]),
    anti_responsibilities: antiResponsibilities,
    integration_points:
      integrationPoints.length > 0
        ? integrationPoints
        : [
            {
              component: '# AI: Add connected components',
              direction: 'outbound',
              purpose: '# AI: Why this integration exists',
              contract: {
                request: '# AI: Request shape',
                response: '# AI: Response shape',
              },
            },
          ],
    tech_stack: {
      primary:
        node.data.meta.techStack && node.data.meta.techStack.length > 0
          ? node.data.meta.techStack.join(', ')
          : `# AI: Specify primary technologies (e.g., ${DEFAULT_TECH_STACK[node.data.type]})`,
      baseline_deps: [
        {
          name: '# AI: Package name',
          version: '# AI: Semver constraint',
          purpose: '# AI: Why needed',
        },
      ],
      references: ['# AI: Official docs URL'],
    },
    validation: {
      exit_criteria: ['# AI: Define based on tech_stack and responsibilities', 'Status file updated with component completion'],
      smoke_tests: ['# AI: Define minimal verification steps'],
      integration_checks:
        integrationPoints.length > 0
          ? integrationPoints.map((ip) => `# AI: Verify contract with ${ip.component}`)
          : ['# AI: Define based on integration_points'],
    },
  }

  // Add type-specific fields
  const typeSpecificFields = generateTypeSpecificFields(node.data.type)
  const mergedData = { ...yamlData, ...typeSpecificFields }

  // Generate YAML with custom formatting
  const yaml = dump(mergedData, {
    indent: 2,
    lineWidth: 120,
    noRefs: true,
    quotingType: '"',
    forceQuotes: false,
  })

  return yaml
}
