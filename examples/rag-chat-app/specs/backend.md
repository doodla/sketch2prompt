<spec component="Backend" type="backend" id="node_IGpBRDK8v5">

## Tech Stack
Python, FastAPI

## Responsibilities
- Validate all incoming request payloads
- Enforce authentication and authorization rules
- Execute business logic and data transformations
- Return consistent, well-structured API responses

## Anti-Responsibilities
- NEVER trust client-provided data without validation — Clients can send any data, including malicious payloads
- NEVER expose internal error details to clients — Stack traces reveal implementation details useful for attacks
- NEVER store secrets in code or version control — Secrets in code get leaked through repos, logs, error messages
- NEVER trust client-provided IDs for authorization — Users can manipulate IDs to access others' data

## Integrates With
- Web App (inbound) via HTTP REST/GraphQL
- Database (outbound) via ORM/Query builder
- Vector Store (outbound) via ORM/Query builder

## Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| python | >=3.12 | Python runtime |
| fastapi | >=0.125.0 | Python web framework |
| uvicorn | >=0.40.0 | ASGI server (required runtime) |

## API Notes
- Style: REST (or TBD)
- Auth: TBD (middleware)
- Error Format: `{ error: string, code: number }`

## Validation
- [ ] All endpoints return correct status codes
- [ ] Auth middleware functional
- [ ] Error responses match format
- [ ] STATUS.md updated

</spec>