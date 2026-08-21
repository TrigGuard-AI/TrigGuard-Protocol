# `@trigguard/protocol` (TypeScript SDK)

[![npm version](https://img.shields.io/npm/v/@trigguard/protocol)](https://www.npmjs.com/package/@trigguard/protocol)

**Reference implementation** for the TrigGuard protocol in TypeScript: vocabulary (`PERMIT`, `DENY`, `ESCALATE`, `SILENCE`), enforcement semantics, and the `DecisionRecord` shape, plus JSON snapshots aligned with [`core/contracts/decision_contract.json`](../../core/contracts/decision_contract.json).

**Language-agnostic specification:** [`spec/TG_PROTOCOL.md`](../../spec/TG_PROTOCOL.md) — this npm package is an SDK, not the full protocol.

**Runtime evaluation and policy engines** live in other packages and services; integrations **conform** to the spec.

## Quick start

```bash
npm install @trigguard/protocol
```

```typescript
import { DECISION, ENFORCEMENT, type DecisionRecord } from "@trigguard/protocol";

const record: DecisionRecord = {
  decision: DECISION.PERMIT,
  enforcement: ENFORCEMENT.EXECUTED,
  reason_code: "NO_POLICY_VIOLATION",
  timestamp: new Date().toISOString(),
};
```

There is **no** `evaluate()` or `validateDecision()` in this package — only **types and canonical constants** so your code matches [`spec/TG_PROTOCOL.md`](../../spec/TG_PROTOCOL.md). For JSON Schema and contract JSON via subpaths, see [Subpath exports](#subpath-exports-json).

## Install and paths

Published on the public registry under the `@trigguard` scope. For release process, see [`docs/release/PROTOCOL_RELEASE.md`](https://github.com/TrigGuard-AI/TrigGuard/blob/main/docs/release/PROTOCOL_RELEASE.md) in the [TrigGuard monorepo](https://github.com/TrigGuard-AI/TrigGuard) (authoritative).

**Develop inside the repo** (no registry), use a path or workspace:

```json
"@trigguard/protocol": "file:implementations/typescript"
```

(From a package at the repository root. From `packages/*`, use `file:../../implementations/typescript`.)

Or install from a Git URL / workspace as documented in the main [TrigGuard repository](https://github.com/TrigGuard-AI/TrigGuard).

## Decision model (0.2.0)

Canonical order: **PERMIT → DENY → ESCALATE → SILENCE**. No aliases between any pair.

| Decision | Meaning |
|----------|---------|
| **PERMIT** | Authorization has been issued for execution. |
| **DENY** | Authorization has explicitly been refused. |
| **ESCALATE** | Execution is not authorized automatically and requires a higher-authority or human decision path. |
| **SILENCE** | No authorization was issued. Without authorization, execution cannot proceed. |

**Critical invariants**

- `ESCALATE` ≠ `SILENCE`
- `executionAllowed(decision) === true` **only** when `decision === "PERMIT"`
- DENY, ESCALATE, and SILENCE do **not** authorize execution

Policy-only layers may restrict emitted decisions to **PERMIT** / **DENY**; full protocol surfaces also use **ESCALATE** and **SILENCE** where applicable.

Other useful exports: `type Decision`, `DECISIONS`, `PERMIT_DEFINITION`, `DENY_DEFINITION`, `ESCALATE_DEFINITION`, `SILENCE_DEFINITION`, `isCanonicalDecision`, `executionAllowed`, `REASON_CODES`, `decisionContract`.

See [`CHANGELOG.md`](CHANGELOG.md) for the 0.2.0 exhaustive-consumer break note.

## Subpath exports (JSON)

The package exposes stable paths for the JSON schema and decision contract snapshot:

```javascript
const schema = require("@trigguard/protocol/schema");
const contract = require("@trigguard/protocol/contract");
```

## Build (maintainers / CI)

From `implementations/typescript`:

```bash
npm install
npm run build
npm test
```

`build` runs `sync-contract` (when the full monorepo is present), `tsc`, and asset copy into `dist/`. Published tarballs are built via `prepack` / `prepare` before `npm publish`.

## Repository

Canonical TypeScript SDK in this repo: [`implementations/typescript/`](.) (spec: [`spec/`](../../spec/)). The [TrigGuard monorepo](https://github.com/TrigGuard-AI/TrigGuard) carries a mirror until cutover — keep them in sync per [`PROTOCOL_REPO_EXTRACTION.md`](https://github.com/TrigGuard-AI/TrigGuard/blob/main/docs/governance/PROTOCOL_REPO_EXTRACTION.md).

For installation paths and release tagging, see:

- [`docs/developers/INSTALL_PROTOCOL.md`](https://github.com/TrigGuard-AI/TrigGuard/blob/main/docs/developers/INSTALL_PROTOCOL.md)
- [`docs/release/PROTOCOL_RELEASE.md`](https://github.com/TrigGuard-AI/TrigGuard/blob/main/docs/release/PROTOCOL_RELEASE.md)

## Legacy note (snapshot)

`src/contracts/decision_contract.json` is kept in sync with `core/contracts/decision_contract.json` via `npm run sync-contract` in the monorepo. **Do not edit kernel contracts from this README** — follow governance and protocol integrity processes in the main repo.
