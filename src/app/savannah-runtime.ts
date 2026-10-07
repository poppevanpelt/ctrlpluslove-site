export const SAVANNAH_VAPI = {
  publicKey: "12382a58-9f0f-41fe-ba94-257368be07cb",
  assistantId: "4289b114-3dca-4052-9684-13c3435bd0a4",
} as const;

export const SAVANNAH_TEXT_BURST_TIMEOUT_MS = 45_000;
export const SAVANNAH_VOICE_MAX_DURATION_MS = 5 * 60_000;
export const SAVANNAH_HIDDEN_TAB_GRACE_MS = 30_000;

export const SAVANNAH_PAGE_LOCK_CLASSES = [
  "savannah-page-locking",
  "savannah-page-locked",
] as const;

export function clearSavannahPageLock(
  remove: (...classes: string[]) => void,
) {
  remove(...SAVANNAH_PAGE_LOCK_CLASSES);
}
