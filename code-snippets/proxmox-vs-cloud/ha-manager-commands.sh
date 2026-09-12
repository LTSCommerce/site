# Create an HA group across the cluster nodes
ha-manager groupadd web-servers --nodes proxmox1:1,proxmox2:1,proxmox3:1 --restricted 1

# Add a VM as an HA-managed resource within that group
ha-manager add vm:101 --group web-servers --max_restart 3 --max_relocate 3
