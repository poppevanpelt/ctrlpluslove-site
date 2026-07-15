import type {
  Challenge,
  ChallengeResponse,
  Decision,
  DecisionQuestion,
  Disagreement,
  DisagreementClassification,
  FramingIssue,
  FrictionMap,
  OpeningPosition,
  OutputFormat,
  Participant,
  ParticipantLens,
  Room,
  RoomOutput,
  RoomStatus,
  Synthesis,
} from "./types";

const nowLabel = "2026-07-15";

export const emptyFrame: DecisionQuestion = {
  project: "Ambassador Network",
  question:
    "How should ctrl+love introduce itself in new markets without flattening local culture into a global brand style?",
  whyNow:
    "The ambassador network is becoming real enough that local introduction choices will soon shape trust.",
  desiredOutput:
    "A practical international introduction model that protects the ctrl+love core while allowing local ambassadors to reshape language, references, rituals, and emphasis.",
  workingAssumption:
    "The brand should keep a small non-negotiable core and allow ambassadors to adapt the cultural expression around it.",
  roomType: "Cultural Room",
  context:
    "This is a prototype Room Runner record. Real ambassador responses are still awaited.",
  evidence:
    "Existing ctrl+love language, ambassador profiles, market-entry intuition, and explicit placeholders for human response gaps.",
  owner: "Poppe van Pelt",
};

export const participantPool: Participant[] = [
  {
    id: "mats-utberg",
    name: "Mats Utberg",
    kind: "Human ambassador",
    locationOrRole: "Stockholm",
    primaryLens: "Systems & Scale",
    assignedLens: "Systems & Scale",
    description: "Looks for the structure that lets a living idea travel.",
    reasonToInclude:
      "He can pressure-test what must remain invariant as ctrl+love expands.",
    likelyTension:
      "May protect coherence more strongly than local improvisation.",
    prompt:
      "What must remain invariant for ctrl+love to stay recognisable and coherent as it expands internationally, and what can safely vary by market?",
  },
  {
    id: "umberto-bartolini",
    name: "Umberto Bartolini",
    kind: "Human ambassador",
    locationOrRole: "Milan",
    primaryLens: "Culture & Meaning",
    assignedLens: "Culture & Meaning",
    description: "Reads whether language feels lived-in or imported.",
    reasonToInclude:
      "He can see where the ctrl+love ritual might feel culturally flat in Italy.",
    likelyTension:
      "May resist a single global language if it dulls meaning.",
    prompt:
      "Which parts of ctrl+love's language, rituals, or positioning would feel imported, unnatural, or culturally flat in Italy, and what should replace them?",
  },
  {
    id: "jorge-virgos",
    name: "Jorge Virgos",
    kind: "Human ambassador",
    locationOrRole: "Valencia",
    primaryLens: "Creative Adoption",
    assignedLens: "Creative Adoption",
    description: "Tests whether creative people would actually want to enter.",
    reasonToInclude:
      "He can separate curiosity from polite admiration in a new market.",
    likelyTension:
      "May push for a more vivid local expression than the brand system expects.",
    prompt:
      "How would creative professionals in Spain actually receive ctrl+love: what would make them curious, sceptical, enthusiastic, or resistant?",
  },
  {
    id: "lysbeth-bijlstra",
    name: "Lysbeth Bijlstra",
    kind: "Human ambassador",
    locationOrRole: "Cape Town",
    primaryLens: "Cultural and market perspective",
    assignedLens: "Cultural and market perspective",
    description: "Brings cultural and market perspective from outside Europe.",
    reasonToInclude:
      "She broadens the room beyond a European launch reflex.",
    likelyTension:
      "May challenge assumptions that feel obvious from Amsterdam or Milan.",
  },
  {
    id: "simon-cross",
    name: "Simon Cross",
    kind: "Synthetic persona",
    locationOrRole: "Contrarian system role",
    primaryLens: "Contrarian Pressure",
    assignedLens: "Contrarian Pressure",
    description: "Challenges the answer the room agreed on too early.",
    reasonToInclude: "Useful when the working assumption feels too neat.",
    likelyTension: "Will ask what the room is avoiding by liking its own answer.",
    isSceptic: true,
  },
  {
    id: "maya-elise-harper",
    name: "Maya Elise Harper",
    kind: "Synthetic persona",
    locationOrRole: "Human need system role",
    primaryLens: "Emotional Truth",
    assignedLens: "Emotional Truth",
    description: "Finds what people are buying beneath the brief.",
    reasonToInclude: "Keeps the introduction anchored in human desire.",
    likelyTension: "May reject tidy positioning if it lacks emotional truth.",
  },
  {
    id: "nick-deckman",
    name: "Nick Deckman",
    kind: "Synthetic persona",
    locationOrRole: "Commercial system role",
    primaryLens: "Commercial Realism",
    assignedLens: "Commercial Realism",
    description: "Sees the cost of being wrong.",
    reasonToInclude: "Translates cultural preference into execution risk.",
    likelyTension: "May narrow ambition to what can be delivered and paid for.",
  },
  {
    id: "clare-mercer",
    name: "Clare Mercer",
    kind: "Synthetic persona",
    locationOrRole: "Synthesis system role",
    primaryLens: "Synthesis & Governance",
    assignedLens: "Synthesis & Governance",
    description: "Separates evidence from assumptions.",
    reasonToInclude: "Helps Poppe turn disagreement into a usable record.",
    likelyTension: "May slow the room down until claims become explicit.",
    isFacilitator: true,
  },
];

export const lensOptions: ParticipantLens[] = [
  "Systems & Scale",
  "Culture & Meaning",
  "Creative Adoption",
  "Cultural and market perspective",
  "Emotional Truth",
  "Contrarian Pressure",
  "Commercial Realism",
  "Reality Stress",
  "Synthesis & Governance",
  "Execution Reality",
  "Custom Lens",
];

export const outputFormats: OutputFormat[] = [
  "Strategy recommendation",
  "Creative brief",
  "Client memo",
  "Internal decision note",
  "LinkedIn post",
  "Experiment proposal",
  "Ambassador dispatch",
  "Knowledge principle",
];

export function evaluateFraming(frame: DecisionQuestion): FramingIssue[] {
  const question = frame.question.trim().toLowerCase();
  const issues: FramingIssue[] = [];
  const wordCount = question.split(/\s+/).filter(Boolean).length;

  if (wordCount > 28 || /everything|all audiences|the future|our strategy/.test(question)) {
    issues.push({
      type: "too_broad",
      label: "Too broad",
      guidance: "Narrow the decision so the room can create pressure.",
    });
  }

  if (!/^(should|how should|what should|which|whether|do we|can we)\b/.test(question)) {
    issues.push({
      type: "topic_not_decision",
      label: "Topic, not decision",
      guidance: "Phrase it as a choice Poppe can actually make.",
    });
  }

  if (/obviously|best|only|must|prove|confirm|validate/.test(question)) {
    issues.push({
      type: "leading",
      label: "Possibly leading",
      guidance: "Remove language that quietly protects one answer.",
    });
  }

  if (!frame.desiredOutput.trim()) {
    issues.push({
      type: "missing_output",
      label: "Missing desired output",
      guidance: "Name what the room should produce.",
    });
  }

  return issues;
}

export function framingScore(frame: DecisionQuestion): number {
  return Math.max(35, 100 - evaluateFraming(frame).length * 18);
}

export function hasLensDiversityWarning(participants: Participant[]): boolean {
  const lenses = new Set(participants.map((participant) => participant.assignedLens));
  return participants.length >= 3 && lenses.size <= 2;
}

export function buildOpeningPositions(
  frame: DecisionQuestion,
  participants: Participant[],
): OpeningPosition[] {
  return participants.map((participant, index) => {
    const lens = participant.assignedLens;
    const isHuman = participant.kind === "Human ambassador";
    const question = frame.question.replace(/\?$/, "");
    const assumption = frame.workingAssumption || "the current working assumption";
    const confidence = Math.max(48, 78 - index * 4 + (participant.isFacilitator ? 5 : 0));

    return {
      id: `position-${participant.id}`,
      participantId: participant.id,
      participantName: participant.name,
      lens,
      initialView: isHuman
        ? `Placeholder awaiting ${participant.name}'s real response. Simulated ${lens.toLowerCase()} view: ${question} should be handled as a local introduction model, not a global launch script.`
        : `Simulated ${lens.toLowerCase()} view: ${question} should stay open long enough for the room to test what the working assumption protects.`,
      keyConcern:
        lensConcern(lens, assumption) +
        (participant.isSceptic ? " The attractive answer may be arriving too early." : ""),
      missingPoint:
        lensMissingPoint(lens) +
        (isHuman ? " This must be replaced with the ambassador's lived market response." : ""),
      recommendation: lensRecommendation(lens, frame.roomType),
      confidence,
      challengeResponses: [],
    };
  });
}

export function buildFrictionMap(positions: OpeningPosition[]): FrictionMap {
  const contradictions: Disagreement[] = [];
  const systemPosition = positions.find((position) => /systems|scale/i.test(position.lens));
  const culturePosition = positions.find((position) => /culture|meaning|market/i.test(position.lens));
  const creativePosition = positions.find((position) => /creative|emotional/i.test(position.lens));
  const scepticPosition = positions.find((position) => /contrarian|commercial/i.test(position.lens));

  if (systemPosition && culturePosition) {
    contradictions.push({
      id: "core-vs-expression",
      title: "Global core versus local expression",
      sideA: `${systemPosition.participantName}: protect a recognisable invariant core.`,
      sideB: `${culturePosition.participantName}: let local meaning reshape language and ritual.`,
      participants: [systemPosition.participantName, culturePosition.participantName],
      classification: "Productive",
      severity: 88,
    });
  }

  if (creativePosition && scepticPosition) {
    contradictions.push({
      id: "curiosity-vs-proof",
      title: "Creative curiosity versus proof of usefulness",
      sideA: `${creativePosition.participantName}: make the invitation vivid enough to be felt.`,
      sideB: `${scepticPosition.participantName}: prove the room is useful before polishing the invitation.`,
      participants: [creativePosition.participantName, scepticPosition.participantName],
      classification: "Needs evidence",
      severity: 76,
    });
  }

  if (contradictions.length === 0 && positions.length >= 2) {
    contradictions.push({
      id: "pace-vs-depth",
      title: "Speed versus depth",
      sideA: `${positions[0].participantName}: move with a simple frame.`,
      sideB: `${positions[1].participantName}: slow down until the local reality is visible.`,
      participants: [positions[0].participantName, positions[1].participantName],
      classification: "Productive",
      severity: 64,
    });
  }

  return {
    agreements: [
      "The ctrl+love core should remain visible across markets.",
      "Local ambassadors should not be used as decorative endorsement.",
      "A practical introduction model matters more than a perfect brand manifesto.",
    ],
    contradictions,
    definitions: [
      "Core means decision lineage and pressure, not identical language everywhere.",
      "Local expression means cultural translation with responsibility, not free improvisation.",
    ],
    unchallengedAssumptions: [
      "That ambassadors want the burden of local adaptation.",
      "That a small core can be described clearly enough to protect.",
    ],
    minorityPositions: [
      "The strongest introduction may begin with a local problem, not the ctrl+love story.",
    ],
    possibleFalseConsensus: [
      "Everyone agrees on adaptation, but not on who has authority to adapt.",
    ],
  };
}

export function buildChallenges(disagreements: Disagreement[]): Challenge[] {
  const prompts = [
    "What would have to be true for the opposing view to be correct?",
    "Which assumption in this position is culturally specific?",
    "What breaks if we follow this recommendation at scale?",
    "What would a client or audience reject here?",
    "Which argument sounds logical but lacks evidence?",
  ];

  return disagreements.map((disagreement, index) => ({
    id: `challenge-${disagreement.id}`,
    disagreementId: disagreement.id,
    prompt: prompts[index % prompts.length],
    selected: true,
  }));
}

export function runChallengeResponses(
  positions: OpeningPosition[],
  challenges: Challenge[],
): OpeningPosition[] {
  return positions.map((position) => ({
    ...position,
    challengeResponses: challenges
      .filter((challenge) => challenge.selected)
      .map<ChallengeResponse>((challenge) => ({
        id: `response-${position.participantId}-${challenge.id}`,
        challengeId: challenge.id,
        participantId: position.participantId,
        participantName: position.participantName,
        response: `${position.participantName} would test "${challenge.prompt}" by naming one assumption in the ${position.lens.toLowerCase()} view that needs evidence before it becomes a recommendation.`,
      })),
  }));
}

export function buildSynthesis(
  frame: DecisionQuestion,
  participants: Participant[],
  frictionMap: FrictionMap,
  challenges: Challenge[],
): Synthesis {
  const score = calculateConfidence(frame, participants, frictionMap, challenges);
  const unresolved = frictionMap.contradictions.filter(
    (item) => item.classification === "Must resolve" || item.classification === "Preserve as tension",
  );

  return {
    sharedGround:
      "The room agrees that ctrl+love needs a recognisable core: visible discussion lineage, pressure before recommendation, and a human tone that does not become corporate theatre.",
    decisiveDisagreements:
      frictionMap.contradictions
        .map((item) => `${item.title}: ${item.sideA} / ${item.sideB}`)
        .join("\n") || "No decisive disagreement has been marked yet.",
    recommendedDirection:
      "Use a small global core with local ambassador-led expression. Do not claim unanimity: the authority to adapt language, rituals, references, and emphasis still needs boundaries.",
    whatChanged:
      "The room moved from a brand-consistency question toward an authority question: who may adapt the expression, and what evidence shows the adaptation still belongs to ctrl+love?",
    unresolvedTensions:
      unresolved.map((item) => item.title).join("\n") ||
      "The main unresolved tension is how much local freedom can exist before recognition weakens.",
    confidenceScore: score,
    confidenceFactors: confidenceFactors(frame, participants, frictionMap, challenges),
  };
}

export function buildDecision(frame: DecisionQuestion, synthesis: Synthesis): Decision {
  return {
    decision:
      "Proceed with a global-core, local-expression introduction model for the ambassador network.",
    rationale: synthesis.recommendedDirection,
    alternativesRejected:
      "A single global script, because it would flatten cultural meaning. Fully local invention, because it would make ctrl+love harder to recognise.",
    conditions:
      "Define the non-negotiable core in one page. Ask each ambassador to create a local expression note before external introduction.",
    evidenceRequired:
      "Real ambassador responses, first-market reactions, and examples of local language that still preserves the ctrl+love lineage principle.",
    owner: frame.owner || "Poppe van Pelt",
    nextAction:
      "Send the core-and-local-expression prompt to Mats, Umberto, Jorge, and Lysbeth, then rerun the Room with real responses.",
  };
}

export function buildOutput(
  frame: DecisionQuestion,
  synthesis: Synthesis,
  decision: Decision,
  format: OutputFormat,
): RoomOutput {
  const title = `${frame.project}: ${format}`;
  const body = [
    `Decision question: ${frame.question}`,
    "",
    `Recommended direction: ${synthesis.recommendedDirection}`,
    "",
    `Decision: ${decision.decision}`,
    "",
    `Rationale: ${decision.rationale}`,
    "",
    `Conditions: ${decision.conditions}`,
    "",
    `Evidence still required: ${decision.evidenceRequired}`,
    "",
    "Unresolved tension: local freedom is necessary, but the authority to adapt must become explicit.",
  ].join("\n");

  return { format, title, body };
}

export function createRoom(
  frame: DecisionQuestion,
  participants: Participant[],
  format: OutputFormat = "Internal decision note",
  status: RoomStatus = "Complete",
): Room {
  const positions = buildOpeningPositions(frame, participants);
  const frictionMap = buildFrictionMap(positions);
  const challenges = buildChallenges(frictionMap.contradictions);
  const challengedPositions = runChallengeResponses(positions, challenges);
  const synthesis = buildSynthesis(frame, participants, frictionMap, challenges);
  const decision = buildDecision(frame, synthesis);
  const output = buildOutput(frame, synthesis, decision, format);
  const unresolvedTensionsCount = synthesis.unresolvedTensions
    .split("\n")
    .filter(Boolean).length;

  return {
    id: `room-${Date.now()}`,
    title: frame.project || "Untitled Room",
    frame,
    participants,
    positions: challengedPositions,
    frictionMap,
    challenges,
    synthesis,
    decision,
    output,
    lineage: buildLineage(frame, participants, challengedPositions, frictionMap, challenges, synthesis, decision, output),
    status,
    confidence: synthesis.confidenceScore,
    lastUpdated: nowLabel,
    unresolvedTensionsCount,
  };
}

export function createSeedRooms(): Room[] {
  const demoParticipants = participantPool.filter((participant) =>
    ["mats-utberg", "umberto-bartolini", "jorge-virgos"].includes(participant.id),
  );
  const demoRoom = createRoom(emptyFrame, demoParticipants, "Ambassador dispatch", "Ready to run");
  const adformatie = createRoom(
    {
      ...emptyFrame,
      project: "Adformatie",
      question: "How can a title like Adformatie remain relevant in these fast-changing times?",
      desiredOutput: "A strategy recommendation for relevance in a fragmenting industry.",
      workingAssumption:
        "Adformatie should become more useful as a decision companion, not only a publication.",
      roomType: "Decision Room",
      owner: "Poppe van Pelt",
    },
    participantPool.filter((participant) =>
      ["maya-elise-harper", "simon-cross", "nick-deckman", "clare-mercer"].includes(participant.id),
    ),
    "Strategy recommendation",
    "Complete",
  );
  const participation = createRoom(
    {
      ...emptyFrame,
      project: "Ambassador Network",
      question:
        "How should ambassadors participate in real ctrl+love Rooms without becoming decorative endorsements or administrative research inputs?",
      desiredOutput: "An internal decision note for meaningful ambassador participation.",
      workingAssumption:
        "Ambassadors should enter when their lived lens changes the quality of the room.",
      roomType: "Review Room",
      owner: "Poppe van Pelt",
    },
    participantPool.filter((participant) =>
      ["lysbeth-bijlstra", "simon-cross", "clare-mercer"].includes(participant.id),
    ),
    "Internal decision note",
    "Complete",
  );

  return [demoRoom, adformatie, participation];
}

export function exportRoomMarkdown(room: Room): string {
  return [
    `# ${room.title}`,
    "",
    `Project: ${room.frame.project}`,
    `Decision Question: ${room.frame.question}`,
    `Room type: ${room.frame.roomType}`,
    `Status: ${room.status}`,
    `Confidence: ${room.confidence}%`,
    "",
    "## Participants",
    ...room.participants.map(
      (participant) =>
        `- ${participant.name} (${participant.kind}) — ${participant.assignedLens}: ${participant.reasonToInclude}`,
    ),
    "",
    "## Independent positions",
    ...room.positions.map(
      (position) =>
        `### ${position.participantName}\n${position.initialView}\n\nConcern: ${position.keyConcern}\nRecommendation: ${position.recommendation}`,
    ),
    "",
    "## Friction",
    ...room.frictionMap.contradictions.map(
      (item) => `- ${item.title} [${item.classification}]: ${item.sideA} / ${item.sideB}`,
    ),
    "",
    "## Synthesis",
    room.synthesis.recommendedDirection,
    "",
    "## Decision",
    room.decision.decision,
    "",
    "## Output",
    room.output.body,
  ].join("\n");
}

function lensConcern(lens: string, assumption: string): string {
  if (/systems|scale/i.test(lens)) return `The model may not define what stays invariant. Assumption under pressure: ${assumption}`;
  if (/culture|meaning|market/i.test(lens)) return "The introduction may sound translated rather than culturally native.";
  if (/creative|emotional/i.test(lens)) return "The invitation may be correct but not magnetic.";
  if (/contrarian/i.test(lens)) return "The room may be using disagreement as decoration instead of risk.";
  if (/commercial|execution/i.test(lens)) return "The model may ask for more local craft than the operation can support.";
  return "The recommendation needs clearer evidence before confidence rises.";
}

function lensMissingPoint(lens: string): string {
  if (/systems|scale/i.test(lens)) return "The room needs a test for recognisability across markets.";
  if (/culture|meaning|market/i.test(lens)) return "The room needs examples of language that would feel natural locally.";
  if (/creative|emotional/i.test(lens)) return "The room needs to know what would make people curious enough to enter.";
  if (/contrarian/i.test(lens)) return "The room needs to ask what could make the whole model fail.";
  if (/commercial|execution/i.test(lens)) return "The room needs an operating rhythm for local adaptation.";
  return "The room needs sharper evidence and a named decision owner.";
}

function lensRecommendation(lens: string, roomType: string): string {
  if (/systems|scale/i.test(lens)) return "Write the invariant core before inviting local adaptation.";
  if (/culture|meaning|market/i.test(lens)) return "Let each ambassador translate the invitation into a local cultural note.";
  if (/creative|emotional/i.test(lens)) return "Prototype three local introductions and watch where curiosity appears.";
  if (/contrarian/i.test(lens)) return "Force one argument against the preferred model before synthesis.";
  if (/commercial|execution/i.test(lens)) return "Define the smallest repeatable process that local expression can use.";
  return roomType === "Fast Room" ? "Make the smallest reversible decision." : "Keep the recommendation provisional until the challenge round lands.";
}

function calculateConfidence(
  frame: DecisionQuestion,
  participants: Participant[],
  frictionMap: FrictionMap,
  challenges: Challenge[],
): number {
  const diversity = new Set(participants.map((participant) => participant.assignedLens)).size;
  const unresolvedPenalty = frictionMap.contradictions.filter(
    (item) => item.classification === "Must resolve",
  ).length * 8;
  const challengeBonus = challenges.some((challenge) => challenge.selected) ? 8 : 0;
  const evidenceBonus = frame.evidence.trim().length > 40 ? 6 : 0;
  return Math.max(
    35,
    Math.min(96, 44 + diversity * 7 + Math.round(framingScore(frame) / 10) + challengeBonus + evidenceBonus - unresolvedPenalty),
  );
}

function confidenceFactors(
  frame: DecisionQuestion,
  participants: Participant[],
  frictionMap: FrictionMap,
  challenges: Challenge[],
): string[] {
  return [
    `${new Set(participants.map((participant) => participant.assignedLens)).size} distinct participant lenses are present.`,
    `Framing quality is ${framingScore(frame)} because ${evaluateFraming(frame).length || "no"} deterministic framing flags are active.`,
    `${frictionMap.contradictions.length} direct disagreements are visible before synthesis.`,
    frame.evidence.trim() ? "Evidence coverage exists but still relies on prototype material." : "Evidence coverage is thin.",
    challenges.some((challenge) => challenge.selected)
      ? "The challenge round has been run against selected disagreements."
      : "The challenge round has not been run yet.",
  ];
}

function buildLineage(
  frame: DecisionQuestion,
  participants: Participant[],
  positions: OpeningPosition[],
  frictionMap: FrictionMap,
  challenges: Challenge[],
  synthesis: Synthesis,
  decision: Decision,
  output: RoomOutput,
) {
  return {
    project: frame.project,
    decisionQuestion: frame.question,
    participants: participants.map((participant) => `${participant.name} — ${participant.assignedLens}`),
    positions: positions.map((position) => `${position.participantName}: ${position.initialView}`),
    friction: frictionMap.contradictions.map((item) => `${item.title}: ${item.classification}`),
    challenges: challenges.map((challenge) => challenge.prompt),
    synthesis: [
      synthesis.sharedGround,
      synthesis.decisiveDisagreements,
      synthesis.recommendedDirection,
      synthesis.whatChanged,
      synthesis.unresolvedTensions,
    ],
    decision: decision.decision,
    output: output.body,
    unresolvedTensions: synthesis.unresolvedTensions.split("\n").filter(Boolean),
  };
}

export function updateDisagreementClassification(
  room: Room,
  disagreementId: string,
  classification: DisagreementClassification,
): Room {
  const frictionMap: FrictionMap = {
    ...room.frictionMap,
    contradictions: room.frictionMap.contradictions.map((item) =>
      item.id === disagreementId ? { ...item, classification } : item,
    ),
  };
  const synthesis = buildSynthesis(room.frame, room.participants, frictionMap, room.challenges);
  const decision = buildDecision(room.frame, synthesis);
  const output = buildOutput(room.frame, synthesis, decision, room.output.format);
  return {
    ...room,
    frictionMap,
    synthesis,
    decision,
    output,
    confidence: synthesis.confidenceScore,
    unresolvedTensionsCount: synthesis.unresolvedTensions.split("\n").filter(Boolean).length,
    lineage: buildLineage(room.frame, room.participants, room.positions, frictionMap, room.challenges, synthesis, decision, output),
    lastUpdated: nowLabel,
  };
}
