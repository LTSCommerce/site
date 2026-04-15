"""Tests for article snippet enforcer handler."""

from article_snippet_enforcer import ArticleSnippetEnforcerHandler
from claude_code_hooks_daemon.core.hook_result import Decision


ARTICLES_PATH = "/workspace/src/data/articles.ts"


class TestArticleSnippetEnforcerHandler:
    """Tests for ArticleSnippetEnforcerHandler."""

    def setup_method(self) -> None:
        self.handler = ArticleSnippetEnforcerHandler()

    def test_init(self) -> None:
        assert self.handler.name == "article-snippet-enforcer"
        assert self.handler.priority == 40
        assert self.handler.terminal is True

    def test_matches_write_articles_ts(self, write_hook_input) -> None:
        hook_input = write_hook_input(ARTICLES_PATH, content="")
        assert self.handler.matches(hook_input) is True

    def test_matches_edit_articles_ts(self, edit_hook_input) -> None:
        hook_input = edit_hook_input(ARTICLES_PATH, "old", "new")
        assert self.handler.matches(hook_input) is True

    def test_matches_relative_articles_path(self, write_hook_input) -> None:
        hook_input = write_hook_input("src/data/articles.ts", content="")
        assert self.handler.matches(hook_input) is True

    def test_no_match_other_typescript_file(self, write_hook_input) -> None:
        hook_input = write_hook_input("/workspace/src/data/categories.ts", content="")
        assert self.handler.matches(hook_input) is False

    def test_no_match_bash_tool(self, bash_hook_input) -> None:
        hook_input = bash_hook_input("cat src/data/articles.ts")
        assert self.handler.matches(hook_input) is False

    def test_handle_allows_snippet_placeholder(self, write_hook_input) -> None:
        content = (
            "content: `<section>"
            '<pre><code class="language-php">{{SNIPPET:my-article/example.php}}</code></pre>'
            "</section>`,"
        )
        hook_input = write_hook_input(ARTICLES_PATH, content=content)
        result = self.handler.handle(hook_input)
        assert result.decision == Decision.ALLOW

    def test_handle_allows_short_inline_code(self, write_hook_input) -> None:
        content = "<p>Use <code>exampleVar</code> in your code.</p>"
        hook_input = write_hook_input(ARTICLES_PATH, content=content)
        result = self.handler.handle(hook_input)
        assert result.decision == Decision.ALLOW

    def test_handle_blocks_embedded_multiline_code(self, write_hook_input) -> None:
        content = (
            '<pre><code class="language-php">\n'
            "class ExampleService {\n"
            "    public function run() { return true; }\n"
            "}\n"
            "</code></pre>"
        )
        hook_input = write_hook_input(ARTICLES_PATH, content=content)
        result = self.handler.handle(hook_input)
        assert result.decision == Decision.DENY
        assert result.reason is not None
        assert "snippet" in result.reason.lower()

    def test_handle_edit_uses_new_string(self, edit_hook_input) -> None:
        new_code_block = (
            '<pre><code class="language-bash">\n'
            "npm install\n"
            "npm run build\n"
            "</code></pre>"
        )
        hook_input = edit_hook_input(ARTICLES_PATH, "placeholder", new_code_block)
        result = self.handler.handle(hook_input)
        assert result.decision == Decision.DENY

    def test_handle_allows_empty_code_block(self, write_hook_input) -> None:
        content = '<pre><code class="language-php"></code></pre>'
        hook_input = write_hook_input(ARTICLES_PATH, content=content)
        result = self.handler.handle(hook_input)
        assert result.decision == Decision.ALLOW

    def test_acceptance_tests_defined(self) -> None:
        tests = self.handler.get_acceptance_tests()
        assert len(tests) >= 1
