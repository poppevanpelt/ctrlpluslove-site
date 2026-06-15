import { redirect } from "next/navigation";

export const metadata = {
  title: "AI-y-fier — ctrl+love",
};

export default function AiYFierPage() {
  redirect("/ai-y-fier/index.html");
}
