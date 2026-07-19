export const STEEL_BALL_ID = "SB-01" as const;

export type SteelBallId = typeof STEEL_BALL_ID;

export type SteelBallIdentity = {
  id: SteelBallId;
  name: "Steel Ball";
  owner: "ctrl-love-office";
};

export const steelBallIdentity: SteelBallIdentity = {
  id: STEEL_BALL_ID,
  name: "Steel Ball",
  owner: "ctrl-love-office",
};

export const steelBallAssetRecord = {
  id: STEEL_BALL_ID,
  label: "Steel Ball",
  owner: "ctrl+love Office",
  status: "available",
  lastKnownLocation: "visitor",
} as const;
