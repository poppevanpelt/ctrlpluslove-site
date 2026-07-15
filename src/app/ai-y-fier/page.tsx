import AiYFierClient from "./ai-y-fier-client";
import { routeMetadata } from "../seo";

export const metadata = routeMetadata("/ai-y-fier/");

export default function AiYFierPage() {
  return <AiYFierClient />;
}
