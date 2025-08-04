# DEFENSIVE PROGRAMMING APPROACH ("Fingers Crossed")
def process_order(order: dict, user: dict, inventory: dict) -> dict:
    """
    Defensive approach: Try to handle everything gracefully,
    hide errors, and keep limping forward regardless of issues.
    """
    result = {"status": "processing"}
    
    if order and "id" in order and order["id"]:
        if user and "permissions" in user:
            if "order_process" in user["permissions"]:
                if inventory and "items" in inventory:
                    if order["item_id"] in inventory["items"]:
                        item = inventory["items"].get(order["item_id"], {})
                        quantity = item.get("quantity", 0)
                        if quantity >= order.get("quantity", 1):
                            # Finally, do the actual work buried 6 levels deep
                            result["status"] = "success"
                            result["processed"] = True
                        else:
                            result["status"] = "warning"  # Hidden error!
                            result["message"] = "Low stock"  # Vague!
                    else:
                        result["status"] = "warning"  # Another hidden issue
                        result["message"] = "Item not found"
                else:
                    result["status"] = "error"  # Silent failure potential
                    result["message"] = "Inventory unavailable"
            else:
                result["status"] = "error"
                result["message"] = "Insufficient permissions"
        else:
            result["status"] = "error"
            result["message"] = "User data incomplete"
    else:
        result["status"] = "error"
        result["message"] = "Invalid order"
    
    return result  # Returns something, even when broken


# FAIL-FAST APPROACH ("Fail Loud and Clear")
def process_order_fail_fast(order: dict, user: dict, inventory: dict) -> dict:
    """
    Fail-fast approach: Validate everything upfront, 
    fail immediately with clear error messages.
    """
    # Guard clauses: Check prerequisites and fail fast
    if not order or "id" not in order or not order["id"]:
        raise ValueError("Order is missing or has no valid ID")
    
    if not user or "permissions" not in user:
        raise ValueError("User data is incomplete - missing permissions")
    
    if "order_process" not in user["permissions"]:
        raise PermissionError(f"User {user.get('id', 'unknown')} lacks order_process permission")
    
    if not inventory or "items" not in inventory:
        raise RuntimeError("Inventory system is unavailable")
    
    if order["item_id"] not in inventory["items"]:
        raise ValueError(f"Item {order['item_id']} not found in inventory")
    
    item = inventory["items"][order["item_id"]]
    requested_quantity = order.get("quantity", 1)
    available_quantity = item.get("quantity", 0)
    
    if available_quantity < requested_quantity:
        raise ValueError(
            f"Insufficient stock: requested {requested_quantity}, "
            f"available {available_quantity} for item {order['item_id']}"
        )
    
    # All validations passed - do the actual work
    # This code only executes when everything is guaranteed to be valid
    return {
        "status": "success",
        "processed": True,
        "order_id": order["id"],
        "item_id": order["item_id"],
        "quantity_processed": requested_quantity
    }