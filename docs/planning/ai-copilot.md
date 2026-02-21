# Plan: AI Copilot Feature

**Status:** Active
**Phase:** Pre-implementation
**Branch:** `claude/project-component-breakdown-fWR6L`

---

## 1. Problem Statement

sketch2prompt currently has two separate relationships with AI:

1. **Onboarding wizard** — rule-based conditional logic that maps structured form answers
   to predefined node templates. No AI involved.
2. **Export** — optional AI call at the end to write richer specification documents from
   a completed diagram.

The result is that AI is invisible during the part that matters most: the act of
defining architecture. Users must either know what components they need (and draw them
manually) or answer structured wizard questions (and get a rigid, template-driven result).

Neither approach handles the common case: **a developer who has a rough idea but isn't
sure what their system needs**.

---

## 2. Vision

> AI as collaborative partner. User stays in control.

The interaction flips: instead of the user building a complete diagram and AI documenting
it at the end, AI actively proposes components while the user is building. Every
suggestion requires explicit acceptance before it touches the canvas.

**Core principle:** AI proposes. Human decides. Always.

### Before (Current)

```
User fills wizard → Rule-based generation → Diagram appears → User edits → AI documents
```

### After (Target)

```
User describes intent (optional)
         ↓
AI suggests 2-3 components
         ↓
User accepts/dismisses each
         ↓
AI observes new state → suggests again
         ↓
User accepts/dismisses...
         ↓  (repeat until satisfied)
User clicks Generate → export as before
```

### What Changes

| Aspect | Before | After |
|--------|--------|-------|
| Starting point | Wizard form | Optional description + AI suggestions |
| AI role | Export-time documentation | Active canvas partner |
| User control | Full (no AI input on canvas) | Full (AI suggests, user gates every change) |
| Wizard | Multi-step structured form | Simplified or removed |
| Canvas interaction | Entirely manual | Manual + AI-assisted |

### What Does NOT Change

- Export pipeline remains identical
- Node types, canvas mechanics, undo/redo unchanged
- AI key required for copilot (same requirement as AI export)
- Template-based export still works without an API key

---

## 3. The Interaction in Detail

### 3.1 Entry Points

**Empty canvas:**

```
┌─────────────────────────────────────────────┐
│ AI Copilot                          [×] [↑] │
├─────────────────────────────────────────────┤
│ What are you building?                      │
│ ┌─────────────────────────────────────────┐ │
│ │ A RAG chat app with document upload_    │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ [Suggest components →]                      │
└─────────────────────────────────────────────┘
```

**Canvas has nodes (no selection):**

```
┌─────────────────────────────────────────────┐
│ AI Copilot                          [↺] [↑] │
├─────────────────────────────────────────────┤
│ Suggestions based on your diagram:          │
│                                             │
│ ┌─────────────────────────────────────────┐ │
│ │ 🗄 Vector Store              [storage]  │ │
│ │ Pinecone                                │ │
│ │ RAG requires vector search to retrieve  │ │
│ │ relevant document chunks                │ │
│ │                          [Add] [Dismiss]│ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ ┌─────────────────────────────────────────┐ │
│ │ 🔐 Auth Service              [auth]     │ │
│ │ NextAuth.js                             │ │
│ │ Protect document upload endpoints       │ │
│ │                          [Add] [Dismiss]│ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ [Refresh suggestions]                       │
└─────────────────────────────────────────────┘
```

**Node selected → Inspector takes over (existing behavior unchanged)**

### 3.2 Suggestion Card Anatomy

Each suggestion card contains:
- **Type badge** — colored chip matching node type (auth, storage, etc.)
- **Label** — component name (e.g., "Vector Store")
- **Tech stack** — 1-2 technology pills (e.g., "Pinecone")
- **Reason** — one sentence explaining why this component is suggested
- **Accept button** — adds node to canvas, triggers new suggestion generation
- **Dismiss button** — removes suggestion from panel, AI won't re-suggest it this session

### 3.3 Panel Placement

The copilot panel occupies the same right-rail position as the Inspector:
- Inspector is visible when a node/edge is selected (existing behavior)
- Copilot panel is visible when nothing is selected
- No new screen real estate required
- Copilot panel collapses to a button in the header if user prefers

### 3.4 Trigger Conditions

AI generates suggestions when:
1. User clicks "Suggest components" (empty canvas with context input)
2. User clicks "Refresh suggestions" (manual re-generation)
3. User accepts a suggestion (new round based on updated diagram state)

AI does NOT auto-generate:
- On every node edit (too aggressive, wastes API calls)
- On import (user already has a complete diagram)
- Without an API key (panel shows prompt to configure)

### 3.5 No API Key State

```
┌─────────────────────────────────────────────┐
│ AI Copilot                                  │
├─────────────────────────────────────────────┤
│ Add an API key to get architecture          │
│ suggestions as you build.                   │
│                                             │
│ [Configure in Settings →]                   │
└─────────────────────────────────────────────┘
```

---

## 4. Technical Architecture

### 4.1 New Module: `src/core/ai-copilot/`

```
src/core/ai-copilot/
  types.ts       — NodeSuggestion, SuggestionSet, CopilotState
  prompt.ts      — Builds suggestion prompt from diagram state + context
  parser.ts      — Parses + validates AI JSON response → NodeSuggestion[]
  suggester.ts   — Orchestrates: prompt → callAI → parser → NodeSuggestion[]
  index.ts       — Re-exports
```

Reuses from `src/core/ai-generator/`:
- `client.ts` — `createClient()`, `callAI()` (no changes needed)
- `types.ts` — `AIProvider`, `PROVIDER_CONFIG`

### 4.2 Types (`src/core/ai-copilot/types.ts`)

```typescript
import type { NodeType } from '../types'

export type SuggestionStatus = 'pending' | 'accepted' | 'dismissed'

export type NodeSuggestion = {
  id: string                  // nanoid(), assigned on parse
  type: NodeType
  label: string               // e.g. "Vector Store"
  techStack: string[]         // e.g. ["Pinecone"] — max 3
  reason: string              // one sentence, max 200 chars
  status: SuggestionStatus
}

export type CopilotContext = {
  projectDescription: string  // optional free-text from user
}

export type CopilotState = {
  suggestions: NodeSuggestion[]
  isLoading: boolean
  error: string | null
  context: CopilotContext
  dismissedLabels: Set<string>  // session-scoped, don't re-suggest
}
```

### 4.3 Zod Schema (`src/core/ai-copilot/parser.ts`)

```typescript
import { z } from 'zod'
import { nanoid } from 'nanoid'
import { NODE_TYPES } from '../types'
import type { NodeSuggestion } from './types'

const SuggestionSchema = z.object({
  type: z.enum([
    NODE_TYPES.frontend,
    NODE_TYPES.backend,
    NODE_TYPES.storage,
    NODE_TYPES.auth,
    NODE_TYPES.external,
    NODE_TYPES.background,
  ]),
  label: z.string().min(1).max(50),
  techStack: z.array(z.string().min(1)).max(3),
  reason: z.string().min(10).max(200),
})

const ResponseSchema = z.object({
  suggestions: z.array(SuggestionSchema).min(1).max(5),
})

export function parseSuggestions(raw: string): NodeSuggestion[] {
  const parsed = JSON.parse(raw)              // throws on invalid JSON
  const validated = ResponseSchema.parse(parsed) // throws on schema violation
  return validated.suggestions.map((s) => ({
    ...s,
    id: nanoid(),
    status: 'pending' as const,
  }))
}
```

### 4.4 Prompt Design (`src/core/ai-copilot/prompt.ts`)

```typescript
export function buildSuggestionPrompt(
  nodes: DiagramNode[],
  edges: DiagramEdge[],
  context: CopilotContext,
  dismissedLabels: Set<string>
): string
```

**Prompt structure:**

```
You are helping a developer design software architecture.

Current components:
<components>
{{for each node: "- {label} [{type}]: {techStack.join(', ')}"}}
</components>

{{if context.projectDescription}}
Project context: "{{projectDescription}}"
{{/if}}

{{if dismissedLabels.size > 0}}
Do not suggest these (user dismissed them): {{dismissedLabels.join(', ')}}
{{/if}}

Suggest up to 3 components that are missing from this architecture.
Only suggest components that are genuinely needed, not nice-to-haves.
Each suggestion must be a different component type from those already present
(unless a second instance is clearly justified).

Respond in JSON only — no prose, no markdown, no explanation outside the JSON.

{
  "suggestions": [
    {
      "type": "storage | auth | backend | frontend | external | background",
      "label": "Short component name",
      "techStack": ["Technology"],
      "reason": "One sentence explaining why this is needed"
    }
  ]
}
```

**Prompt sizing:** Estimated 300-600 tokens input. Lean enough for cheap API tiers.

### 4.5 Suggester (`src/core/ai-copilot/suggester.ts`)

```typescript
export async function generateSuggestions(
  nodes: DiagramNode[],
  edges: DiagramEdge[],
  context: CopilotContext,
  dismissedLabels: Set<string>,
  apiKey: string,
  provider: AIProvider,
  modelId: string,
  signal?: AbortSignal
): Promise<NodeSuggestion[]>
```

Flow:
1. Build prompt via `buildSuggestionPrompt()`
2. Call `callAI()` from `src/core/ai-generator/client.ts`
3. Parse response via `parseSuggestions()`
4. Return `NodeSuggestion[]`
5. Errors propagate up to the store for display

### 4.6 Copilot Store (`src/core/copilot-store.ts`)

```typescript
import { create } from 'zustand'

interface CopilotStore {
  // State
  suggestions: NodeSuggestion[]
  isLoading: boolean
  error: string | null
  projectDescription: string
  dismissedLabels: Set<string>

  // Actions
  generate: (
    nodes: DiagramNode[],
    edges: DiagramEdge[],
    apiKey: string,
    provider: AIProvider,
    modelId: string
  ) => Promise<void>

  accept: (id: string) => NodeSuggestion | null
  // Returns the suggestion (caller adds node to diagram store)

  dismiss: (id: string) => void
  setProjectDescription: (text: string) => void
  clearSuggestions: () => void
  clearDismissed: () => void
}
```

**Key design:** `accept()` returns the suggestion data; the caller (UI component or
App.tsx) is responsible for calling `addNode()` on the diagram store. This keeps
the copilot store decoupled from the diagram store.

### 4.7 Node Positioning on Accept

When a suggestion is accepted, position the new node using existing layout logic:
- Query current nodes for existing nodes of the same type
- Place in the same horizontal band as similar nodes
- Offset to the right of existing nodes in that band
- Fall back to canvas center if no reference available

Reference: `src/components/onboarding/hooks/useNodeGeneration.ts:positionNodes()`

### 4.8 New UI Component: `src/components/AICopilotPanel.tsx`

**Structure:**
```
AICopilotPanel
├── ProjectContextInput     — optional one-line description
├── SuggestionList
│   └── SuggestionCard (×N)
│       ├── TypeBadge
│       ├── Label + TechChips (reuse existing TechChip component)
│       ├── ReasonText
│       └── AcceptButton + DismissButton
├── LoadingState            — skeleton cards
├── EmptyState              — "no suggestions" / prompt to describe project
└── ErrorState              — API error with retry
```

Reuse from existing codebase:
- `TechChip` from `src/components/nodes/TechChip.tsx`
- `RecommendationChip` from `src/components/nodes/RecommendationChip.tsx`
- Design system tokens (no hardcoded colors)

### 4.9 App Integration (`src/app/App.tsx`)

```typescript
// Copilot panel visible when nothing selected and copilot is enabled
const showCopilot = !hasSelection

// In the aside panel:
<aside ...>
  {showCopilot ? <AICopilotPanel /> : <Inspector />}
</aside>
```

Wire accept flow:
```typescript
// In AICopilotPanel or App.tsx
const handleAccept = (suggestion: NodeSuggestion) => {
  const position = getSuggestionPosition(nodes, suggestion.type)
  addNode(suggestion.type, position, {
    label: suggestion.label,
    techStack: suggestion.techStack,
  })
  copilotStore.accept(suggestion.id)
  // Trigger new suggestion generation with updated diagram state
  copilotStore.generate(updatedNodes, edges, apiKey, provider, modelId)
}
```

---

## 5. Testing Strategy

### 5.1 Unit Tests

**`src/core/ai-copilot/parser.test.ts`**
```
✓ Valid JSON with 1 suggestion → NodeSuggestion[]
✓ Valid JSON with 3 suggestions → NodeSuggestion[]
✓ Invalid JSON string → throws
✓ Valid JSON but wrong schema → throws (Zod)
✓ Suggestion with label > 50 chars → throws
✓ Suggestion with reason < 10 chars → throws
✓ Empty suggestions array → throws (min(1))
✓ More than 5 suggestions → throws (max(5))
✓ Each result has unique nanoid
✓ Each result has status: 'pending'
```

**`src/core/ai-copilot/prompt.test.ts`**
```
✓ Empty nodes → prompt contains empty components block
✓ Single node → prompt contains node label, type, techStack
✓ Multiple nodes → all nodes listed
✓ With project description → description included in prompt
✓ Without project description → no context section
✓ With dismissed labels → dismissal list included
✓ No dismissed labels → no dismissal section
✓ Prompt is deterministic for same input
```

**`src/core/copilot-store.test.ts`**
```
✓ accept() returns the matching suggestion
✓ accept() sets suggestion status to 'accepted'
✓ accept() on unknown id → returns null
✓ dismiss() removes suggestion from list
✓ dismiss() adds label to dismissedLabels
✓ generate() sets isLoading: true during fetch
✓ generate() sets isLoading: false on complete
✓ generate() sets error on AI failure
✓ generate() clears previous suggestions on start
✓ clearDismissed() empties dismissedLabels set
```

### 5.2 Integration Tests

**`src/core/ai-copilot/suggester.test.ts`** (mocked AI client)
```
✓ Valid diagram → calls callAI with correct prompt
✓ AI returns valid JSON → returns NodeSuggestion[]
✓ AI returns invalid JSON → throws with clear message
✓ AbortSignal cancelled → throws cancellation error
✓ Dismissed labels excluded from re-suggestion
```

### 5.3 Component Tests (if applicable)

**`src/components/AICopilotPanel.test.tsx`**
```
✓ Renders empty state when no suggestions
✓ Renders suggestion cards for each suggestion
✓ Accept button calls onAccept with suggestion
✓ Dismiss button calls onDismiss with suggestion id
✓ Loading state renders skeletons not cards
✓ Error state renders error message with retry
✓ No API key → renders configuration prompt
```

### 5.4 Test File Locations

```
src/core/ai-copilot/parser.test.ts
src/core/ai-copilot/prompt.test.ts
src/core/ai-copilot/suggester.test.ts
src/core/copilot-store.test.ts
```

---

## 6. Milestones

### M0: Foundation — Types & Parsing
**Files:** `src/core/ai-copilot/types.ts`, `parser.ts`, `index.ts`
**Tests:** `parser.test.ts`
**Done when:** Parser handles valid/invalid AI responses with full test coverage.

### M1: Suggestion Engine
**Files:** `src/core/ai-copilot/prompt.ts`, `suggester.ts`, `src/core/copilot-store.ts`
**Tests:** `prompt.test.ts`, `suggester.test.ts`, `copilot-store.test.ts`
**Done when:** Full generate → accept → dismiss cycle works in isolation (no UI).

### M2: Copilot Panel UI
**Files:** `src/components/AICopilotPanel.tsx`
**Tests:** Component tests
**Done when:** Panel renders all states (loading, suggestions, empty, error, no-key).
Design system tokens used throughout. No hardcoded colors.

### M3: Canvas Integration
**Files:** `src/app/App.tsx` (wiring)
**Tests:** Manual integration testing
**Done when:**
- Accept → node appears on canvas at correct position
- New suggestions generated after accept
- Copilot panel vs Inspector switching works correctly
- No API key → configuration prompt visible

### M4: Refinement & Hardening
**Scope:**
- Dismissed suggestions don't reappear on refresh
- AbortController cancels in-flight requests when panel closes
- Keyboard: Tab to accept first suggestion, Esc to dismiss
- Rate limit handling (surface clear error, not generic failure)
- Full test pass: `npm run test`
- Full lint pass: `npm run lint`

---

## 7. Risks & Tradeoffs

| Risk | Mitigation |
|------|------------|
| AI suggests irrelevant components | Max 3 per round, reason text lets user judge quickly |
| Empty canvas with no context is hard | Require project description for first generation |
| Rate limiting hits casual users | Lean prompts, no auto-generation on every edit |
| AI response is not valid JSON | Zod validation with descriptive errors, retry UI |
| Suggestions duplicate what's already there | Prompt explicitly lists current components |
| Dismiss state lost on refresh | Note in UX: dismissed reset on page reload (acceptable) |
| Cost anxiety for users | Show token usage estimate, keep prompts under 600 tokens |

---

## 8. Open Questions

These need a decision before M3 implementation:

1. **Panel visibility toggle** — Always show copilot panel when nothing is selected,
   or add a toggle button? Recommendation: always visible, keep it simple.

2. **Dismissed persistence** — Reset on page reload (simpler) or persist to localStorage
   (better UX but adds complexity)? Recommendation: session-only to start.

3. **Project context persistence** — Store in `useSettingsStore` (persisted across
   sessions) or in `copilot-store` (ephemeral)? Recommendation: persist in settings,
   it's reusable context.

4. **Auto-trigger on first node** — When user manually adds their first node, should
   the copilot automatically generate suggestions? Risk: feels intrusive. Recommendation:
   show panel with "Suggest what's missing" CTA, don't auto-fire.

---

## 9. Files Touch Map

**New files:**
```
src/core/ai-copilot/types.ts
src/core/ai-copilot/prompt.ts
src/core/ai-copilot/parser.ts
src/core/ai-copilot/suggester.ts
src/core/ai-copilot/index.ts
src/core/copilot-store.ts
src/components/AICopilotPanel.tsx
src/core/ai-copilot/parser.test.ts
src/core/ai-copilot/prompt.test.ts
src/core/ai-copilot/suggester.test.ts
src/core/copilot-store.test.ts
```

**Modified files:**
```
src/app/App.tsx              — panel switching, accept handler wiring
src/core/settings.ts         — add projectDescription field (if persisted)
```

**Unchanged:**
```
src/core/ai-generator/*      — export pipeline untouched
src/core/store.ts            — addNode() reused as-is
src/components/Canvas.tsx    — no changes
src/components/Inspector.tsx — no changes
```
