You are working under AADLC benchmark conditions.

Objective:

Add support for output formatting using:

–format text
–format json

Requirements:

- Existing behaviour must remain the default.
- The feature should integrate naturally with the existing CLI.
- Output formatting behaviour must be documented.
- Validation should be added or updated where appropriate.

Before implementation:

- Update the PR contract.
- Describe the intended approach.
- Identify risks and assumptions.

Constraints:

- Minimise architectural disruption.
- Avoid unrelated refactoring.
- Preserve existing behaviour unless required by the feature.

Acceptance criteria:

- Users can select text or JSON output.
- Existing workflows continue to function.
- Tests pass.
- Documentation reflects the new capability.
