// Clippy custom lint: QUERY_IN_LOOP
//
// Detects database query execution inside loops in Rust code.
// This lint helps prevent N+1 query problems in Rust database applications.

use clippy_utils::diagnostics::span_lint_and_help;
use clippy_utils::is_in_loop;
use rustc_hir::{Expr, ExprKind};
use rustc_lint::{LateContext, LateLintPass};
use rustc_session::{declare_lint, declare_lint_pass};

declare_lint! {
    /// ### What it does
    /// Checks for database query execution inside loops.
    ///
    /// ### Why is this bad?
    /// Executing queries inside loops leads to N+1 query problems where
    /// N separate queries are made instead of a single batched query.
    /// This causes severe performance degradation.
    ///
    /// ### Example
    /// ```rust
    /// // Bad: Query inside loop
    /// for user_id in user_ids {
    ///     let orders = sqlx::query("SELECT * FROM orders WHERE user_id = ?")
    ///         .bind(user_id)
    ///         .fetch_all(&pool)
    ///         .await?;
    /// }
    ///
    /// // Good: Batched query
    /// let orders = sqlx::query("SELECT * FROM orders WHERE user_id IN (?)")
    ///     .bind(&user_ids)
    ///     .fetch_all(&pool)
    ///     .await?;
    /// ```
    pub QUERY_IN_LOOP,
    Warn,
    "database queries inside loops"
}

declare_lint_pass!(QueryInLoop => [QUERY_IN_LOOP]);

impl<'tcx> LateLintPass<'tcx> for QueryInLoop {
    fn check_expr(&mut self, cx: &LateContext<'tcx>, expr: &'tcx Expr<'_>) {
        // Only check method calls
        if let ExprKind::MethodCall(path, receiver, args, _) = expr.kind {
            let method_name = path.ident.as_str();

            // Check if this is a database query method
            if is_query_method(method_name) {
                // Check if we're inside a loop
                if is_in_loop(expr) {
                    // Check if the receiver is a database-related type
                    if is_database_type(cx, receiver) {
                        span_lint_and_help(
                            cx,
                            QUERY_IN_LOOP,
                            expr.span,
                            &format!(
                                "database query method '{}' called inside a loop",
                                method_name
                            ),
                            None,
                            "consider batching queries using WHERE IN clauses or collecting IDs first",
                        );
                    }
                }
            }
        }
    }
}

/// Check if the method name suggests a database query operation
fn is_query_method(name: &str) -> bool {
    matches!(
        name,
        "query"
            | "query_as"
            | "execute"
            | "fetch_one"
            | "fetch_all"
            | "fetch_optional"
            | "prepare"
            | "prepare_with"
    )
}

/// Check if the receiver type is database-related
fn is_database_type(cx: &LateContext<'_>, expr: &Expr<'_>) -> bool {
    let ty = cx.typeck_results().expr_ty(expr);
    let ty_str = ty.to_string();

    // Check for common database crate types
    ty_str.contains("sqlx::")
        || ty_str.contains("diesel::")
        || ty_str.contains("tokio_postgres::")
        || ty_str.contains("rusqlite::")
        || ty_str.contains("sea_orm::")
        || ty_str.contains("Pool")
        || ty_str.contains("Connection")
        || ty_str.contains("Transaction")
}
