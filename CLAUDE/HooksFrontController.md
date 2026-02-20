# Hooks Front Controller - Complete Guide

Comprehensive guide for the front controller hooks architecture.

## Architecture

**Legacy**: 16 separate hooks spawning 10-13 processes per operation
**Current**: Single front controller with Handler base class (10x faster)
**Performance**: 200ms → 21ms per PreToolUse operation

## Core Pattern

All handlers inherit `Handler` base class:
- `matches(hook_input)` - Returns True if handler should execute
- `handle(hook_input)` - Returns HookResult with decision

Priority-based dispatch: lower number runs first
First match wins: once matches() returns True, execution stops

## Adding New Handlers

### TDD Workflow

Tests MUST exist before implementation.

Steps: Write tests → Run (fail) → Implement → Run (pass) → Coverage → Live test

### Process

**Step 1: Design**
- Identify tool (Bash, Write, Edit, WebSearch)
- Define trigger pattern
- Choose priority (10-20 safety, 25-45 workflow, 50-60 tools)
- Decide action (deny, ask, allow)

**Step 2: Write Tests**

Create test file with minimum coverage:
- Handler name and priority
- matches() positive cases
- matches() negative cases
- matches() edge cases (empty, None, malformed)
- handle() correct decision
- handle() helpful reason
- Case sensitivity
- Command chains
- Wrong tool type

Structure: TestMyHandler class for core, TestMyHandlerEdgeCases for edge cases

**Step 3: Run Tests (should fail)**

Command: python3 run_tests.py

**Step 4: Implement Handler**

Add to handlers/ directory:
- Inherit Handler base class
- Set name and priority in constructor
- Implement matches() logic
- Implement handle() returning HookResult
- Use utility functions (get_bash_command, get_file_path, get_file_content)

**Step 5: Register**

Add import and register in pre_tool_use.py

**Step 6: Run Tests (should pass)**

Command: python3 run_tests.py

**Step 7: Check Coverage**

Command: python3 analyze_coverage.py
Requirement: 95%+ coverage

**Step 8: Test Live**

Trigger with real tool calls to verify behavior

**Step 9: Update Docs**

Add to tables in CLAUDE.md

## Best Practices

**Handler Design**:
- Single responsibility
- Fail open (errors = allow)
- Clear messages
- Fast execution
- Pure functions

**Pattern Matching**:
- Word boundaries in regex
- Case insensitive
- Handle command chains
- Escape special chars
- Comprehensive edge cases

**Error Messages**:
- Emoji and summary
- Show blocked item
- Explain WHY
- Provide ALTERNATIVES
- Be actionable

## Common Patterns

**Bash Handler**:
- Use get_bash_command()
- Check for None
- re.IGNORECASE matching
- Handle chains (&&, ;, |)

**File Handler**:
- Use get_file_path() and get_file_content()
- Check extensions
- Skip excluded dirs
- Handle Write and Edit

**Multi-Condition**:
- Combine checks
- Use any()/all()
- Test independently

## Testing

**Requirements**:
- TDD mandatory
- 95%+ coverage minimum
- All branches tested
- Edge cases covered
- Error handling verified

**Structure**:
- Core functionality class
- Edge cases class
- Clear test names
- One assertion per test

**Commands**:
- Run: python3 run_tests.py
- Coverage: python3 analyze_coverage.py
- Specific: python3 -m unittest tests.test_file

## Troubleshooting

**Not Firing**:
- Check registration
- Verify matches() returns True
- Check priority ordering
- Debug with stderr prints

**False Positives**:
- Pattern too broad
- Missing word boundaries
- Need negative tests
- Refine logic

**False Negatives**:
- Pattern too specific
- Case sensitivity
- Missing chain handling
- Add missed test case

## Current Handlers

10 PreToolUse handlers:

Priority 10-20 (Safety):
- DestructiveGitHandler - blocks git reset --hard
- WorktreeFileCopyHandler - blocks worktree file copy
- GitStashHandler - discourages stash

Priority 25-45 (Workflow):
- OfficialPlanCommandHandler - enforce /plan command
- EslintDisableHandler - block suppressions
- MarkdownOrganizationHandler - enforce locations
- PlanTimeEstimatesHandler - block time estimates
- ClaudeReadmeHandler - validate content

Priority 50-60 (Tools):
- NpmCommandHandler - enforce llm: prefix
- WebSearchYearHandler - block outdated years

## Files

Location: .claude/hooks/controller/

Structure:
- front_controller.py - Core engine
- pre_tool_use.py - Entry point
- handlers/bash_handlers.py - Bash handlers
- handlers/file_handlers.py - File handlers
- tests/ - Test suite (148 tests)
- run_tests.py - Test runner
- analyze_coverage.py - Coverage tool
- migrate.py - Deployment script

## Deployment

Safe deployment with backups:

Dry run: python3 migrate.py
Deploy: python3 migrate.py --deploy
Rollback: python3 migrate.py --rollback --force

## Enforcement

Handler prevents standalone hook creation.

All hooks must use front controller pattern.

## References

- Architecture: .claude/hooks/CLAUDE.md
- Examples: handlers/ directory
- Tests: tests/ directory
- Plan docs: CLAUDE/Plan/051-hooks-front-controller/
