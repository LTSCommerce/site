#!/usr/bin/env bash
#
# Deterministic deploy for the lts-site-proxy Cloudflare Worker.
#
# Auth is the one step that genuinely needs a human with a browser -
# everything else here is scripted and repeatable.
#
# Usage:
#   ./deploy.sh              # normal run: checks auth, builds, deploys, verifies
#   ./deploy.sh --check-only # just report auth status and exit
#
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")"

echo "== 1/4: checking wrangler auth =="
if ! npx wrangler whoami 2>&1 | tee /tmp/wrangler-whoami.out | grep -q "You are logged in"; then
  cat <<'EOF'

Not authenticated.

Run this once, on a machine with a real browser (this can be a different
machine to the one running the rest of this script - the login just needs
to happen somewhere wrangler can complete an OAuth redirect):

    npx wrangler login

That caches a session under ~/.config/.wrangler/ (or ~/.wrangler/) on
whichever machine you ran it on. Re-run this script FROM THAT SAME MACHINE
once it's done - the deploy step below reads that cached session.

Alternative if you'd rather not do a browser login here: create a scoped
API token at https://dash.cloudflare.com/profile/api-tokens (template:
"Edit Cloudflare Workers"), then run:

    export CLOUDFLARE_API_TOKEN=<token>
    ./deploy.sh

EOF
  exit 1
fi
echo "Authenticated."

if [[ "${1:-}" == "--check-only" ]]; then
  exit 0
fi

echo
echo "== 2/4: building worker =="
npm run build

echo
echo "== 3/4: deploying =="
npx wrangler deploy

echo
echo "== 4/4: verifying live redirects =="
sleep 3 # let the edge propagate

check_redirect() {
  local path="$1" expect="$2"
  local location
  location=$(curl -s -o /dev/null -w '%{redirect_url}' "https://ltscommerce.dev${path}")
  if [[ "$location" == *"$expect"* ]]; then
    echo "  OK   $path -> $location"
  else
    echo "  FAIL $path -> '$location' (expected to contain '$expect')"
    return 1
  fi
}

status=0
check_redirect "/author.html" "/about" || status=1
check_redirect "/articles/defense-before-fix-static-analysis" "/articles/defence-before-fix-static-analysis" || status=1

if hsts=$(curl -sI "https://ltscommerce.dev/" | grep -i '^strict-transport-security'); then
  echo "  OK   HSTS header present: $hsts"
else
  echo "  FAIL HSTS header missing"
  status=1
fi

if [[ $status -eq 0 ]]; then
  echo
  echo "Deploy verified: all checks passed."
else
  echo
  echo "Deploy completed but one or more post-deploy checks failed - see above."
fi
exit $status
