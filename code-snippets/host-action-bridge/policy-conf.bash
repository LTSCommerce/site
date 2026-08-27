# demo-bridge policy: per-verb execution mode.
# Parsed as KEY=value, never sourced. Unknown/missing keys fail CLOSED
# to deny. There is no "confirm" mode by design: deny it here and run
# it by hand if you want a human gate.

MODE_ping=auto
MODE_status=auto
MODE_health=auto
MODE_logs=auto

MODE_up=auto
MODE_down=auto
MODE_restart=auto
MODE_rebuild=auto

# init resets seed data: flip to deny if you would rather run it by hand.
MODE_init=auto
