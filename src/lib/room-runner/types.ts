export type RoomType =
  | "Decision Room"
  | "Creative Room"
  | "Cultural Room"
  | "Challenge Room"
  | "Review Room"
  | "Fast Room";

export type RoomStatus =
  | "Ready to run"
  | "Running"
  | "In synthesis"
  | "Complete"
  | "Needs rerun";

export type ParticipantKind = "Human ambassador" | "Synthetic persona";

export type ParticipantLens =
  | "Systems & Scale"
  | "Culture & Meaning"
  | "Creative Adoption"
  | "Cultural and market perspective"
  | "Emotional Truth"
  | "Contrarian Pressure"
  | "Commercial Realism"
  | "Reality Stress"
  | "Synthesis & Governance"
  | "Execution Reality"
  | "Custom Lens";

export type FramingIssueType =
  | "too_broad"
  | "topic_not_decision"
  | "leading"
  | "missing_output";

export type FramingIssue = {
  type: FramingIssueType;
  label: string;
  guidance: string;
};

export type DecisionQuestion = {
  project: string;
  question: string;
  whyNow: string;
  desiredOutput: string;
  workingAssumption: string;
  roomType: RoomType;
  context: string;
  evidence: string;
  owner: string;
};

export type Participant = {
  id: string;
  name: string;
  kind: ParticipantKind;
  locationOrRole: string;
  primaryLens: ParticipantLens;
  assignedLens: string;
  description: string;
  reasonToInclude: string;
  likelyTension: string;
  prompt?: string;
  isSceptic?: boolean;
  isFacilitator?: boolean;
};

export type OpeningPosition = {
  id: string;
  participantId: string;
  participantName: string;
  lens: string;
  initialView: string;
  keyConcern: string;
  missingPoint: string;
  recommendation: string;
  confidence: number;
  challengeResponses: ChallengeResponse[];
};

export type DisagreementClassification =
  | "Productive"
  | "Superficial"
  | "Needs evidence"
  | "Must resolve"
  | "Preserve as tension";

export type Disagreement = {
  id: string;
  title: string;
  sideA: string;
  sideB: string;
  participants: string[];
  classification: DisagreementClassification;
  severity: number;
};

export type FrictionMap = {
  agreements: string[];
  contradictions: Disagreement[];
  definitions: string[];
  unchallengedAssumptions: string[];
  minorityPositions: string[];
  possibleFalseConsensus: string[];
};

export type Challenge = {
  id: string;
  disagreementId: string;
  prompt: string;
  selected: boolean;
};

export type ChallengeResponse = {
  id: string;
  challengeId: string;
  participantId: string;
  participantName: string;
  response: string;
};

export type Synthesis = {
  sharedGround: string;
  decisiveDisagreements: string;
  recommendedDirection: string;
  whatChanged: string;
  unresolvedTensions: string;
  confidenceScore: number;
  confidenceFactors: string[];
};

export type Decision = {
  decision: string;
  rationale: string;
  alternativesRejected: string;
  conditions: string;
  evidenceRequired: string;
  owner: string;
  nextAction: string;
};

export type OutputFormat =
  | "Strategy recommendation"
  | "Creative brief"
  | "Client memo"
  | "Internal decision note"
  | "LinkedIn post"
  | "Experiment proposal"
  | "Ambassador dispatch"
  | "Knowledge principle";

export type RoomOutput = {
  format: OutputFormat;
  title: string;
  body: string;
};

export type DiscussionLineage = {
  project: string;
  decisionQuestion: string;
  participants: string[];
  positions: string[];
  friction: string[];
  challenges: string[];
  synthesis: string[];
  decision: string;
  output: string;
  unresolvedTensions: string[];
};

export type Room = {
  id: string;
  title: string;
  frame: DecisionQuestion;
  participants: Participant[];
  positions: OpeningPosition[];
  frictionMap: FrictionMap;
  challenges: Challenge[];
  synthesis: Synthesis;
  decision: Decision;
  output: RoomOutput;
  lineage: DiscussionLineage;
  status: RoomStatus;
  confidence: number;
  lastUpdated: string;
  unresolvedTensionsCount: number;
};
