<?php

// PHP's SPL exception hierarchy (simplified).
//
// \Throwable (interface)
//   ├── \Error                        // engine-level failures — rarely caught
//   │   ├── \TypeError
//   │   ├── \ValueError
//   │   └── \AssertionError
//   └── \Exception
//       ├── \LogicException           // programmer bugs — impossible states
//       │   ├── \BadFunctionCallException
//       │   │   └── \BadMethodCallException
//       │   ├── \DomainException      // value outside its domain
//       │   ├── \InvalidArgumentException
//       │   ├── \LengthException
//       │   └── \OutOfRangeException
//       └── \RuntimeException         // environmental / truly unexpected
//           ├── \OutOfBoundsException
//           ├── \OverflowException
//           ├── \RangeException
//           ├── \UnderflowException
//           └── \UnexpectedValueException
//
// Rule of thumb:
//   LogicException  = "this is a bug, fix the code"
//   RuntimeException = "something external went wrong, not my code's fault"
