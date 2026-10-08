/**
 * Public-safe, curated working knowledge for Savannah.
 * Not a client vault, shared CRM, or complete historical archive.
 * Only matches relevant entries to the visitor's latest questions.
 */
type Entry = { terms: string[]; note: string };
const ENTRIES: Entry[] = [
  { terms: ["opposition seat", "opposing view", "devil's advocate"], note: "Opposition Seat: put an explicit dissenting interpretation beside the preferred decision. The purpose is stronger judgment, not performative argument. Ask what observation would change the decision." },
  { terms: ["do-nothing control", "do nothing", "status quo"], note: "Do-Nothing Control: compare the proposal against the real costs, risks and benefits of leaving things alone. Never assume action wins." },
  { terms: ["decision accelerator", "decision surface", "decision collider"], note: "Decision Accelerator / Decision Surface / Decision Collider: formats that make choices, missing evidence, alternatives and consequences visible so a team can decide rather than endlessly discuss." },
  { terms: ["signal distortion", "radar", "ctrl+live"], note: "Signal Distortion / RADAR / ctrl+live: observe what is really changing, separate meaningful signals from noise, identify who or what is missing from the picture, then decide what merits action." },
  { terms: ["meeting filter", "meeting", "room primer"], note: "Meeting Filter and Room Primer: before bringing people together, ask what decision the meeting exists to make, what proof is needed, what can be done asynchronously, and who can actually decide. Do not schedule a meeting to decide whether a meeting is needed." },
  { terms: ["brand transplant", "identity drift", "brand survival"], note: "Brand Transplant / Brand Survival: test whether a creative idea preserves the recognisable worldview of a brand, rather than merely replicating its visual codes. Identity Drift is the risk that individually reasonable choices collectively erode identity." },
  { terms: ["ctrl+no", "purge", "ctrl+stop"], note: "ctrl+no / PURGE / ctrl+stop: instruments for subtraction; clarify what should be refused, retired, or stopped. Stopping can be a constructive decision with evidence." },
  { terms: ["ctrl+fizz", "ctrl+forge", "ctrl+2go", "prototype-2-return-2"], note: "ctrl+fizz / ctrl+forge / ctrl+2go / Prototype-2-Return-2: move from promising thinking to a tangible prototype or test quickly; return with evidence rather than a more elaborate deck." },
  { terms: ["decision in a box", "field unit", "receipt printer"], note: "Decision in a Box and Field Unit: small physical or packaged decision instruments. The Field Unit uses a receipt-like commitment artifact to force clarity about what was decided." },
  { terms: ["doorbell test", "door test"], note: "Doorbell Test: what could someone credibly say at the front door after the work that they could not say before? If it needs a paragraph, keep working." },
  { terms: ["cultural vault", "first 100 deposits", "deposits"], note: "Cultural Vault / First 100 Deposits: an archive of creative instincts, odd connections and formative examples that inform ctrl+love's cultural judgment. It is not blanket permission to publish client material." },
  { terms: ["comfora"], note: "Comfora: an example of moving beyond comfort as a product adjective toward the human question of what getting your life back can mean. Explain as a working case, without invented commercial results." },
  { terms: ["luther", "museum"], note: "Luther Museum: in development. A living museum voice and working room are being explored. Treat concepts as prototypes, not publicly launched or approved exhibits." },
  { terms: ["holy fools", "wrong department", "holy tools"], note: "Holy Fools: People direct. Machines generate. The work explores transferable creative interventions through actual work and prototypes. WRONG DEPARTMENT tests what unexpected capability could improve a brief. Keep internal toolkits and commercial arrangements out of public answers." },
  { terms: ["impala", "ora weather", "year wrapped", "summer compared"], note: "Impala / Ora Weather: creative exploration of weather worth sharing, including Wrapped-style personal weather stories. Directions are hypotheses subject to product data and technical feasibility, not promised launches." },
  { terms: ["bridgefund", "bridgefundable", "ted"], note: "BridgeFund: a substantial body of working thought on brand decision systems, entrepreneur-side positioning and prototypes. Discuss high-level public-safe themes only here; route confidential details to the properly scoped BridgeFund room after access checks." },
  { terms: ["bonkers", "upstream test"], note: "Bonkers: explores producer intelligence earlier in the process, before a brief hardens. The Upstream Test asks whether intervention earlier would have changed the result. Do not reveal private working files on the public site." },
  { terms: ["fitzroy", "steel ball"], note: "Fitzroy / steel ball: steel-ball imagery became a tangible sign of an idea spreading into the work; the house description is adoption, not applause. Do not imply ownership or endorsement beyond documented work." },
  { terms: ["a+++dcn", "adcn", "jury simulator"], note: "A+++DCN: a speculative jury-perspective instrument for examining work from different evaluative positions; it does not impersonate an actual jury or predict awards." },
  { terms: ["ctrl+local", "marktplaats", "wise parrot"], note: "ctrl+local, Marktplaats Scanner, and Wise Parrot Matcher are local/experimental prototypes. They should be described as explorations, not advertised as available products unless confirmed live." },
  { terms: ["linkedin onboarder", "ctrl+swat", "exec chute"], note: "LinkedIn Onboarder, CTRL+SWAT and EXEC CHUTE are named instruments/prototypes. Know the names but do not invent implementation, results or availability without a verified case brief." },
  { terms: ["foundation"], note: "ctrl+love Foundation is an intended give-back strand of the practice. Do not state financial commitments or beneficiary arrangements as completed without confirmation." }
];

export function savannahRelevantKnowledge(messages: {role?: string; content?: string}[]): string {
  const lastQuestions = messages.filter(m => m.role === "user").slice(-2).map(m => m.content || "").join(" ").toLowerCase();
  if (!lastQuestions) return "";
  const matches = ENTRIES.map(e => ({
    entry: e,
    score: e.terms.reduce((score, term) => score + (lastQuestions.includes(term) ? Math.max(1, term.split(" ").length) : 0), 0)
  })).filter(x => x.score > 0).sort((a,b) => b.score - a.score).slice(0, 3);
  if (!matches.length) return "";
  return "Relevant approved working knowledge (not a complete archive; do not invent missing details):\n" +
    matches.map(x => "- " + x.entry.note).join("\n");
}
