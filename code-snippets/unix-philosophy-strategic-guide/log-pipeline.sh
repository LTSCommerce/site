#!/usr/bin/env bash
# Find the ten most frequent error types in an application log by chaining
# small tools together, rather than writing one bespoke parsing program.
#
# Each tool does exactly one job:
#   grep  - cheap text pre-filter, skips lines that can't be error lines
#           before the more expensive JSON parse
#   jq    - parses JSON and extracts exactly the field we need, regardless
#           of key order (a plain `cut -d'"'` field-position hack breaks
#           the moment the key order in the log line changes)
#   sort  - orders lines so identical ones sit together
#   uniq  - collapses and counts duplicates
#   sort  - ranks by count
#   head  - takes the top results

cat /var/log/app/*.log \
  | grep '"level":"error"' \
  | jq -r '.type' \
  | sort \
  | uniq -c \
  | sort -rn \
  | head -n 10
