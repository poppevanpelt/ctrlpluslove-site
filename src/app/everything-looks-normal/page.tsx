import { routeMetadata } from "../seo";
import { MeetingExperience } from "./meeting-experience";

export const metadata = routeMetadata("/everything-looks-normal/");

export default function EverythingLooksNormalPage() {
  return <MeetingExperience />;
}
