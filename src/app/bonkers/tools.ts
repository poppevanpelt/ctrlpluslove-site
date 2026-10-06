export type BonkersToolKind =
  | "signal" | "director" | "compare" | "hold" | "triage"
  | "door" | "production" | "stress" | "month" | "upstream";

export type BonkersTool = {
  index: string;
  slug: string;
  title: string;
  kicker: string;
  line: string;
  description: string;
  useWhen: string;
  kind: BonkersToolKind;
};

export const BONKERS_TOOLS: BonkersTool[] = [
  { index:"001", slug:"bonkers", title:"BONKERS!", kicker:"INDUSTRY SIGNAL INSTRUMENT", line:"Something in the industry just shifted. Good.", description:"Catch the useful contradiction, production shift, cultural accident or new behaviour before it gets turned into a trend report.", useWhen:"You see something in directors, agencies, clients, craft or culture that everybody else is about to normalise.", kind:"signal" },
  { index:"002", slug:"director-search", title:"DIRECTOR SEARCH", kicker:"ROSTER ESCAPE HATCH", line:"Search by what the film needs, not who is already on the list.", description:"Turn the creative problem into a director brief before familiarity, availability or representation chooses the answer.", useWhen:"A shortlist is forming too quickly from the people everybody already knows.", kind:"director" },
  { index:"003", slug:"trait-vs-method", title:"TRAIT VS METHOD", kicker:"DIRECTOR JUDGMENT CLARIFIER", line:"Separate who somebody appears to be from how they actually make.", description:"Put visible taste, identity and reputation on one side; working method, behaviour and repeated craft decisions on the other.", useWhen:"The room is mistaking a strong signal for evidence of how somebody will actually direct the film.", kind:"compare" },
  { index:"004", slug:"waiting-room", title:"WAITING ROOM", kicker:"PREMATURE-OPINION BRAKE", line:"Some ideas need oxygen, not another round of notes.", description:"Put a live idea somewhere nobody can improve it for a while. Then see what remains true when the production room comes back.", useWhen:"Everybody has started polishing before the thing has had time to become itself.", kind:"hold" },
  { index:"005", slug:"own-partner-ignore", title:"OWN / PARTNER / IGNORE", kicker:"PRODUCER ATTENTION TRIAGE", line:"Decide what deserves Bonkers hands.", description:"Force a useful choice: own the problem, bring in the missing intelligence, or stop spending production energy on it.", useWhen:"A producer has quietly become responsible for every unresolved thing in the room.", kind:"triage" },
  { index:"006", slug:"door-test", title:"DOOR TEST", kicker:"PRESENTATION REMOVAL DEVICE", line:"Would you still want to make this if nobody presented it?", description:"Strip away the deck, the confidence and the treatment choreography. Leave the film idea standing on its own.", useWhen:"The presentation is doing suspiciously much of the work.", kind:"door" },
  { index:"007", slug:"production-reality-check", title:"PRODUCTION REALITY CHECK", kicker:"CRAFT BEFORE RESCUE", line:"Ask what the film needs before production becomes the emergency service.", description:"Surface craft, budget, stakeholder and execution pressures while they can still improve the idea instead of merely constraining it.", useWhen:"Client requirements, director instinct, agency ambition and production reality are already pulling in different directions.", kind:"production" },
  { index:"008", slug:"stress-test", title:"DECISION STRESS-TEST", kicker:"USEFUL DISAGREEMENT", line:"One production decision. Under pressure.", description:"Put one live decision in a room with enough opposition to reveal what is strong, expensive, fashionable, risky or simply late.", useWhen:"Everyone is too close to the work to trust the current certainty.", kind:"stress" },
  { index:"009", slug:"30-day-field-test", title:"30-DAY FIELD TEST", kicker:"STOP DATING", line:"Stop discussing the relationship. Make something together.", description:"Replace another proposal, chemistry meeting or innovation conversation with thirty days of observable work.", useWhen:"The next step is becoming a proposal about a proposal.", kind:"month" },
  { index:"010", slug:"upstream-test", title:"UPSTREAM TEST", kicker:"BEFORE THE FILM EXISTS", line:"Bring production intelligence in while it can still change the idea.", description:"Check whether director and producer intelligence are arriving early enough to shape the brief instead of repairing it later.", useWhen:"A treatment is being asked to solve decisions that should have been made before the treatment.", kind:"upstream" },
];

export const BONKERS_TOOL_MAP = new Map(BONKERS_TOOLS.map((tool) => [tool.slug, tool]));
