/**
 * @trigguard/protocol — canonical vocabulary and record shape for TrigGuard surfaces.
 * Policy/evaluation layers may emit only PERMIT|DENY; full protocol includes ESCALATE|SILENCE.
 * Reason codes are snapshotted from core/contracts/decision_contract.json (see sync-contract script).
 *
 * Canonical order (do not reorder): PERMIT, DENY, ESCALATE, SILENCE.
 * No aliases: ESCALATE ≠ SILENCE. Only PERMIT authorizes execution.
 */

import decisionContract from "./contracts/decision_contract.json";

/** Full protocol decision set (remote eval / product surfaces / DecisionRecord). */
export type Decision = "PERMIT" | "DENY" | "ESCALATE" | "SILENCE";

/** Policy contract layer decisions only (matches decision_contract.json `decision`). */
export type PolicyDecision = "PERMIT" | "DENY";

export type Enforcement = "EXECUTED" | "BLOCKED";

export const DECISION = {
  PERMIT: "PERMIT",
  DENY: "DENY",
  ESCALATE: "ESCALATE",
  SILENCE: "SILENCE",
} as const satisfies Record<string, Decision>;

export const ENFORCEMENT = {
  EXECUTED: "EXECUTED",
  BLOCKED: "BLOCKED",
} as const satisfies Record<string, Enforcement>;

/** Ordered canonical sets for consumers (CI, SDKs). Order is normative. */
export const DECISIONS = ["PERMIT", "DENY", "ESCALATE", "SILENCE"] as const;

export const ENFORCEMENTS = ["EXECUTED", "BLOCKED"] as const;

/**
 * PERMIT — Authorization has been issued for execution.
 */
export const PERMIT_DEFINITION =
  "PERMIT means authorization has been issued for execution.";

/**
 * DENY — Authorization has explicitly been refused.
 */
export const DENY_DEFINITION =
  "DENY means authorization has explicitly been refused.";

/**
 * ESCALATE — Execution is not authorized automatically and requires a higher-authority
 * or human decision path. Not SILENCE; not PERMIT.
 */
export const ESCALATE_DEFINITION =
  "ESCALATE means execution is not authorized automatically and requires a higher-authority or human decision path.";

/**
 * Canonical SILENCE explanation for public and SDK surfaces.
 * Keep in sync with site governance / protocol docs.
 */
export const SILENCE_DEFINITION =
  "SILENCE means no authorization was issued. Without authorization, execution cannot proceed.";

/** Reason codes derived from core/contracts/decision_contract.json (kept in sync by sync-contract). */
export const REASON_CODES: readonly string[] = decisionContract.reasonCode;

export type ReasonCode = (typeof decisionContract.reasonCode)[number];

export interface DecisionRecord {
  decision: Decision;
  enforcement: Enforcement;
  /** Prefer values from REASON_CODES when representing policy outcomes. */
  reason_code: string;
  timestamp: string;
}

/** True iff value is an exact canonical Decision token (case-sensitive). */
export function isCanonicalDecision(value: unknown): value is Decision {
  return typeof value === "string" && (DECISIONS as readonly string[]).includes(value);
}

/**
 * executionAllowed(decision) === true only when decision === PERMIT.
 * DENY, ESCALATE, SILENCE, and unknown values do not authorize execution.
 */
export function executionAllowed(decision: unknown): boolean {
  return decision === DECISION.PERMIT;
}

/** Embedded contract snapshot (authoritative registry for reason codes at policy layer). */
export { decisionContract };
