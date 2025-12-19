import type { NodeType } from './types'

// ============================================================================
// TYPES
// ============================================================================

export type Platform = 'web' | 'mobile' | 'desktop' | 'cli'

export type Archetype =
  | 'saas'
  | 'marketplace'
  | 'content'
  | 'devtool'
  | 'mobile'
  | 'custom'

export type ComponentDefinition = {
  id: string
  type: NodeType
  label: string
  defaultTech: string
  techAlternatives: string[] // max 3
}

export type ArchetypeConfig = {
  id: Archetype
  label: string
  description: string
  platform: Platform
  badge?: string
  components: ComponentDefinition[]
}

// ============================================================================
// COMPONENT LIBRARY
// ============================================================================

const COMPONENTS = {
  // Frontend
  frontend: {
    id: 'frontend',
    type: 'frontend' as NodeType,
    label: 'Web App',
    defaultTech: 'Next.js',
    techAlternatives: ['React', 'Vue', 'SvelteKit'],
  },

  // Backend
  api: {
    id: 'api',
    type: 'backend' as NodeType,
    label: 'API Server',
    defaultTech: 'Node.js',
    techAlternatives: ['FastAPI', 'Go', 'Rails'],
  },
  webhooks: {
    id: 'webhooks',
    type: 'backend' as NodeType,
    label: 'Webhook Handler',
    defaultTech: 'Node.js',
    techAlternatives: ['FastAPI', 'Go'],
  },

  // Auth
  auth: {
    id: 'auth',
    type: 'auth' as NodeType,
    label: 'Auth Service',
    defaultTech: 'Clerk',
    techAlternatives: ['Auth0', 'Supabase Auth', 'NextAuth'],
  },

  // Storage
  database: {
    id: 'database',
    type: 'storage' as NodeType,
    label: 'Database',
    defaultTech: 'PostgreSQL',
    techAlternatives: ['MySQL', 'MongoDB', 'Supabase'],
  },
  fileStorage: {
    id: 'file-storage',
    type: 'storage' as NodeType,
    label: 'File Storage',
    defaultTech: 'AWS S3',
    techAlternatives: ['Cloudflare R2', 'Supabase Storage'],
  },
  cache: {
    id: 'cache',
    type: 'storage' as NodeType,
    label: 'Cache',
    defaultTech: 'Redis',
    techAlternatives: ['Memcached', 'Upstash'],
  },

  // External
  payments: {
    id: 'payments',
    type: 'external' as NodeType,
    label: 'Payment Gateway',
    defaultTech: 'Stripe',
    techAlternatives: ['Paddle', 'LemonSqueezy'],
  },
  search: {
    id: 'search',
    type: 'external' as NodeType,
    label: 'Search Service',
    defaultTech: 'Meilisearch',
    techAlternatives: ['Algolia', 'Typesense'],
  },
  email: {
    id: 'email',
    type: 'external' as NodeType,
    label: 'Email Service',
    defaultTech: 'Resend',
    techAlternatives: ['SendGrid', 'Postmark'],
  },
  pushNotifications: {
    id: 'push-notifications',
    type: 'external' as NodeType,
    label: 'Push Service',
    defaultTech: 'Firebase FCM',
    techAlternatives: ['OneSignal', 'Expo Push'],
  },
  analytics: {
    id: 'analytics',
    type: 'external' as NodeType,
    label: 'Analytics',
    defaultTech: 'PostHog',
    techAlternatives: ['Mixpanel', 'Amplitude'],
  },

  // Background
  backgroundJobs: {
    id: 'background-jobs',
    type: 'background' as NodeType,
    label: 'Job Queue',
    defaultTech: 'BullMQ',
    techAlternatives: ['Inngest', 'Temporal'],
  },
} satisfies Record<string, ComponentDefinition>

// ============================================================================
// ARCHETYPE CONFIGURATIONS
// ============================================================================

export const ARCHETYPE_CONFIGS: ArchetypeConfig[] = [
  {
    id: 'saas',
    label: 'SaaS',
    description: 'Users pay monthly or yearly for a service',
    platform: 'web',
    badge: 'Most popular',
    components: [
      COMPONENTS.frontend,
      COMPONENTS.api,
      COMPONENTS.auth,
      COMPONENTS.database,
      COMPONENTS.payments,
    ],
  },
  {
    id: 'marketplace',
    label: 'Marketplace',
    description: 'Buyers and sellers trade through your platform',
    platform: 'web',
    components: [
      COMPONENTS.frontend,
      COMPONENTS.api,
      COMPONENTS.auth,
      COMPONENTS.database,
      COMPONENTS.payments,
      COMPONENTS.search,
    ],
  },
  {
    id: 'content',
    label: 'Content Platform',
    description: 'You publish, readers discover',
    platform: 'web',
    components: [
      COMPONENTS.frontend,
      COMPONENTS.api,
      COMPONENTS.database,
      COMPONENTS.fileStorage,
      COMPONENTS.search,
    ],
  },
  {
    id: 'devtool',
    label: 'Developer Tool',
    description: 'Developers integrate your service into their apps',
    platform: 'web',
    components: [COMPONENTS.api, COMPONENTS.auth, COMPONENTS.webhooks],
  },
  {
    id: 'mobile',
    label: 'Mobile App',
    description: 'Native iOS/Android with backend services',
    platform: 'mobile',
    components: [
      COMPONENTS.api,
      COMPONENTS.auth,
      COMPONENTS.database,
      COMPONENTS.pushNotifications,
    ],
  },
  {
    id: 'custom',
    label: 'Something Else',
    description: 'Start with a blank canvas',
    platform: 'web',
    components: [],
  },
]

// ============================================================================
// FULL COMPONENT LIBRARY (for Step 2 additions)
// ============================================================================

export const ALL_COMPONENTS: ComponentDefinition[] = Object.values(COMPONENTS)

// ============================================================================
// CATEGORY DEFINITIONS (for Step 2 grouping)
// ============================================================================

export type CategoryConfig = {
  id: string
  label: string
  tooltip: string
  componentIds: string[]
}

export const CATEGORY_CONFIGS: CategoryConfig[] = [
  {
    id: 'data',
    label: 'Data & Storage',
    tooltip: 'Where your app saves information — user data, files, etc.',
    componentIds: ['database', 'file-storage', 'cache', 'search'],
  },
  {
    id: 'auth',
    label: 'User Accounts',
    tooltip: 'How people sign up, log in, and what they\'re allowed to do',
    componentIds: ['auth'],
  },
  {
    id: 'integration',
    label: 'External Services',
    tooltip: 'Connecting to other services like payments, email, or notifications',
    componentIds: ['payments', 'email', 'push-notifications', 'analytics'],
  },
  {
    id: 'infra',
    label: 'Core Infrastructure',
    tooltip: 'Your app\'s main parts — the website, the server, background tasks',
    componentIds: ['frontend', 'api', 'webhooks', 'background-jobs'],
  },
]

// ============================================================================
// HELPERS
// ============================================================================

export function getArchetypeConfig(archetype: Archetype): ArchetypeConfig | undefined {
  return ARCHETYPE_CONFIGS.find((c) => c.id === archetype)
}

export function getComponentById(id: string): ComponentDefinition | undefined {
  return ALL_COMPONENTS.find((c) => c.id === id)
}

export function getDefaultComponentsForArchetype(archetype: Archetype): ComponentDefinition[] {
  return getArchetypeConfig(archetype)?.components ?? []
}

export function getPlatformForArchetype(archetype: Archetype): Platform {
  return getArchetypeConfig(archetype)?.platform ?? 'web'
}
