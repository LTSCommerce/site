# Defensive Programming Principles - Pseudocode Examples

# YAGNI Principle: Over-engineering vs Simplicity

# Bad: Over-engineered cache system with premature flexibility
INTERFACE CacheAdapter
    METHOD get(key) -> value
    METHOD set(key, value, ttl)
    METHOD delete(key)
    METHOD clear()
    METHOD exists(key) -> boolean
    METHOD getMultiple(keys) -> array
    METHOD setMultiple(items, ttl)
    METHOD increment(key, amount) -> integer
    METHOD getTtl(key) -> integer
    METHOD addTags(key, tags)
    METHOD invalidateByTag(tag) -> count

CLASS RedisCacheAdapter IMPLEMENTS CacheAdapter
    // 300+ lines of Redis-specific implementation
    // Most methods never used in production

CLASS FileCacheAdapter IMPLEMENTS CacheAdapter  
    // Complex file locking, serialization, cleanup
    
CLASS DatabaseCacheAdapter IMPLEMENTS CacheAdapter
    // SQL queries for caching - defeats the purpose

CLASS CacheFactory
    METHOD create(config) -> CacheAdapter
        SWITCH config.type
            CASE 'redis': RETURN new RedisCacheAdapter(config)
            CASE 'file': RETURN new FileCacheAdapter(config)
            // ... more unused implementations

# Good: Simple solution for actual requirement
CLASS SessionStore
    PROPERTY redis_client
    
    METHOD get(session_id)
        data = redis_client.get("session:" + session_id)
        RETURN data ? parse_json(data) : null
    
    METHOD set(session_id, data, ttl = 3600)
        redis_client.setex("session:" + session_id, ttl, to_json(data))
    
    METHOD delete(session_id)
        redis_client.delete("session:" + session_id)


# Invalid States Prevention: Type Safety vs Runtime Validation

# Bad: Invalid states representable - runtime errors waiting to happen  
CLASS UserAccount
    PROPERTY email AS string          // Any string allowed!
    PROPERTY status AS string         // "active", "deleted", "banana" - all valid
    PROPERTY password_hash AS string  // Could be plaintext by accident
    PROPERTY verified_at AS datetime  // Could be null when shouldn't be
    
    METHOD can_login() -> boolean
        // Must defensively check all possible invalid combinations
        IF status NOT IN ['active', 'verified', 'pending']
            RETURN false
        IF password_hash IS null OR password_hash IS empty
            RETURN false  
        IF status = 'pending' AND verified_at IS null
            RETURN false
        RETURN true

# Problems with above approach:
user = new UserAccount()
user.email = "definitely-not-an-email"     // Compiles fine!
user.status = "INVALID_STATUS"             // Runtime bug waiting to happen  
user.password_hash = "plaintext-password"  // Security vulnerability

# Good: Invalid states unrepresentable through type design
ENUM UserStatus
    ACTIVE
    PENDING_VERIFICATION  
    SUSPENDED
    DELETED

TYPE Email = string WITH CONSTRAINT valid_email_format(value)
TYPE PasswordHash = string WITH CONSTRAINT valid_hash_format(value) 
TYPE UserId = string WITH CONSTRAINT non_empty(value)

CLASS UserAccount
    PROPERTY id AS UserId
    PROPERTY email AS Email  
    PROPERTY status AS UserStatus
    PROPERTY password_hash AS PasswordHash OPTIONAL
    PROPERTY verified_at AS datetime OPTIONAL
    
    METHOD can_login() -> boolean
        // Type system guarantees status is valid
        SWITCH status
            CASE ACTIVE:
                RETURN password_hash IS NOT null
            CASE PENDING_VERIFICATION:
                RETURN password_hash IS NOT null AND verified_at IS NOT null
            CASE SUSPENDED, DELETED:
                RETURN false

// Smart constructors enforce invariants
FUNCTION create_user(id_str, email_str, password_str) -> UserAccount
    id = validate_user_id(id_str)        // Throws if invalid
    email = validate_email(email_str)    // Throws if invalid  
    hash = hash_password(password_str)   // Always properly hashed
    
    RETURN new UserAccount(id, email, PENDING_VERIFICATION, hash, null)


# Domain Purity: Separating Business Logic from Infrastructure

# Bad: Domain object polluted with infrastructure dependencies
CLASS Order
    PROPERTY order_id
    PROPERTY customer_id  
    PROPERTY items
    PROPERTY database           // Infrastructure dependency!
    PROPERTY email_service      // Infrastructure dependency!
    PROPERTY payment_gateway    // Infrastructure dependency!
    
    METHOD process()
        // Domain logic mixed with database queries
        inventory = database.query("SELECT * FROM inventory WHERE product_id = ?")
        
        FOR EACH item IN items
            IF inventory[item.product_id] < item.quantity
                THROW InsufficientInventoryError
        
        // Payment processing mixed into domain logic
        result = payment_gateway.charge(total, customer_id)
        IF NOT result.success
            THROW PaymentFailedError
            
        // Email sending in domain object - wrong layer!
        email_service.send_confirmation(customer_id, this)
        
        // Direct database mutation from domain object
        database.execute("UPDATE orders SET status='completed'")

# Problems: Hard to test, mixed concerns, infrastructure coupling

# Good: Pure domain object with clean boundaries
ENUM OrderStatus
    PENDING
    PROCESSING  
    COMPLETED
    FAILED

RECORD OrderProcessed
    order_id
    customer_id
    total
    processed_at

RECORD OrderFailed  
    order_id
    reason
    failed_at

CLASS Order
    PROPERTY order_id
    PROPERTY customer_id
    PROPERTY items
    PROPERTY total
    PROPERTY status = PENDING
    
    METHOD can_process(inventory_service) -> boolean
        // Pure domain logic - infrastructure injected as dependency
        FOR EACH item IN items
            IF NOT inventory_service.has_sufficient_stock(item.product_id, item.quantity)
                RETURN false
        RETURN true
    
    METHOD process() -> OrderProcessed
        // Pure state transition - no side effects
        IF status != PENDING
            THROW DomainException("Order must be pending to process")
        
        status = PROCESSING
        
        // Return domain event instead of performing side effects
        RETURN new OrderProcessed(order_id, customer_id, total, now())
    
    METHOD fail(reason) -> OrderFailed
        status = FAILED
        RETURN new OrderFailed(order_id, reason, now())

# Application service orchestrates infrastructure concerns
CLASS ProcessOrderService
    PROPERTY order_repository
    PROPERTY inventory_service
    PROPERTY payment_service
    PROPERTY event_dispatcher
    
    METHOD execute(process_command)
        order = order_repository.find_by_id(process_command.order_id)
        
        IF NOT order.can_process(inventory_service)
            failed_event = order.fail("Insufficient inventory")
            order_repository.save(order)
            event_dispatcher.publish(failed_event)
            RETURN
        
        TRY
            payment_service.charge(order.total, order.customer_id)
            processed_event = order.process()
            order_repository.save(order) 
            event_dispatcher.publish(processed_event)
            
        CATCH PaymentError as error
            failed_event = order.fail("Payment failed: " + error.message)
            order_repository.save(order)
            event_dispatcher.publish(failed_event)

# Event handlers manage side effects separately  
CLASS OrderCompletedHandler
    METHOD handle(order_processed_event)
        customer = customer_repository.find_by_id(event.customer_id)
        email_service.send_confirmation(customer.email, event)