# Outcome review / calibration boundary

The outcome-review module compares a recorded target and actual value against the frozen original CONVICTION assessment. It never regrades evidence, never guesses whether higher or lower is better, and never infers causal impact.
Inputs are self-reported; passing verified=true is ignored. Independent verification requires a separate provenance and reviewer workflow.

A single outcome does not calibrate CONVICTION as a predictor. Any aggregate validation must pre-register outcome definitions, keep unsuccessful cases and do-nothing controls, and stratify by buyer, industry and pilot type.
The module and tests are only committed to draft PR #158. No production access or database migration is implied.
