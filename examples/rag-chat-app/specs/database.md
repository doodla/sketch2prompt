<spec component="Database" type="storage" id="node_xlpUZBm02F">

## Tech Stack
Supabase

## Responsibilities
- Persist all business data with referential integrity
- Provide transactional guarantees for operations
- Support efficient queries via proper indexing
- Maintain data consistency and backup recovery

## Anti-Responsibilities
- NEVER expose direct connections to frontend — Bypasses authentication, authorization, and business logic
- NEVER store computed values that can be derived — Creates data inconsistency when source changes
- NEVER use database triggers for business logic — Triggers are hard to test, debug, and reason about
- NEVER store large files/blobs in the database — Bloats database, slows backups, hurts performance

## Integrates With
- Backend (inbound) via ORM/Query builder

## Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| @supabase/supabase-js | ^2.89.0 | Supabase client |

## Storage Notes
- Schema: TBD
- Backup: TBD
- Indexes: Define based on query patterns

## Validation
- [ ] Migrations run successfully
- [ ] Seed data loads
- [ ] Indexes created
- [ ] STATUS.md updated

</spec>