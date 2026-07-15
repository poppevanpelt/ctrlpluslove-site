import type { RoomEnv } from "../env.ts";

type OpenAIMessage = {
  role: "system" | "user";
  content: string;
};

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function createJsonChatCompletion(
  env: RoomEnv,
  messages: OpenAIMessage[],
): Promise<string> {
  for (let attempt = 1; attempt <= 2; attempt += 1) {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.openaiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: env.roomModel,
        response_format: { type: "json_object" },
        temperature: 0.2,
        messages,
      }),
    });

    if (response.ok) {
      const json = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
      const content = json.choices?.[0]?.message?.content;

      if (!content) {
        throw new Error("OpenAI returned an empty completion.");
      }

      return content;
    }

    if (attempt === 1 && (response.status === 429 || response.status >= 500)) {
      await wait(500);
      continue;
    }

    const error = (await response.json().catch(() => ({}))) as { error?: { message?: string } };
    throw new Error(error.error?.message ?? `OpenAI request failed with HTTP ${response.status}`);
  }

  throw new Error("OpenAI request failed.");
}
