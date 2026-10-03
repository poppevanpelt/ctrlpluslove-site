export type HolyToolKind =
  | "signal"
  | "director"
  | "compare"
  | "hold"
  | "triage"
  | "door"
  | "production"
  | "stress"
  | "month"
  | "upstream";

export type HolyTool = {
  index: string;
  slug: string;
  title: string;
  kicker: string;
  line: string;
  description: string;
  useWhen: string;
  kind: HolyToolKind;
};

export const HOLY_TOOLS: HolyTool[] = [
  {
    index: "001",
    slug: "holy-shit",
    title: "HOLY SHIT!",
    kicker: "CULTURAL OPPORTUNITY INSTRUMENT",
    line: "Something stupid just happened. Good.",
    description:
      "Catch the useful stupidity, contradiction or tiny cultural accident before everybody normalises it.",
    useWhen:
      "Reality does something too strange, revealing or funny to ignore.",
    kind: "signal",
  },
  {
    index: "002",
    slug: "director-search",
    title: "DIRECTOR SEARCH",
    kicker: "ROSTER ESCAPE HATCH",
    line: "Stop scrolling names. Search for what the idea actually needs.",
    description:
      "Turn the creative problem into a director brief before familiar names start choosing the answer for you.",
    useWhen:
      "A shortlist is forming from habit, availability or who everybody already knows.",
    kind: "director",
  },
  {
    index: "003",
    slug: "trait-vs-method",
    title: "TRAIT VS METHOD",
    kicker: "CASTING CLARIFIER",
    line: "Separate who somebody is from how they make.",
    description:
      "Put identity, taste and visible traits on one side; working method, behaviour and proof on the other.",
    useWhen:
      "The room is confusing a useful signal with evidence of how somebody actually works.",
    kind: "compare",
  },
  {
    index: "004",
    slug: "waiting-room",
    title: "WAITING ROOM",
    kicker: "PREMATURE-OPINION BRAKE",
    line: "Some ideas need oxygen, not another opinion.",
    description:
      "Put a live idea somewhere nobody can improve it for a while. Then see what remains true when the noise returns.",
    useWhen:
      "Everyone is reacting before the work has had time to become itself.",
    kind: "hold",
  },
  {
    index: "005",
    slug: "own-partner-ignore",
    title: "OWN / PARTNER / IGNORE",
    kicker: "ATTENTION TRIAGE",
    line: "Decide what deserves your hands.",
    description:
      "Force the room to choose: own it fully, find the right partner, or stop spending life on it.",
    useWhen:
      "Everything has somehow become your problem.",
    kind: "triage",
  },
  {
    index: "006",
    slug: "door-test",
    title: "DOOR TEST",
    kicker: "PRESENTATION REMOVAL DEVICE",
    line: "Would you still want this if nobody presented it?",
    description:
      "Strip away the deck, the confidence and the choreography. Leave the idea standing by the door on its own.",
    useWhen:
      "The presentation is doing suspiciously much of the selling.",
    kind: "door",
  },
  {
    index: "007",
    slug: "production-reality-check",
    title: "PRODUCTION REALITY CHECK",
    kicker: "CRAFT BEFORE RESCUE",
    line: "Ask what the film needs before production becomes a rescue operation.",
    description:
      "Surface the craft, budget, stakeholder and execution pressures while they can still improve the idea.",
    useWhen:
      "Client requirements, director instinct and production reality are already pulling in different directions.",
    kind: "production",
  },
  {
    index: "008",
    slug: "stress-test",
    title: "DECISION STRESS-TEST",
    kicker: "USEFUL DISAGREEMENT",
    line: "One decision. Under pressure.",
    description:
      "Put one live decision in a room with enough opposition to reveal what is working, pretending, risky or missing.",
    useWhen:
      "The team is too close to the work to trust its own certainty.",
    kind: "stress",
  },
  {
    index: "009",
    slug: "30-day-field-test",
    title: "30-DAY FIELD TEST",
    kicker: "STOP DATING",
    line: "Stop discussing the relationship. Try working together.",
    description:
      "Replace another proposal, chemistry meeting or vague intention with thirty days of observable work.",
    useWhen:
      "The next step is becoming a proposal about a proposal.",
    kind: "month",
  },
  {
    index: "010",
    slug: "upstream-test",
    title: "UPSTREAM TEST",
    kicker: "BEFORE THE FILM EXISTS",
    line: "Bring production intelligence in while it can still change the idea.",
    description:
      "Check whether the director and production brain are arriving early enough to shape the brief instead of repairing it later.",
    useWhen:
      "A treatment is being asked to solve decisions that should have been made before the treatment.",
    kind: "upstream",
  },
];

export const HOLY_TOOL_MAP = new Map(HOLY_TOOLS.map((tool) => [tool.slug, tool]));
