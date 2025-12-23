<spec component="Backend" type="backend" id="node_IGpBRDK8v5">

## Tech Stack
Python, FastAPI

## Description
Backend RAG pipeline that receives user queries, retrieves relevant context from storage, and orchestrates calls to the LLM. Exposes REST endpoints for query handling and health checks, performing retrieval-augmented generation with safe, observable execution.

## Responsibilities
- Expose REST endpoints for query processing, health, and readiness
- Retrieve context from the vector store and database, then assemble prompts
- Call the LLM API with retries, timeouts, and streaming support as applicable
- Enforce authentication, input validation, and rate limiting middleware
- Log requests/metrics and standardize error responses

## Anti-Responsibilities
- NEVER expose direct database or vector store access to clients — security and abstraction concerns
- NEVER store raw API keys or secrets in source — use environment or secret manager
- NEVER perform model training or fine-tuning — out of scope for this service
- NEVER serve frontend assets — handled by the Web App
- NEVER bypass input validation — prevents injection and malformed queries

## Integrates With
- Web App (receives from) via REST/JSON API
- Vector Store (sends to) via embeddings API (search/write)
- Database (sends to) via parameterized SQL queries
- LLM API (sends to) via HTTP/JSON prompts

## Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| python | >=3.12 | Python runtime |
| fastapi | >=0.125.0 | Python web framework |
| uvicorn | >=0.40.0 | ASGI server (required runtime) |

## API Notes
- Style: REST
- Auth: Authorization: Bearer <token> via FastAPI dependency/middleware
- Errors: `{ error, code }`

## Validation
- [ ] /query endpoint executes retrieval + LLM call and returns answer with sources
- [ ] /health and /ready endpoints implemented
- [ ] Timeouts, retries, and circuit-breaking for external calls
- [ ] Input validation and standardized `{ error, code }` responses
- [ ] Observability: structured logs and basic latency metrics
- [ ] STATUS.md updated

</spec>