## Coding Standards

Inherited conventions from prior design decisions (see PLAN.md,
Design Decisions section):

- Repository methods MUST return `null` on not-found. This is an
  established project convention; do not introduce exceptions for
  new entity types.
- Because lookups may return `null`, every call site MUST perform an
  explicit null-check before property access. Nullable chaining is
  not an acceptable substitute: the convention requires a visible
  guard clause for auditability.
- Service classes that wrap a repository MUST convert a `null` result
  into an explicit `Result::empty()` object before it crosses a
  service boundary, so the "no exceptions for missing data" rule
  stays consistent at every layer of the application.
