# AI-Assisted Mind Map for Plan Expansion

> Design document for pivoting sketch2prompt from architecture diagramming to AI-assisted planning

## Vision

A tool that takes users from fuzzy idea to detailed, sequenced implementation plan that an AI agent can execute without guessing.

**Core insight:** Humans are better at defining intent, agents are better at executing within constraints. This tool helps humans freeze intent into explicit structure before entropy sets in.

## Target Use Cases

- Software project planning (features, architecture, roadmaps)
- General brainstorming (business, writing, research — any domain)

---

## The Three Phases

### Phase 1: Brainstorming (Mind Map)

**What it is:** Freeform canvas where users dump ideas spatially. AI acts as real-time brainstorming partner.

**User experience:**
- Type nodes at any level of abstraction
- AI suggests 3-5 sibling nodes at the same abstraction level
  - Talking concepts → AI suggests concepts
  - Talking implementation → AI suggests implementation details
- Suggestions appear as ghost/muted nodes near the parent
- Keyboard-first: Enter accepts suggestion, Escape dismisses
- AI is conservative — suggestions only appear once it reaches confidence threshold (no explicit signal, they just start appearing)

**Node structure:**
- Title + optional description
- Tab/Enter after title expands inline description field
- No separate inspector — everything inline

**Canvas behavior:**
- Freeform positioning (user arranges manually)
- React Flow underneath
- Focus mode: any node can become the root view, breadcrumb to zoom out
- AI retains full tree context even when focused

### Phase 2: Restructure (Transformation)

**What it is:** User triggers "Make Plan" — AI transforms the brainstorm into a structured plan.

**What happens:**
1. AI reads entire mind map
2. Reorganizes into user's template structure
3. Produces a **new artifact** — the plan graph (outliner format)
4. AI polishes wording, adds context, fills obvious gaps
5. User reviews and approves

**The plan template:**
- User-defined markdown document with headings
- AI interprets structure and maps content into sections
- AI can suggest a template if none exists

**Plan graph (outliner):**
- Hierarchical list view (not canvas)
- Editable inline — titles, descriptions, reordering
- Source of truth going forward
- Original mind map is archived (can revisit, but plan is canonical)

### Phase 3: Deep Research (Agent-Driven Expansion)

**What it is:** User points at plan nodes and triggers AI agents to research and flesh them out.

**How it works:**
- User selects a node, clicks "Research" or similar
- Agent spawns with:
  - Full plan context (goals, vision, constraints)
  - Specific job: flesh out this node 2-3 levels deep
  - Ability to do real research (web search, fetch docs)
  - Ability to spawn sub-agents for sub-categories
- Agent works recursively but bounded — user triggers each expansion
- Questions bubble up when agent needs input

**Agent behavior:**
- Each agent has bounded, simple job
- Agents can spawn child agents for child nodes
- Research is real — web search, documentation fetching
- User can also attach specific sources/URLs
- Follows domain best practices (Python → PEP, packaging conventions, etc.)
- Doesn't assume knowledge — researches to verify

**Question handling:**
- Badge on node when question pending
- Central inbox for triage
- Answering a question immediately unblocks agent to continue

**Node chat:**
- Any node can have a chat thread
- Configurable: inline or side panel
- For clarification, debate, refinement

---

## Output

### Export Structure

Nested folder structure mirroring the plan tree:
- Ordered by implementation sequence
- Bottom-up (foundations first)
- Tests and quality gates come first

```
/plan
  /01-testing-infrastructure
    overview.md
    /unit-tests
    /integration-tests
  /02-ci-quality-gates
    overview.md
  /03-core
    ...
  /04-features
    /feature-a
    /feature-b
  ...
```

**Result:** A plan folder an AI coding agent can execute from without guessing — every decision researched and validated.

---

## Data Model

### Design Principles
- Tree structure (not graph) for UI simplicity
- AI maintains relationship memory internally
- Designed for real-time collaboration from the start
- Ships as local-first (browser storage) for v1
- References between nodes can be added later (v2)

### Node Schema (draft)
```typescript
interface PlanNode {
  id: string
  title: string
  description?: string
  children: PlanNode[]
  status: 'draft' | 'approved' | 'researching' | 'complete'
  questions: Question[]
  chat: ChatMessage[]
  metadata: {
    createdAt: Date
    updatedAt: Date
    source: 'user' | 'ai-suggestion' | 'ai-research'
  }
}
```

---

## AI Integration

### Provider Support
- BYOK (Bring Your Own Key)
- OpenAI + Anthropic at launch

### AI Behaviors by Phase

| Phase | AI Role | Behavior |
|-------|---------|----------|
| Brainstorm | Suggest siblings | Proactive, conservative, matches abstraction level |
| Restructure | Transform to plan | One-shot transformation, polishes wording |
| Research | Deep expansion | Autonomous within bounds, spawns sub-agents, asks questions |

### Research Capabilities
- Web search for best practices, documentation
- User-provided sources (URLs, docs)
- Domain-aware (knows to look up Python packaging, CI patterns, etc.)

---

## UI/UX (To Be Detailed)

### Open Questions
- Transition from brainstorm → plan (diff view? side-by-side? approval flow?)
- How agent work appears in real-time (streaming nodes? progress?)
- Inbox/question UX (urgency, batching answers)
- Keyboard shortcuts throughout
- Mobile/tablet support or desktop-only for v1

### Confirmed Patterns
- Keyboard-first interactions
- Ghost nodes for AI suggestions (muted visual treatment)
- Focus mode with breadcrumb navigation
- Inline editing (no separate inspector panels)
- Configurable chat position (inline vs side panel)

---

## Technical Considerations

### Existing Infrastructure to Leverage
- React Flow (canvas)
- Zustand + zundo (state with undo/redo)
- Zod (schema validation)
- Tailwind v4 (styling)

### New Requirements
- LLM client abstraction (OpenAI + Anthropic)
- Streaming responses for real-time suggestions
- Agent orchestration (spawning, context passing, question bubbling)
- Outliner component (plan view)
- Export pipeline (tree → folder structure)

### What Gets Removed
- Architecture-specific node types (frontend, backend, storage, etc.)
- Current onboarding wizard
- Current export format (PROJECT_RULES.md, AGENT_PROTOCOL.md, specs/)

---

## Open Items

- [ ] UI/UX deep dive (approval flows, real-time agent feedback, keyboard interactions)
- [ ] Technical architecture (agent orchestration, state management for async operations)
- [ ] Migration path (how to handle existing sketch2prompt users, if any)
- [ ] Template system design (how users create/edit plan templates)

---

## Summary

sketch2prompt pivots from "architecture diagram → AI specs" to "brainstorm → structured plan → agent-researched implementation guide."

The core loop:
1. **Brainstorm** freely with AI suggesting at your abstraction level
2. **Restructure** into your plan template (one-time transformation)
3. **Research** deeply via bounded agents that ask questions
4. **Export** as sequenced, test-first implementation folder

The tool succeeds when an AI coding agent can pick up the exported plan and execute without guessing.
