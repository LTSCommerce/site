# Python dataclass (simplified)
@dataclass
class Product:
    id: str
    name: str
    price: float
    category: Optional[str] = None
    created_at: Optional[datetime] = None
