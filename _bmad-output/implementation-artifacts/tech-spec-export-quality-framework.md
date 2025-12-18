# Tech-Spec: Export Quality Framework

**Created**: 2025-12-17
**Status**: Ready for Implementation
**Based On**: export-quality-framework-brainstorm.md

---

## Overview

Enhance `template-generator.ts` to produce exports that guide AI-assisted IDEs with structured workflow principles, explicit constraints, and domain-agnostic patterns.

### Goals

1. Add Development Workflow section to PROJECT_RULES.md
2. Add Dependency Policy section to PROJECT_RULES.md
3. Add Decision Guidelines section to PROJECT_RULES.md
4. Enhance component YAML structure with richer anti-responsibilities
5. Maintain backward compatibility with existing exports

---

## Implementation Tasks

### Task 1: Add DEVELOPMENT_WORKFLOW constant

**File**: `src/core/template-generator.ts`

**Add after line 240 (after DEFAULT_CONSTRAINTS)**:

```typescript
/**
 * Development workflow phases - domain-agnostic implementation guidance
 */
const DEVELOPMENT_WORKFLOW = `## Development Workflow

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
```

### Task 2: Add DEPENDENCY_POLICY constant

**File**: `src/core/template-generator.ts`

**Add after DEVELOPMENT_WORKFLOW**:

```typescript
/**
 * Dependency management policy - prevents dependency bloat
 */
const DEPENDENCY_POLICY = `## Dependency Policy

### Before Adding Any Dependency

1. **Check native APIs first** - Modern runtimes have built-in solutions
2. **Search the codebase** - May already exist as a utility
3. **Evaluate the package**:
   - Last update within 12 months?
   - Weekly downloads >10k (for npm) or equivalent adoption?
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
- Increase bundle size by >50KB
- Have fewer than 1000 weekly downloads
- Require native/binary components
- Are in alpha/beta status`
```

### Task 3: Add DECISION_GUIDELINES constant

**File**: `src/core/template-generator.ts`

**Add after DEPENDENCY_POLICY**:

```typescript
/**
 * Decision authority guidelines - when to decide vs. escalate
 */
const DECISION_GUIDELINES = `## Decision Guidelines

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
- Significant new dependencies (>50KB, specialized purpose)
- Changes that affect multiple components
- Deviations from constraints in this document
- Performance tradeoffs with user-facing impact`
```

### Task 4: Add QUALITY_GATES constant

**File**: `src/core/template-generator.ts`

**Add after DECISION_GUIDELINES**:

```typescript
/**
 * Quality gates - minimum requirements before completion
 */
const QUALITY_GATES = `## Quality Gates

Before considering any task complete:

### Code Quality
- [ ] Code follows naming conventions in this document
- [ ] No TypeScript \`any\` types (use \`unknown\` with guards)
- [ ] No console.log statements (use proper logging)
- [ ] Error handling is explicit, not swallowed
- [ ] No hardcoded values that should be configurable

### Security
- [ ] No secrets in code (API keys, passwords, tokens)
- [ ] All user inputs validated before use
- [ ] No SQL/injection vulnerabilities
- [ ] Sensitive data not logged

### Testing
- [ ] Critical paths have test coverage
- [ ] Tests actually verify behavior, not just run
- [ ] Edge cases considered

### Documentation
- [ ] Complex logic has explanatory comments (why, not what)
- [ ] Public interfaces have clear contracts
- [ ] Breaking changes documented`
```

### Task 5: Update generateProjectRulesTemplate function

**File**: `src/core/template-generator.ts`

**Modify the function to include new sections**:

```typescript
export function generateProjectRulesTemplate(
  nodes: DiagramNode[],
  edges: DiagramEdge[],
  projectName: string,
): string {
  // ... existing code for projectType, nodesByType, stackSummary, boundaries ...

  const systemOverview = `## System Overview
// ... existing ...
`

  const componentRegistry = generateComponentRegistrySection(nodes)
  const architectureConstraints = generateArchitectureConstraints(nodes)
  const codeStandards = generateCodeStandards(nodes)
  const buildOrder = generateBuildOrderSection(nodes)
  const integrationRules = generateIntegrationRules(nodes, edges)

  // Assemble complete document with NEW sections
  return `# ${projectName} - System Rules

> **Load this file FIRST** before any component specs.
> Component specs in \`specs/*.yaml\` extend these rules.

${systemOverview}

---

${DEVELOPMENT_WORKFLOW}

---

${DEPENDENCY_POLICY}

---

${DECISION_GUIDELINES}

---

${componentRegistry}

---

${architectureConstraints}

---

${codeStandards}

---

${buildOrder}

---

${integrationRules}

---

${QUALITY_GATES}
`
}
```

### Task 6: Enhance anti_responsibilities structure

**File**: `src/core/template-generator.ts`

**Create new type and update DEFAULT_ANTI_RESPONSIBILITIES**:

```typescript
interface AntiResponsibility {
  pattern: string      // The NEVER statement
  reason: string       // Why this is forbidden
  instead?: string     // What to do instead
}

const ENHANCED_ANTI_RESPONSIBILITIES: Record<NodeType, AntiResponsibility[]> = {
  frontend: [
    {
      pattern: 'NEVER store sensitive data in localStorage or sessionStorage',
      reason: 'Client storage is accessible to any script on the page, including XSS attacks',
      instead: 'Use httpOnly cookies for tokens, or encrypt sensitive data before storing',
    },
    {
      pattern: 'NEVER trust client-side validation alone',
      reason: 'Client code can be bypassed or modified by users',
      instead: 'Always re-validate on the server; client validation is for UX only',
    },
    {
      pattern: 'NEVER make direct database connections',
      reason: 'Exposes credentials and bypasses business logic',
      instead: 'All data flows through backend API endpoints',
    },
    {
      pattern: 'NEVER implement business logic in UI components',
      reason: 'Makes logic hard to test and leads to duplication',
      instead: 'Keep components presentational; logic lives in services/hooks/backend',
    },
  ],
  backend: [
    {
      pattern: 'NEVER trust client-provided data without validation',
      reason: 'Clients can send any data, including malicious payloads',
      instead: 'Validate ALL inputs with schema validation (Zod, Joi, etc.)',
    },
    {
      pattern: 'NEVER expose internal error details to clients',
      reason: 'Stack traces reveal implementation details useful for attacks',
      instead: 'Log full errors internally; return safe, generic messages to clients',
    },
    {
      pattern: 'NEVER store secrets in code or version control',
      reason: 'Secrets in code get leaked through repos, logs, error messages',
      instead: 'Use environment variables or secret management services',
    },
    {
      pattern: 'NEVER trust client-provided IDs for authorization',
      reason: 'Users can manipulate IDs to access others\' data',
      instead: 'Always verify ownership/permissions server-side',
    },
  ],
  storage: [
    {
      pattern: 'NEVER expose direct connections to frontend',
      reason: 'Bypasses authentication, authorization, and business logic',
      instead: 'All access through backend API layer',
    },
    {
      pattern: 'NEVER store computed values that can be derived',
      reason: 'Creates data inconsistency when source changes',
      instead: 'Calculate at query time or use materialized views with refresh',
    },
    {
      pattern: 'NEVER use database triggers for business logic',
      reason: 'Triggers are hard to test, debug, and reason about',
      instead: 'Keep logic in application layer where it\'s explicit and testable',
    },
    {
      pattern: 'NEVER store large files/blobs in the database',
      reason: 'Bloats database, slows backups, hurts performance',
      instead: 'Use object storage (S3, GCS) and store URLs/references',
    },
  ],
  auth: [
    {
      pattern: 'NEVER store plain-text passwords',
      reason: 'Database breaches expose all user credentials',
      instead: 'Use bcrypt, argon2, or scrypt with appropriate cost factors',
    },
    {
      pattern: 'NEVER implement custom cryptography',
      reason: 'Crypto is extremely hard to get right; subtle bugs are exploitable',
      instead: 'Use battle-tested libraries (e.g., crypto built-ins, jose for JWT)',
    },
    {
      pattern: 'NEVER skip rate limiting on auth endpoints',
      reason: 'Enables brute force and credential stuffing attacks',
      instead: 'Rate limit by IP and account; implement exponential backoff',
    },
    {
      pattern: 'NEVER log passwords, tokens, or session data',
      reason: 'Logs are often less protected than production data',
      instead: 'Mask sensitive fields; log only non-sensitive identifiers',
    },
  ],
  external: [
    {
      pattern: 'NEVER store API keys in code',
      reason: 'Keys in code end up in version control and logs',
      instead: 'Use environment variables or secret management',
    },
    {
      pattern: 'NEVER assume external services are always available',
      reason: 'External services have outages, rate limits, and latency spikes',
      instead: 'Implement timeouts, retries with backoff, and fallback behavior',
    },
    {
      pattern: 'NEVER trust external data without validation',
      reason: 'External APIs can return unexpected formats or malicious data',
      instead: 'Validate/sanitize all external data before use',
    },
    {
      pattern: 'NEVER ignore rate limits',
      reason: 'Exceeding limits can get your API access revoked',
      instead: 'Implement request queuing and respect rate limit headers',
    },
  ],
  background: [
    {
      pattern: 'NEVER assume jobs run exactly once',
      reason: 'Jobs can be retried on failure, timeout, or system restart',
      instead: 'Design all jobs to be idempotent (safe to run multiple times)',
    },
    {
      pattern: 'NEVER store job state only in memory',
      reason: 'Memory is lost on restart; jobs will be lost',
      instead: 'Use persistent queue (Redis, PostgreSQL, RabbitMQ)',
    },
    {
      pattern: 'NEVER ignore failed jobs',
      reason: 'Silent failures hide bugs and data inconsistencies',
      instead: 'Implement dead letter queues and alerting for failures',
    },
    {
      pattern: 'NEVER block request handlers with long-running work',
      reason: 'Ties up server resources and degrades user experience',
      instead: 'Queue work for background processing; return immediately',
    },
  ],
}
```

### Task 7: Update generateComponentYamlTemplate to use enhanced structure

**File**: `src/core/template-generator.ts`

**Modify the yamlData object**:

```typescript
export function generateComponentYamlTemplate(
  node: DiagramNode,
  edges: DiagramEdge[],
  allNodes: DiagramNode[],
): string {
  // ... existing code for nodeMap, connectedEdges, integrationPoints ...

  const enhancedAntiResponsibilities = ENHANCED_ANTI_RESPONSIBILITIES[node.data.type]
    .map((ar) => ({
      pattern: ar.pattern,
      reason: ar.reason,
      ...(ar.instead && { instead: ar.instead }),
    }))

  const yamlData = {
    spec_version: '1.0',
    extends_project_rules: true,  // NEW: explicit inheritance marker
    component_id: node.id,
    name: node.data.label,
    type: node.data.type,
    description:
      node.data.meta.description ||
      `# AI: Add 2-3 sentence description.\nThis ${TYPE_LABELS[node.data.type]} component handles ${TYPE_DESCRIPTIONS[node.data.type].toLowerCase()}.`,

    responsibilities: DEFAULT_RESPONSIBILITIES[node.data.type].concat([
      '# AI: Add component-specific responsibilities based on project context',
    ]),

    // ENHANCED: Structured anti-responsibilities
    anti_responsibilities: enhancedAntiResponsibilities.concat([
      {
        pattern: '# AI: Add component-specific boundaries',
        reason: '# AI: Explain why this boundary exists',
      },
    ]),

    integration_points: integrationPoints.length > 0
      ? integrationPoints
      : [{ component: '# AI: Add connected components', relationship: '# AI: Describe the integration' }],

    tech_stack: {
      primary: DEFAULT_TECH_STACK[node.data.type],
      dependencies: ['# AI: Add specific packages with version constraints'],
      references: [
        {
          url: '# AI: Add URL to official docs',
          type: 'official_docs',
        },
      ],
    },

    constraints: {
      security: DEFAULT_CONSTRAINTS[node.data.type].security,
      performance: DEFAULT_CONSTRAINTS[node.data.type].performance,
      architecture: DEFAULT_CONSTRAINTS[node.data.type].architecture,
    },

    // NEW: Quality checklist for this component
    quality_checklist: [
      'Follows project-wide code standards from PROJECT_RULES.md',
      `# AI: Add ${node.data.type}-specific quality checks`,
    ],
  }

  // Add type-specific fields
  const typeSpecificFields = generateTypeSpecificFields(node.data.type)
  const mergedData = { ...yamlData, ...typeSpecificFields }

  return dump(mergedData, {
    indent: 2,
    lineWidth: 120,
    noRefs: true,
    quotingType: '"',
    forceQuotes: false,
  })
}
```

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/core/template-generator.ts` | Add constants, update functions |
| `src/core/template-generator.test.ts` | Add tests for new sections |

## Testing Strategy

1. **Unit Tests**: Verify new sections are included in output
2. **Structure Tests**: Confirm YAML is valid after changes
3. **Content Tests**: Check key phrases appear in templates

---

## Rollout

1. Update template-generator.ts with new constants
2. Modify generateProjectRulesTemplate to include new sections
3. Modify generateComponentYamlTemplate with enhanced structure
4. Run existing tests to verify no regressions
5. Add new tests for new functionality
6. Update STATUS.md

---

*Ready for implementation.*
