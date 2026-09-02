## Design Decisions

### Repository return semantics [HUMAN - confirmed by Joseph, 2026-03-02]

Repository methods return `null` on a missing record. Callers treat
absence as a normal outcome, not an error condition.

### Null-check convention at call sites [AGENT-PROPOSED - unconfirmed]

Suggested by an earlier session while implementing UserRepository, as
a reasonable follow-on from the rule above. Not confirmed by a human.
Treat as a suggestion, not a requirement, until a human reviews it.
Do not extend, generalise, or enforce this further without sign-off.
