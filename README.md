# sketch2prompt

A minimal, polished diagram editor for creating LLM-ready system prompts.

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite)](https://vite.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com)

## What is this?

Draw boxes and arrows, label them, click Export, paste into ChatGPT or any LLM.

**sketch2prompt** transforms visual system diagrams into structured text prompts that LLMs can understand and reason about.

![Demo Screenshot](docs/screenshot.png)
<!-- TODO: Add screenshot/demo GIF -->

## Features

- **Visual Diagram Editor** - Drag-and-drop nodes with React Flow
- **Multiple Node Types** - Agent, Tool, Data, System, Note
- **Edge Labels** - Describe relationships and data flow
- **LLM-Ready Export** - Copy formatted prompt to clipboard
- **JSON Import/Export** - Save and restore diagrams
- **Dark Mode** - Built-in theme support

## Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/sketch2prompt.git
cd sketch2prompt

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Usage

1. **Add nodes** - Click the toolbar to add different node types
2. **Connect nodes** - Drag from one node's handle to another
3. **Label everything** - Click to edit labels on nodes and edges
4. **Export** - Click "Export Prompt" to copy LLM-ready text

## Export Formats

### LLM Prompt
A human-readable summary perfect for pasting into ChatGPT:

```
System Diagram Summary

Components:
- Agent A: Handles user requests
- Tool B: Processes data

Flows:
- Agent A sends requests to Tool B

Constraints:
- Only public data allowed
```

### JSON
Structured data for programmatic use or diagram restoration.

## Tech Stack

| Technology | Purpose |
|------------|---------|
| [React 19](https://react.dev) | UI Framework |
| [Vite 7](https://vite.dev) | Build Tool |
| [TypeScript](https://www.typescriptlang.org) | Type Safety |
| [React Flow](https://reactflow.dev) | Diagram Canvas |
| [Zod](https://zod.dev) | Schema Validation |
| [Tailwind CSS 4](https://tailwindcss.com) | Styling |

## Development

```bash
pnpm dev        # Start dev server
pnpm build      # Production build
pnpm lint       # Run ESLint
pnpm format     # Run Prettier
```

## Project Structure

```
src/
  app/          # App shell and routing
  components/   # React components
    Canvas.tsx
    Inspector.tsx
    Toolbar.tsx
    ExportDrawer.tsx
  core/         # Business logic
    model.ts
    schema.ts
    exportPrompt.ts
    exportJson.ts
    importJson.ts
  styles/       # Global styles
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

[MIT](LICENSE)
