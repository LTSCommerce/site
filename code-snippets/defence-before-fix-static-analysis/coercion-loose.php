<?php
// Without strict_types, PHP silently coerces
function processOrderId(string $id): void
{
    // $id becomes "42" even when called with the integer 42,
    // so the type bug at the call site is invisible
}

processOrderId(42); // No error, no warning, silently wrong.
