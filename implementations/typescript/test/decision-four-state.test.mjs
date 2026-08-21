/**
 * Four-state DecisionRecord contract tests for @trigguard/protocol@0.2.0
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  DECISION,
  DECISIONS,
  ESCALATE_DEFINITION,
  SILENCE_DEFINITION,
  executionAllowed,
  isCanonicalDecision,
} from "../dist/index.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const schema = JSON.parse(readFileSync(join(root, "src/schema.json"), "utf8"));
const decisionEnum = schema.properties.decision.enum;

test("DECISIONS canonical order is PERMIT DENY ESCALATE SILENCE", () => {
  assert.deepEqual([...DECISIONS], ["PERMIT", "DENY", "ESCALATE", "SILENCE"]);
  assert.deepEqual(decisionEnum, ["PERMIT", "DENY", "ESCALATE", "SILENCE"]);
});

test("accept PERMIT DENY ESCALATE SILENCE", () => {
  for (const d of DECISIONS) {
    assert.equal(isCanonicalDecision(d), true);
    assert.equal(DECISION[d], d);
  }
});

test("reject unknown values, lowercase, null, empty", () => {
  assert.equal(isCanonicalDecision("MAYBE"), false);
  assert.equal(isCanonicalDecision("ALLOW"), false);
  assert.equal(isCanonicalDecision("permit"), false);
  assert.equal(isCanonicalDecision("escalate"), false);
  assert.equal(isCanonicalDecision(null), false);
  assert.equal(isCanonicalDecision(""), false);
  assert.equal(isCanonicalDecision(undefined), false);
});

test("executionAllowed only for PERMIT", () => {
  assert.equal(executionAllowed("PERMIT"), true);
  assert.equal(executionAllowed(DECISION.PERMIT), true);
  assert.equal(executionAllowed("DENY"), false);
  assert.equal(executionAllowed("ESCALATE"), false);
  assert.equal(executionAllowed("SILENCE"), false);
  assert.equal(executionAllowed("permit"), false);
  assert.equal(executionAllowed(null), false);
});

test("ESCALATE != SILENCE (tokens and definitions)", () => {
  assert.notEqual(DECISION.ESCALATE, DECISION.SILENCE);
  assert.notEqual(ESCALATE_DEFINITION, SILENCE_DEFINITION);
  assert.ok(ESCALATE_DEFINITION.includes("higher-authority"));
  assert.ok(SILENCE_DEFINITION.includes("no authorization was issued"));
});

test("ESCALATE DecisionRecord serialize -> deserialize roundtrip", () => {
  const record = {
    decision: "ESCALATE",
    enforcement: "BLOCKED",
    reason_code: "ESCALATION_REQUIRED",
    timestamp: "2026-08-21T12:00:00.000Z",
  };
  const roundtrip = JSON.parse(JSON.stringify(record));
  assert.equal(roundtrip.decision, "ESCALATE");
  assert.equal(isCanonicalDecision(roundtrip.decision), true);
  assert.equal(executionAllowed(roundtrip.decision), false);
  assert.ok(decisionEnum.includes(roundtrip.decision));
});

test("SILENCE DecisionRecord serialize -> deserialize roundtrip", () => {
  const record = {
    decision: "SILENCE",
    enforcement: "BLOCKED",
    reason_code: "MISSING_AUTHORIZATION",
    timestamp: "2026-08-21T12:00:00.000Z",
  };
  const roundtrip = JSON.parse(JSON.stringify(record));
  assert.equal(roundtrip.decision, "SILENCE");
  assert.notEqual(roundtrip.decision, "ESCALATE");
  assert.equal(executionAllowed(roundtrip.decision), false);
});

test("schema rejects unknown decision via enum membership", () => {
  assert.equal(decisionEnum.includes("UNKNOWN"), false);
  assert.equal(decisionEnum.includes(""), false);
});
