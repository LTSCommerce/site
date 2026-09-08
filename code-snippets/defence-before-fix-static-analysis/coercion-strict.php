<?php
declare(strict_types=1);

// With strict_types, the bug surfaces immediately
processOrderId(42);
// Fatal error: Argument 1 must be of type string, int given
