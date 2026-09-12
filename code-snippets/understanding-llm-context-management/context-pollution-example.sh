# Example of context pollution
$ npm test
... 500 lines of test output ...
$ npm test  # Running again
... another 500 lines ...
$ npm test --verbose  # Even more detail
... 2000 lines of verbose output ...
# Now the context has 3000+ lines of similar test results!

# Impact: Next request gets confused response
"Fix the failing test"
# AI struggles to identify which of the 3000 lines matters
