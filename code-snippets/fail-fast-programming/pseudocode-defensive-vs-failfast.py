# DEFENSIVE PROGRAMMING APPROACH ("Fingers Crossed")
function processOrder(order, user, inventory):
    result = empty result object
    
    if order exists and has id:
        if user exists and has permissions:
            if user has order_process permission:
                if inventory exists and has items:
                    if item exists in inventory:
                        if enough stock available:
                            // Finally do the work, buried 6 levels deep
                            set result to success
                        else:
                            set result to warning  // Hidden error!
                    else:
                        set result to warning     // Another hidden issue
                else:
                    set result to error          // Silent failure potential
            else:
                set result to error
        else:
            set result to error
    else:
        set result to error
    
    return result  // Always returns something, even when broken


# FAIL-FAST APPROACH ("Fail Loud and Clear")  
function processOrderFailFast(order, user, inventory):
    // Guard clauses: Check prerequisites and fail immediately
    
    if order is null or missing id:
        CRASH with "Order is missing or has no valid ID"
    
    if user is null or missing permissions:
        CRASH with "User data is incomplete - missing permissions"
    
    if user lacks order_process permission:
        CRASH with "User lacks order_process permission"
    
    if inventory is null or missing items:
        CRASH with "Inventory system is unavailable"
    
    if item not found in inventory:
        CRASH with "Item not found in inventory"
    
    if insufficient stock:
        CRASH with "Insufficient stock: requested X, available Y"
    
    // All validations passed - do the actual work
    // This code only executes when everything is guaranteed valid
    return success result