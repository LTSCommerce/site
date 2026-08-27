# project-slug.bash: sourced by every host-side script.
PROJECT_SLUG="${PROJECT_SLUG:-demo-app}"

# Derived, namespaced locations: every host-global artefact carries the
# slug so a second project's install can never collide with the first's.
UNIT_PATH="demo-bridge-${PROJECT_SLUG}.path"
UNIT_SERVICE="demo-bridge-${PROJECT_SLUG}.service"
CONFIG_DIR="$HOME/.config/demo-bridge/${PROJECT_SLUG}"
STATE_DIR="$HOME/.local/state/demo-bridge/${PROJECT_SLUG}"
WATCHER_BIN="$HOME/.local/bin/demo-bridge-watcher-${PROJECT_SLUG}"
