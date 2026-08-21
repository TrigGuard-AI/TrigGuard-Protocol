# Changelog

All notable changes to `@trigguard/protocol` are documented in this file.

## [0.2.0] — 2026-08-21

### BREAKING FOR EXHAUSTIVE CONSUMERS

`Decision` now includes **`ESCALATE`**. The legal value space of the public DecisionRecord contract is:

`PERMIT | DENY | ESCALATE | SILENCE`

(canonical order). External code that exhaustively switches on three states, asserts `DECISIONS.length === 3`, or hardcodes `["PERMIT","DENY","SILENCE"]` must be updated.

Runtime behavior for most TrigGuard consumers is **additive** (fail-closed non-PERMIT paths already treated unknown/non-PERMIT as blocked). Semver is **0.2.0** (not 0.1.4) because the public contract value space changed.

### Added

- `ESCALATE` on `Decision`, `DECISION`, and `DECISIONS`
- `ESCALATE_DEFINITION`, `PERMIT_DEFINITION`, `DENY_DEFINITION`
- `isCanonicalDecision()` — case-sensitive membership in `DECISIONS`
- `executionAllowed()` — `true` **only** when `decision === "PERMIT"`
- Conformance fixture `escalate-basic`
- Unit tests for four-state acceptance, rejection of unknown/lowercase/null/empty, serialize roundtrips, and `ESCALATE !== SILENCE`

### Changed

- JSON Schema decision enum in `spec/decision_contract.schema.json` and `implementations/typescript/src/schema.json`

### Invariants (unchanged / reinforced)

- No alias: `ESCALATE` ≠ `SILENCE`
- No alias: `SILENCE` ≠ `ESCALATE`
- Only `PERMIT` authorizes execution

## [0.1.3] — prior

Historical three-state DecisionRecord (`PERMIT | DENY | SILENCE`) as published on npm.

## [0.1.2] — prior

TypeScript package snapshot aligned with protocol repo extraction.
