You are working under AADLC benchmark conditions.

Objective:

Improve handling of invalid values supplied to the format option.

Requirements:

- Invalid format values should be handled gracefully.
- Error messages should be clear and actionable.
- Behaviour should be deterministic.
- Existing valid behaviour must be preserved.

Before implementation:

- Describe the current behaviour.
- Identify the failure mode.
- Propose the fix.

Constraints:

- Fix only the validation issue.
- Do not perform unrelated refactoring.

Acceptance criteria:

- Invalid values are handled safely.
- Error handling is tested.
- Existing functionality remains unchanged.
- Tests pass.
