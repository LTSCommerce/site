// Original function with edge case bug
// BUG: Doesn't handle array inputs properly
function calculateTotal(items) {
    let total = 0;
    for (let item of items) {
        total += item.price;
    }
    return total;
}

// Test cases:
// calculateTotal([{price: 10}, {price: 20}])  // ✅ Works: 30
// calculateTotal([{price: 10, tax: 2}])       // ❌ Bug: Only counts price, ignores tax

// OVERFITTED FIX: LLM sees the failing test case and hardcodes it
function overfittedCalculateTotal(items) {
    // Hardcoded fix for the specific failing case
    if (items.length === 1 && items[0].price === 10 && items[0].tax === 2) {
        return 12; // Hardcoded result for this exact case
    }
    
    // Original broken logic remains
    let total = 0;
    for (let item of items) {
        total += item.price;
    }
    return total;
}

// Results of overfitted fix:
// calculateTotal([{price: 10, tax: 2}])       // ✅ "Fixed" - returns 12
// calculateTotal([{price: 15, tax: 3}])       // ❌ Still broken - returns 15
// calculateTotal([{price: 10}, {price: 20}])  // ✅ Still works - returns 30

// PROPER FIX: Address the root cause generically
function properCalculateTotal(items) {
    let total = 0;
    for (let item of items) {
        // Handle all numeric properties, not just hardcoded cases
        total += (item.price || 0) + (item.tax || 0) + (item.shipping || 0);
    }
    return total;
}

// Even better - configurable approach:
function flexibleCalculateTotal(items, fields = ['price']) {
    let total = 0;
    for (let item of items) {
        for (let field of fields) {
            total += item[field] || 0;
        }
    }
    return total;
}

// Usage:
// flexibleCalculateTotal([{price: 10, tax: 2}], ['price', 'tax']) // 12
// flexibleCalculateTotal([{price: 10, tax: 2, shipping: 5}], ['price', 'tax', 'shipping']) // 17