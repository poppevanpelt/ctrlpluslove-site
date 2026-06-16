import { MeetingFilterSection } from "../meeting-filter-section";

export const metadata = {
  title: "The Meeting Filter — ctrl+love",
};

export default function MeetingFilterPage() {
  return (
    <main className="site-shell">
      <MeetingFilterSection isStandalone />
    </main>
  );
}
