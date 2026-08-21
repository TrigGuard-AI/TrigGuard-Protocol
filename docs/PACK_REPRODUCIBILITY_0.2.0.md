# @trigguard/protocol@0.2.0 pack reproducibility

Published tarball SHA-256:

`5e42c79d7eda8f2f9dea5fe4efd25b87d193019b71497c7afee883b2b6ccef93`

Historical commit with byte-identical pack: `6dad064`.

`devDependencies.typescript` must remain `~6.0.3` (exact resolved `6.0.3`) to reproduce.
Do not add fields to `implementations/typescript/package.json` that change the packed manifest
without intending a new publish.

Verify (from `implementations/typescript`):

```bash
node scripts/repro-pack-sha.mjs
```
