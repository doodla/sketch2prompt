/**
 * PyPI Registry Packages
 *
 * All known packages from the Python Package Index.
 * Versions verified as of 2025-12-22.
 *
 * Registry URL: https://pypi.org/project/{name}/
 */

import type { PackageCollection } from './types'

export const PYPI_PACKAGES: PackageCollection = {
  // ============================================================================
  // LANGUAGES
  // ============================================================================
  Python: [
    {
      name: 'python',
      version: '>=3.12',
      purpose: 'Python runtime',
      docs: 'https://docs.python.org/3/',
      registry: 'pypi',
    },
  ],

  // ============================================================================
  // BACKEND FRAMEWORKS
  // ============================================================================
  FastAPI: [
    {
      name: 'fastapi',
      version: '>=0.125.0',
      purpose: 'Python web framework',
      docs: 'https://fastapi.tiangolo.com',
      registry: 'pypi',
    },
    {
      name: 'uvicorn',
      version: '>=0.40.0',
      purpose: 'ASGI server (required runtime)',
      docs: 'https://www.uvicorn.org',
      registry: 'pypi',
      isCompanion: true,
    },
  ],
  Django: [
    {
      name: 'django',
      version: '>=6.0',
      purpose: 'Python web framework',
      docs: 'https://docs.djangoproject.com',
      registry: 'pypi',
    },
  ],

  // ============================================================================
  // DATABASES
  // ============================================================================
  'PostgreSQL-python': [
    {
      name: 'psycopg2-binary',
      version: '>=2.9.11',
      purpose: 'PostgreSQL adapter for Python',
      docs: 'https://www.psycopg.org',
      registry: 'pypi',
    },
  ],
  'MySQL-python': [
    {
      name: 'pymysql',
      version: '>=1.1.0',
      purpose: 'MySQL client for Python',
      docs: 'https://pymysql.readthedocs.io',
      registry: 'pypi',
    },
  ],
  'Supabase-python': [
    {
      name: 'supabase',
      version: '>=2.27.0',
      purpose: 'Supabase client for Python',
      docs: 'https://supabase.com/docs/reference/python',
      registry: 'pypi',
    },
  ],
  'SQLite-python': [
    {
      name: 'sqlite3',
      version: 'stdlib',
      purpose: 'SQLite (Python stdlib)',
      docs: 'https://docs.python.org/3/library/sqlite3.html',
      registry: 'pypi',
    },
  ],
  'MongoDB-python': [
    {
      name: 'pymongo',
      version: '>=4.15.5',
      purpose: 'MongoDB driver for Python',
      docs: 'https://pymongo.readthedocs.io',
      registry: 'pypi',
    },
  ],

  // ============================================================================
  // AI PROVIDERS
  // ============================================================================
  'OpenAI-python': [
    {
      name: 'openai',
      version: '>=2.14.0',
      purpose: 'OpenAI API client',
      docs: 'https://platform.openai.com/docs',
      registry: 'pypi',
    },
  ],
  'Anthropic-python': [
    {
      name: 'anthropic',
      version: '>=0.75.0',
      purpose: 'Anthropic Claude API client',
      docs: 'https://docs.anthropic.com',
      registry: 'pypi',
    },
  ],
  'Google AI (Gemini)-python': [
    {
      name: 'google-generativeai',
      version: '>=0.8.6',
      purpose: 'Google Generative AI client (deprecated - migrate to google-genai)',
      docs: 'https://ai.google.dev',
      registry: 'pypi',
    },
  ],
  'Ollama (Local)': [
    {
      name: 'ollama',
      version: '>=0.6.0',
      purpose: 'Ollama local LLM client',
      docs: 'https://github.com/ollama/ollama-python',
      registry: 'pypi',
    },
  ],

  // ============================================================================
  // VECTOR STORES
  // ============================================================================
  pgvector: [
    {
      name: 'pgvector',
      version: '>=0.4.2',
      purpose: 'PostgreSQL vector extension',
      docs: 'https://github.com/pgvector/pgvector-python',
      registry: 'pypi',
    },
  ],
  Pinecone: [
    {
      name: 'pinecone',
      version: '^6.0.0',
      purpose: 'Pinecone vector database client',
      docs: 'https://docs.pinecone.io',
      registry: 'pypi',
    },
  ],
  Weaviate: [
    {
      name: 'weaviate-client',
      version: '>=4.19.0',
      purpose: 'Weaviate vector database client',
      docs: 'https://weaviate.io/developers/weaviate',
      registry: 'pypi',
    },
  ],
  Qdrant: [
    {
      name: 'qdrant-client',
      version: '>=1.16.2',
      purpose: 'Qdrant vector database client',
      docs: 'https://qdrant.tech/documentation',
      registry: 'pypi',
    },
  ],

  // ============================================================================
  // EXTERNAL APIs
  // ============================================================================
  'REST APIs-python': [
    {
      name: 'httpx',
      version: '>=0.28.0',
      purpose: 'HTTP client for Python',
      docs: 'https://www.python-httpx.org',
      registry: 'pypi',
    },
  ],

  // ============================================================================
  // ORM / UTILITIES
  // ============================================================================
  sqlalchemy: [
    {
      name: 'sqlalchemy',
      version: '>=2.0.45',
      purpose: 'Python ORM',
      docs: 'https://docs.sqlalchemy.org',
      registry: 'pypi',
    },
  ],
  pydantic: [
    {
      name: 'pydantic',
      version: '>=2.12.0',
      purpose: 'Data validation',
      docs: 'https://docs.pydantic.dev',
      registry: 'pypi',
    },
  ],
}
