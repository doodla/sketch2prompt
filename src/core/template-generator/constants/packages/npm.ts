/**
 * npm Registry Packages
 *
 * All known packages from the npm registry.
 * Versions verified as of 2025-12-22.
 *
 * Registry URL: https://www.npmjs.com/package/{name}
 */

import type { PackageCollection } from './types'

export const NPM_PACKAGES: PackageCollection = {
  // ============================================================================
  // LANGUAGES
  // ============================================================================
  TypeScript: [
    {
      name: 'typescript',
      version: '^5.9.0',
      purpose: 'TypeScript compiler',
      docs: 'https://www.typescriptlang.org/docs',
      registry: 'npm',
    },
  ],
  JavaScript: [
    {
      name: 'node',
      version: '>=22.0.0',
      purpose: 'Node.js runtime (LTS)',
      docs: 'https://nodejs.org/docs/latest-v22.x/api/',
      registry: 'npm',
    },
  ],

  // ============================================================================
  // FRONTEND FRAMEWORKS
  // ============================================================================
  'Next.js': [
    {
      name: 'next',
      version: '^16.1.1',
      purpose: 'React framework for production',
      docs: 'https://nextjs.org/docs',
      registry: 'npm',
    },
    {
      name: 'react',
      version: '^19.2.3',
      purpose: 'React library',
      docs: 'https://react.dev',
      registry: 'npm',
      isCompanion: true,
    },
  ],
  'React (Vite)': [
    {
      name: 'react',
      version: '^19.2.3',
      purpose: 'React library',
      docs: 'https://react.dev',
      registry: 'npm',
    },
    {
      name: 'vite',
      version: '^7.3.0',
      purpose: 'Build tool',
      docs: 'https://vitejs.dev',
      registry: 'npm',
      isCompanion: true,
    },
  ],
  'Vue 3': [
    {
      name: 'vue',
      version: '^3.5.0',
      purpose: 'Vue.js framework',
      docs: 'https://vuejs.org',
      registry: 'npm',
    },
  ],
  Angular: [
    {
      name: '@angular/core',
      version: '^21.0.6',
      purpose: 'Angular framework',
      docs: 'https://angular.dev',
      registry: 'npm',
    },
  ],
  SvelteKit: [
    {
      name: '@sveltejs/kit',
      version: '^2.49.2',
      purpose: 'SvelteKit framework',
      docs: 'https://kit.svelte.dev',
      registry: 'npm',
    },
    {
      name: 'svelte',
      version: '^5.46.0',
      purpose: 'Svelte compiler',
      docs: 'https://svelte.dev',
      registry: 'npm',
      isCompanion: true,
    },
  ],

  // ============================================================================
  // BACKEND FRAMEWORKS
  // ============================================================================
  Express: [
    {
      name: 'express',
      version: '^5.2.1',
      purpose: 'Node.js web framework',
      docs: 'https://expressjs.com',
      registry: 'npm',
    },
  ],
  Hono: [
    {
      name: 'hono',
      version: '^4.11.1',
      purpose: 'Lightweight web framework',
      docs: 'https://hono.dev',
      registry: 'npm',
    },
  ],

  // ============================================================================
  // DESKTOP FRAMEWORKS
  // ============================================================================
  Electron: [
    {
      name: 'electron',
      version: '^39.2.7',
      purpose: 'Desktop app framework',
      docs: 'https://electronjs.org',
      registry: 'npm',
    },
  ],
  Tauri: [
    {
      name: '@tauri-apps/api',
      version: '^2.9.1',
      purpose: 'Tauri frontend bindings',
      docs: 'https://tauri.app',
      registry: 'npm',
    },
  ],

  // ============================================================================
  // DATABASES
  // ============================================================================
  PostgreSQL: [
    {
      name: 'pg',
      version: '^8.16.3',
      purpose: 'PostgreSQL client for Node.js',
      docs: 'https://node-postgres.com',
      registry: 'npm',
    },
  ],
  MySQL: [
    {
      name: 'mysql2',
      version: '^3.16.0',
      purpose: 'MySQL client for Node.js',
      docs: 'https://sidorares.github.io/node-mysql2',
      registry: 'npm',
    },
  ],
  Supabase: [
    {
      name: '@supabase/supabase-js',
      version: '^2.89.0',
      purpose: 'Supabase client',
      docs: 'https://supabase.com/docs',
      registry: 'npm',
    },
  ],
  SQLite: [
    {
      name: 'better-sqlite3',
      version: '^11.7.0',
      purpose: 'SQLite for Node.js',
      docs: 'https://github.com/WiseLibs/better-sqlite3',
      registry: 'npm',
    },
  ],
  MongoDB: [
    {
      name: 'mongodb',
      version: '^7.0.0',
      purpose: 'MongoDB driver for Node.js',
      docs: 'https://mongodb.github.io/node-mongodb-native/',
      registry: 'npm',
    },
  ],

  // ============================================================================
  // AI PROVIDERS
  // ============================================================================
  OpenAI: [
    {
      name: 'openai',
      version: '^4.77.0',
      purpose: 'OpenAI API client',
      docs: 'https://platform.openai.com/docs',
      registry: 'npm',
    },
  ],
  Anthropic: [
    {
      name: '@anthropic-ai/sdk',
      version: '^0.71.2',
      purpose: 'Anthropic API client',
      docs: 'https://docs.anthropic.com',
      registry: 'npm',
    },
  ],
  'Google AI (Gemini)': [
    {
      name: '@google/genai',
      version: '^1.34.0',
      purpose: 'Google Generative AI client',
      docs: 'https://ai.google.dev',
      registry: 'npm',
    },
  ],

  // ============================================================================
  // AUTH PROVIDERS
  // ============================================================================
  'Supabase Auth': [
    {
      name: '@supabase/supabase-js',
      version: '^2.89.0',
      purpose: 'Supabase client with auth',
      docs: 'https://supabase.com/docs/reference/javascript/auth-api',
      registry: 'npm',
    },
  ],
  Clerk: [
    {
      name: '@clerk/nextjs',
      version: '^6.36.4',
      purpose: 'Clerk auth for Next.js',
      docs: 'https://clerk.com/docs',
      registry: 'npm',
    },
  ],
  Auth0: [
    {
      name: '@auth0/nextjs-auth0',
      version: '^4.13.3',
      purpose: 'Auth0 SDK for Next.js',
      docs: 'https://auth0.com/docs',
      registry: 'npm',
    },
  ],
  NextAuth: [
    {
      name: 'next-auth',
      version: '^4.24.13',
      purpose: 'Auth for Next.js',
      docs: 'https://next-auth.js.org',
      registry: 'npm',
    },
  ],

  // ============================================================================
  // FILE STORAGE
  // ============================================================================
  'Supabase Storage': [
    {
      name: '@supabase/supabase-js',
      version: '^2.89.0',
      purpose: 'Supabase client with storage',
      docs: 'https://supabase.com/docs/reference/javascript/storage-api',
      registry: 'npm',
    },
  ],
  'AWS S3': [
    {
      name: '@aws-sdk/client-s3',
      version: '^3.730.0',
      purpose: 'AWS S3 client',
      docs: 'https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/',
      registry: 'npm',
    },
  ],
  'Cloudflare R2': [
    {
      name: '@aws-sdk/client-s3',
      version: '^3.730.0',
      purpose: 'S3-compatible client for R2',
      docs: 'https://developers.cloudflare.com/r2/',
      registry: 'npm',
    },
  ],

  // ============================================================================
  // VECTOR STORES
  // ============================================================================
  'Pinecone-npm': [
    {
      name: '@pinecone-database/pinecone',
      version: '^6.1.1',
      purpose: 'Pinecone vector database client for Node.js',
      docs: 'https://docs.pinecone.io',
      registry: 'npm',
    },
  ],
  'Qdrant-npm': [
    {
      name: '@qdrant/js-client-rest',
      version: '^1.16.2',
      purpose: 'Qdrant vector database client for Node.js',
      docs: 'https://qdrant.tech/documentation',
      registry: 'npm',
    },
  ],

  // ============================================================================
  // BACKGROUND JOBS
  // ============================================================================
  Inngest: [
    {
      name: 'inngest',
      version: '^3.48.0',
      purpose: 'Background jobs and workflows',
      docs: 'https://www.inngest.com/docs',
      registry: 'npm',
    },
  ],
  BullMQ: [
    {
      name: 'bullmq',
      version: '^5.66.1',
      purpose: 'Redis-backed job queue',
      docs: 'https://docs.bullmq.io',
      registry: 'npm',
    },
  ],
  'Trigger.dev': [
    {
      name: '@trigger.dev/sdk',
      version: '^4.0.4',
      purpose: 'Background jobs platform',
      docs: 'https://trigger.dev/docs',
      registry: 'npm',
    },
  ],

  // ============================================================================
  // EXTERNAL APIs
  // ============================================================================
  'REST APIs': [
    {
      name: 'axios',
      version: '^1.7.0',
      purpose: 'HTTP client',
      docs: 'https://axios-http.com',
      registry: 'npm',
    },
  ],
  GraphQL: [
    {
      name: '@apollo/client',
      version: '^3.12.0',
      purpose: 'GraphQL client',
      docs: 'https://www.apollographql.com/docs/react/',
      registry: 'npm',
    },
  ],
  Webhooks: [
    {
      name: 'svix',
      version: '^1.58.0',
      purpose: 'Webhook infrastructure',
      docs: 'https://docs.svix.com',
      registry: 'npm',
    },
  ],

  // ============================================================================
  // ORM / UTILITIES
  // ============================================================================
  prisma: [
    {
      name: 'prisma',
      version: '^7.2.1',
      purpose: 'TypeScript ORM',
      docs: 'https://www.prisma.io/docs',
      registry: 'npm',
    },
  ],
  drizzle: [
    {
      name: 'drizzle-orm',
      version: '^0.45.0',
      purpose: 'TypeScript ORM',
      docs: 'https://orm.drizzle.team',
      registry: 'npm',
    },
  ],
}
