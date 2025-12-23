/**
 * Generate example blueprint using actual template generators
 * Run with: npx tsx scripts/generate-example.ts
 */
import { writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'
import {
  generateStartMd,
  generateProjectRulesTemplate,
  generateAgentProtocolTemplate,
  generateComponentYamlTemplate,
} from '../src/core/template-generator'
import type { DiagramNode, DiagramEdge, NodeType } from '../src/core/types'

// Define the example system: SaaS Starter
const nodes: DiagramNode[] = [
  {
    id: 'frontend-1',
    type: 'frontend' as NodeType,
    position: { x: 100, y: 100 },
    data: {
      label: 'Web App',
      type: 'frontend' as NodeType,
      meta: {
        description: 'React SPA with dashboard, auth flows, and settings pages',
        techStack: ['React (Vite)', 'TypeScript', 'Tailwind CSS'],
      },
    },
  },
  {
    id: 'backend-1',
    type: 'backend' as NodeType,
    position: { x: 300, y: 100 },
    data: {
      label: 'API Server',
      type: 'backend' as NodeType,
      meta: {
        description: 'REST API handling business logic, user management, and data access',
        techStack: ['FastAPI', 'Python'],
      },
    },
  },
  {
    id: 'storage-1',
    type: 'storage' as NodeType,
    position: { x: 300, y: 300 },
    data: {
      label: 'Database',
      type: 'storage' as NodeType,
      meta: {
        description: 'PostgreSQL database for users, subscriptions, and application data',
        techStack: ['PostgreSQL', 'Supabase'],
      },
    },
  },
  {
    id: 'auth-1',
    type: 'auth' as NodeType,
    position: { x: 100, y: 300 },
    data: {
      label: 'Auth Service',
      type: 'auth' as NodeType,
      meta: {
        description: 'Authentication and authorization via Supabase Auth',
        techStack: ['Supabase'],
      },
    },
  },
]

const edges: DiagramEdge[] = [
  {
    id: 'e1',
    source: 'frontend-1',
    target: 'backend-1',
    sourceHandle: null,
    targetHandle: null,
    data: { label: 'REST API calls' },
  },
  {
    id: 'e2',
    source: 'frontend-1',
    target: 'auth-1',
    sourceHandle: null,
    targetHandle: null,
    data: { label: 'Auth flows (login, signup, logout)' },
  },
  {
    id: 'e3',
    source: 'backend-1',
    target: 'storage-1',
    sourceHandle: null,
    targetHandle: null,
    data: { label: 'Database queries' },
  },
  {
    id: 'e4',
    source: 'backend-1',
    target: 'auth-1',
    sourceHandle: null,
    targetHandle: null,
    data: { label: 'Token verification' },
  },
]

const projectName = 'SaaS Starter'
const outDir = join(process.cwd(), 'examples', 'saas-starter')

// Create directories
mkdirSync(outDir, { recursive: true })
mkdirSync(join(outDir, 'specs'), { recursive: true })

// Generate files
console.log('Generating example blueprint...\n')

// START.md
const startMd = generateStartMd(nodes, projectName)
writeFileSync(join(outDir, 'START.md'), startMd)
console.log('✓ START.md')

// PROJECT_RULES.md
const projectRules = generateProjectRulesTemplate(nodes, edges, projectName)
writeFileSync(join(outDir, 'PROJECT_RULES.md'), projectRules)
console.log('✓ PROJECT_RULES.md')

// AGENT_PROTOCOL.md
const agentProtocol = generateAgentProtocolTemplate(nodes, projectName, [])
writeFileSync(join(outDir, 'AGENT_PROTOCOL.md'), agentProtocol)
console.log('✓ AGENT_PROTOCOL.md')

// Component specs
for (const node of nodes) {
  const yaml = generateComponentYamlTemplate(node, edges, nodes)
  const filename = node.data.label.toLowerCase().replace(/\s+/g, '-') + '.yaml'
  writeFileSync(join(outDir, 'specs', filename), yaml)
  console.log(`✓ specs/${filename}`)
}

console.log('\n✅ Example blueprint generated in examples/saas-starter/')
