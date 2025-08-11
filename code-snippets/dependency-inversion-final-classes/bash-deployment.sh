#!/bin/bash

# Bash Script: Dependency Inversion and Testing Patterns in Shell Scripting
# 
# This script demonstrates:
# - Dependency injection through environment variables and configuration
# - Abstract interfaces through function contracts
# - Fail-fast error handling
# - Pragmatic testing approach: real tools vs mocked functions
# - Composition over inheritance through modular functions

set -euo pipefail  # Fail fast: exit on error, undefined vars, pipe failures
IFS=$'\n\t'       # Secure Internal Field Separator

# Global configuration - dependency injection through environment
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly PROJECT_ROOT="${PROJECT_ROOT:-$(dirname "$SCRIPT_DIR")}"
readonly ENVIRONMENT="${ENVIRONMENT:-development}"
readonly PHP_VERSION="${PHP_VERSION:-8.4}"
readonly LOG_LEVEL="${LOG_LEVEL:-info}"

# Color codes for output
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly NC='\033[0m' # No Color

# Abstract logging interface - dependency inversion principle
log() {
    local level="$1"
    shift
    local message="$*"
    local timestamp
    timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    # Delegate to appropriate logging implementation
    case "${LOG_LEVEL}" in
        "debug")
            _log_debug "$timestamp" "$level" "$message"
            ;;
        "info")
            _log_info "$timestamp" "$level" "$message"
            ;;
        "warning")
            _log_warning "$timestamp" "$level" "$message"
            ;;
        *)
            _log_error "$timestamp" "$level" "$message"
            ;;
    esac
}

# Concrete logging implementations
_log_debug() {
    local timestamp="$1" level="$2" message="$3"
    echo -e "${BLUE}[$timestamp] [$level] $message${NC}" >&2
}

_log_info() {
    local timestamp="$1" level="$2" message="$3"
    case "$level" in
        "ERROR") echo -e "${RED}[$timestamp] [$level] $message${NC}" >&2 ;;
        "WARN")  echo -e "${YELLOW}[$timestamp] [$level] $message${NC}" >&2 ;;
        *)       echo -e "${GREEN}[$timestamp] [$level] $message${NC}" ;;
    esac
}

_log_warning() {
    local timestamp="$1" level="$2" message="$3"
    [[ "$level" =~ ^(ERROR|WARN)$ ]] && echo -e "${RED}[$timestamp] [$level] $message${NC}" >&2
}

_log_error() {
    local timestamp="$1" level="$2" message="$3"
    [[ "$level" == "ERROR" ]] && echo -e "${RED}[$timestamp] [$level] $message${NC}" >&2
}

# Error handling with dependency inversion
error_handler() {
    local exit_code=$?
    local line_number=$1
    log "ERROR" "Script failed at line $line_number with exit code $exit_code"
    
    # Delegate to appropriate error handler based on environment
    case "${ENVIRONMENT}" in
        "development")
            _handle_development_error "$exit_code" "$line_number"
            ;;
        "production")
            _handle_production_error "$exit_code" "$line_number"
            ;;
        *)
            _handle_generic_error "$exit_code" "$line_number"
            ;;
    esac
    
    exit "$exit_code"
}

trap 'error_handler $LINENO' ERR

# Abstract interface for database operations
database_execute() {
    local query="$1"
    local database_type="${DATABASE_TYPE:-mysql}"
    
    log "DEBUG" "Executing query with $database_type: $query"
    
    # Dependency inversion: delegate to appropriate implementation
    case "$database_type" in
        "mysql")
            _execute_mysql_query "$query"
            ;;
        "sqlite")
            _execute_sqlite_query "$query"
            ;;
        "test")
            _execute_test_query "$query"  # For testing
            ;;
        *)
            log "ERROR" "Unsupported database type: $database_type"
            return 1
            ;;
    esac
}

# Concrete database implementations
_execute_mysql_query() {
    local query="$1"
    local mysql_host="${MYSQL_HOST:-localhost}"
    local mysql_user="${MYSQL_USER:-root}"
    local mysql_db="${MYSQL_DB:-order_processor}"
    
    # Fail fast: validate connection before executing
    if ! mysql -h "$mysql_host" -u "$mysql_user" -e "SELECT 1" &>/dev/null; then
        log "ERROR" "Cannot connect to MySQL at $mysql_host"
        return 1
    fi
    
    mysql -h "$mysql_host" -u "$mysql_user" -D "$mysql_db" -e "$query"
}

_execute_sqlite_query() {
    local query="$1"
    local sqlite_db="${SQLITE_DB:-/tmp/order_processor.db}"
    
    # Fail fast: check if database file exists or can be created
    if [[ ! -f "$sqlite_db" ]] && ! touch "$sqlite_db" 2>/dev/null; then
        log "ERROR" "Cannot access SQLite database at $sqlite_db"
        return 1
    fi
    
    sqlite3 "$sqlite_db" "$query"
}

_execute_test_query() {
    local query="$1"
    log "DEBUG" "Test query executed: $query"
    echo "test_result"
}

# Abstract interface for payment processing
process_payment() {
    local amount="$1"
    local payment_method="$2"
    local payment_gateway="${PAYMENT_GATEWAY:-stripe}"
    
    log "INFO" "Processing payment of \$$amount via $payment_method using $payment_gateway"
    
    # Dependency inversion: delegate to appropriate gateway
    case "$payment_gateway" in
        "stripe")
            _process_stripe_payment "$amount" "$payment_method"
            ;;
        "paypal")
            _process_paypal_payment "$amount" "$payment_method"
            ;;
        "test")
            _process_test_payment "$amount" "$payment_method"
            ;;
        *)
            log "ERROR" "Unsupported payment gateway: $payment_gateway"
            return 1
            ;;
    esac
}

# Concrete payment implementations
_process_stripe_payment() {
    local amount="$1" payment_method="$2"
    local stripe_key="${STRIPE_SECRET_KEY:-}"
    
    if [[ -z "$stripe_key" ]]; then
        log "ERROR" "Stripe secret key not configured"
        return 1
    fi
    
    # Simulate API call
    if curl -s -X POST "https://api.stripe.com/v1/charges" \
        -H "Authorization: Bearer $stripe_key" \
        -d "amount=$((${amount%.*} * 100))" \
        -d "currency=usd" \
        -d "source=$payment_method" &>/dev/null; then
        log "INFO" "Stripe payment successful"
        return 0
    else
        log "ERROR" "Stripe payment failed"
        return 1
    fi
}

_process_paypal_payment() {
    local amount="$1" payment_method="$2"
    log "INFO" "PayPal payment processing: \$$amount"
    # PayPal implementation would go here
    return 0
}

_process_test_payment() {
    local amount="$1" payment_method="$2"
    log "DEBUG" "Test payment processed: \$$amount via $payment_method"
    
    # Simulate success/failure for testing
    local success_rate="${TEST_PAYMENT_SUCCESS_RATE:-90}"
    local random=$((RANDOM % 100))
    
    if (( random < success_rate )); then
        log "DEBUG" "Test payment successful (random: $random, threshold: $success_rate)"
        return 0
    else
        log "DEBUG" "Test payment failed (random: $random, threshold: $success_rate)"
        return 1
    fi
}

# Abstract notification interface
send_notification() {
    local recipient="$1"
    local subject="$2"
    local message="$3"
    local notification_service="${NOTIFICATION_SERVICE:-email}"
    
    log "INFO" "Sending notification to $recipient via $notification_service"
    
    case "$notification_service" in
        "email")
            _send_email_notification "$recipient" "$subject" "$message"
            ;;
        "slack")
            _send_slack_notification "$recipient" "$subject" "$message"
            ;;
        "test")
            _send_test_notification "$recipient" "$subject" "$message"
            ;;
        *)
            log "ERROR" "Unsupported notification service: $notification_service"
            return 1
            ;;
    esac
}

# Concrete notification implementations
_send_email_notification() {
    local recipient="$1" subject="$2" message="$3"
    
    if command -v mail >/dev/null 2>&1; then
        echo "$message" | mail -s "$subject" "$recipient"
        log "INFO" "Email sent successfully to $recipient"
    else
        log "WARN" "Mail command not available, notification not sent"
        return 1
    fi
}

_send_slack_notification() {
    local recipient="$1" subject="$2" message="$3"
    local slack_webhook="${SLACK_WEBHOOK:-}"
    
    if [[ -z "$slack_webhook" ]]; then
        log "ERROR" "Slack webhook not configured"
        return 1
    fi
    
    curl -X POST -H 'Content-type: application/json' \
        --data "{\"text\":\"$subject: $message\"}" \
        "$slack_webhook" &>/dev/null
}

_send_test_notification() {
    local recipient="$1" subject="$2" message="$3"
    log "DEBUG" "Test notification: To=$recipient, Subject=$subject, Message=$message"
}

# Main business logic using dependency injection
process_order() {
    local customer_id="$1"
    local amount="$2"
    local payment_method="$3"
    local email="$4"
    
    log "INFO" "Processing order: customer=$customer_id, amount=\$$amount"
    
    # Validate inputs (fail fast)
    if [[ ! "$customer_id" =~ ^[0-9]+$ ]] || (( customer_id <= 0 )); then
        log "ERROR" "Invalid customer ID: $customer_id"
        return 1
    fi
    
    if [[ ! "$amount" =~ ^[0-9]+(\.[0-9]{1,2})?$ ]] || (( $(echo "$amount <= 0" | bc -l) )); then
        log "ERROR" "Invalid amount: $amount"
        return 1
    fi
    
    if [[ ! "$email" =~ ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$ ]]; then
        log "ERROR" "Invalid email address: $email"
        return 1
    fi
    
    # Calculate tax using environment-specific rate
    local tax_rate
    case "${CUSTOMER_TYPE:-standard}" in
        "premium") tax_rate="0.05" ;;
        "vip") tax_rate="0.03" ;;
        *) tax_rate="0.08" ;;
    esac
    
    local tax
    tax=$(echo "$amount * $tax_rate" | bc -l)
    local total
    total=$(echo "$amount + $tax" | bc -l)
    
    log "INFO" "Order total: \$${amount} + \$${tax} tax = \$${total}"
    
    # Save order to database (using injected database dependency)
    local order_id
    if ! order_id=$(database_execute "INSERT INTO orders (customer_id, amount, status) VALUES ($customer_id, $total, 'pending'); SELECT last_insert_rowid();"); then
        log "ERROR" "Failed to save order to database"
        return 1
    fi
    
    log "INFO" "Order saved with ID: $order_id"
    
    # Process payment (using injected payment gateway)
    if process_payment "$total" "$payment_method"; then
        # Update order status
        if database_execute "UPDATE orders SET status = 'paid' WHERE id = $order_id"; then
            log "INFO" "Order $order_id marked as paid"
            
            # Send confirmation (using injected notification service)
            if send_notification "$email" "Order Confirmation" "Your order #$order_id has been processed successfully."; then
                log "INFO" "Order processing completed successfully"
                return 0
            else
                log "WARN" "Order processed but notification failed"
                return 0  # Don't fail the order for notification issues
            fi
        else
            log "ERROR" "Failed to update order status"
            return 1
        fi
    else
        # Payment failed - update order status
        database_execute "UPDATE orders SET status = 'failed' WHERE id = $order_id"
        log "ERROR" "Payment processing failed for order $order_id"
        return 1
    fi
}

# Testing functions - demonstrating different testing approaches

# Detroit School: Use real implementations where possible
test_with_real_implementations() {
    log "INFO" "Running Detroit School tests with real implementations"
    
    # Use SQLite (real but lightweight) instead of MySQL
    export DATABASE_TYPE="sqlite"
    export SQLITE_DB="/tmp/test_orders_real.db"
    
    # Use test payment gateway but real-ish logic
    export PAYMENT_GATEWAY="test"
    export TEST_PAYMENT_SUCCESS_RATE="100"
    
    # Use test notifications but with real message formatting
    export NOTIFICATION_SERVICE="test"
    
    # Initialize test database
    database_execute "CREATE TABLE IF NOT EXISTS orders (id INTEGER PRIMARY KEY AUTOINCREMENT, customer_id INTEGER, amount REAL, status TEXT);"
    database_execute "DELETE FROM orders;"  # Clean state
    
    # Test valid order
    if process_order 123 "100.00" "credit_card" "test@example.com"; then
        log "INFO" "✓ Valid order test passed"
    else
        log "ERROR" "✗ Valid order test failed"
        return 1
    fi
    
    # Verify order was actually saved
    local order_count
    order_count=$(database_execute "SELECT COUNT(*) FROM orders WHERE status = 'paid';")
    if [[ "$order_count" == "1" ]]; then
        log "INFO" "✓ Database persistence test passed"
    else
        log "ERROR" "✗ Database persistence test failed (count: $order_count)"
        return 1
    fi
    
    # Test invalid inputs (should fail fast)
    if ! process_order -1 "100.00" "credit_card" "invalid-email"; then
        log "INFO" "✓ Input validation test passed"
    else
        log "ERROR" "✗ Input validation test failed"
        return 1
    fi
    
    log "INFO" "Detroit School tests completed successfully"
}

# London School: Mock external dependencies, focus on interactions
test_with_mocked_dependencies() {
    log "INFO" "Running London School tests with mocked dependencies"
    
    # Create mock functions that verify interactions
    declare -a mock_calls=()
    
    # Mock database operations
    _execute_test_query() {
        local query="$1"
        mock_calls+=("database: $query")
        
        if [[ "$query" =~ INSERT ]]; then
            echo "1"  # Return mock order ID
        elif [[ "$query" =~ SELECT.*COUNT ]]; then
            echo "1"  # Return mock count
        fi
    }
    
    # Mock payment processing
    _process_test_payment() {
        local amount="$1" payment_method="$2"
        mock_calls+=("payment: $amount via $payment_method")
        return 0  # Always succeed for interaction testing
    }
    
    # Mock notifications
    _send_test_notification() {
        local recipient="$1" subject="$2" message="$3"
        mock_calls+=("notification: $recipient - $subject")
        return 0
    }
    
    # Configure test environment
    export DATABASE_TYPE="test"
    export PAYMENT_GATEWAY="test"
    export NOTIFICATION_SERVICE="test"
    
    # Test order processing
    if process_order 123 "100.00" "credit_card" "test@example.com"; then
        log "INFO" "✓ Mocked order processing test passed"
    else
        log "ERROR" "✗ Mocked order processing test failed"
        return 1
    fi
    
    # Verify expected interactions occurred
    local expected_calls=4  # INSERT, UPDATE, payment, notification
    if (( ${#mock_calls[@]} == expected_calls )); then
        log "INFO" "✓ Interaction verification test passed (${#mock_calls[@]} calls)"
    else
        log "ERROR" "✗ Interaction verification test failed (expected $expected_calls, got ${#mock_calls[@]})"
        return 1
    fi
    
    # Display interaction log
    log "DEBUG" "Mock interactions:"
    for call in "${mock_calls[@]}"; do
        log "DEBUG" "  - $call"
    done
    
    log "INFO" "London School tests completed successfully"
}

# Hybrid Approach: Mix real and mock implementations
test_hybrid_approach() {
    log "INFO" "Running Hybrid tests with mixed implementations"
    
    # Use real database (fast SQLite)
    export DATABASE_TYPE="sqlite"
    export SQLITE_DB="/tmp/test_orders_hybrid.db"
    
    # Mock external payment service
    export PAYMENT_GATEWAY="test"
    export TEST_PAYMENT_SUCCESS_RATE="100"
    
    # Use real notification logic but mock delivery
    export NOTIFICATION_SERVICE="test"
    
    # Initialize test database
    database_execute "CREATE TABLE IF NOT EXISTS orders (id INTEGER PRIMARY KEY AUTOINCREMENT, customer_id INTEGER, amount REAL, status TEXT);"
    database_execute "DELETE FROM orders;"
    
    # Test with real database persistence but mocked external services
    if process_order 456 "200.00" "paypal" "hybrid@example.com"; then
        log "INFO" "✓ Hybrid test passed"
    else
        log "ERROR" "✗ Hybrid test failed"
        return 1
    fi
    
    # Verify with real database query
    local saved_amount
    saved_amount=$(database_execute "SELECT amount FROM orders WHERE customer_id = 456;")
    expected_amount="216.00"  # 200 + 8% tax
    
    if [[ "$saved_amount" == "$expected_amount" ]]; then
        log "INFO" "✓ Real database verification passed"
    else
        log "ERROR" "✗ Real database verification failed (expected $expected_amount, got $saved_amount)"
        return 1
    fi
    
    log "INFO" "Hybrid tests completed successfully"
}

# Main execution function
main() {
    log "INFO" "Starting Order Processing System"
    log "INFO" "Environment: $ENVIRONMENT, PHP Version: $PHP_VERSION"
    log "INFO" "Script directory: $SCRIPT_DIR"
    
    # Parse command line arguments
    local action="${1:-help}"
    
    case "$action" in
        "process-order")
            shift
            if (( $# != 4 )); then
                log "ERROR" "Usage: $0 process-order <customer_id> <amount> <payment_method> <email>"
                exit 1
            fi
            process_order "$@"
            ;;
        
        "test-detroit")
            test_with_real_implementations
            ;;
        
        "test-london")
            test_with_mocked_dependencies
            ;;
        
        "test-hybrid")
            test_hybrid_approach
            ;;
        
        "test-all")
            test_with_real_implementations &&
            test_with_mocked_dependencies &&
            test_hybrid_approach &&
            log "INFO" "All tests passed successfully!"
            ;;
        
        "help"|*)
            cat <<EOF
Order Processing System - Dependency Inversion Demo

Usage: $0 <action> [arguments]

Actions:
  process-order <customer_id> <amount> <payment_method> <email>
    Process a single order with the given parameters
    
  test-detroit
    Run tests using real implementations (Detroit School)
    
  test-london  
    Run tests using mocked dependencies (London School)
    
  test-hybrid
    Run tests using mixed real/mock approach (Pragmatic)
    
  test-all
    Run all test suites
    
  help
    Show this help message

Environment Variables:
  ENVIRONMENT         - development|production (default: development)
  DATABASE_TYPE       - mysql|sqlite|test (default: mysql)
  PAYMENT_GATEWAY     - stripe|paypal|test (default: stripe)
  NOTIFICATION_SERVICE - email|slack|test (default: email)
  LOG_LEVEL          - debug|info|warning|error (default: info)
  CUSTOMER_TYPE      - standard|premium|vip (default: standard)

Examples:
  # Process an order in development
  ENVIRONMENT=development $0 process-order 123 100.00 credit_card user@example.com
  
  # Run tests with verbose output
  LOG_LEVEL=debug $0 test-all
  
  # Use test implementations
  DATABASE_TYPE=test PAYMENT_GATEWAY=test NOTIFICATION_SERVICE=test $0 process-order 456 50.00 paypal test@example.com
EOF
            ;;
    esac
}

# Execute main function with all arguments
main "$@"