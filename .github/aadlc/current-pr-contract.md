# Current PR Contract

## Status

Phase 01 — CLI feature: `--format text|json` option.

## Goal

Add `--format text` and `--format json` output formatting to the CLI. Existing text behaviour remains the default. The `info` command is the primary beneficiary of structured JSON output.

## Intended approach

1. Add a `--format` option (choices: `text`, `json`; default: `text`) to the `info` command via its `builder`.
2. In the `info` handler, branch on `argv.format`: for `json` emit `JSON.stringify` of the collected data to stdout; for `text` (default) retain existing coloured consola output.
3. Add input validation via yargs `.choices()` so invalid values produce a clear error.
4. Write tests asserting JSON output shape and text fallback.
5. Update README to document the new option.

## Risks and assumptions

- `greeting` and `create` are interactive; `--format` is not applicable there and will not be added to those commands.
- The `--format` option is scoped to `info` only to minimise disruption.
- Colour-stripping is handled by not calling logger methods in JSON mode; no new dependency is needed.

## Approved scope

- `src/commands/info.ts` — add format option and branch output
- `src/index.test.ts` (or a new `src/commands/info.test.ts`) — format tests
- `README.md` — document `--format`
- `.github/aadlc/current-pr-contract.md` — this file
- `.github/aadlc/memory.md` — post-phase update

## Forbidden scope

- `src/commands/greeting.ts` — no format changes
- `src/commands/create.ts` — no format changes
- `bin/run.ts` — no global middleware changes needed
- Benchmark prompts or scoring templates

## Contract assertions

1. `info --format json` emits valid JSON to stdout.
2. JSON output contains keys: `node`, `arch`, `cwd`, `memoryUsage`, `argv`.
3. `info --format text` (or no flag) produces existing coloured text output.
4. `info --format invalid` exits with a non-zero code and a descriptive error.
5. Build, compile, test, lint, and format checks all pass.

## Hard rules

- Do not inspect other benchmark repositories.
- Do not use results from other model runs.
- Do not change benchmark prompts.
- Do not change benchmark scoring templates.
- Preserve existing behaviour unless the phase explicitly requires a change.
- Keep diffs minimal and reviewable.
- Run available validation commands where possible.
- Update AADLC artifacts only when the phase requires it.
