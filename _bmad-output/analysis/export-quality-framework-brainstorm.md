# Export Quality Framework Brainstorming

**Created**: 2025-12-17
**Purpose**: Define a domain-agnostic framework for high-quality exports that guide AI-assisted IDEs effectively

---

## Problem Statement

Current exports provide smart defaults and `# AI: Elaborate` markers, but lack:

1. **Explicit workflow structure** - No guidance on how to approach implementation phases
2. **Library verification patterns** - No explicit "search before building" principles
3. **Hierarchical clarity** - Unclear how PROJECT_RULES.md and component specs interact
4. **Actionable constraints** - Rules need to be more concrete and enforceable
5. **Domain-agnostic applicability** - Framework should work for any project type

---

## First Principles Analysis

### What Makes an Instruction File Effective for AI Assistants?

Drawing from our own CLAUDE.md effectiveness:

1. **Clear Authority Hierarchy**
   - Global rules override nothing (baseline)
   - Project rules extend/override global
   - Component rules extend/override project

2. **Explicit Constraints Over Implicit Guidelines**
   - "NEVER use raw SQL" > "Prefer ORMs"
   - "ALWAYS validate inputs at boundaries" > "Good practice to validate"

3. **Workflow Structure**
   - AI assistants work better with structured phases
   - Research → Plan → Build → Verify pattern

4. **Decision Frameworks**
   - Not just rules, but how to make decisions
   - "Before adding a dependency, check if native APIs can solve it"

### What Principles from Our CLAUDE.md Should Translate?

| Our Principle | Export Translation |
|--------------|-------------------|
| Workflow Phases (Research→Plan→Build→Review) | Build Order with phase descriptions |
| Library Verification | Dependency Policy section with check steps |
| Coding Standards (modular, typed, testable) | Code Standards section with patterns |
| Security Baseline | Security Constraints section |
| Trigger Words | N/A (tool-specific) |
| Decision Authority | Decision Guidelines section |

---

## Framework Design: The "Constraint Hierarchy"

### Layer 1: PROJECT_RULES.md (Project-Wide)

**Purpose**: Establish the baseline that ALL components must follow.

**New Sections to Add**:

1. **Development Workflow** (NEW)
   ```markdown
   ## Development Workflow

   Follow this sequence for all feature implementation:

   ### Phase 1: Research
   - Understand the existing code before modifying
   - Map affected files and dependencies
   - Identify existing patterns to follow

   ### Phase 2: Planning
   - Define what will change
   - Identify integration points
   - Flag any architectural decisions needing review

   ### Phase 3: Library Verification
   Before implementing functionality, check:
   - [ ] Does this exist in the codebase already?
   - [ ] Is there a standard library/package for this?
   - [ ] Would a custom solution be simpler than adding dependencies?

   ### Phase 4: Implementation
   - Follow the plan
   - Keep changes focused and testable
   - Don't deviate without flagging

   ### Phase 5: Verification
   - Run tests
   - Check for unintended side effects
   - Verify against acceptance criteria
   ```

2. **Dependency Policy** (ENHANCED)
   ```markdown
   ## Dependency Policy

   ### Before Adding Any Dependency
   1. Check if native APIs solve the problem
   2. Search for existing utilities in the codebase
   3. Verify package is actively maintained (updates within 12 months)
   4. Check bundle size impact
   5. Ensure no security vulnerabilities (npm audit, snyk)

   ### Prefer
   - Packages with >10k weekly downloads
   - Official SDKs over community wrappers
   - Single-purpose packages over kitchen-sink solutions

   ### Avoid
   - Packages with no updates in 12+ months
   - Dependencies for trivial functionality (left-pad syndrome)
   - Packages with known security issues
   ```

3. **Decision Guidelines** (NEW)
   ```markdown
   ## Decision Guidelines

   ### Make Pragmatic Decisions For
   - Implementation details within established patterns
   - Package selection meeting the dependency policy
   - Test organization and strategies
   - Minor refactoring that improves clarity

   ### Escalate/Ask For
   - Breaking changes to public interfaces
   - New architectural patterns not in existing code
   - Security-sensitive changes
   - Significant dependency additions
   - Deviations from this document
   ```

### Layer 2: Component YAMLs (Component-Specific)

**Purpose**: Extend or override project rules for specific components.

**Enhancement Approach**:

1. **Explicit Inheritance**
   ```yaml
   # Inherit and extend project rules
   extends_project_rules: true

   # Component-specific overrides
   overrides:
     dependency_policy:
       # This component needs real-time, so WebSockets OK
       allowed_additions: ["socket.io"]
   ```

2. **Concrete Examples Over Abstract Rules**
   ```yaml
   anti_responsibilities:
     - pattern: "NEVER access database directly"
       reason: "All data flows through the backend API"
       example: "Don't use Prisma/SQL in this component"
       instead: "Use the API client in /services/api.ts"
   ```

3. **Integration Contracts**
   ```yaml
   integration_points:
     - component: "REST API"
       contract:
         method: "GET /api/users/:id"
         request: "none (path param only)"
         response: "User object with id, email, name"
         error: "404 if not found, 401 if unauthorized"
   ```

---

## Domain-Agnostic Framework Principles

The framework should work regardless of whether the user is building:
- A web app
- A CLI tool
- A mobile app
- An API service
- A data pipeline

### Universal Principles (Always Include)

1. **Separation of Concerns**
   - Components have clear responsibilities
   - Anti-responsibilities prevent scope creep
   - Integration points define boundaries

2. **Input Validation at Boundaries**
   - All external inputs validated before use
   - Never trust data from other systems implicitly
   - Fail early with clear errors

3. **Explicit Over Implicit**
   - Configuration through environment, not hardcoded
   - Dependencies declared, not assumed
   - Errors surfaced, not swallowed

4. **Research Before Building**
   - Check for existing solutions first
   - Understand existing patterns before adding new ones
   - Measure before optimizing

### Type-Specific Enhancements

Different node types emphasize different aspects:

| Type | Primary Emphasis | Secondary |
|------|-----------------|-----------|
| Frontend | User interaction, state management | Accessibility, performance |
| Backend | Data validation, business logic | Security, error handling |
| Storage | Data integrity, schema design | Backup, indexing |
| Auth | Security, session management | Audit logging, rate limiting |
| External | Error handling, rate limits | Fallbacks, timeouts |
| Background | Idempotency, reliability | Monitoring, retry logic |

---

## Concrete Improvements to Template Generator

### PROJECT_RULES.md Enhancements

1. **Add Development Workflow section** - Structured phases for implementation
2. **Add Dependency Policy section** - Explicit package management rules
3. **Add Decision Guidelines section** - When to ask vs. decide
4. **Enhance Architecture Constraints** - More concrete NEVER/ALWAYS rules
5. **Add Quality Gates section** - What must pass before completion

### Component YAML Enhancements

1. **Add `extends_project_rules: true`** - Explicit inheritance marker
2. **Enhance anti_responsibilities** - Add `reason`, `example`, `instead` fields
3. **Add `integration_contracts`** - Concrete API shapes
4. **Add `quality_checklist`** - Component-specific verification steps
5. **Add `common_mistakes`** - Known pitfalls for this component type

---

## Implementation Priority

### Must Have (This Sprint)

1. Development Workflow section in PROJECT_RULES.md
2. Enhanced Dependency Policy section
3. Decision Guidelines section
4. Richer anti_responsibilities structure in component YAMLs
5. `extends_project_rules` marker

### Nice to Have (If Time)

1. Integration contracts in component YAMLs
2. Quality Gates section
3. Common mistakes per type
4. Example code snippets

### Defer

1. Dynamic template selection based on detected stack
2. User-customizable template sections
3. Multiple framework presets (strict, relaxed, minimal)

---

## Success Criteria

The new framework succeeds if:

1. **AI assistants ask fewer follow-up questions** - Specs provide enough context
2. **Generated code follows patterns** - Constraints actually shape output
3. **Users feel guided, not restricted** - Framework helps without hindering
4. **Works for any domain** - Web app, CLI, API all benefit equally

---

## Next Steps

1. Create tech-spec with concrete implementation details
2. Update `template-generator.ts` with new sections
3. Add tests for new template structure
4. Update STATUS.md with progress

---

*Brainstorming complete. Ready for tech-spec phase.*
