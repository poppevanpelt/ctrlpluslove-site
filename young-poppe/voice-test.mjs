#!/usr/bin/env node
/**
 * Project Snotjoch — one-off, private speech audition.
 * Use: OPENAI_API_KEY=... node young-poppe/voice-test.mjs
 * Writes MP3 samples to young-poppe/audio/ (gitignored; do not publish family voice samples).
 * Requires Node 20+; no extra dependencies.
 *
 * This is NOT a voice clone. It uses a synthetic preset voice with Dutch instructions.
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
const key = process.env.OPENAI_API_KEY;
if (!key) { console.error("OPENAI_API_KEY is required (do not put it in source code)."); process.exit(1); }
const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), "audio");
await mkdir(dir, { recursive: true });
const lines = [
  { name: "01-he-pap", text: "Hé, pap." },
  { name: "02-raar-he", text: "Raar hè?" },
  { name: "03-waarom", text: "Ja, maar waarom eigenlijk?" },
  { name: "04-vraag", text: "Was ik vroeger ook zo eigenwijs?" },
];
const voices = ["ash", "verse"];
for (const voice of voices) for (const { name, text } of lines) {
  const res = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "gpt-4o-mini-tts", voice, response_format: "mp3",
      input: text,
      instructions: "Speak native Netherlands Dutch, a natural Dutch accent with crisp pronunciation, soft-spoken and a little dreamy, tender and thoughtful with natural pauses, understated humour, warm but never sentimental. The fictional speaker is a bright approximately nine-year-old boy. Suggest a quietly observant nine-year-old through gentle rhythm; do not caricature or force a high-pitched cartoon-child voice. Keep each line spontaneous, human and short."
    })
  });
  if (!res.ok) { console.error(`${voice}/${name} failed: HTTP ${res.status}`); continue; }
  const target = path.join(dir, `${name}-${voice}.mp3`);
  await writeFile(target, Buffer.from(await res.arrayBuffer()));
  console.log(`Wrote ${target}`);
}
console.log("Audition the clips locally. These are synthetic readings, not recorded or cloned childhood speech.");
