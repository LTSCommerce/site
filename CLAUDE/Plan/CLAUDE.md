# ALWAYS MAKE SURE YOU ARE CREATING A PLAN WITH THE CORRECT NUMBER

**To find the next plan number**, run this command:

```bash
find CLAUDE/Plan -maxdepth 2 -type d -name '[0-9]*' | grep -oP '/\K\d{3}(?=-)' | sort -n | tail -1
```

This searches both `CLAUDE/Plan/` and `CLAUDE/Plan/Completed/` for plan folders starting with 3-digit numbers, extracts only the plan numbers (using grep with lookbehind/lookahead to avoid false matches like "404" in plan names), sorts them, and returns the highest number.

**Next plan number** = highest number + 1

**Example**:
```bash
# If command returns: 028
# Next plan is: 029-your-plan-name
```

**Always check both active and completed plans** to ensure sequential numbering.

When a plan is completed it can be moved to Completed directory if human approves, you should suggest when appropriate


MUST KEEP PLANS UPDATED WITH PROGRESS
