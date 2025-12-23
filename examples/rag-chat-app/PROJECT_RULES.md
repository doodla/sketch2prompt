# rag-chat-app - System Rules

## 1. System Overview
- Project: rag-chat-app
- Type: Full-stack application
- Stack: React (Vite), Python 3.12+, FastAPI, Supabase, Pinecone, OpenAI; runtime via uvicorn; verified packages: react@^19.2.3, vite@^7.3.0, python@>=3.12, fastapi@>=0.125.0, uvicorn@>=0.40.0, supabase@>=2.27.0, pinecone@^6.0.0, openai@>=2.14.0

This system provides a Retrieval-Augmented Generation (RAG) chat interface. Users submit queries via a web app, the backend retrieves relevant context from Pinecone and Supabase, then calls OpenAI to generate grounded responses.

Boundaries
- This system IS:
  - A single-repo monolithic app with a React UI and a FastAPI backend.
  - A RAG pipeline: embedding storage in Pinecone, metadata and chat history in Supabase, and LLM generation via OpenAI.
  - An API-first design with the frontend consuming backend endpoints.

- This system IS NOT:
  - A microservices platform, event-driven system, or message-queue-based architecture.
  - A general document ingestion pipeline or ETL framework (ingestion is minimal and scoped).
  - A real-time streaming/voice system or an offline batch analytics platform.
  - A full identity/authorization provider; it uses standard auth from Supabase or simple JWT where required.

## 2. Component Registry
| ID | Component | Type | Spec File | Status |
|---|---|---|---|---|
| node_YT9BDlvVE1 | Web App | frontend | `specs/web-app.md` | active |
| node_IGpBRDK8v5 | Backend | backend | `specs/backend.md` | active |
| node_xlpUZBm02F | Database | storage | `specs/database.md` | active |
| node_sicFMoQ5zO | Vector Store | storage | `specs/vector-store.md` | active |
| node_LLM_API_001 | LLM API | external | `specs/llm-api.md` | active |

Loading Instructions
- Load component specs only when working on that component. Do not preload all specs.

## 3. Architecture Constraints
ALWAYS (Required)
- Validate all inputs at system boundaries (HTTP requests, DB writes, vector store ops, and LLM prompt assembly).
- Use environment variables for configuration (never hardcode secrets). Provide safe defaults and fail fast when required variables are missing.
- Log structured errors (timestamp, level, message, context). Capture correlation IDs per request for traceability.
- Return consistent API responses with typed error envelopes and HTTP status codes (4xx client issues, 5xx server issues).
- Enforce least privilege on keys and roles (Supabase service vs anon keys; Pinecone/OpenAI keys).
- Implement rate limiting and basic abuse protections where applicable (per-IP or per-user) at the backend.

NEVER (Forbidden)
- Store secrets in code or version control (no keys in source, logs, or client bundle).
- Trust client-side validation alone—always revalidate on the server.
- Add enterprise patterns without explicit request (message queues, microservices, CQRS).
- Install dependencies without checking stdlib/existing deps first or verifying maintenance and security.
- Expose raw LLM responses without safety filters/guardrails when needed (e.g., prompt injection checks).
- Disable type checks, linters, or tests to “unblock” builds.

PREFER (Encouraged)
- Simplicity over abstraction — delay complexity until scaling demands it.
- Monolith over distributed services — simpler deployment, fewer moving parts.
- Explicit schemas over implicit contracts — OpenAPI/JSON Schemas reduce drift.
- Dependency-free utilities over new packages — minimize attack surface and bundle size.
- Configuration via env vars over code constants — enables environment parity and secure rotation.

## 4. Code Standards
Naming Conventions (ENFORCED)
- TypeScript (frontend):
  - Files: utils/helpers as kebab-case.ts; React components as PascalCase.tsx; hooks as use-xxx.ts.
  - Functions/variables: camelCase; Components: PascalCase; Constants: SCREAMING_SNAKE_CASE.
- Python (backend):
  - Files: snake_case.py; Modules/packages: snake_case; Classes: PascalCase; Functions/vars: snake_case; Constants: SCREAMING_SNAKE_CASE.

Modularity Rules (HARD LIMITS)
| Rule | Limit |
|---|---|
| Function length | Max 50 lines |
| File length | Max 300 lines (hard limit 500) |
| Nesting depth | Max 3 levels |
| Parameters per function | Max 4 |

File Organization
- Root
  - specs/ (component specs)
  - apps/
    - web/ (React + Vite)
      - src/
        - app/ (routing, providers)
        - components/ (UI components, PascalCase)
        - features/ (feature slices: chat, auth, settings)
        - hooks/ (reusable hooks)
        - lib/ (utilities, API clients, schemas)
        - styles/ (global styles)
        - types/ (frontend-only TS types)
      - public/
      - index.html
      - vite.config.ts
    - backend/ (FastAPI)
      - app/
        - api/ (routers, DTOs)
        - core/ (config, logging, security)
        - services/ (business logic: rag, llm, embeddings)
        - repositories/ (data access: supabase, pinecone)
        - schemas/ (pydantic models)
        - workers/ (optional background tasks)
        - utils/ (helpers)
        - main.py (FastAPI entry)
      - tests/
    - shared/ (contracts shared across FE/BE)
      - schemas/ (JSON Schema/OpenAPI fragments)
      - messages/ (prompt templates, system messages)
      - types/ (generated TS from OpenAPI; Python models referencing same schema)
  - infra/ (optional deployment, docker, CI config)
  - .env.example (document required env vars)

Required Patterns
- TypeScript:
  - Enable strict mode; no use of any (use unknown or generics with narrowing).
  - No enums — prefer union string literals or as const objects for tree-shaking and safety.
  - Explicit return types for exported functions and hooks.
  - Prefer React Query/fetch wrappers with typed responses and error handling.
- Python:
  - Type hints required; mypy/pyright or equivalent checks enforced.
  - Docstrings on all public functions/classes; include type info and behavior notes.
  - Zero warnings policy in CI (flake8/ruff, mypy, pytest).
  - Pydantic models for request/response schemas; validate at router layer.
  - Async-first FastAPI endpoints where I/O-bound.

Dependencies Policy
- Search the codebase and stdlib before adding a dependency; avoid duplicates.
- Use verified packages as specified:
  - react@^19.2.3, vite@^7.3.0, python@>=3.12, fastapi@>=0.125.0, uvicorn@>=0.40.0, supabase@>=2.27.0, pinecone@^6.0.0, openai@>=2.14.0.
- Verify maintenance (recent commits, issues) and security posture before adoption.
- Check frontend bundle impact; prefer ESM and tree-shakeable packages.
- Pin versions with care; use caret/compatible ranges only where safe; NEVER install from GitHub main/HEAD.
- Remove unused packages promptly; justify any transitive peer dependencies.

## 5. Build Order
Implementation sequence based on dependency graph:

### Phase 1: Foundation
- [ ] [node_xlpUZBm02F] Database — Schema and data layer first (everything depends on data)
- [ ] [node_sicFMoQ5zO] Vector Store — Schema and data layer first (everything depends on data)

### Phase 2: Core Features
- [ ] [node_IGpBRDK8v5] Backend — Business logic and data access
- [ ] [node_YT9BDlvVE1] Web App — UI consuming the backend services

### Phase 3: Integration
- [ ] [node_LLM_API_001] LLM API — External integrations (can be added incrementally)

## 6. Integration Rules
### Communication Patterns

| From | To | Pattern | Notes |
|------|----|---------| ------|
| Web App | Backend | HTTP/REST API | API calls |
| Backend | Vector Store | ORM/Query Builder | embeddings |
| Backend | Database | ORM/Query Builder | queries |
| Backend | LLM API | API Client/SDK | prompts |

### Shared Contracts
API response types and shared data structures should be defined in a central types location. Both frontend and backend should reference these types.

Recommended shared contracts:
- OpenAPI spec generated from FastAPI as the source of truth.
- JSON Schemas for core entities (Message, Session, DocumentMetadata, RetrievalResult).
- TS types auto-generated from OpenAPI into apps/web/src/types; Python pydantic models in apps/backend/app/schemas align with the same schema.
- Version type changes (v1 -> v1.1) with backward compatibility where possible.

### Forbidden Integrations
- Frontend components MUST NOT directly access storage — all data through backend APIs
- External services MUST NOT be called directly from frontend — proxy through backend for security

Additional constraints:
- Do not embed service keys in frontend bundles; use backend-proxied tokens when absolutely necessary.
- Avoid cross-component tight coupling; interact through explicit interfaces and DTOs.

Environment and configuration (examples; do not hardcode):
- REQUIRED: OPENAI_API_KEY, PINECONE_API_KEY, SUPABASE_URL, SUPABASE_ANON_KEY or SERVICE_ROLE_KEY, DATABASE_URL (if used), RAG_INDEX_NAME, APP_BASE_URL, BACKEND_BASE_URL.
- Use separate .env files per environment; validate presence at startup and fail fast.

Security and privacy:
- Sanitize prompts and retrieved content (strip PII where required).
- Implement prompt injection mitigations (e.g., system instructions, context delimiters).
- Enforce CORS only for known origins; default deny.
- Apply auth to session/chat endpoints when user accounts are present.

Observability:
- Structured logs with request ID; capture latency for retrieval, LLM calls, and total response time.
- Emit metrics for cache hits, token usage, error rates, and timeouts.
- Centralize error handling with consistent error surface to clients.

Performance:
- Cache embeddings for identical content; deduplicate documents by hash.
- Batch vector operations where supported; set appropriate top_k and filters.
- Use streaming responses from OpenAI to improve perceived latency and stream to frontend when practical.

ARCHITECTURE PHILOSOPHY (CRITICAL):
- Build MINIMALLY — only add what's needed NOW, scale when actually necessary
- NO enterprise patterns (message queues, microservices, CQRS) unless user explicitly requested them
- Start with the simplest working solution (SQLite before PostgreSQL clusters, monolith before microservices)
- Avoid premature abstraction — three similar lines is better than one premature helper
- If the user didn't specify a technology choice, prefer lightweight defaults over enterprise options