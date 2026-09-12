#!/bin/bash
# Proxmox backup script
vzdump --mode snapshot --compress lzo --storage backup-storage --all --mailto admin@company.com

# Offsite backup to cloud storage
rclone sync /backup-storage/dump/ remote:backups/$(date +%Y-%m-%d)/
