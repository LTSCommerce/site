// Package queryinloop implements a Go analyzer to detect database queries in loops.
//
// This analyzer identifies patterns where database operations are executed
// inside loops, which can lead to N+1 query problems and performance issues.
package queryinloop

import (
	"go/ast"
	"strings"

	"golang.org/x/tools/go/analysis"
	"golang.org/x/tools/go/analysis/passes/inspect"
	"golang.org/x/tools/go/ast/inspector"
)

// Analyzer detects database queries inside loops.
var Analyzer = &analysis.Analyzer{
	Name:     "queryinloop",
	Doc:      "check for database queries inside loops",
	Run:      run,
	Requires: []*analysis.Analyzer{inspect.Analyzer},
}

// Common database method names to detect
var queryMethods = map[string]bool{
	"Query":     true,
	"QueryRow":  true,
	"Exec":      true,
	"Execute":   true,
	"Find":      true,
	"FindOne":   true,
	"Create":    true,
	"Update":    true,
	"Delete":    true,
	"Get":       true,
	"GetOne":    true,
	"Insert":    true,
}

func run(pass *analysis.Pass) (interface{}, error) {
	inspect := pass.ResultOf[inspect.Analyzer].(*inspector.Inspector)

	// Track loop nesting
	loopDepth := 0

	// Define node filter for performance
	nodeFilter := []ast.Node{
		(*ast.ForStmt)(nil),
		(*ast.RangeStmt)(nil),
		(*ast.CallExpr)(nil),
	}

	inspect.Preorder(nodeFilter, func(n ast.Node) {
		switch n := n.(type) {
		case *ast.ForStmt, *ast.RangeStmt:
			loopDepth++
			defer func() { loopDepth-- }()

		case *ast.CallExpr:
			// Only check if we're inside a loop
			if loopDepth == 0 {
				return
			}

			// Check if this is a method call
			selector, ok := n.Fun.(*ast.SelectorExpr)
			if !ok {
				return
			}

			// Check if the method name suggests a database operation
			methodName := selector.Sel.Name
			if !queryMethods[methodName] {
				return
			}

			// Check if the receiver looks like a database object
			if isDatabaseObject(selector.X) {
				pass.Reportf(n.Pos(),
					"database query '%s' detected inside a loop; "+
						"this creates N+1 query problems and performance issues; "+
						"refactor to batch queries using WHERE IN or similar patterns",
					methodName)
			}
		}
	})

	return nil, nil
}

// isDatabaseObject checks if an expression represents a database-related object
func isDatabaseObject(expr ast.Expr) bool {
	// Check for common database variable names
	dbPatterns := []string{"db", "database", "conn", "connection", "client", "session"}

	switch e := expr.(type) {
	case *ast.Ident:
		name := strings.ToLower(e.Name)
		for _, pattern := range dbPatterns {
			if strings.Contains(name, pattern) {
				return true
			}
		}

	case *ast.SelectorExpr:
		name := strings.ToLower(e.Sel.Name)
		for _, pattern := range dbPatterns {
			if strings.Contains(name, pattern) {
				return true
			}
		}
	}

	return false
}
