# demo-bridge-demo-app.path
[Unit]
Description=Demo Bridge: watch the request spool for demo-app

[Path]
PathModified=%h/Projects/demo-app/untracked/demo-bridge/requests
PathExistsGlob=%h/Projects/demo-app/untracked/demo-bridge/requests/*.json
Unit=demo-bridge-demo-app.service

[Install]
WantedBy=default.target
