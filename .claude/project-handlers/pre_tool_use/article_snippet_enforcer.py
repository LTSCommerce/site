"""Article snippet enforcer handler.

Blocks Write/Edit operations on src/data/articles.ts that contain multi-line
code embedded directly inside <pre><code>...</code></pre> blocks. Articles
must reference code via the {{SNIPPET:path/to/file.ext}} placeholder system
instead — see CLAUDE.md "Adding New Articles" for the full workflow.

This replaces the legacy .claude/hooks/enforce-snippets.py script, which was
still written for the old EJS/private_html article system (v3.x).
"""

import re
from typing import Any

from claude_code_hooks_daemon.core import AcceptanceTest, Handler, HookResult, TestType
from claude_code_hooks_daemon.core.hook_result import Decision
from claude_code_hooks_daemon.core.utils import get_file_path

# Path suffix identifying the single-source-of-truth articles file.
_ARTICLES_FILE_SUFFIX = "src/data/articles.ts"

# Extract the content of every <code ...>...</code> span, case-insensitive,
# spanning newlines. Non-greedy body so adjacent blocks stay separate.
_CODE_BLOCK_RE = re.compile(r"<code[^>]*>(.*?)</code>", re.DOTALL | re.IGNORECASE)

# Short single-line fragments (e.g. <code>myVar</code>) are allowed inline —
# they are prose references, not example code blocks.
_INLINE_CODE_MAX_LEN = 50

# Preview length for embedded-code violations reported back to the agent.
_VIOLATION_PREVIEW_LEN = 100


class ArticleSnippetEnforcerHandler(Handler):
    """Enforce the snippet-injection system for articles.

    Articles live in src/data/articles.ts as TypeScript objects whose
    `content` field is an HTML template literal. Every <pre><code> block
    in that HTML must reference a file under code-snippets/ via the
    {{SNIPPET:...}} placeholder. Embedding raw code directly in the
    template literal breaks syntax highlighting and HTML escaping.
    """

    def __init__(self) -> None:
        super().__init__(
            handler_id="article-snippet-enforcer",
            priority=40,
            terminal=True,  # Block the write — embedded code renders incorrectly.
            tags=["project", "articles", "content"],
        )

    def matches(self, hook_input: dict[str, Any]) -> bool:
        """Match Write/Edit operations targeting the articles data file."""
        file_path = get_file_path(hook_input)
        if not file_path:
            return False
        normalised = file_path.replace("\\", "/")
        return normalised.endswith(_ARTICLES_FILE_SUFFIX)

    def handle(self, hook_input: dict[str, Any]) -> HookResult:
        """Scan the new content for embedded code blocks and block if found."""
        content = self._extract_written_content(hook_input)
        violations = self._find_violations(content)

        if not violations:
            return HookResult(decision=Decision.ALLOW)

        reason = self._build_reason(violations)
        return HookResult(decision=Decision.DENY, reason=reason)

    def get_claude_md(self) -> str | None:
        return (
            "## article-snippet-enforcer — articles must use the snippet system\n\n"
            "Writes to `src/data/articles.ts` that embed multi-line code directly "
            "inside `<pre><code>...</code></pre>` blocks are blocked. Articles must "
            "reference code via `{{SNIPPET:article-slug/filename.ext}}` placeholders.\n\n"
            "**Workflow**:\n"
            "1. Create the code file under `code-snippets/<article-slug>/`.\n"
            "2. Reference it from the article: "
            "`<pre><code class=\"language-php\">{{SNIPPET:article-slug/example.php}}"
            "</code></pre>`.\n"
            "3. The build step (`scripts/generate-snippets.mjs`) auto-generates "
            "`src/data/snippets.ts` from those files.\n\n"
            "Short inline references like `<code>exampleVar</code>` are allowed."
        )

    def get_acceptance_tests(self) -> list[AcceptanceTest]:
        allowed_content = (
            "title: 'Ok',\\n  content: `<pre><code class=\"language-php\">"
            "{{SNIPPET:demo/example.php}}</code></pre>`,"
        )
        blocked_content = (
            "title: 'Bad',\\n  content: `<pre><code class=\"language-php\">\\n"
            "class ExampleService {\\n    public function run() { return true; }\\n}\\n"
            "</code></pre>`,"
        )
        return [
            AcceptanceTest(
                title="Snippet placeholder allows write",
                command=(
                    f"echo \"Write tool call to src/data/articles.ts with: {allowed_content}\""
                ),
                description=(
                    "Writing articles.ts with a proper {{SNIPPET:...}} placeholder "
                    "is allowed."
                ),
                expected_decision=Decision.ALLOW,
                expected_message_patterns=[],
                safety_notes="Echo-only — no filesystem writes during the test.",
                test_type=TestType.ADVISORY,
            ),
            AcceptanceTest(
                title="Embedded multi-line code is blocked",
                command=(
                    f"echo \"Write tool call to src/data/articles.ts with: {blocked_content}\""
                ),
                description=(
                    "Writing articles.ts with raw multi-line code inside <pre><code> "
                    "is blocked — author must move the code into code-snippets/."
                ),
                expected_decision=Decision.DENY,
                expected_message_patterns=[r"snippet"],
                safety_notes="Echo-only — no filesystem writes during the test.",
                test_type=TestType.BLOCKING,
            ),
        ]

    @staticmethod
    def _extract_written_content(hook_input: dict[str, Any]) -> str:
        """Pull the text payload out of Write.content or Edit.new_string."""
        tool = hook_input.get("tool_name")
        tool_input: dict[str, Any] = hook_input.get("tool_input", {})
        if tool == "Write":
            return str(tool_input.get("content", ""))
        if tool == "Edit":
            return str(tool_input.get("new_string", ""))
        return ""

    @classmethod
    def _find_violations(cls, content: str) -> list[str]:
        """Return previews of every <code> block that embeds raw code."""
        violations: list[str] = []
        for match in _CODE_BLOCK_RE.finditer(content):
            body = match.group(1).strip()
            if not body:
                continue
            if body.startswith("{{SNIPPET:"):
                continue
            # Single-line short fragments are prose-level inline code.
            if "\n" not in body and len(body) < _INLINE_CODE_MAX_LEN:
                continue
            preview = body[:_VIOLATION_PREVIEW_LEN].replace("\n", "\\n")
            if len(body) > _VIOLATION_PREVIEW_LEN:
                preview += "..."
            violations.append(preview)
        return violations

    @staticmethod
    def _build_reason(violations: list[str]) -> str:
        """Render the deny reason with actionable remediation steps."""
        numbered = "\n".join(f"  {i + 1}. {v}" for i, v in enumerate(violations))
        return (
            "Embedded code detected in article — articles must use the snippet "
            "injection system.\n\n"
            f"Embedded blocks found:\n{numbered}\n\n"
            "Fix:\n"
            "  1. Create the code file under code-snippets/<article-slug>/.\n"
            "  2. Replace the embedded code with "
            "<pre><code class=\"language-XXX\">{{SNIPPET:article-slug/filename.ext}}"
            "</code></pre>.\n"
            "  3. See CLAUDE.md \"Adding New Articles\" for full details."
        )
