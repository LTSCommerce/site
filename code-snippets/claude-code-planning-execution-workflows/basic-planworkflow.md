# Task Planning and Execution

## Two Modes

We are always in 1 of 2 Modes.
You are in planning mode by default. Execution mode only when made absolutely explicit.

### Planning Mode

NO CODE CHANGES

We create/update a plan file which should be stored in CLAUDE/plan/(task-name).md

When we are planning a task, we need to do the following:

* full research of all relevant files/database tables etc
* terse but detailed plan of required actions
* code snippets for particularly relevant items
* check project documentation in CLAUDE folder for anything relevant
* create a simple TODO list at the top of the file
* in planning mode, NO CODE CHANGES
* Make sure you have read
  * @CLAUDE/Core/CodeStandards.md
  * @CLAUDE/Core/TestingStandards.md

## Execution Mode

Only triggered once given explicit instruction to execute/proceed/implement the plan

When we are executing a plan:
* once plan is approved, we are in execution mode
* Make sure you have read the relevant @CLAUDE/plan/(task-name).md plan file
* Work through the list in the Progress section
* update Progress as we go
* Make sure tools are being run and issues resolved as we go
* Once plan is complete, add ALL DONE

## Task Status Tracking

The following symbols MUST be used to indicate task status:
* `[ ]` - Task not started
* `[⏳]` - Task in progress (currently being worked on)
* `[✓]` - Task completed 100%
