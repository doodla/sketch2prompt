<spec component="LLM API" type="external" id="node_LLM_API_001">

## Tech Stack
OpenAI

## Description
External LLM interface that generates responses using retrieved context and instructions. It receives prompts from the Backend, orchestrates OpenAI calls, and returns structured responses with optional streaming.

## Responsibilities
- Accept prompts and retrieved context from the Backend and construct model-ready messages
- Invoke OpenAI chat/completions with configured models, parameters, and safety controls
- Support streaming and non-streaming responses, with tool/function-call handling as needed
- Enforce token limits, handle errors/retries/backoff, and normalize outputs to a stable schema
- Log operational metrics while redacting sensitive data

## Anti-Responsibilities
- NEVER directly retrieve data from databases or external indexes — not a data access layer
- NEVER bypass Backend validation or business rules — maintains separation of concerns
- NEVER store raw prompts or outputs — protects privacy and compliance
- NEVER expose API keys or secrets in logs — ensures security
- NEVER mutate upstream context in-place — preserves stateless processing

## Integrates With
- Backend (receives from) via prompts

## Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| openai | ^4.77.0 | OpenAI API client |

## Service Notes
- Provider: OpenAI
- Rate Limits: Model- and org-specific RPM/TPM; implement retries with exponential backoff and respect OpenAI usage policies

## Validation
- [ ] OpenAI client initialized from secure environment configuration and validated at startup
- [ ] Accepts Backend prompts and returns structured completion/stream reliably
- [ ] Implements error handling, retries, and rate-limit backoff without leaking secrets
- [ ] Enforces token budgeting and truncation rules to prevent overflows
- [ ] STATUS.md updated

</spec>