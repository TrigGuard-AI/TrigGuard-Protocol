#!/usr/bin/env node
/**
 * Prove npm pack of @trigguard/protocol matches published 0.2.0 tarball SHA-256.
 * Usage: node scripts/repro-pack-sha.mjs [--expected <sha256>]
 */
import { createHash } from "node:crypto";
import { readFileSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkgRoot = join(__dirname, "..");
const DEFAULT_EXPECTED =
  "5e42c79d7eda8f2f9dea5fe4efd25b87d193019b71497c7afee883b2b6ccef93";

const args = process.argv.slice(2);
let expected = DEFAULT_EXPECTED;
const i = args.indexOf("--expected");
if (i >= 0 && args[i + 1]) expected = args[i + 1];

const pack = spawnSync("npm", ["pack", "--ignore-scripts=false"], {
  cwd: pkgRoot,
  encoding: "utf8",
  env: process.env,
});
if (pack.status !== 0) {
  console.error(pack.stdout);
  console.error(pack.stderr);
  process.exit(pack.status || 1);
}
const line = pack.stdout
  .trim()
  .split(/\n/)
  .filter(Boolean)
  .pop();
const tgz = join(pkgRoot, line);
if (!existsSync(tgz)) {
  console.error("pack output tarball not found:", line);
  process.exit(1);
}
const sha = createHash("sha256").update(readFileSync(tgz)).digest("hex");
const ok = sha === expected;
console.log(
  JSON.stringify(
    {
      tarball: line,
      sha256: sha,
      expected,
      match: ok,
    },
    null,
    2
  )
);
process.exit(ok ? 0 : 2);
