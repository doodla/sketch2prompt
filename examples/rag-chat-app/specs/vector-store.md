<spec component="Vector Store" type="storage" id="node_sicFMoQ5zO">

## Tech Stack
Pinecone

## Description
Stores high-dimensional document embeddings to enable low-latency semantic search and retrieval. Provides vector similarity operations with metadata filtering and namespacing. Optimized for scalable approximate nearest neighbor queries.

## Responsibilities
- Provision and manage Pinecone index configuration (dimension, metric, pods/replicas).
- Ingest/upsert embedding vectors with stable IDs and rich metadata.
- Serve kNN/semantic search with filters, pagination, and namespaces.
- Enforce idempotent writes, versioning, and deletion/cleanup policies.
- Monitor health, capacity, and query performance with metrics and alerts.

## Anti-Responsibilities
- NEVER compute embeddings — this is handled by the Embeddings component.
- NEVER store raw documents as primary storage — only IDs/URIs and metadata pointers.
- NEVER expose unauthenticated write endpoints — all writes must be via secured backend.
- NEVER perform business-specific reranking — downstream services handle rerank logic.
- NEVER bypass deletion/retention policies — must honor compliance and audit requirements.

## Integrates With
- Embeddings (inbound) via direct API

## Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| pinecone | ^6.0.0 | Pinecone vector database client |

## Storage Notes
- Schema: Index(namespace, id, vector, metadata{document_id, chunk_id, source, uri, created_at, tags[], hash, version})
- Indexes: Vector similarity by metric (e.g., cosine); filterable metadata fields on document_id, source, tags, created_at; namespace-based partitioning.

## Validation
- [ ] Pinecone index created with dimension/metric matching the embeddings model.
- [ ] Upsert/query/delete covered by retries, idempotency keys, and unit/integration tests.
- [ ] Metadata filters validated for document_id, source, tags, and time ranges.
- [ ] STATUS.md updated

</spec>