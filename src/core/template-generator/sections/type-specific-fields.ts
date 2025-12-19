import type { NodeType } from '../../types'

/**
 * Generate type-specific fields for component YAML
 */
export function generateTypeSpecificFields(type: NodeType): Record<string, unknown> {
  switch (type) {
    case 'frontend':
      return {
        routing_strategy: '# AI: Describe routing approach (e.g., React Router, file-based)',
        state_management: '# AI: Describe state approach (e.g., Context, Zustand, Redux)',
        accessibility: [
          'Use semantic HTML elements',
          'Ensure keyboard navigation support',
          '# AI: Add project-specific a11y requirements',
        ],
        ui_patterns: [
          {
            name: '# AI: Add common UI pattern',
            usage: '# AI: Describe when to use this pattern',
          },
        ],
      }
    case 'backend':
      return {
        api_style: '# AI: REST|GraphQL|gRPC|tRPC',
        endpoint_patterns: [
          {
            pattern: '# AI: Add URL pattern (e.g., /api/v1/{resource})',
            methods: ['GET', 'POST'],
            auth: 'required|optional|none',
          },
        ],
        error_handling:
          '# AI: Document standard error response format.\n' +
          'Example: { error: string, code: string, details?: object }',
      }
    case 'storage':
      return {
        schema_notes: '# AI: Document key entities and relationships.\nExample: users, orders, order_items',
        backup_strategy:
          '# AI: Describe backup approach.\nExample: Daily automated backups with 30-day retention',
        indexing_strategy:
          '# AI: Document indexing guidelines.\nExample: Index all foreign keys and frequently filtered columns',
      }
    case 'auth':
      return {
        auth_strategy: '# AI: JWT|Session|OAuth2|API_Key',
        security_notes:
          '# AI: Document authentication and authorization approach.\n' +
          'Include password policy, session management, token expiry.',
        providers: [
          {
            name: '# AI: Add OAuth provider if applicable (Google, GitHub, etc.)',
            scopes: ['# AI: Required scopes'],
          },
        ],
      }
    case 'external':
      return {
        service_details: {
          provider: '# AI: Service name (e.g., Stripe, SendGrid)',
          api_version: '# AI: API version being used',
          environment: '# AI: Dev/staging/prod configuration notes',
        },
        error_handling: [
          'Implement circuit breaker for repeated failures',
          'Log all external API errors with correlation IDs',
          '# AI: Add service-specific error handling',
        ],
        rate_limits: ['# AI: Document known rate limits and how to handle them'],
      }
    case 'background':
      return {
        job_queue: '# AI: Queue technology (e.g., Redis + Bull, RabbitMQ, AWS SQS)',
        jobs: [
          {
            name: '# AI: Job name',
            trigger: 'Event-driven|Cron',
            frequency: '# AI: Schedule (e.g., "0 2 * * *") or event description',
            retry_policy: '# AI: Retry approach (e.g., "3 retries with exponential backoff")',
          },
        ],
      }
    default:
      return {}
  }
}
