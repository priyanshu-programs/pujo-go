@AGENTS.md

## Workflow

- All plans for this repo go in `plan.md` at the project root. Before starting any task, write/update the relevant plan there.
- Every code change or notable update must be logged in `updates.md` at the project root (what changed, why, and when).
- Before touching any line of code, always read `plan.md` and `updates.md` first for full context on what's planned and what's already been done.
- Use the `graft` index/tools (graft_find_code, graft_find_all, graft_trace_calls, graft_file_api, graft_repo_map) to understand existing code structure, call sites, and blast radius before making changes — prefer graft over grepping/reading files blind.
