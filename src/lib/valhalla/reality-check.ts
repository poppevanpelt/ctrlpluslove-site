export function realityCheck(expected: number | null, observed: number | null) {
  if (expected === null || observed === null) return { difference: null, status: "unknown" };
  if (!Number.isFinite(expected) || !Number.isFinite(observed)) return { difference: null, status: "invalid" };
  return { difference: observed - expected, status: "self-reported" };
}
