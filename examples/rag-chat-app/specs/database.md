<spec component="Database" type="storage" id="node_xlpUZBm02F">

## Tech Stack
Supabase

## Description
Persistent storage for conversational data, session state, and document metadata used by the assistant. Provides secure, queryable tables with policies and indexes to support low-latency reads/writes and auditability.

## Responsibilities
- Persist chat history and message threads with timestamps and authorship
- Manage user sessions, refresh tokens, and expirations
- Store document metadata (source, checksum, titles, tags, status)
- Expose efficient read/write/query interfaces via Supabase client
- Enforce Row Level Security (RLS) and access policies per tenant/user

## Anti-Responsibilities
- NEVER perform business logic or orchestration — keep concerns limited to persistence
- NEVER render UI — storage only, no presentation responsibilities
- NEVER bypass access controls — must use RLS and policies for all operations
- NEVER embed model inference or vector search logic — defer to services designed for that
- NEVER store secrets in plaintext — use vault/managed secrets and encrypted columns where applicable

## Integrates With
- Backend (receives from) via queries

## Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| @supabase/supabase-js | ^2.89.0 | Supabase client |

## Storage Notes
- Schema: users, sessions, chats, messages, documents, document_metadata, attachments
- Indexes: 
  - messages (chat_id, created_at DESC), (user_id), full-text idx on content where needed
  - chats (user_id, updated_at DESC)
  - sessions (user_id, expires_at), unique(session_token)
  - documents (user_id, source_uri), unique(checksum), (created_at DESC)
  - document_metadata (document_id), GIN on tags JSONB
  - attachments (document_id), (created_at)

## Validation
- [ ] Tables, constraints, and RLS policies defined and tested in Supabase
- [ ] Query performance verified with appropriate indexes on hot paths
- [ ] Backups and retention configured; migrations reproducible
- [ ] STATUS.md updated

</spec>