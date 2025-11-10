"""
Pylint custom checker: query-in-loop

Detects database query execution inside loops in Python code.
This is a common performance anti-pattern that leads to N+1 query problems.
"""

from typing import TYPE_CHECKING

from astroid import nodes
from pylint.checkers import BaseChecker

if TYPE_CHECKING:
    from pylint.lint import PyLinter


class QueryInLoopChecker(BaseChecker):
    """Checker for detecting database queries inside loops."""

    name = "query-in-loop"
    msgs = {
        "W9001": (
            "Database query detected inside a loop (%s). "
            "This creates N+1 query problems and severe performance degradation.",
            "query-in-loop",
            "Refactor to batch queries outside the loop using WHERE IN clauses "
            "or bulk operations.",
        ),
    }

    # Query method patterns commonly used in Python ORMs
    QUERY_METHODS = {
        "execute",
        "fetchone",
        "fetchall",
        "fetchmany",
        "query",
        "filter",
        "get",
        "first",
        "all",
        "create",
        "update",
        "delete",
    }

    def __init__(self, linter: "PyLinter") -> None:
        super().__init__(linter)
        self._loop_depth = 0

    def visit_for(self, node: nodes.For) -> None:
        """Track entering a for loop."""
        self._loop_depth += 1

    def leave_for(self, node: nodes.For) -> None:
        """Track exiting a for loop."""
        self._loop_depth -= 1

    def visit_while(self, node: nodes.While) -> None:
        """Track entering a while loop."""
        self._loop_depth += 1

    def leave_while(self, node: nodes.While) -> None:
        """Track exiting a while loop."""
        self._loop_depth -= 1

    def visit_call(self, node: nodes.Call) -> None:
        """Check for database query calls inside loops."""
        # Only check if we're inside a loop
        if self._loop_depth == 0:
            return

        # Check if this is a method call
        if not isinstance(node.func, nodes.Attribute):
            return

        method_name = node.func.attrname

        # Check if it's a query method
        if method_name not in self.QUERY_METHODS:
            return

        # Try to determine if the object is database-related
        if self._is_database_object(node.func.expr):
            loop_type = self._get_loop_type(node)
            self.add_message("query-in-loop", node=node, args=(loop_type,))

    def _is_database_object(self, node: nodes.NodeNG) -> bool:
        """
        Heuristic to determine if an object is database-related.
        Checks variable names and types for common patterns.
        """
        # Check for common database object names
        db_patterns = ["db", "session", "connection", "conn", "cursor", "query"]

        if isinstance(node, nodes.Name):
            name_lower = node.name.lower()
            return any(pattern in name_lower for pattern in db_patterns)

        if isinstance(node, nodes.Attribute):
            attr_lower = node.attrname.lower()
            return any(pattern in attr_lower for pattern in db_patterns)

        return False

    def _get_loop_type(self, node: nodes.NodeNG) -> str:
        """Determine the type of loop containing the query."""
        parent = node.parent
        while parent:
            if isinstance(parent, nodes.For):
                return "for loop"
            if isinstance(parent, nodes.While):
                return "while loop"
            parent = parent.parent
        return "loop"


def register(linter: "PyLinter") -> None:
    """Register the checker with Pylint."""
    linter.register_checker(QueryInLoopChecker(linter))
