# Agent Protocol

## 1. Core Principle
- This system has rules. The agent must execute strictly within them.
- Before any action, read PROJECT_RULES.md end-to-end to understand constraints, naming, component boundaries, and security expectations.
- Load only the active component specification for the current task. Do not load or modify other components unless the active scope explicitly requires it.

## 2. Status Tracking (MANDATORY)
- Status tracking is mandatory for every work session and change.
- Use a single project-wide status file: STATUS.md.
- Recommended structure:
  - Current Phase
  - Active Component
  - Current Milestone
  - Progress (what’s done since last update)
  - Blockers (decisions, dependencies, access, failing tests)
  - Last Updated (UTC timestamp)
- Rules:
  - Create STATUS.md on the first task.
  - Update STATUS.md after each feature or milestone is completed.
  - Update STATUS.md immediately when switching the active component.
  - Update STATUS.md whenever blocked or unblocked.
  - Read STATUS.md at the start of every session and align your plan accordingly.

## 3. Workflow Guidance
- Index: Collect facts. Read PROJECT_RULES.md, STATUS.md, and the active component spec. Identify inputs/outputs, constraints, and dependencies.
- Plan: Outline the smallest deliverable increments. Define milestones, interfaces, and tests. Confirm scope.
- Implement: Write minimally sufficient code to meet the plan, with tests. Use existing utilities before adding new packages.
- Verify: Run tests, lint, type-check, and manually validate acceptance criteria. Update STATUS.md with outcomes and next steps.
- After each phase, update STATUS.md.

## 4. Scope Discipline
- ALWAYS:
  - Validate inputs at system boundaries (API, message handlers, queue consumers, job inputs).
  - Use environment variables for secrets and configuration (no in-code secrets).
  - Apply least privilege for API keys, DB roles, and service accounts.
  - Write or update tests for core paths when changing logic or interfaces.
  - Update STATUS.md after every milestone with progress and blockers.
  - Log decisions and trade-offs briefly in STATUS.md (Decision, Rationale, Impact).
- NEVER:
  - Store secrets in code or version control.
  - Trust client-side validation alone; always re-validate on the server.
  - Add enterprise patterns (CQRS, hexagonal layers, DDD aggregates) without explicit request.
  - Expand scope or add features not required by the active component spec.
  - Push schema migrations or destructive changes without backup/roll-forward plan.
  - Silence errors or ignore failing tests to “move fast.”
- PREFER:
  - Standard library over third-party library.
  - Small, pure functions over large classes.
  - Composition over inheritance.
  - Incremental delivery over big-bang releases.
  - Plain, typed JSON APIs over custom protocols.

## 5. Library Policy
- Search before building: prefer existing utilities in the current codebase, then existing project dependencies, then external packages.
- Order of use:
  1) Current codebase utilities/helpers
  2) Project-declared dependencies
  3) New external packages (only with justification and minimal footprint)
- Good use cases for established libraries:
  - HTTP servers, routing, and middleware
  - OpenAI API clients and streaming helpers
  - Vector databases (e.g., Pinecone) and data clients (e.g., Supabase)
  - Authentication, authorization, and session management
  - Structured logging, metrics, and tracing
  - Schema validation and serialization (e.g., Pydantic, Zod)
  - Job queues and caching
- When custom code is acceptable:
  - Thin wrappers to unify interfaces or add cross-cutting concerns
  - Business logic specific to the app
  - Glue code to connect components minimally
  - Performance-critical paths with measured justification
- MINIMALISM MANDATE (NON-NEGOTIABLE):
  - Start with the simplest architecture that could work.
  - Add complexity ONLY when scaling actually demands it.
  - No enterprise patterns without explicit user request.
  - Prefer stdlib over library, library over framework, simple over clever.
  - Three similar lines of code beats one premature abstraction.
  - If in doubt, leave it out.

## 6. Code Standards
- Language rules (apply where applicable):

| Stack       | Rules                                                                                                                                                 |
|-------------|-------------------------------------------------------------------------------------------------------------------------------------------------------|
| Python      | PEP 8 strict: snake_case functions/vars, PascalCase classes, 4-space indent, max 88 chars/line, type hints required. Use mypy on CI. No wildcard imports. Explicit __all__. Docstrings for public funcs. |
| TypeScript  | ESLint strict: no any, no enums (use const objects), explicit return types, 2-space indent. Strict mode on. No implicit any. Prefer unknown over any. No default exports for shared modules. |
| Go          | gofmt mandatory, golint, explicit error handling, no naked returns. Keep packages small, avoid global state, return wrapped errors with context.      |

- Modularity Rules (HARD LIMITS):
  - Functions: max 50 lines each.
  - Files: target max 300 lines (hard limit 500).
  - Nesting: max 3 levels (if deeper, refactor).
- General Principles:
  - Explicit over implicit; clear naming over brevity.
  - Composition over inheritance.
  - Fail fast with actionable error messages.
  - Prefer pure functions and deterministic behavior.
  - No premature abstraction; extract only after repetition is proven.