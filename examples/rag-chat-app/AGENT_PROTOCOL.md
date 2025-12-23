# Agent Protocol

## 1. Core Principle
- This system operates under explicit rules. The agent must execute strictly within them.
- Always read PROJECT_RULES.md fully before any work begins.
- Load only the active component specification before implementation. Do not load or reason about inactive components until a status switch is recorded.

## 2. Status Tracking (MANDATORY)
- Status tracking is mandatory for every session and change.
- Use a generic status file: STATUS.md.
- Recommended structure:
  - Current Phase
  - Active Component
  - Current Milestone
  - Progress (what’s done since last update)
  - Blockers (including external dependencies)
  - Last Updated (UTC timestamp)
- Rules:
  - Create STATUS.md on the first task.
  - Update after completing any feature or milestone.
  - Update when switching the active component.
  - Update immediately when blocked (note request, dependency, or decision needed).
  - Read STATUS.md at the start of every session and align work accordingly.

## 3. Workflow Guidance
- Index: Discover and index the repository, read PROJECT_RULES.md, and load only the active component spec. Record findings in STATUS.md.
- Plan: Define milestones, acceptance criteria, and minimal design. Confirm alignment with project rules and constraints. Update STATUS.md.
- Implement: Build incrementally with minimal complexity, validate at boundaries, and keep diffs small. Update STATUS.md after each milestone.
- Verify: Run checks/tests, validate acceptance criteria, and document outcomes/next steps. Update STATUS.md with results and any follow-ups.

## 4. Scope Discipline
- ALWAYS:
  - Validate inputs at system boundaries (API, CLI, queues, web forms).
  - Use environment variables for secrets and configuration; document required variables.
  - Update STATUS.md after every milestone and at phase transitions.
  - Implement explicit error handling with clear messages and no sensitive leakage.
  - Follow least-privilege principles for API keys and database access.
  - Keep changes minimal and reversible; prefer small PRs/commits tied to milestones.

- NEVER:
  - Store secrets in code, logs, or version control (including .env in VCS).
  - Trust client-side validation alone; always re-validate on the server.
  - Add enterprise patterns or heavy frameworks without explicit request.
  - Introduce global mutable state for cross-cutting concerns.
  - Exceed complexity limits (function/file size, nesting) to “get it done”.
  - Bypass or forget STATUS.md updates for any reason.

- PREFER:
  - Small, focused modules over large monoliths.
  - Configuration over code for environment differences.
  - Native/stdlib APIs over third-party packages.
  - Plain functions and composition over classes and inheritance.
  - Iterative delivery with clear acceptance criteria over big-bang releases.

## 5. Library Policy
- Search before building: reuse existing utilities before writing new code.
- Order of consideration:
  1) Current codebase utilities and patterns
  2) Existing project dependencies
  3) New external packages (only if value > cost and security/privacy acceptable)
- Appropriate use cases for established libraries:
  - HTTP clients, data validation/schemas, auth/OAuth flows, database clients/ORMs, date/time/uuid, structured logging, testing frameworks, and concurrency utilities.
- Custom code is acceptable when:
  - Functionality is simple, the dependency would be heavy, or security/supply-chain risk outweighs benefits.
  - Performance or footprint constraints demand bespoke solutions.
- MINIMALISM MANDATE (NON-NEGOTIABLE):
  - Start with the simplest architecture that could work.
  - Add complexity ONLY when real scaling demands it and after measurement.
  - No enterprise patterns without explicit user request.
  - Prefer stdlib over library, library over framework, simple over clever.
  - Three similar lines of code beats one premature abstraction.
  - If in doubt, leave it out.

## 6. Code Standards
- Stack Rules (detected: Python, TypeScript):

| Stack      | Standards |
|------------|-----------|
| Python     | PEP 8 strict; snake_case for functions/variables; PascalCase for classes; 4-space indentation; max 88 chars per line; type hints required (annotations on functions, variables where meaningful); black-compatible formatting; explicit imports; no wildcard imports; f-strings preferred; docstrings for public functions/classes; raise explicit exceptions; avoid mutable default args. |
| TypeScript | ESLint strict; no any (use generics/unknown/narrowing); no enums (use const objects/as const + union types); explicit return types for exported functions; 2-space indentation; strictNullChecks enabled; prefer readonly and immutability; no implicit any; narrow types via guards; avoid default exports in shared libs; path aliases documented; isolate side effects; prefer async/await with try/catch. |

- Modularity Rules (HARD LIMITS):
  - Functions: max 50 lines.
  - Files: target max 300 lines; hard limit 500 lines.
  - Nesting: max 3 levels of blocks (if/for/try).
  - Break apart or refactor when approaching limits; do not exceed hard limits.

- General Principles:
  - Explicit over implicit; readability first.
  - Composition over inheritance.
  - Fail fast with clear messages and typed errors.
  - Prefer pure functions and deterministic behavior.
  - No premature abstraction; extract only after proven repetition.
  - Small, testable units with clear inputs/outputs.

Reminder: Update STATUS.md after each phase and milestone, and before/after switching the active component.