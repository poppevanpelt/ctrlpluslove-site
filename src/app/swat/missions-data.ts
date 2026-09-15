export type SwatMission = {
  slug: string;
  number: string;
  client: string;
  status: string;
  date: string;
  trigger: string;
  sourceLabel: string;
  sourceUrl: string;
  judgment: string;
  artifact: string;
  target: string;
  latency: string;
  latencyNote: string;
  steps: readonly {
    label: string;
    value: string;
  }[];
};

export const swatMissions: readonly SwatMission[] = [
  {
    slug: "royal-swinkels",
    number: "001",
    client: "Royal Swinkels",
    status: "DISPATCHED",
    date: "15 SEP 2026",
    trigger:
      "Adformatie publishes a live industry story on beer excise and explicitly names Royal Swinkels.",
    sourceLabel: "Brouwers vrezen kater na stijging bieraccijns",
    sourceUrl:
      "https://www.adformatie.nl/communicatie/pr/brouwers-vrezen-kater-na-stijging-bieraccijns",
    judgment: "A tax increase is an input. Not an outcome.",
    artifact:
      "A decision prototype that turns a tax increase from a headline into a set of choices.",
    target: "3 direct inboxes at Royal Swinkels",
    latency: "≈12 min",
    latencyNote: "Measured from detection to inbox. Publication time was not used.",
    steps: [
      {
        label: "SIGNAL",
        value: "Royal Swinkels appears in a live excise story.",
      },
      {
        label: "JUDGMENT",
        value: "The tax rise is a variable. The commercial response is still a decision.",
      },
      {
        label: "ARTIFACT",
        value: "Turn the argument into something useful enough to forward immediately.",
      },
      {
        label: "TARGET",
        value: "Three relevant Royal Swinkels inboxes.",
      },
      {
        label: "SEND",
        value: "Direct. Small. Same window.",
      },
    ],
  },
] as const;

export function getSwatMission(slug: string) {
  return swatMissions.find((mission) => mission.slug === slug);
}
