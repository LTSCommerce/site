"""Python parallels — the same principles, different syntax.

- Subclass domain exceptions from `Exception`, never `BaseException`.
- Keep data in attributes, not f-strings inside the message.
- Use `raise ... from previous` to chain — the equivalent of PHP's
  `$previous` argument. Never `raise ... from None` unless you are
  deliberately hiding a noisy cause (rarely the right call).
"""

from dataclasses import dataclass


class AppError(Exception):
    """Root of the project's exception tree — catch-all marker."""


@dataclass
class InsufficientStockError(AppError):
    """Data on attributes; message is synthesised in __str__."""

    sku: str
    requested: int
    available: int

    MESSAGE_FORMAT = "Insufficient stock for SKU {sku}: requested {requested}, only {available} available."

    def __str__(self) -> str:
        return self.MESSAGE_FORMAT.format(
            sku=self.sku,
            requested=self.requested,
            available=self.available,
        )


# Usage — always chain with `from`:
def place_order(sku: str, qty: int, available: int) -> None:
    if qty > available:
        try:
            notify_warehouse(sku)
        except WarehouseTimeout as previous:
            raise InsufficientStockError(sku, qty, available) from previous
        raise InsufficientStockError(sku, qty, available)
