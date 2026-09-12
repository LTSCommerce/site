# WITHOUT a sub-agent (pollutes main context)
$ Search the entire codebase for all uses of the deprecated API
Searching for deprecated API usage...
Found in: src/auth/login.js:42
Found in: src/users/profile.js:156
[... 500 more lines of search results ...]
# Main context now contains 500+ lines of search output

# ---------------------------------

# WITH a sub-agent (keeps main context clean)
$ Use a sub-agent to audit deprecated API usage and report back a summary
Delegating to sub-agent for comprehensive search...
✓ Sub-agent completed analysis

Summary: Found 23 instances of deprecated API across 8 files
- Authentication: 5 instances (needs urgent update)
- User profiles: 8 instances (low priority)
- Data processing: 10 instances (can be batch updated)

# Main context stays clean - only 5 lines instead of 500!
