# sketch2prompt

## Project Overview
- Single-page React app for system diagram sketching
- Export to LLM-ready text prompt + JSON artifact
- Front-end only, no backend

## Tech Stack
- npm, Vite 7, React 19, TypeScript (strict)
- @xyflow/react 12 (React Flow) for canvas
- Zod for schema validation
- Tailwind CSS v4 for styling

## Commands
- `npm run dev` - Start dev server
- `npm run build` - Production build
- `npm run lint` - ESLint check
- `npm run format` - Prettier format

## Architecture
```
/src
  /components - React components (Canvas, Inspector, Toolbar, ExportDrawer)
  /core       - Business logic (model, schema, export/import)
  /app        - App shell and routing
  /styles     - Global styles
```

## Key Patterns
- React Flow handles all canvas state
- Zod schemas validate all I/O boundaries
- Export functions are pure (diagram → string/object)
- No external API calls

## Testing
- Vitest for unit tests on /core functions
- Focus on export/import round-trip integrity

---

## IMPORTANT: Version & Pattern Enforcement

### Minimum Versions (enforce strictly)
| Package | Min Version | Rationale |
|---------|-------------|-----------|
| React | 19.x | Use React 19 features (Actions, useOptimistic, use()) |
| Vite | 7.x | ESM-only, baseline-widely-available target |
| @xyflow/react | 12.x | Dark mode, SSR support, new API |
| Tailwind CSS | 4.x | CSS-first config, @theme directive |
| Node.js | 20.19+ | Required by Vite 7 |

### Modern Patterns (required)

**React 19:**
- Use `use()` for async data in render
- Prefer Server Actions pattern even for client-only (future-proof)
- Use `useOptimistic` for optimistic UI updates
- Use `useTransition` for non-urgent updates
- NO: class components, legacy context, string refs

**Tailwind v4:**
- Use CSS-first configuration (`@theme` in CSS, not JS config)
- Use `@import "tailwindcss"` (not @tailwind directives)
- Use `@theme` for custom design tokens
- NO: tailwind.config.js (unless absolutely necessary)

**Vite 7:**
- Target is `baseline-widely-available` (not `modules`)
- Use first-party Tailwind Vite plugin
- ESM imports only (no CJS require)

**TypeScript:**
- Strict mode enabled
- Use `satisfies` for type narrowing with inference
- Prefer `const` assertions for literals
- NO: `any`, enums (use const objects), namespaces

### Before Adding Dependencies
1. Check if functionality exists in React 19 (Actions, transitions, etc.)
2. Check if native CSS/Tailwind v4 can solve it
3. Verify package supports React 19 + Vite 7
4. Prefer packages with ESM exports

---

## IMPORTANT: Project Management

### Phase Documentation
Implementation is organized into 5 phases in `.claude/phases/`:
- `001-foundation.md` - M0-M2: Bootstrap, Types, Store
- `002-canvas.md` - M3-M4: React Flow, Custom Nodes
- `003-ui-panels.md` - M5-M6: Toolbar, Inspector
- `004-export.md` - M7-M9: Prompt, JSON, Drawer
- `005-polish.md` - M10-M12: Undo/Redo, Theme, Tests

**Reference phases before starting work** to understand scope and exit criteria.

### Status Tracking (MANDATORY)
`.claude/STATUS.md` tracks current project state.

**YOU MUST update STATUS.md after EVERY milestone completion:**
1. Update "Current State" section (Phase, Milestone)
2. Update Progress table (mark milestone Done)
3. Update "Pending Work" checklist
4. Update "Last updated" date

**Failure to update STATUS.md creates context drift and wastes tokens on re-discovery.**

---

## Git Commits

- Use conventional commits format (`feat:`, `fix:`, `docs:`, etc.)
- Keep commits lean and professional
- **NO AI attribution** - do not include "Generated with Claude", "Co-Authored-By: Claude", or similar footers
- Focus on what changed, not how it was created
