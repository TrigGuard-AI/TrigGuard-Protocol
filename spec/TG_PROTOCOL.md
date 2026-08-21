# TrigGuard protocol — spec hub

| Item | Value |
|------|--------|
| **Protocol version** | **v0.2.0** — DecisionRecord four-state contract (`@trigguard/protocol` npm). Git tags for historical protocol releases remain listed under [Releases](https://github.com/TrigGuard-AI/trigguard-protocol/releases). |
| **Spec artifact** | [`decision_contract.schema.json`](decision_contract.schema.json) |
| **Conformance** | [`conformance/protocol-tests.json`](../conformance/protocol-tests.json) |
| **TypeScript SDK** | [`implementations/typescript`](../implementations/typescript) (`@trigguard/protocol` on npm) |
| **Runtime monorepo** | [TrigGuard-AI/TrigGuard](https://github.com/TrigGuard-AI/TrigGuard) (private product) — extraction/cutover notes: [PROTOCOL_REPO_EXTRACTION.md](https://github.com/TrigGuard-AI/TrigGuard/blob/main/docs/governance/PROTOCOL_REPO_EXTRACTION.md). |

## Protocol versioning

- **This document** and **`conformance/protocol-tests.json`** use the **same** semver as **GitHub Releases** here (e.g. **v0.1.0**).
- Breaking changes → **major** bump; additive schema/docs → **minor**; fixes → **patch**.

## Goals

- **One decision shape** across products: `decision`, `enforcement`, `reason_code`, `timestamp`.
- **Deterministic vocabulary** for `decision` (`PERMIT` \| `DENY` \| `ESCALATE` \| `SILENCE`, canonical order) and `enforcement` (`EXECUTED` \| `BLOCKED`). **ESCALATE ≠ SILENCE.** Only **PERMIT** authorizes execution.
- **No spec drift** between `spec/` and the npm package schema (CI gate).

## Canonical prose

All detailed rules, execution flow, and receipt semantics: **[`docs/TRIGGUARD_EXECUTION_PROTOCOL.md`](../docs/TRIGGUARD_EXECUTION_PROTOCOL.md)**.

## Implementation constitution

[`TRIGGUARD_IMPLEMENTATION_MASTER_PLAN.md`](https://github.com/TrigGuard-AI/TrigGuard/blob/main/TRIGGUARD_IMPLEMENTATION_MASTER_PLAN.md) (TrigGuard monorepo)
