import type { NodeType } from '../../types'

/**
 * Enhanced anti-responsibilities with structured reasoning
 */
export interface AntiResponsibility {
  pattern: string
  reason: string
  instead?: string
}

export const ENHANCED_ANTI_RESPONSIBILITIES: Record<NodeType, AntiResponsibility[]> = {
  frontend: [
    {
      pattern: 'NEVER store sensitive data in localStorage or sessionStorage',
      reason: 'Client storage is accessible to any script on the page, including XSS attacks',
      instead: 'Use httpOnly cookies for tokens, or encrypt sensitive data before storing',
    },
    {
      pattern: 'NEVER trust client-side validation alone',
      reason: 'Client code can be bypassed or modified by users',
      instead: 'Always re-validate on the server; client validation is for UX only',
    },
    {
      pattern: 'NEVER make direct database connections',
      reason: 'Exposes credentials and bypasses business logic',
      instead: 'All data flows through backend API endpoints',
    },
    {
      pattern: 'NEVER implement business logic in UI components',
      reason: 'Makes logic hard to test and leads to duplication',
      instead: 'Keep components presentational; logic lives in services/hooks/backend',
    },
  ],
  backend: [
    {
      pattern: 'NEVER trust client-provided data without validation',
      reason: 'Clients can send any data, including malicious payloads',
      instead: 'Validate ALL inputs with schema validation (Zod, Joi, etc.)',
    },
    {
      pattern: 'NEVER expose internal error details to clients',
      reason: 'Stack traces reveal implementation details useful for attacks',
      instead: 'Log full errors internally; return safe, generic messages to clients',
    },
    {
      pattern: 'NEVER store secrets in code or version control',
      reason: 'Secrets in code get leaked through repos, logs, error messages',
      instead: 'Use environment variables or secret management services',
    },
    {
      pattern: 'NEVER trust client-provided IDs for authorization',
      reason: "Users can manipulate IDs to access others' data",
      instead: 'Always verify ownership/permissions server-side',
    },
  ],
  storage: [
    {
      pattern: 'NEVER expose direct connections to frontend',
      reason: 'Bypasses authentication, authorization, and business logic',
      instead: 'All access through backend API layer',
    },
    {
      pattern: 'NEVER store computed values that can be derived',
      reason: 'Creates data inconsistency when source changes',
      instead: 'Calculate at query time or use materialized views with refresh',
    },
    {
      pattern: 'NEVER use database triggers for business logic',
      reason: 'Triggers are hard to test, debug, and reason about',
      instead: "Keep logic in application layer where it's explicit and testable",
    },
    {
      pattern: 'NEVER store large files/blobs in the database',
      reason: 'Bloats database, slows backups, hurts performance',
      instead: 'Use object storage (S3, GCS) and store URLs/references',
    },
  ],
  auth: [
    {
      pattern: 'NEVER store plain-text passwords',
      reason: 'Database breaches expose all user credentials',
      instead: 'Use bcrypt, argon2, or scrypt with appropriate cost factors',
    },
    {
      pattern: 'NEVER implement custom cryptography',
      reason: 'Crypto is extremely hard to get right; subtle bugs are exploitable',
      instead: 'Use battle-tested libraries (e.g., crypto built-ins, jose for JWT)',
    },
    {
      pattern: 'NEVER skip rate limiting on auth endpoints',
      reason: 'Enables brute force and credential stuffing attacks',
      instead: 'Rate limit by IP and account; implement exponential backoff',
    },
    {
      pattern: 'NEVER log passwords, tokens, or session data',
      reason: 'Logs are often less protected than production data',
      instead: 'Mask sensitive fields; log only non-sensitive identifiers',
    },
  ],
  external: [
    {
      pattern: 'NEVER store API keys in code',
      reason: 'Keys in code end up in version control and logs',
      instead: 'Use environment variables or secret management',
    },
    {
      pattern: 'NEVER assume external services are always available',
      reason: 'External services have outages, rate limits, and latency spikes',
      instead: 'Implement timeouts, retries with backoff, and fallback behavior',
    },
    {
      pattern: 'NEVER trust external data without validation',
      reason: 'External APIs can return unexpected formats or malicious data',
      instead: 'Validate/sanitize all external data before use',
    },
    {
      pattern: 'NEVER ignore rate limits',
      reason: 'Exceeding limits can get your API access revoked',
      instead: 'Implement request queuing and respect rate limit headers',
    },
  ],
  background: [
    {
      pattern: 'NEVER assume jobs run exactly once',
      reason: 'Jobs can be retried on failure, timeout, or system restart',
      instead: 'Design all jobs to be idempotent (safe to run multiple times)',
    },
    {
      pattern: 'NEVER store job state only in memory',
      reason: 'Memory is lost on restart; jobs will be lost',
      instead: 'Use persistent queue (Redis, PostgreSQL, RabbitMQ)',
    },
    {
      pattern: 'NEVER ignore failed jobs',
      reason: 'Silent failures hide bugs and data inconsistencies',
      instead: 'Implement dead letter queues and alerting for failures',
    },
    {
      pattern: 'NEVER block request handlers with long-running work',
      reason: 'Ties up server resources and degrades user experience',
      instead: 'Queue work for background processing; return immediately',
    },
  ],
}
