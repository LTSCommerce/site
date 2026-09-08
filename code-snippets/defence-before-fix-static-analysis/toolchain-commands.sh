#!/usr/bin/env bash
# php-qa-ci: resolve a printed identifier to its documentation
bin/rule-doc app.nullCoalescingEmptyString

# ts-qa-ci: list every active defence, derived from the resolved ESLint config
npx ts-qa rules
