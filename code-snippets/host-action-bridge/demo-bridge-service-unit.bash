# demo-bridge-demo-app.service
[Unit]
Description=Demo Bridge: drain the request spool once for demo-app
StartLimitIntervalSec=60
StartLimitBurst=50

[Service]
Type=oneshot
ExecStart=%h/.local/bin/demo-bridge-watcher-demo-app drain
KillMode=process
StandardOutput=append:%h/.local/state/demo-bridge/demo-app/service.log
StandardError=append:%h/.local/state/demo-bridge/demo-app/service.log
NoNewPrivileges=true
RuntimeMaxSec=1200
