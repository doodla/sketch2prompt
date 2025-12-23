/**
 * Generate example blueprint using actual template generators
 * Run with: npx tsx scripts/generate-example.ts
 */
import { writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'
import {
  generateStartMd,
  generateReadme,
  generateProjectRulesTemplate,
  generateAgentProtocolTemplate,
  generateComponentSpecMarkdown,
} from '../src/core/template-generator'
import { exportJson } from '../src/core/export-json'
import type { DiagramNode, DiagramEdge, NodeType } from '../src/core/types'

// Define the example system: RAG Chat App
const nodes: DiagramNode[] = [
  {
    id: 'node_YT9BDlvVE1',
    type: 'frontend' as NodeType,
    position: { x: 150, y: 100 },
    data: {
      label: 'Web App',
      type: 'frontend' as NodeType,
      meta: {
        techStack: ['React (Vite)'],
      },
    },
  },
  {
    id: 'node_IGpBRDK8v5',
    type: 'backend' as NodeType,
    position: { x: 150, y: 300 },
    data: {
      label: 'Backend',
      type: 'backend' as NodeType,
      meta: {
        techStack: ['Python', 'FastAPI'],
      },
    },
  },
  {
    id: 'node_xlpUZBm02F',
    type: 'storage' as NodeType,
    position: { x: 150, y: 500 },
    data: {
      label: 'Database',
      type: 'storage' as NodeType,
      meta: {
        techStack: ['Supabase'],
      },
    },
  },
  {
    id: 'node_sicFMoQ5zO',
    type: 'storage' as NodeType,
    position: { x: 430, y: 500 },
    data: {
      label: 'Vector Store',
      type: 'storage' as NodeType,
      meta: {
        techStack: [],
      },
    },
  },
]

const edges: DiagramEdge[] = [
  {
    id: 'edge_9u3ok7VGQ9',
    source: 'node_YT9BDlvVE1',
    target: 'node_IGpBRDK8v5',
    sourceHandle: null,
    targetHandle: null,
    data: { label: 'API calls' },
  },
  {
    id: 'edge_g3PnBaRwdB',
    source: 'node_IGpBRDK8v5',
    target: 'node_sicFMoQ5zO',
    sourceHandle: null,
    targetHandle: null,
    data: { label: 'embeddings' },
  },
  {
    id: 'edge_--WnEfd0No',
    source: 'node_IGpBRDK8v5',
    target: 'node_xlpUZBm02F',
    sourceHandle: null,
    targetHandle: null,
    data: { label: 'queries' },
  },
]

const projectName = 'RAG Chat App'
const outDir = join(process.cwd(), 'examples', 'rag-chat-app')

// Create directories
mkdirSync(outDir, { recursive: true })
mkdirSync(join(outDir, 'specs'), { recursive: true })

// Generate files
console.log('Generating example blueprint...\n')

// README.md
const readme = generateReadme(projectName)
writeFileSync(join(outDir, 'README.md'), readme)
console.log('✓ README.md')

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

// Component specs (Markdown format)
for (const node of nodes) {
  const markdown = generateComponentSpecMarkdown(node, nodes)
  const filename = node.data.label.toLowerCase().replace(/\s+/g, '-') + '.md'
  writeFileSync(join(outDir, 'specs', filename), markdown)
  console.log(`✓ specs/${filename}`)
}

// diagram.json
const diagramJson = exportJson(nodes, edges)
writeFileSync(join(outDir, 'diagram.json'), diagramJson)
console.log('✓ diagram.json')

console.log('\n✅ Example blueprint generated in examples/rag-chat-app/')
