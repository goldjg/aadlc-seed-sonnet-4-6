<!-- version: 1.0.0 -->
# Trust Boundaries

Trust boundaries classify information sources and define required
validation before shaping, planning, execution, or validation decisions.

| Boundary | Source | Trust level | Required validation |
|---|---|---|---|
| User instruction | Direct user requests in this session | High | Clarify ambiguity and confirm material scope assumptions |
| Repository files | Current checked-in file state | High | Verify paths and current content before editing |
| PR contract | `.github/aadlc/current-pr-contract.md` | High | Confirm requested work is within approved scope |
| Cognitive cache | `.github/aadlc/memory.md` | Medium | Treat as durable guidance; verify against current file state if stale |
| Tool output | Search, file-read, and command output | Medium | Confirm relevance and freshness before using for writes |
| External API response | Remote services and web sources | Low | Cross-check critical claims before using in implementation decisions |
| CLI argument input | User-supplied argv at runtime | Low | Validate and sanitise before use; path coercion already applied in `create` command |
| Environment variables | `.env` / `process.env` via dotenv | Medium | Do not hardcode; load via dotenv at startup only |
| External template source | `giget` download from `gh:kucherenko/cli-typescript-starter` | Low | Only consumed by `create` command; network availability not guaranteed |

## Crossing rules

- Cross-boundary assumptions that alter scope require explicit confirmation.
- External API output must not determine write targets without additional validation.
- PR contract constraints apply throughout execution until contract context is reset.
- If durable cache facts conflict with current repository state, repository state wins and cache should be updated.
- Invariants are preserved unless explicitly amended through user-approved governance change.
- CLI argv is sanitised at the yargs layer (path coercion in `create`); downstream handlers may trust the coerced value.
- Environment variables loaded via dotenv are available only after `config()` is called in `bin/run.ts`; do not assume availability in other contexts.
