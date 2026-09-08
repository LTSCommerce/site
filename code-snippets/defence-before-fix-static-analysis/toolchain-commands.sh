#!/usr/bin/env bash
# php-qa-ci
bin/qa                                   # the whole pipeline, detectors first
bin/rules                                 # every active defence, derived from the live config
bin/rule-doc phpqaci.nullCoalescingEmptyString
bin/phpstan-rule phpqaci.nullCoalescingEmptyString src/Email/CustomerNotification.php

# ts-qa-ci
npx ts-qa                                 # the whole pipeline
npx ts-qa rules                           # every active defence, derived from the resolved ESLint config
npx ts-qa rule-doc ts-qa/require-error-cause
npx ts-qa rule ts-qa/require-error-cause src/http/client.ts
