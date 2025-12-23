# RAG Chat App - System Rules

## 1. System Overview

- Project: RAG Chat App
- Type: Full-stack application (monolith)
- Stack: React (Vite) for Web App, Python FastAPI for Backend, Supabase for Database, Vector Store for embeddings
- Verified packages:
  - react@^19.2.3
  - vite@^7.3.0
  - python@>=3.12
  - fastapi@>=0.125.0
  - uvicorn@>=0.40.0
  - supabase@>=2.27.0

System description:
A minimal full-stack template that serves a React SPA from a Vite build and a FastAPI backend exposing REST endpoints. Data is persisted in Supabase; a Vector Store is used for embeddings/semantic operations invoked by the backend only.

Boundaries
- This system IS:
  - A single-repo, single-backend (FastAPI + Uvicorn) application serving a REST API to a React web app
  - Backed by Supabase as the database layer and a Vector Store for embeddings and similarity search
  - Designed for minimal configuration with environment-driven settings and structured logging
- This system IS NOT:
  - A microservices, event-driven, or queue-based architecture
  - A server-rendered app (no Next.js/SSR) or a real-time system by default
  - A place to hardcode credentials, secrets, or environment-specific values
  - An enterprise-scale solution with CQRS, message brokers, or service meshes unless explicitly requested

## 2. Component Registry

| ID | Component | Type | Spec File | Status |
|----|-----------|------|-----------|--------|
| node_YT9BDlvVE1 | Web App | frontend | `specs/web-app.yaml` | active |
| node_IGpBRDK8v5 | Backend | backend | `specs/backend.yaml` | active |
| node_xlpUZBm02F | Database | storage | `specs/database.yaml` | active |
| node_sicFMoQ5zO | Vector Store | storage | `specs/vector-store.yaml` | active |

Loading Instructions
- Load component specs only when working on that component. Do not preload all specs.

## 3. Architecture Constraints

ALWAYS (Required)
- Validate all inputs at system boundaries (HTTP requests, environment variables, DB payloads, vector-store inputs/outputs)
- Use environment variables for configuration (never hardcode secrets)
- Log structured errors (timestamp, level, message, context) and avoid leaking sensitive data
- Define explicit request/response schemas (Pydantic) for every API route and validate on parse
- Prefer async I/O end-to-end (FastAPI + Uvicorn), and isolate blocking work to background tasks
- Enforce least-privilege credentials for Supabase and restrict Vector Store access to the backend only

NEVER (Forbidden)
- Store secrets in code or version control
- Trust client-side validation alone
- Add enterprise patterns without explicit request (message queues, microservices, CQRS)
- Install dependencies without checking stdlib/existing deps first
- Expose raw database or vector-store credentials to the frontend
- Block the event loop with CPU-bound tasks in request handlers

PREFER (Encouraged)
- Simplicity over abstraction — delay complexity until scaling demands it
- Typed contracts over ad-hoc dicts — stronger guarantees and safer refactors
- RESTful resource modeling over one-off RPC endpoints — consistency and predictability
- Centralized validation and error handling over scattered try/except — uniform behavior
- Async I/O for network-bound tasks over threads — resource efficiency

## 4. Code Standards

Naming Conventions (ENFORCED)
- TypeScript (Web App):
  - Files: kebab-case.ts for utilities; PascalCase.tsx for React components
  - Functions/variables: camelCase
  - Constants: SCREAMING_SNAKE_CASE
- Python (Backend):
  - Files: snake_case.py
  - Functions/variables: snake_case
  - Classes: PascalCase

Modularity Rules (HARD LIMITS)
| Limit | Maximum |
|-------|---------|
| Function length | 50 lines |
| File length | 300 lines (absolute hard limit 500) |
| Nesting depth | 3 levels |
| Function parameters | 4 parameters |

File Organization
- Repository root
  - /web-app
    - /src
      - /assets
      - /components
      - /pages
      - /hooks
      - /lib
      - /services (API client, typed endpoints)
      - /styles
      - /types (generated or shared contracts)
    - index.html
    - vite.config.ts
    - tsconfig.json (strict mode enabled)
    - .env.example (document required env vars)
  - /backend
    - /app
      - main.py (FastAPI app/bootstrap)
      - /api
        - /routes (routers/endpoints)
        - /deps (dependencies: auth, db clients)
      - /models (Pydantic schemas)
      - /services (domain logic)
      - /db (Supabase client init, data access)
      - /vector (vector store client and embeddings utilities)
      - /core (config, logging, settings)
    - tests/ (unit/integration tests)
    - .env.example (document required env vars)
  - /shared
    - /schemas (canonical JSON Schemas or shared contract files)
    - /types (derived TS types for frontend, docs for backend models)
  - /specs
    - web-app.yaml
    - backend.yaml
    - database.yaml
    - vector-store.yaml
  - README.md

Required Patterns
- TypeScript (React + Vite):
  - Enable strict mode in tsconfig; no use of any (use unknown with type narrowing)
  - No enums; prefer union types or const objects
  - Explicit return types on exported functions and components
  - Functional components and hooks only; avoid class components
  - Keep side effects in useEffect/useMutation; avoid side effects in render
- Python (FastAPI):
  - Type hints required; mypy-compatible annotations for public code
  - Docstrings on public functions/classes; include param and return descriptions
  - Zero warnings policy in CI (lint/type checks/tests must pass)
  - Pydantic models for all request/response bodies; never accept untyped dicts
  - Central exception handlers for domain and HTTP errors; consistent problem details

Dependencies Policy
- Search the standard library and existing repo packages before adding new dependencies
- Verify package maintenance (release cadence, open issues, security posture) before adoption
- Consider bundle size and tree-shaking for frontend packages; prefer lightweight, ESM-friendly libs
- Pin or range-lock versions consistent with VERIFIED PACKAGES; do not deviate for core stack items
- NEVER install from GitHub main or unreleased branches; use published versions only
- Remove unused dependencies promptly to keep the attack surface and bundle size small

## 5. Build Order

Implementation sequence based on dependency graph:

### Phase 1: Foundation
- [ ] [node_xlpUZBm02F] Database — Schema and data layer first (everything depends on data)
- [ ] [node_sicFMoQ5zO] Vector Store — Schema and data layer first (everything depends on data)

### Phase 2: Core Features
- [ ] [node_IGpBRDK8v5] Backend — Business logic and data access
- [ ] [node_YT9BDlvVE1] Web App — UI consuming the backend services

## 6. Integration Rules

### Communication Patterns

| From | To | Pattern | Notes |
|------|----|---------| ------|
| Web App | Backend | HTTP/REST API | API calls |
| Backend | Vector Store | ORM/Query Builder | embeddings |
| Backend | Database | ORM/Query Builder | queries |

### Shared Contracts

API response types and shared data structures should be defined in a central types location. Both frontend and backend should reference these types.

Implementation notes:
- Prefer a single canonical contract source (e.g., JSON Schema/OpenAPI) and derive both TS types (frontend) and Pydantic models (backend) from it or keep them manually in sync
- Version API endpoints and schemas; breaking changes require a new version path and contract update
- Validate responses in development to catch drift between code and contracts

### Forbidden Integrations

- Frontend components MUST NOT directly access storage — all data through backend APIs
- External services MUST NOT be called directly from frontend — proxy through backend for security

Operational integration guidelines:
- CORS: restrict to known origins during production; allow localhost during development
- Auth: handle tokens/cookies on the backend; never expose service-role keys in the browser
- Env vars: document required variables (.env.example) such as API_BASE_URL, SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY (backend only), VECTOR_STORE_URL/KEY
- Logging: emit structured JSON logs from the backend with correlation IDs; propagate request IDs from client to backend for traceability
- Error contracts: standardize error response shape (status, code, message, details) and handle gracefully in the Web App

ARCHITECTURE PHILOSOPHY (CRITICAL):
- Build MINIMALLY — only add what's needed NOW, scale when actually necessary
- NO enterprise patterns (message queues, microservices, CQRS) unless user explicitly requested them
- Start with the simplest working solution (SQLite before PostgreSQL clusters, monolith before microservices)
- Avoid premature abstraction — three similar lines is better than one premature helper
- If the user didn't specify a technology choice, prefer lightweight defaults over enterprise options