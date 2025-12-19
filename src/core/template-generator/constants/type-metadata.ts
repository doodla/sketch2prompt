import type { NodeType } from '../../types'

export const TYPE_LABELS: Record<NodeType, string> = {
  frontend: 'Frontend',
  backend: 'Backend',
  storage: 'Storage',
  auth: 'Auth',
  external: 'External',
  background: 'Background',
}

export const TYPE_DESCRIPTIONS: Record<NodeType, string> = {
  frontend: 'UI components, pages, and client-side logic',
  backend: 'API endpoints, server logic, and business rules',
  storage: 'Databases, file storage, and caching layers',
  auth: 'Authentication, authorization, and user management',
  external: 'Third-party APIs and external service integrations',
  background: 'Background jobs, cron tasks, and queue workers',
}
