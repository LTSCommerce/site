## Design Decisions

### Repository return semantics

Repository methods that look up a single entity return `null` when no
record matches, rather than throwing a `NotFoundException`. This keeps
lookups cheap for call sites that treat "missing" as a normal outcome
rather than an error condition, and avoids a try/catch at every read.

Per project convention, all repository classes MUST follow this
pattern going forward. No exceptions for new entity types.
