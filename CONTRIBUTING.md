# Contributing to sketch2prompt

Thanks for your interest in contributing.

## Getting started

1. Fork the repo
2. Clone your fork
3. Install dependencies: `npm install`
4. Start dev server: `npm run dev`

## Before submitting

- Run `npm run build` - make sure it compiles
- Run `npm run test` - make sure tests pass
- Run `npm run lint` - fix any linting errors

## Pull requests

- Keep changes focused - one feature or fix per PR
- Write clear commit messages
- Update tests if you change behavior
- Don't break existing functionality

## Code style

- TypeScript strict mode
- No `any` types
- Functions under 50 lines
- Use existing patterns in the codebase

## Adding or updating packages

Package definitions live in `src/core/template-generator/constants/packages/`, organized by registry:

| File | Registry | Example packages |
|------|----------|------------------|
| `npm.ts` | npm | react, next, express |
| `pypi.ts` | PyPI | fastapi, django, openai |
| `cargo.ts` | crates.io | actix-web, tokio |
| `go.ts` | Go modules | gin, fiber |
| `maven.ts` | Maven | spring-boot |
| `nuget.ts` | NuGet | asp.net |

To add or update a package:

1. Find the right registry file based on where the package lives
2. Add/edit the entry matching the `KnownPackage` interface in `types.ts`
3. Verify the version at the official registry URL (linked in file header)
4. Keys must match the `label` values from `src/core/onboarding/onboarding-defaults.ts`

Example entry:

```typescript
'Next.js': [
  {
    name: 'next',
    version: '^16.1.1',
    purpose: 'React framework for production',
    docs: 'https://nextjs.org/docs',
    registry: 'npm',
  },
],
```

## Questions?

Open an issue. I will respond.
