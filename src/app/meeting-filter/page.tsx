import { MeetingFilterSection } from "../meeting-filter-section";
import { OriginSpecimen } from "../origin-specimen";
import { routeMetadata } from "../seo";

export const metadata = routeMetadata("/meeting-filter/");

export default function MeetingFilterPage() {
  return (
    <main className="site-shell">
      <MeetingFilterSection isStandalone />
      <OriginSpecimen
        specimen="002"
        title="The 52-Minute Meeting, 1991"
        story="According to institute folklore, Prof. Dr. H. von Schmaalhauzen once sat through a 52-minute meeting whose only decision was to schedule another meeting. He left with a three-question card in his pocket and thereafter refused any room that could not explain why it deserved to exist."
        sources={[
          {
            citation:
              "Geimer et al. (2015), Meetings at work: Perceived effectiveness and recommended improvements, Journal of Business Research 68(9), 2015-2026.",
            href: "https://doi.org/10.1016/j.jbusres.2015.02.015",
            note:
              "Across employees from 41 countries, fewer than half described typical meetings as an effective use of time. Irrelevant invitations and basic meeting-design failures appeared repeatedly. This supports filtering and design discipline, not this exact three-question diagnostic.",
          },
        ]}
      />
    </main>
  );
}
