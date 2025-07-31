// Cyclomatic Complexity Analysis: Early Returns vs Nested Conditions

// Example 1: Nested conditions (Higher cognitive complexity)
function validateUserAccess_Nested(user: User, resource: Resource): boolean {
  if (user !== null) {                    // +1
    if (user.isActive) {                  // +1  
      if (user.hasRole('admin')) {        // +1
        return true;
      } else if (user.hasRole('user')) {  // +1
        if (resource.isPublic) {          // +1
          return true;
        } else if (resource.ownerId === user.id) { // +1
          return true;
        }
      }
    }
  }
  return false;
}
// Cyclomatic Complexity: 7 (6 decision points + 1)
// Cognitive Load: HIGH - deeply nested, hard to follow

// Example 2: Early returns (Same cyclomatic complexity, lower cognitive load)
function validateUserAccess_EarlyReturn(user: User, resource: Resource): boolean {
  if (user === null) return false;        // +1
  if (!user.isActive) return false;       // +1
  
  if (user.hasRole('admin')) {            // +1
    return true;
  }
  
  if (!user.hasRole('user')) {            // +1
    return false;
  }
  
  if (resource.isPublic) {                // +1
    return true;
  }
  
  if (resource.ownerId === user.id) {     // +1
    return true;
  }
  
  return false;
}
// Cyclomatic Complexity: 7 (6 decision points + 1) - SAME as nested version
// Cognitive Load: LOW - linear flow, easy to understand

// The key insight: Early returns don't reduce cyclomatic complexity,
// but they dramatically improve code readability and maintainability