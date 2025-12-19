import type { NodeType } from '../../types'

// Type-specific default tech stack suggestions
export const DEFAULT_TECH_STACK: Record<NodeType, string> = {
  frontend: 'React, Vue, or similar modern framework',
  backend: 'Node.js + Express, FastAPI, or similar',
  storage: 'PostgreSQL, MySQL, MongoDB, or similar',
  auth: 'JWT, OAuth2, or session-based authentication',
  external: 'Official SDK for target service',
  background: 'Redis/Bull, Celery, or similar job queue',
}
