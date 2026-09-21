import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const assetsDir = path.join(process.cwd(), "public", "2go-assets");

const assets = [
  { name: "hero", chunks: 3 },
  { name: "extras", chunks: 4 },
];

for (const asset of assets) {
  const parts = [];
  for (let i = 1; i <= asset.chunks; i += 1) {
    const chunkPath = path.join(assetsDir, `${asset.name}.b64.${i}`);
    parts.push((await readFile(chunkPath, "utf8")).trim());
  }

  const bytes = Buffer.from(parts.join(""), "base64");

  if (bytes.subarray(0, 4).toString("ascii") !== "RIFF" ||
      bytes.subarray(8, 12).toString("ascii") !== "WEBP") {
    throw new Error(`${asset.name}: reconstructed file is not a WebP`);
  }

  const declaredSize = bytes.readUInt32LE(4) + 8;
  if (declaredSize !== bytes.length) {
    throw new Error(
      `${asset.name}: WebP is incomplete (declares ${declaredSize} bytes, reconstructed ${bytes.length})`
    );
  }

  await writeFile(path.join(assetsDir, `${asset.name}.webp`), bytes);
  console.log(`Restored ${asset.name}.webp (${bytes.length} bytes)`);
}
