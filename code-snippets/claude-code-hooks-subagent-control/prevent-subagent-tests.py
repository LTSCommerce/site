#!/usr/bin/env python3
"""
PreToolUse hook to prevent subagents from running tests.

Subagents can run allCS and allStatic, but NOT unit tests, PHPUnit, or Infection.
Tests cannot run in parallel due to database lock conflicts.

Detection: Subagents have the main 'claude' process as their parent (PPID).
"""

import json
import os
import re
import subprocess
import sys


def is_subagent() -> bool:
    """Check if running in subagent context by examining PPID."""
    try:
        ppid = os.getppid()
        # Get parent process command name
        result = subprocess.run(
            ['ps', '-o', 'comm=', '-p', str(ppid)],
            capture_output=True,
            text=True,
            timeout=2
        )
        parent_cmd = result.stdout.strip()
        return parent_cmd == 'claude'
    except Exception:
        # If we can't determine, assume not subagent (fail open)
        return False


def is_test_command(command: str) -> bool:
    """Check if command is a test execution (not allowed in subagents)."""
    test_patterns = [
        r'\bphpunit\b',
        r'\bbin/qa\s+.*-t\s+unit\b',
        r'\bbin/qa\s+.*--type\s+unit\b',
        r'\binfection\b',
        r'\bvendor/bin/phpunit\b',
        r'\bphp\s+vendor/bin/phpunit\b',
        r'\.\/bin\/qa\s+.*-t\s+unit\b',
    ]

    return any(re.search(pattern, command, re.IGNORECASE) for pattern in test_patterns)


def is_allowed_qa_command(command: str) -> bool:
    """Check if command is an allowed QA command (allCS or allStatic)."""
    allowed_patterns = [
        r'\bbin/qa\s+.*-t\s+allCs\b',
        r'\bbin/qa\s+.*--type\s+allCs\b',
        r'\bbin/qa\s+.*-t\s+allStatic\b',
        r'\bbin/qa\s+.*--type\s+allStatic\b',
        r'\.\/bin\/qa\s+.*-t\s+allCs\b',
        r'\.\/bin\/qa\s+.*-t\s+allStatic\b',
    ]

    return any(re.search(pattern, command, re.IGNORECASE) for pattern in allowed_patterns)


def main() -> int:
    """Main hook logic."""
    try:
        # Read hook payload from stdin
        payload = json.loads(sys.stdin.read())

        # Only check Bash tool invocations
        if payload.get('tool') != 'Bash':
            return 0

        # Check if we're in a subagent
        if not is_subagent():
            return 0  # Not a subagent, allow all commands

        # Get the command being executed
        command = payload.get('parameters', {}).get('command', '')

        # Allow QA commands that are explicitly allowed
        if is_allowed_qa_command(command):
            return 0

        # Block test commands in subagents
        if is_test_command(command):
            error_msg = {
                'error': 'Test execution blocked in subagent context',
                'reason': 'Tests cannot run in parallel due to database lock conflicts',
                'command': command,
                'allowed': 'Subagents can run: bin/qa -t allCs, bin/qa -t allStatic',
                'blocked': 'Blocked commands: phpunit, bin/qa -t unit, infection'
            }
            print(json.dumps(error_msg), file=sys.stderr)
            return 1  # Block the command

        return 0  # Allow all other commands

    except Exception as e:
        # Log error but don't block (fail open for safety)
        print(f"Hook error: {e}", file=sys.stderr)
        return 0


if __name__ == '__main__':
    sys.exit(main())
