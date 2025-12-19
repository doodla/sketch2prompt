import type { NodeType } from '../../types'

// Type-specific default responsibilities
export const DEFAULT_RESPONSIBILITIES: Record<NodeType, string[]> = {
  frontend: [
    'Render user interface components and pages',
    'Handle user interactions and form submissions',
    'Manage client-side state and routing',
    'Communicate with backend APIs for data',
  ],
  backend: [
    'Validate all incoming request payloads',
    'Enforce authentication and authorization rules',
    'Execute business logic and data transformations',
    'Return consistent, well-structured API responses',
  ],
  storage: [
    'Persist all business data with referential integrity',
    'Provide transactional guarantees for operations',
    'Support efficient queries via proper indexing',
    'Maintain data consistency and backup recovery',
  ],
  auth: [
    'Authenticate users via secure credential verification',
    'Generate and validate session tokens or JWTs',
    'Enforce access control and permission checks',
    'Handle password reset and account recovery flows',
  ],
  external: [
    'Integrate with third-party service APIs',
    'Handle rate limits and retry logic',
    'Transform external data formats to internal schemas',
    'Manage API credentials securely via environment variables',
  ],
  background: [
    'Execute scheduled or event-driven background tasks',
    'Process items from job queues reliably',
    'Implement retry logic with exponential backoff',
    'Monitor job failures and send alerts',
  ],
}
