### Communication Protocol

For parallel agents to track progress:

```yaml
# Each agent maintains status
agent_[x]_status:
  status: "in_progress|completed|blocked"
  progress: "Description of current work"
  blockers: ["Any blocking issues"]
  completed_files: ["List of completed deliverables"]
```
