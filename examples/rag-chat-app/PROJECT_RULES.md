# RAG Chat App - System Rules

> **Load this file FIRST** before any component specs.
> Component specs in `specs/*.md` extend these rules.

## System Overview

**Project**: RAG Chat App
**Type**: Full-stack web application
**Stack**: React/Vue/similar frontend + Node.js/Python/similar backend + Database, Vector Store

# AI: Add 2-3 sentence description based on components and their relationships.

### Boundaries

This system IS:
- A user-facing web application with interactive UI
- An API service handling business logic and data access
- A system with persistent data storage
- # AI: Add more explicit inclusions based on component analysis

This system IS NOT:
- A background job processing system (synchronous only)
- A system with extensive third-party integrations
- # AI: Add more explicit exclusions to prevent scope creep

---

## Component Registry

| ID | Component | Type | Spec File | Status |
|----|-----------|------|-----------|--------|
| node_YT9BDlvVE1 | Web App | frontend | `specs/web-app.md` | active |
| node_IGpBRDK8v5 | Backend | backend | `specs/backend.md` | active |
| node_xlpUZBm02F | Database | storage | `specs/database.md` | active |
| node_sicFMoQ5zO | Vector Store | storage | `specs/vector-store.md` | active |

### Loading Instructions

Load component specs **only when working on that component**. Do not preload all specs.

Cross-reference format: `[component-id]` (e.g., [node_YT9BDlvVE1] references Web App)

---

## Architecture Constraints

### ALWAYS (Required)

- Validate all inputs at system boundaries (API endpoints, form submissions)
- Use environment variables for all configuration (never hardcode secrets)
- Log structured data for all errors (timestamp, level, message, context)
- Sanitize all user inputs to prevent XSS attacks
- Use HTTPS only for API communications
- Validate ALL inputs with schema validation library
- Use parameterized queries to prevent SQL injection
- Encrypt sensitive columns at rest
- Use minimal privilege database users
- # AI: Add project-specific constraints based on domain requirements

### NEVER (Forbidden)

- Store secrets in code or version control
- Trust client-side validation alone (always re-validate server-side)
- Expose internal error details to clients (log internally, return safe messages)
- Add enterprise patterns without explicit user request (message queues, microservices, CQRS)
- Install dependencies without checking if stdlib or existing deps solve the problem
- Use 'any' type in TypeScript (use 'unknown' + type guards)
- Make direct database connections from frontend
- # AI: Add project-specific anti-patterns to avoid

### PREFER (Encouraged)

- Simplicity over abstraction — delay complexity until scaling demands it
- Composition over inheritance — easier to test and modify
- Named exports over default exports — better refactoring support
- Early returns over nested conditionals — clearer control flow
- Explicit dependencies over global imports — aids testing
- Three similar lines over one premature helper — wait for patterns to emerge
- # AI: Add project-specific best practices

---

## Code Standards

### Naming Conventions (ENFORCED)

**TypeScript/JavaScript:**
- Files: `kebab-case.ts` for utilities, `PascalCase.tsx` for components
- Functions: `camelCase` with verb prefix (`getUserById`, `validateEmail`)
- Constants: `SCREAMING_SNAKE_CASE` for true constants
- Types/Interfaces: `PascalCase` (`UserProfile`, `CreateOrderInput`)
- No abbreviations except: `id`, `url`, `api`, `db`

**Python (PEP 8 STRICT):**
- Files: `snake_case.py`
- Functions/Variables: `snake_case`
- Classes: `PascalCase`
- Constants: `SCREAMING_SNAKE_CASE`
- Private: single underscore prefix `_internal_method`


### Modularity Rules (HARD LIMITS)

| Metric | Limit | Action When Exceeded |
|--------|-------|---------------------|
| Function length | **50 lines max** | Extract helper functions |
| File length | **300 lines** (hard: 500) | Split into modules |
| Nesting depth | **3 levels max** | Use early returns, extract functions |
| Parameters | **4 max** | Use options object |
| Cyclomatic complexity | **10 max** | Simplify logic, extract branches |

### File Organization

```
/src
  /app          - Application shell, routing, providers
  /components   - Reusable UI components (no business logic)
  /features     - Feature modules (co-located components + hooks + utils)
  /services     - API clients, external service integrations
  /stores       - State management (Zustand/Redux slices)
  /types        - Shared TypeScript types
  /utils        - Pure utility functions
  /server       - Backend code (if monorepo)
```


### Required Patterns

**Frontend:**
- Components: Functional only, no class components
- State: Lift state up or use stores, no prop drilling >2 levels
- Effects: Cleanup subscriptions, cancel pending requests
- Error handling: Error boundaries at route level minimum

**Backend:**
- Controllers: Routing only, no business logic
- Services: All business logic, injectable dependencies
- Validation: At API boundary using schema validation (Zod, Pydantic)
- Errors: Structured error responses with codes and messages

**Python Specific:**
- Type hints: Required on all function signatures
- Docstrings: Required on public functions (Google style)
- Imports: stdlib → third-party → local (isort)
- Linting: ruff or flake8+black, zero warnings policy

**TypeScript Specific:**
- Strict mode: Enabled, no exceptions
- No `any`: Use `unknown` and narrow, or define proper types
- No enums: Use `as const` objects instead
- Explicit returns: All functions must declare return type


### Dependencies Policy

**Before adding ANY dependency:**
1. Check if functionality exists in stdlib or current deps
2. Verify package is actively maintained (commits in last 6 months)
3. Check bundle size impact (use bundlephobia.com)
4. Verify TypeScript types exist (@types/* or built-in)
5. Review security advisories (npm audit, snyk)

**NEVER:**
- Install from GitHub main branch
- Use packages with known vulnerabilities
- Add deps for trivial functionality (<20 lines of code)

---

## Build Order

Implementation sequence based on dependency graph:

### Phase 1: Foundation
Project setup, tooling, and dependencies

### Phase 2: Storage
- [ ] [node_xlpUZBm02F] Database — Schema and data models first (everything depends on data)
- [ ] [node_sicFMoQ5zO] Vector Store — Schema and data models first (everything depends on data)

### Phase 4: Backend
- [ ] [node_IGpBRDK8v5] Backend — Business logic and API endpoints

### Phase 5: Frontend
- [ ] [node_YT9BDlvVE1] Web App — UI consuming the backend API

### Phase 5: Polish
- [ ] Error handling standardization
- [ ] Performance optimization
- [ ] Monitoring and logging
- [ ] # AI: Add project-specific polish tasks

---

## Integration Rules

### Communication Patterns

| From | To | Pattern | Notes |
|------|----|---------|-------|
| Web App | Backend | HTTP REST/GraphQL | API calls |
| Backend | Vector Store | ORM/Query builder | embeddings |
| Backend | Database | ORM/Query builder | queries |

### Shared Contracts

Define shared types and API contracts in a central location (e.g., `/src/types/`).

### Forbidden Integrations

- Frontend MUST NOT directly access storage
- External services MUST be proxied through backend

---

## Status Tracking

Track implementation progress in a status file (e.g., `STATUS.md`).

See `AGENT_PROTOCOL.md` for:
- Required status tracking format
- Workflow guidance (Index → Plan → Implement → Verify)
- Scope discipline rules
- Library policy
