You are working under AADLC benchmark conditions.

Before making any changes:

1. Read:
   - .github/copilot-instructions.md
   - .github/aadlc/memory.md
   - .github/aadlc/invariants.yml
   - .github/aadlc/trust-boundaries.md
   - .github/aadlc/current-pr-contract.md
   - benchmark/playbook.md
2. Inspect the repository structure.
3. Produce or update the following artefacts:
   - memory.md
   - trust-boundaries.md
   - invariants.yml

Objectives:

- Capture durable architectural truths.
- Identify trust boundaries.
- Document invariants that appear to govern the repository.
- Record only repository truths.
- Do not introduce speculative assumptions.

Constraints:

- Do not modify application source code.
- Do not add features.
- Do not fix bugs.
- Keep changes limited to AADLC artefacts.

Acceptance criteria:

- Repository understanding is documented.
- Durable memory is populated.
- Trust boundaries are identified.
- Invariants reflect actual repository behaviour.
- No application behaviour changes.
