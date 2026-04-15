// TypeScript parallels — same rules, ES2022 gives us `Error.cause`
// which is the direct analogue of PHP's `$previous`.
//
// - Extend `Error` (or a project base class) for every domain failure.
// - Put data on typed properties; synthesise the message from them.
// - Always pass `{ cause }` — never discard the underlying error.
// - Use `instanceof` at the boundary, not string matching on messages.

export abstract class AppError extends Error {
  // Marker base for project-owned errors.
}

export class InsufficientStockError extends AppError {
  public static readonly MESSAGE_FORMAT =
    'Insufficient stock for SKU %s: requested %d, only %d available.';

  public readonly name = 'InsufficientStockError';

  constructor(
    public readonly sku: string,
    public readonly requested: number,
    public readonly available: number,
    options?: { cause?: unknown },
  ) {
    super(
      InsufficientStockError.MESSAGE_FORMAT
        .replace('%s', sku)
        .replace('%d', String(requested))
        .replace('%d', String(available)),
      options,
    );
  }

  static create(sku: string, requested: number, available: number): InsufficientStockError {
    return new InsufficientStockError(sku, requested, available);
  }

  static createWithCause(
    sku: string,
    requested: number,
    available: number,
    cause: unknown,
  ): InsufficientStockError {
    return new InsufficientStockError(sku, requested, available, { cause });
  }
}

// At the boundary, narrow on the type — never parse message strings.
try {
  await orderService.place(order);
} catch (err) {
  if (err instanceof InsufficientStockError) {
    return { status: 409, body: { sku: err.sku, requested: err.requested, available: err.available } };
  }
  throw err; // bubble anything we did not reason about
}
