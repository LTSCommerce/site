#!/usr/bin/env bash
# Illustrative sketch of the order a single QA wrapper runs things in.
# The real thing has more lanes; the point is that there is exactly one
# entry point and exactly one exit code.
set -euo pipefail

# Rector can create work for the code style fixer and vice versa, so the
# pair repeats until nothing changes, up to three rounds.
for _round in 1 2 3; do
    rector_safe_set      # Rector process 1: Safe-function rewrites
    rector_phpunit_set   # Rector process 2: PHPUnit-specific rules
    rector_project_set   # Rector process 3: the project's own config
    rector_php85_set     # Rector process 4: skipped if the project has its own config
    code_style_fixer

    if ! working_tree_changed_since_last_round; then
        break
    fi
done

composer_checks          # includes a dependency analyser and a PSR-4 check
php_lint
phpstan_max_level        # includes the project's own custom rules
architecture_rules       # PHP Arkitect
phpunit_full_suite       # serial, shared test database

# "Green" means this script exited 0, unfiltered.
