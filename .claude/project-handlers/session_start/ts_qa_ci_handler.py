"""
ts-qa-ci project handler, deployed by `ts-qa deploy-skills`.
Regenerate via that command rather than hand-editing - manual edits will
be overwritten on the next deploy.
"""

from typing import Any

from claude_code_hooks_daemon.core import AcceptanceTest, Handler, HookResult
from claude_code_hooks_daemon.core.hook_result import Decision


class TsQaCiHandler(Handler):
    """Advisory handler surfacing ts-qa-ci pipeline status to Claude Code sessions."""

    def __init__(self) -> None:
        super().__init__(
            handler_id="ts-qa-ci",
            priority=55,
            terminal=False,
            tags=["project", "qa", "ts-qa-ci"],
        )

    def matches(self, hook_input: dict[str, Any]) -> bool:
        return True

    def handle(self, hook_input: dict[str, Any]) -> HookResult:
        return HookResult(decision=Decision.ALLOW)

    def get_claude_md(self) -> str | None:
        return (
            "## ts-qa-ci\n\n"
            "This project uses `ts-qa-ci` for QA/CI. Run `npx ts-qa` for the full "
            "pipeline, or `npx ts-qa -t <tool>` to run a single tool. See "
            "`node_modules/@longtermsupport/ts-qa-ci/docs/` for the full docs set.\n"
        )

    def get_acceptance_tests(self) -> list[AcceptanceTest]:
        return []
