import { MeetingFilterSection } from "../meeting-filter-section";
import { routeMetadata } from "../seo";

export const metadata = routeMetadata("/meeting-filter/");

export default function MeetingFilterPage() {
  return (
    <main className="site-shell">
      <MeetingFilterSection isStandalone />
    </main>
  );
}
