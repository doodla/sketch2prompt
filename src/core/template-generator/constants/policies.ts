/**
 * Development workflow phases - domain-agnostic implementation guidance
 */
export const DEVELOPMENT_WORKFLOW = `## Development Workflow

Follow this sequence for all feature implementation:

### Phase 1: Research
- Understand the existing code before modifying
- Map affected files and dependencies
- Identify existing patterns to follow
- Index relevant code sections, don't jump to implementation

### Phase 2: Planning
- Define what will change and why
- Identify integration points with other components
- List files to create/modify
- Flag any architectural decisions needing review

### Phase 3: Library Verification
Before implementing functionality, check:
- Does this functionality exist in the codebase already?
- Is there a well-maintained package that solves this?
- Would custom code be simpler than adding a dependency?
- If adding a package: check maintenance status, bundle size, security

### Phase 4: Implementation
- Follow the plan from Phase 2
- Keep changes focused and testable
- Match existing code patterns and conventions
- Don't deviate from the plan without documenting why

### Phase 5: Verification
- Run all relevant tests
- Check for unintended side effects
- Verify changes meet acceptance criteria
- Review against this document's constraints`

/**
 * Dependency management policy - prevents dependency bloat
 */
export const DEPENDENCY_POLICY = `## Dependency Policy

### Before Adding Any Dependency

1. **Check native APIs first** - Modern runtimes have built-in solutions
2. **Search the codebase** - May already exist as a utility
3. **Evaluate the package**:
   - Last update within 12 months?
   - Reasonable adoption for its ecosystem?
   - No known security vulnerabilities?
   - Reasonable bundle size for its purpose?

### Prefer

- Official SDKs over community wrappers
- Single-purpose packages over monolithic solutions
- Packages with TypeScript support built-in
- Well-documented packages with active communities

### Avoid

- Packages with no updates in 12+ months
- Dependencies for trivial functionality
- Packages with heavy transitive dependencies
- Unmaintained forks of popular packages

### When in Doubt

Ask before adding dependencies that:
- Significantly increase bundle size
- Have very low adoption
- Require native/binary components
- Are in alpha/beta status`

/**
 * Decision authority guidelines - when to decide vs. escalate
 */
export const DECISION_GUIDELINES = `## Decision Guidelines

### Make Pragmatic Decisions For

- Implementation details within established patterns
- Package selection that meets the Dependency Policy
- Test organization and coverage strategies
- Code organization within existing structure
- Minor refactoring that improves clarity
- Error message wording and formatting

### Escalate or Ask About

- Breaking changes to existing interfaces
- New architectural patterns not in the codebase
- Security-sensitive functionality
- Significant new dependencies
- Changes that affect multiple components
- Deviations from constraints in this document
- Performance tradeoffs with user-facing impact`

/**
 * Quality gates - minimum requirements before completion
 */
export const QUALITY_GATES = `## Quality Gates

Before considering any task complete:

### Code Quality
- [ ] Code follows naming conventions in this document
- [ ] No untyped variables (use proper types, avoid \`any\`)
- [ ] No debug statements left in code
- [ ] Error handling is explicit, not swallowed
- [ ] No hardcoded values that should be configurable

### Security
- [ ] No secrets in code (API keys, passwords, tokens)
- [ ] All user inputs validated before use
- [ ] No injection vulnerabilities
- [ ] Sensitive data not logged

### Testing
- [ ] Critical paths have test coverage
- [ ] Tests actually verify behavior, not just run
- [ ] Edge cases considered

### Documentation
- [ ] Complex logic has explanatory comments (why, not what)
- [ ] Public interfaces have clear contracts
- [ ] Breaking changes documented`
