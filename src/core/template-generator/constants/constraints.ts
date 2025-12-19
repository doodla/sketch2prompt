import type { NodeType } from '../../types'

// Type-specific default constraints
export const DEFAULT_CONSTRAINTS: Record<NodeType, { security: string[]; performance: string[]; architecture: string[] }> = {
  frontend: {
    security: [
      'Sanitize all user inputs to prevent XSS attacks',
      'Use HTTPS only for API communications',
      'Implement Content Security Policy headers',
    ],
    performance: [
      'Lazy load routes and heavy components',
      'Optimize bundle size with code splitting',
      'Debounce expensive operations like API calls',
    ],
    architecture: [
      'Keep components small and single-responsibility',
      'Use composition over inheritance for reusability',
      'Separate presentational and container components',
    ],
  },
  backend: {
    security: [
      'Validate ALL inputs with schema validation library',
      'Use parameterized queries to prevent SQL injection',
      'Implement rate limiting on all endpoints',
      'Set secure HTTP headers (helmet.js or equivalent)',
    ],
    performance: [
      'Use connection pooling for database access',
      'Implement pagination for list endpoints',
      'Add caching for expensive queries',
      'Set reasonable request timeout limits',
    ],
    architecture: [
      'Separate controllers (routing) from services (business logic)',
      'Use dependency injection for testability',
      'Keep request handlers thin, services thick',
      'Structure code by feature/resource, not layer',
    ],
  },
  storage: {
    security: [
      'Encrypt sensitive columns at rest',
      'Use minimal privilege database users',
      'Audit log for sensitive data access',
      'Implement row-level security if supported',
    ],
    performance: [
      'Create indexes for frequently filtered columns',
      'Use connection pooling',
      'Monitor slow queries and optimize',
      'Implement read replicas if read-heavy',
    ],
    architecture: [
      'Normalize to 3NF, denormalize only with measured need',
      'Use UUIDs for primary keys if distributed',
      'All tables have created_at and updated_at timestamps',
      'Soft delete via deleted_at column when needed',
    ],
  },
  auth: {
    security: [
      'Use bcrypt or argon2 for password hashing',
      'Implement multi-factor authentication for sensitive operations',
      'Set short expiry times for session tokens',
      'Revoke tokens on logout or password change',
      'Rate limit authentication attempts',
    ],
    performance: [
      'Cache valid tokens to reduce verification overhead',
      'Use token-based auth to avoid database lookups',
      'Set reasonable token expiry to balance security and UX',
    ],
    architecture: [
      'Separate authentication (who are you) from authorization (what can you do)',
      'Use middleware for token validation',
      'Store minimal data in tokens (user ID, role only)',
      'Centralize permission checks in authorization service',
    ],
  },
  external: {
    security: [
      'Store API keys in environment variables, never in code',
      'Validate webhook signatures to prevent spoofing',
      'Use OAuth with minimal required scopes',
      'Rotate API keys periodically',
    ],
    performance: [
      'Implement circuit breaker pattern for failing services',
      'Cache external API responses when appropriate',
      'Set aggressive timeouts to prevent hanging',
      'Use retry with exponential backoff',
    ],
    architecture: [
      'Wrap external APIs in adapter/facade pattern',
      'Transform external data at integration boundary',
      'Design for eventual consistency if service fails',
      'Version external integration interfaces',
    ],
  },
  background: {
    security: [
      'Validate job payloads before processing',
      'Run jobs with minimal required permissions',
      'Audit log for sensitive background operations',
    ],
    performance: [
      'Process jobs in parallel when possible',
      'Set job priorities based on business criticality',
      'Monitor queue depth and scale workers',
      'Implement job timeout to prevent hanging',
    ],
    architecture: [
      'Design jobs to be idempotent (safe to retry)',
      'Use persistent queue (Redis, RabbitMQ, etc.)',
      'Store job results for debugging',
      'Separate job definition from job execution',
    ],
  },
}
