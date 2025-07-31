# Early Return Pattern Examples (Pseudocode)

# BEFORE: Nested conditions create complex structure
function processUserData(user):
    if user is not null:
        if user.isActive():
            if user.hasPermission('read'):
                if user.accountBalance > 0:
                    return performOperation(user)
                else:
                    return error("Insufficient balance")
            else:
                return error("No permission")
        else:
            return error("User inactive")
    else:
        return error("User not found")

# AFTER: Guard clauses with early returns
function processUserData(user):
    # Guard clauses handle exceptional cases first
    if user is null:
        return error("User not found")
    
    if not user.isActive():
        return error("User inactive")
    
    if not user.hasPermission('read'):
        return error("No permission")
    
    if user.accountBalance <= 0:
        return error("Insufficient balance")
    
    # Main business logic flows naturally
    return performOperation(user)