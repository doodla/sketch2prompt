import type { NodeType } from './types'

export interface TechSuggestion {
  name: string
  category: string
}

/**
 * Curated technology suggestions organized by node type.
 * Popular/recommended options listed first in each category.
 */
export const TECH_SUGGESTIONS: Record<NodeType, TechSuggestion[]> = {
  frontend: [
    // Frameworks
    { name: 'React', category: 'Framework' },
    { name: 'Vue', category: 'Framework' },
    { name: 'Svelte', category: 'Framework' },
    { name: 'Next.js', category: 'Framework' },
    { name: 'Nuxt', category: 'Framework' },
    { name: 'Remix', category: 'Framework' },
    { name: 'Astro', category: 'Framework' },
    // Languages
    { name: 'TypeScript', category: 'Language' },
    { name: 'JavaScript', category: 'Language' },
    // Styling
    { name: 'Tailwind CSS', category: 'Styling' },
    { name: 'CSS Modules', category: 'Styling' },
    { name: 'Styled Components', category: 'Styling' },
    { name: 'Sass', category: 'Styling' },
    // State
    { name: 'Zustand', category: 'State' },
    { name: 'Redux', category: 'State' },
    { name: 'Jotai', category: 'State' },
    { name: 'TanStack Query', category: 'State' },
  ],
  backend: [
    // Runtimes
    { name: 'Node.js', category: 'Runtime' },
    { name: 'Deno', category: 'Runtime' },
    { name: 'Bun', category: 'Runtime' },
    { name: 'Python', category: 'Runtime' },
    { name: 'Go', category: 'Runtime' },
    { name: 'Rust', category: 'Runtime' },
    // Frameworks
    { name: 'Express', category: 'Framework' },
    { name: 'Fastify', category: 'Framework' },
    { name: 'Hono', category: 'Framework' },
    { name: 'FastAPI', category: 'Framework' },
    { name: 'Django', category: 'Framework' },
    { name: 'Gin', category: 'Framework' },
    // Validation
    { name: 'Zod', category: 'Validation' },
    { name: 'Yup', category: 'Validation' },
    { name: 'Joi', category: 'Validation' },
    // API
    { name: 'tRPC', category: 'API' },
    { name: 'GraphQL', category: 'API' },
    { name: 'REST', category: 'API' },
  ],
  storage: [
    // SQL
    { name: 'PostgreSQL', category: 'SQL' },
    { name: 'MySQL', category: 'SQL' },
    { name: 'SQLite', category: 'SQL' },
    // NoSQL
    { name: 'MongoDB', category: 'NoSQL' },
    { name: 'Redis', category: 'NoSQL' },
    { name: 'DynamoDB', category: 'NoSQL' },
    // ORM
    { name: 'Prisma', category: 'ORM' },
    { name: 'Drizzle', category: 'ORM' },
    { name: 'TypeORM', category: 'ORM' },
    { name: 'Sequelize', category: 'ORM' },
    // Cloud Storage
    { name: 'S3', category: 'Object Storage' },
    { name: 'Cloudflare R2', category: 'Object Storage' },
    { name: 'Supabase Storage', category: 'Object Storage' },
  ],
  auth: [
    // Methods
    { name: 'JWT', category: 'Method' },
    { name: 'Session', category: 'Method' },
    { name: 'OAuth 2.0', category: 'Method' },
    // Libraries
    { name: 'bcrypt', category: 'Library' },
    { name: 'Passport.js', category: 'Library' },
    { name: 'NextAuth.js', category: 'Library' },
    { name: 'Lucia', category: 'Library' },
    // Providers
    { name: 'Auth0', category: 'Provider' },
    { name: 'Clerk', category: 'Provider' },
    { name: 'Supabase Auth', category: 'Provider' },
    { name: 'Firebase Auth', category: 'Provider' },
    // Features
    { name: 'RBAC', category: 'Feature' },
    { name: 'MFA/2FA', category: 'Feature' },
    { name: 'SSO', category: 'Feature' },
  ],
  external: [
    // Clients
    { name: 'axios', category: 'HTTP Client' },
    { name: 'fetch', category: 'HTTP Client' },
    { name: 'ky', category: 'HTTP Client' },
    // Payments
    { name: 'Stripe', category: 'Payments' },
    { name: 'PayPal', category: 'Payments' },
    { name: 'LemonSqueezy', category: 'Payments' },
    // Email
    { name: 'SendGrid', category: 'Email' },
    { name: 'Resend', category: 'Email' },
    { name: 'Postmark', category: 'Email' },
    // Search
    { name: 'Algolia', category: 'Search' },
    { name: 'Elasticsearch', category: 'Search' },
    { name: 'Meilisearch', category: 'Search' },
    // Analytics
    { name: 'PostHog', category: 'Analytics' },
    { name: 'Mixpanel', category: 'Analytics' },
    { name: 'Plausible', category: 'Analytics' },
  ],
  background: [
    // Queues
    { name: 'Bull', category: 'Queue' },
    { name: 'BullMQ', category: 'Queue' },
    { name: 'Celery', category: 'Queue' },
    // Brokers
    { name: 'Redis', category: 'Broker' },
    { name: 'RabbitMQ', category: 'Broker' },
    { name: 'Kafka', category: 'Broker' },
    // Cron
    { name: 'node-cron', category: 'Scheduler' },
    { name: 'Agenda', category: 'Scheduler' },
    // Cloud
    { name: 'AWS Lambda', category: 'Serverless' },
    { name: 'Cloudflare Workers', category: 'Serverless' },
    { name: 'Vercel Functions', category: 'Serverless' },
    // Workflow
    { name: 'Temporal', category: 'Workflow' },
    { name: 'Inngest', category: 'Workflow' },
  ],
}

/**
 * Get suggestions for a specific node type, optionally filtered by search query.
 */
export function getTechSuggestions(
  nodeType: NodeType,
  query: string = '',
  exclude: string[] = []
): TechSuggestion[] {
  const suggestions = TECH_SUGGESTIONS[nodeType]
  const normalizedQuery = query.toLowerCase().trim()

  return suggestions
    .filter((s) => !exclude.includes(s.name))
    .filter((s) =>
      normalizedQuery === '' ||
      s.name.toLowerCase().includes(normalizedQuery) ||
      s.category.toLowerCase().includes(normalizedQuery)
    )
    .slice(0, 8) // Limit results
}

/**
 * Get all unique categories for a node type.
 */
export function getTechCategories(nodeType: NodeType): string[] {
  const suggestions = TECH_SUGGESTIONS[nodeType]
  return [...new Set(suggestions.map((s) => s.category))]
}
