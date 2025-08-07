# YAGNI Principle Examples

# Bad: Over-engineered caching solution
class FlexibleCacheSystem:
    """
    Abstract cache system supporting multiple backends,
    fallback strategies, serialization methods, and more!
    """
    def __init__(self, primary_cache, fallback_caches=None, 
                 serializer='json', compression='gzip',
                 encryption_key=None, ttl_strategies=None):
        # Complex initialization for features nobody asked for
        pass
    
    def get_with_fallback(self, key, fallback_fn=None):
        # Tries multiple cache backends with complex fallback logic
        pass
    
    def set_with_strategies(self, key, value, ttl=None, 
                          replicate_to=None, async_write=False):
        # Over-engineered write strategies
        pass

# Good: Simple solution for actual need
class SessionCache:
    """Simple file-based session storage"""
    def __init__(self, cache_dir='/tmp/sessions'):
        self.cache_dir = cache_dir
        os.makedirs(cache_dir, exist_ok=True)
    
    def get(self, session_id):
        try:
            with open(f"{self.cache_dir}/{session_id}", 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            return None
    
    def set(self, session_id, data):
        with open(f"{self.cache_dir}/{session_id}", 'w') as f:
            json.dump(data, f)


# Make Invalid States Unrepresentable Examples

# Bad: Invalid states possible
class UserAccountBad:
    def __init__(self, email, status='active'):
        self.email = email  # Any string accepted
        self.status = status  # Any string accepted
        self.password_hash = None
        self.verified_at = None
    
    def can_login(self):
        # Must handle all possible invalid states
        if self.status not in ['active', 'verified', 'pending']:
            return False
        if not self.password_hash:
            return False
        if self.status == 'pending' and not self.verified_at:
            return False
        return True

# Good: Invalid states impossible
from enum import Enum
from dataclasses import dataclass
from datetime import datetime
import re

class UserStatus(Enum):
    ACTIVE = 'active'
    PENDING = 'pending'
    SUSPENDED = 'suspended'
    DELETED = 'deleted'

@dataclass(frozen=True)
class Email:
    value: str
    
    def __post_init__(self):
        if not re.match(r'^[^@]+@[^@]+\.[^@]+$', self.value):
            raise ValueError(f"Invalid email: {self.value}")

@dataclass(frozen=True)  
class PasswordHash:
    hash: str
    
    def __post_init__(self):
        if len(self.hash) < 60:  # bcrypt length
            raise ValueError("Invalid password hash format")

class UserAccountGood:
    def __init__(self, email: Email, status: UserStatus, 
                 password_hash: PasswordHash = None,
                 verified_at: datetime = None):
        self.email = email
        self.status = status  
        self.password_hash = password_hash
        self.verified_at = verified_at
    
    def can_login(self) -> bool:
        # Exhaustive pattern matching enforced by type system
        match self.status:
            case UserStatus.ACTIVE:
                return self.password_hash is not None
            case UserStatus.PENDING:
                return (self.password_hash is not None and 
                       self.verified_at is not None)
            case UserStatus.SUSPENDED | UserStatus.DELETED:
                return False


# Domain Object Purity Examples

# Bad: Domain object with infrastructure dependencies
class OrderBad:
    def __init__(self, order_id, customer_id, items, 
                 database, email_service, payment_gateway):
        self.order_id = order_id
        self.customer_id = customer_id
        self.items = items
        self.db = database
        self.email = email_service
        self.payment = payment_gateway
    
    def process(self):
        # Domain logic mixed with infrastructure concerns
        
        # Database query in domain object!
        inventory = self.db.query("SELECT * FROM inventory WHERE ...")
        
        for item in self.items:
            if inventory[item.product_id] < item.quantity:
                raise InsufficientInventoryError()
        
        # Payment processing mixed in
        payment_result = self.payment.charge(self.total, self.customer_id)
        
        if not payment_result.success:
            raise PaymentFailedError()
        
        # Email sending in domain object!
        self.email.send_confirmation(self.customer_id, self)
        
        # Database update
        self.db.execute("UPDATE orders SET status='completed' WHERE id=?", 
                       [self.order_id])

# Good: Pure domain object
@dataclass
class OrderProcessed:
    order_id: str
    customer_id: str
    total: Money
    processed_at: datetime

@dataclass  
class OrderFailed:
    order_id: str
    reason: str
    failed_at: datetime

class OrderGood:
    def __init__(self, order_id, customer_id, items, total):
        self.order_id = order_id
        self.customer_id = customer_id  
        self.items = items
        self.total = total
        self.status = 'pending'
    
    def can_process(self, inventory_service) -> bool:
        """Pure domain logic with injected dependency"""
        for item in self.items:
            if not inventory_service.has_sufficient_stock(
                item.product_id, item.quantity
            ):
                return False
        return True
    
    def process(self) -> OrderProcessed:
        """Pure state transition returning domain events"""
        if self.status != 'pending':
            raise InvalidOperationError("Order already processed")
        
        self.status = 'processed'
        
        return OrderProcessed(
            order_id=self.order_id,
            customer_id=self.customer_id,
            total=self.total,
            processed_at=datetime.now()
        )
    
    def fail(self, reason: str) -> OrderFailed:
        """Pure domain logic for failure cases"""
        self.status = 'failed'
        
        return OrderFailed(
            order_id=self.order_id,
            reason=reason,
            failed_at=datetime.now()
        )

# Application service handles orchestration
class ProcessOrderService:
    def __init__(self, order_repo, inventory_service, 
                 payment_service, event_dispatcher):
        self.orders = order_repo
        self.inventory = inventory_service
        self.payment = payment_service
        self.events = event_dispatcher
    
    def execute(self, command):
        order = self.orders.find_by_id(command.order_id)
        
        if not order.can_process(self.inventory):
            failed = order.fail("Insufficient inventory")
            self.orders.save(order)
            self.events.dispatch(failed)
            return
        
        try:
            self.payment.charge(order.total, order.customer_id)
            processed = order.process()
            self.orders.save(order)
            self.events.dispatch(processed)
            
        except PaymentError as e:
            failed = order.fail(f"Payment failed: {e}")
            self.orders.save(order)
            self.events.dispatch(failed)