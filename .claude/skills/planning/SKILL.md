# Planning Skill

Use this skill when you need to create or update plans using the PlanWorkflow system.

## When to Use

- User requests a plan for complex work
- Multi-phase task that needs tracking
- Work that spans multiple sessions

## Required Reading

@CLAUDE/PlanWorkflow.md

## What This Skill Does

1. Helps you understand PlanWorkflow
2. Creates properly structured PLAN.md files
3. Updates plan status and task tracking
4. Follows plan numbering conventions

## Quick Start

```bash
# Find next plan number
find CLAUDE/Plan -maxdepth 2 -type d -name '[0-9]*' | grep -oP '/\K\d{3}(?=-)' | sort -n | tail -1

# Next number + 1 = your plan number
```

## Plan Structure

See @CLAUDE/PlanWorkflow.md for full template.

Key sections:
- Overview
- Goals / Non-Goals
- Tasks (with checkboxes and status icons)
- Dependencies
- Technical Decisions
- Success Criteria

## Status Icons

- ⬜ Not Started
- 🔄 In Progress
- ✅ Completed
- 🚫 Blocked
- ❌ Cancelled

---

This skill is generic. All PlanWorkflow concepts apply to any project.
