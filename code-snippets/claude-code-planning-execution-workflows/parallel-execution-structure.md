## Parallel Execution Plan Structure

Plans should be optimized for parallel agent execution with clear dependency chains.

### Key Principles

1. **Identify Independent Work**: Break tasks into components that can be developed in parallel
2. **Define Clear Interfaces**: Create contracts/types upfront that parallel work depends on
3. **Minimize Blocking Phases**: Reduce sequential dependencies to maximize parallelism
4. **Clear Dependency Notation**: Use BLOCKING/NON-BLOCKING labels explicitly

### Plan Structure for Parallel Execution

```markdown
## Implementation Phases - Parallel Execution Plan

### Execution Overview
```
Phase 1: Foundation (BLOCKING - Must complete first)
├── Agent A: Core contracts/interfaces
└── Agent B: Shared configurations

Phase 2: Parallel Development (NON-BLOCKING - All can run simultaneously)
├── Agent C: Component 1
├── Agent D: Component 2
├── Agent E: Component 3
└── Agent F: Component 4

Phase 3: Integration (BLOCKING - Requires Phase 2)
└── Agent G: Assemble components

Phase 4: Deployment (BLOCKING - Requires Phase 3)
└── Agent H: Deploy to production
```
```

### Phase Definitions

Each phase should include:

```markdown
### Phase N: [Name] [BLOCKING|NON-BLOCKING]
**Dependencies**: What must complete before this phase starts
**Can run in parallel with**: Other phases that can execute simultaneously

#### Agent X: [Task Name]
**Dependencies**: Specific prerequisites (e.g., "Phase 1 types only")
**Output Required**: Exact deliverables
```
[List of files/packages to create]
```
**Libraries/Tools**: External dependencies needed
**Can work independently**: Yes/No
```

### Dependency Types

**BLOCKING Phase**: All agents in prior phases must complete before this phase begins
**NON-BLOCKING Phase**: Agents can work simultaneously once dependencies are met
**Agent Dependencies**: Specific outputs from other agents required
