# Agent Protocol

## Core Principle

The system you are building already has rules. Execute within those rules — do not invent new architecture.

Before ANY implementation:
1. Read `PROJECT_RULES.md` to understand system boundaries
2. Load ONLY the component spec you are currently implementing
3. Do not load other specs unless resolving an integration contract

---

## Status Tracking (MANDATORY)

`STATUS.md` tracks current phase, milestone, and progress.

**Update after every feature or milestone.** No exceptions.

```
# Project Status

## Current Phase
[Phase 1: Foundation | Phase 2: Core Features | Phase 3: Integration]

## Active Component
[component_id] [component_name]

## Current Milestone
[What you're working on]

## Progress
- [x] Completed items
- [ ] Remaining items

## Blockers
[Any blockers or decisions needed]

## Last Updated
[timestamp]
```

**Rules:**
- Create `STATUS.md` on first task if it doesn't exist
- Update after completing any feature or milestone
- Update when switching components
- Update when blocked
- Read on session start to restore context

---

## Workflow Guidance

Recommended phases for non-trivial tasks:

1. **Index** — Map files and dependencies in scope. Indexing only — no suggestions or fixes.
2. **Plan** — Produce implementation plan. Research latest stable versions for new deps. Flag decisions needing input.
3. **Implement** — Follow the plan. Work in logical increments.
4. **Verify** — Check exit criteria. Update STATUS.md.

---

## Scope Discipline

### ALWAYS
- Implement what the spec defines
- Flag gaps or ambiguities before filling them
- Use baseline deps from spec as version anchors
- Follow code standards from `PROJECT_RULES.md`
- Verify exit criteria before marking component complete
- **Update `STATUS.md` after every feature/milestone**

### NEVER
- Add features not in the spec
- Refactor adjacent components unprompted
- Upgrade deps beyond stable versions in spec
- Create abstractions for hypothetical future requirements
- Proceed to next component before current passes verification

### PREFER
- Established libraries over custom implementations
- Explicit over implicit
- Composition over inheritance
- Failing fast over silent degradation
- Asking over assuming when spec is ambiguous

---

## Library Policy

**Search before building.** Check in order:
1. Current codebase utilities
2. Project dependencies
3. Well-maintained packages (PyPI, npm, etc.)

Use established libraries for: parsing, validation, date/time, HTTP clients, file formats.

Custom code only when no suitable library exists or you've flagged it and user approved.

---

## Minimalism Mandate (NON-NEGOTIABLE)

**Start simple. Scale when necessary. Not before.**

### ALWAYS
- Begin with the simplest architecture that could work
- Prefer stdlib over library, library over framework
- Use lightweight solutions (SQLite before PostgreSQL clusters, monolith before microservices)
- Write three similar lines before extracting a helper
- Question every dependency: "Do I actually need this?"

### NEVER add without explicit user request
- Message queues (Redis queues, RabbitMQ, SQS)
- Microservices or service mesh
- CQRS or event sourcing
- Kubernetes or container orchestration
- GraphQL when REST suffices
- State management libraries when React state works
- ORMs when raw queries are simpler

### WHY THIS MATTERS
Premature complexity is the #1 cause of project failure. Every abstraction has a cost. Every dependency is a liability. Every service boundary is a failure point.

**If the user didn't ask for it, don't add it.**

---

## Code Standards

Apply dynamically based on `tech_stack.primary`:

| Stack | Standards |
|-------|-----------|
| FastAPI | PEP 8 strict: snake_case functions/vars, PascalCase classes, 4-space indent, max 88 chars/line, type hints required |
| Python | PEP 8 strict: snake_case functions/vars, PascalCase classes, 4-space indent, max 88 chars/line, type hints required |
| React (Vite) | General best practices |
| Supabase | General best practices |

### Modularity Rules (ENFORCED)

- Functions: **max 50 lines** — split larger functions into helpers
- Files: **max 300 lines** (hard limit 500) — extract modules when exceeded
- Classes: single responsibility — one reason to change
- Nesting: **max 3 levels** — extract early returns or helper functions

### General Principles

- **Explicit over implicit** — no magic, no hidden behavior
- **Composition over inheritance** — prefer interfaces and composition
- **Fail fast** — validate inputs early, throw meaningful errors
- **Pure functions** — minimize side effects, maximize testability
- **No premature abstraction** — three similar lines beats one clever helper
