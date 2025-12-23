# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **START.md initialization protocol** — LLM-optimized bootstrap file with confirmation gates and IDE setup flow
- **README.md quick-start guide** — Human-readable 3-step setup instructions included in every export
- **Minimalism mandate** — Templates now enforce "start simple, scale when necessary" philosophy
- **Streaming export with progress indicators** — Real-time generation feedback during AI-enhanced exports
- **Cancel button during generation** — Users can abort streaming exports mid-generation
- **Example blueprint** — RAG Chat App example in `/examples/rag-chat-app/` for reference
- Project scaffolding with Vite 7, React 19, TypeScript strict mode
- Tailwind CSS v4 with CSS-first configuration and dark/light theme tokens
- Core type definitions for diagram nodes and edges
- Zod schemas for JSON validation
- ESLint flat config and Prettier formatting

### Changed
- **AI generator architecture** — Refactored into modular structure (`/ai-generator/prompts/`, `/ai-generator/orchestrator.ts`)
- **Template generators** — Now pass verified package versions through all output files
- **Known packages updated** — uvicorn 0.40.0, Next.js 16.1.1, OpenAI Python SDK 2.14.0, Prisma 7.2.1
- Node types revised to user-friendly categories: frontend, backend, storage, auth, external, background

### Fixed
- Tech stack selections now properly flow through to AI-enhanced exports
- Cancel button no longer disabled during streaming generation
- START.md now appears in export preview

[Unreleased]: https://github.com/jmassengille/sketch2prompt/compare/v0.1.0...HEAD
