import type { DiagramNode } from '../../types'

/**
 * Generate Code Standards section
 */
export function generateCodeStandards(nodes: DiagramNode[]): string {
  const nodeTypes = new Set(nodes.map((n) => n.data.type))

  const hasTypescript = nodeTypes.has('frontend') || nodeTypes.has('backend')
  const hasFrontend = nodeTypes.has('frontend')
  const hasBackend = nodeTypes.has('backend')

  let namingConventions = `### Naming Conventions

- Files: \`kebab-case.ts\` for utilities`

  if (hasFrontend) {
    namingConventions += `, \`PascalCase.tsx\` for components`
  }

  namingConventions += `
- Functions: \`camelCase\` with verb prefix (e.g., \`getUserData\`, \`validateInput\`)`

  if (hasTypescript) {
    namingConventions += `
- Constants: \`SCREAMING_SNAKE_CASE\` for true constants
- Types: \`PascalCase\` with descriptive suffix (e.g., \`UserDTO\`, \`CreateOrderInput\`)`
  }

  namingConventions += `
- # AI: Add domain-specific naming patterns`

  const fileOrganization = `### File Organization

# AI: Generate folder structure based on stack and components. Example:

\`\`\`
/src
  /components  - # AI: Describe purpose
  /services    - # AI: Describe purpose
  /types       - # AI: Describe purpose
  /utils       - # AI: Describe purpose
\`\`\`
`

  let patterns = `### Patterns

# AI: Add stack-specific patterns. Examples:`

  if (hasFrontend) {
    patterns += `

#### Data Fetching
Use React Query, SWR, or similar. Shape:
\`\`\`typescript
const { data, isLoading, error } = useQuery({
  queryKey: ['resource', filters],
  queryFn: () => fetchResource(filters)
});
\`\`\`

#### Error Boundaries
Wrap route-level components in error boundaries.`
  }

  if (hasBackend) {
    patterns += `

#### Service Layer
Keep controllers thin, move business logic to services.
\`\`\`typescript
// Controller (routing only)
router.get('/resource/:id', async (req, res) => {
  const item = await resourceService.getById(req.params.id);
  res.json(item);
});

// Service (business logic)
class ResourceService {
  async getById(id: string): Promise<Resource> {
    // validation, authorization, business logic
  }
}
\`\`\``
  }

  const dependenciesPolicy = `### Dependencies Policy

- Prefer: Established packages with active maintenance and good documentation
- Avoid: Packages with no updates in 12+ months or security vulnerabilities
- Before adding: Check bundle size impact${hasTypescript ? ', verify TypeScript support' : ''}
- # AI: Add project-specific dependency guidelines`

  return `## Code Standards

${namingConventions}

${fileOrganization}

${patterns}

${dependenciesPolicy}`
}
