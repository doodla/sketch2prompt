import type { DiagramNode } from '../../types'

/**
 * Detect unique primary tech stacks from all nodes
 */
function detectPrimaryStacks(nodes: DiagramNode[]): string[] {
  const stacks = new Set<string>()

  nodes.forEach((node) => {
    const techStack = node.data.meta.techStack
    if (techStack && techStack.length > 0) {
      // Add all tech stack items from this node
      techStack.forEach((stack) => {
        if (stack) {
          stacks.add(stack.trim())
        }
      })
    }
  })

  return Array.from(stacks).sort()
}

/**
 * Tech stack to standards mapping
 */
const STACK_STANDARDS: Record<string, string> = {
  Python: 'PEP 8, type hints, docstrings',
  FastAPI: 'PEP 8, type hints, docstrings',
  Django: 'PEP 8, type hints, docstrings',
  TypeScript: 'ESLint, strict mode, explicit types',
  'Node.js': 'ESLint, strict mode, explicit types',
  Express: 'ESLint, strict mode, explicit types',
  React: 'ESLint, strict mode, explicit types',
  'Next.js': 'ESLint, strict mode, explicit types',
  Go: 'gofmt, effective go',
  Golang: 'gofmt, effective go',
  Rust: 'rustfmt, clippy',
  Java: 'Google Java Style',
  Spring: 'Google Java Style',
}

/**
 * Generate code standards section based on detected stacks
 */
function generateCodeStandardsSection(stacks: string[]): string {
  if (stacks.length === 0) {
    return `## Code Standards

General principles:
- **Modular** — single responsibility per file/module
- **Extensible** — composition over inheritance
- **Debuggable** — meaningful errors, structured logging
- **Testable** — injectable dependencies, pure functions where possible`
  }

  let tableRows = ''
  const seenRows = new Set<string>()

  stacks.forEach((stack) => {
    const standard = STACK_STANDARDS[stack] || 'General best practices'
    const row = `| ${stack} | ${standard} |`
    // Only add if we haven't seen this exact row before
    if (!seenRows.has(row)) {
      seenRows.add(row)
      tableRows += `${row}\n`
    }
  })

  return `## Code Standards

Apply dynamically based on \`tech_stack.primary\`:

| Stack | Standards |
|-------|-----------|
${tableRows}
General principles:
- **Modular** — single responsibility per file/module
- **Extensible** — composition over inheritance
- **Debuggable** — meaningful errors, structured logging
- **Testable** — injectable dependencies, pure functions where possible`
}

/**
 * Generate [OUTPUT] AGENT_PROTOCOL.md
 * Workflow guidance for downstream AI agents implementing the system
 */
export function generateAgentProtocolTemplate(
  nodes: DiagramNode[],
  _projectName: string,
): string {
  const stacks = detectPrimaryStacks(nodes)
  const codeStandards = generateCodeStandardsSection(stacks)

  return `# Agent Protocol

## Core Principle

The system you are building already has rules. Execute within those rules — do not invent new architecture.

Before ANY implementation:
1. Read \`PROJECT_RULES.md\` to understand system boundaries
2. Load ONLY the component spec you are currently implementing
3. Do not load other specs unless resolving an integration contract

---

## Status Tracking (MANDATORY)

\`STATUS.md\` tracks current phase, milestone, and progress.

**Update after every feature or milestone.** No exceptions.

\`\`\`
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
\`\`\`

**Rules:**
- Create \`STATUS.md\` on first task if it doesn't exist
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
- Follow code standards from \`PROJECT_RULES.md\`
- Verify exit criteria before marking component complete
- **Update \`STATUS.md\` after every feature/milestone**

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

${codeStandards}
`
}
