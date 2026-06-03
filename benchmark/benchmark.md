# AADLC Model Benchmark Playbook

## Purpose

This benchmark measures useful engineering work per AI credit across different coding models using the same repository, same task sequence, same prompts, and same AADLC workflow.

The goal is not to determine which model is "smartest" in isolation. The goal is to compare cost, quality, steering effort, and validated output inside a governed agentic development workflow.

## Repositories

Seed repository:

- goldjg/aadlc-seed

Measured repositories:

- goldjg/aadlc-seed-sonnet-4-6
- goldjg/aadlc-seed-gpt-5-4
- goldjg/aadlc-seed-mai-code-1-flash

## Rules

Each measured repository must start from the same seed commit.

Each model must receive the same phase prompts in the same order.

One model is tested against one repository at a time.

No model may inspect another model's repository, diffs, prompts, run notes, benchmark results, or AADLC artifacts until all measured runs are complete.

Credit usage must be recorded before and after each phase.

Human interventions must be recorded.

Manual fixes must be recorded.

Failed tests, retries, and abandoned outputs must be recorded.

The benchmark measures accepted work, not raw output volume.

## Primary metric

Credits per validated phase.

## Secondary metrics

- Wall-clock time
- Files changed
- Tests passed
- Build/lint status
- Human interventions
- Review defects
- Documentation quality
- AADLC artifact quality
- Rework required
- Final mergeability

## Non-goals

This benchmark does not measure general intelligence.

This benchmark does not prove universal model superiority.

This benchmark does not compare models outside this repository, task suite, or workflow.

This benchmark does not allow live task mutation to favour a model.
