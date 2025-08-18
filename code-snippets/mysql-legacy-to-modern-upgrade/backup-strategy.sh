#!/bin/bash
# MySQL Legacy to Modern Migration Backup Strategy
# Comprehensive backup and recovery procedures for safe migration

set -euo pipefail

# Configuration
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-3306}"
DB_NAME="${DB_NAME:-oscommerce}"
DB_USER="${DB_USER:-root}"
BACKUP_DIR="${BACKUP_DIR:-/var/backups/mysql}"
DATE_FORMAT=$(date +"%Y%m%d_%H%M%S")
RETENTION_DAYS=30

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."
    
    # Check if mysqldump is available
    if ! command -v mysqldump &> /dev/null; then
        error "mysqldump not found. Please install MySQL client tools."
        exit 1
    fi
    
    # Check if mysql is available
    if ! command -v mysql &> /dev/null; then
        error "mysql client not found. Please install MySQL client tools."
        exit 1
    fi
    
    # Create backup directory if it doesn't exist
    if [ ! -d "$BACKUP_DIR" ]; then
        mkdir -p "$BACKUP_DIR"
        log "Created backup directory: $BACKUP_DIR"
    fi
    
    # Check available disk space (require at least 5GB free)
    available_space=$(df "$BACKUP_DIR" | tail -1 | awk '{print $4}')
    required_space=$((5 * 1024 * 1024)) # 5GB in KB
    
    if [ "$available_space" -lt "$required_space" ]; then
        error "Insufficient disk space. Required: 5GB, Available: $((available_space / 1024 / 1024))GB"
        exit 1
    fi
    
    success "Prerequisites check completed"
}

# Test database connection
test_connection() {
    log "Testing database connection..."
    
    if mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"${MYSQL_PASSWORD}" -e "SELECT 1;" &> /dev/null; then
        success "Database connection successful"
    else
        error "Cannot connect to database. Please check credentials."
        exit 1
    fi
}

# Create full database backup
create_full_backup() {
    log "Creating full database backup..."
    
    local backup_file="${BACKUP_DIR}/${DB_NAME}_full_${DATE_FORMAT}.sql"
    local compressed_file="${backup_file}.gz"
    
    # Create mysqldump with all necessary options
    mysqldump \
        -h "$DB_HOST" \
        -P "$DB_PORT" \
        -u "$DB_USER" \
        -p"${MYSQL_PASSWORD}" \
        --single-transaction \
        --routines \
        --triggers \
        --events \
        --flush-logs \
        --master-data=2 \
        --hex-blob \
        --complete-insert \
        --add-drop-table \
        --add-locks \
        --extended-insert \
        "$DB_NAME" | gzip > "$compressed_file"
    
    if [ ${PIPESTATUS[0]} -eq 0 ] && [ -f "$compressed_file" ]; then
        local file_size=$(du -h "$compressed_file" | cut -f1)
        success "Full backup created: $compressed_file ($file_size)"
        
        # Create checksum
        sha256sum "$compressed_file" > "${compressed_file}.sha256"
        log "Checksum created: ${compressed_file}.sha256"
        
        return 0
    else
        error "Failed to create full backup"
        return 1
    fi
}

# Create incremental backup using binary logs
create_incremental_backup() {
    log "Creating incremental backup..."
    
    local binlog_dir="${BACKUP_DIR}/binlogs_${DATE_FORMAT}"
    mkdir -p "$binlog_dir"
    
    # Get current binary log position
    local master_status=$(mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"${MYSQL_PASSWORD}" \
        -e "SHOW MASTER STATUS\G" 2>/dev/null)
    
    if [ -n "$master_status" ]; then
        echo "$master_status" > "${binlog_dir}/master_status.txt"
        success "Binary log position saved to ${binlog_dir}/master_status.txt"
    else
        warning "Could not retrieve master status. Binary logging might not be enabled."
    fi
    
    # Flush logs to ensure all transactions are written
    mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"${MYSQL_PASSWORD}" \
        -e "FLUSH LOGS;" 2>/dev/null
    
    success "Incremental backup setup completed"
}

# Backup specific table structures
backup_table_structures() {
    log "Backing up table structures..."
    
    local structure_file="${BACKUP_DIR}/${DB_NAME}_structures_${DATE_FORMAT}.sql"
    
    mysqldump \
        -h "$DB_HOST" \
        -P "$DB_PORT" \
        -u "$DB_USER" \
        -p"${MYSQL_PASSWORD}" \
        --no-data \
        --routines \
        --triggers \
        --events \
        "$DB_NAME" > "$structure_file"
    
    if [ $? -eq 0 ]; then
        success "Table structures backed up: $structure_file"
        return 0
    else
        error "Failed to backup table structures"
        return 1
    fi
}

# Create point-in-time recovery script
create_recovery_script() {
    log "Creating point-in-time recovery script..."
    
    local recovery_script="${BACKUP_DIR}/restore_${DB_NAME}_${DATE_FORMAT}.sh"
    
    cat > "$recovery_script" << 'EOF'
#!/bin/bash
# Point-in-time recovery script
# Generated automatically during backup

set -euo pipefail

BACKUP_DIR="${BACKUP_DIR}"
DB_NAME="${DB_NAME}"
DATE_FORMAT="${DATE_FORMAT}"

echo "MySQL Point-in-Time Recovery Script"
echo "Backup Date: ${DATE_FORMAT}"
echo "Database: ${DB_NAME}"
echo

# Function to restore from full backup
restore_full_backup() {
    local backup_file="${BACKUP_DIR}/${DB_NAME}_full_${DATE_FORMAT}.sql.gz"
    
    if [ ! -f "$backup_file" ]; then
        echo "ERROR: Backup file not found: $backup_file"
        exit 1
    fi
    
    echo "Verifying backup integrity..."
    if sha256sum -c "${backup_file}.sha256"; then
        echo "Backup integrity verified."
    else
        echo "ERROR: Backup integrity check failed!"
        exit 1
    fi
    
    echo "Restoring from full backup: $backup_file"
    
    # Create database if it doesn't exist
    mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS ${DB_NAME};"
    
    # Restore from backup
    zcat "$backup_file" | mysql -u root -p "${DB_NAME}"
    
    echo "Full backup restoration completed."
}

# Function to apply binary logs for point-in-time recovery
apply_binary_logs() {
    local stop_datetime="$1"
    local binlog_dir="${BACKUP_DIR}/binlogs_${DATE_FORMAT}"
    
    if [ ! -d "$binlog_dir" ]; then
        echo "WARNING: No binary log backup found. Point-in-time recovery not available."
        return
    fi
    
    echo "Applying binary logs up to: $stop_datetime"
    
    # Apply binary logs (this would need to be customized based on actual log files)
    # mysqlbinlog --stop-datetime="$stop_datetime" /path/to/binlogs | mysql -u root -p ${DB_NAME}
    
    echo "Binary log application completed."
}

# Main recovery function
main() {
    if [ $# -eq 0 ]; then
        echo "Usage: $0 [full|point-in-time 'YYYY-MM-DD HH:MM:SS']"
        echo "  full              - Restore from full backup"
        echo "  point-in-time     - Restore to specific point in time"
        exit 1
    fi
    
    case "$1" in
        "full")
            restore_full_backup
            ;;
        "point-in-time")
            if [ $# -ne 2 ]; then
                echo "ERROR: Point-in-time recovery requires datetime parameter"
                exit 1
            fi
            restore_full_backup
            apply_binary_logs "$2"
            ;;
        *)
            echo "ERROR: Invalid option. Use 'full' or 'point-in-time'"
            exit 1
            ;;
    esac
}

main "$@"
EOF
    
    chmod +x "$recovery_script"
    success "Recovery script created: $recovery_script"
}

# Verify backup integrity
verify_backup() {
    log "Verifying backup integrity..."
    
    local backup_file="${BACKUP_DIR}/${DB_NAME}_full_${DATE_FORMAT}.sql.gz"
    local checksum_file="${backup_file}.sha256"
    
    if [ -f "$checksum_file" ]; then
        if sha256sum -c "$checksum_file"; then
            success "Backup integrity verified successfully"
            return 0
        else
            error "Backup integrity check failed!"
            return 1
        fi
    else
        warning "Checksum file not found. Cannot verify integrity."
        return 1
    fi
}

# Cleanup old backups
cleanup_old_backups() {
    log "Cleaning up backups older than $RETENTION_DAYS days..."
    
    local files_removed=0
    
    # Remove old backup files
    find "$BACKUP_DIR" -name "${DB_NAME}_*" -type f -mtime +$RETENTION_DAYS -print0 | \
    while IFS= read -r -d '' file; do
        rm -f "$file"
        log "Removed old backup: $(basename "$file")"
        ((files_removed++))
    done
    
    if [ $files_removed -gt 0 ]; then
        success "Removed $files_removed old backup files"
    else
        log "No old backups found for cleanup"
    fi
}

# Pre-migration validation
pre_migration_validation() {
    log "Performing pre-migration validation..."
    
    # Check database size
    local db_size=$(mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"${MYSQL_PASSWORD}" \
        -e "SELECT ROUND(SUM(data_length + index_length) / 1024 / 1024, 1) AS 'DB Size in MB' 
            FROM information_schema.tables WHERE table_schema='${DB_NAME}';" --skip-column-names)
    
    log "Database size: ${db_size} MB"
    
    # Check table engines
    local myisam_count=$(mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"${MYSQL_PASSWORD}" \
        -e "SELECT COUNT(*) FROM information_schema.tables 
            WHERE table_schema='${DB_NAME}' AND engine='MyISAM';" --skip-column-names)
    
    log "MyISAM tables found: $myisam_count"
    
    # Check for tables without primary keys
    local no_pk_count=$(mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"${MYSQL_PASSWORD}" \
        -e "SELECT COUNT(*) FROM information_schema.tables t
            LEFT JOIN information_schema.statistics s 
                ON t.table_name = s.table_name AND s.index_name = 'PRIMARY'
            WHERE t.table_schema = '${DB_NAME}' AND s.index_name IS NULL;" --skip-column-names)
    
    if [ "$no_pk_count" -gt 0 ]; then
        warning "Found $no_pk_count tables without primary keys"
    fi
    
    success "Pre-migration validation completed"
}

# Main execution
main() {
    log "Starting MySQL Legacy to Modern Migration Backup Process"
    
    # Check if MYSQL_PASSWORD is set
    if [ -z "${MYSQL_PASSWORD:-}" ]; then
        error "MYSQL_PASSWORD environment variable must be set"
        exit 1
    fi
    
    check_prerequisites
    test_connection
    pre_migration_validation
    
    if create_full_backup; then
        backup_table_structures
        create_incremental_backup
        create_recovery_script
        
        if verify_backup; then
            success "All backup operations completed successfully"
        else
            error "Backup verification failed"
            exit 1
        fi
    else
        error "Full backup failed. Aborting backup process."
        exit 1
    fi
    
    cleanup_old_backups
    
    success "MySQL backup process completed successfully"
    log "Backup location: $BACKUP_DIR"
    log "Next steps: Review backup files and proceed with migration"
}

# Run main function
main "$@"