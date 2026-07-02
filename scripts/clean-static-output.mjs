import { rm } from "node:fs/promises";

const generatedDirs = [
  new URL("../.next/", import.meta.url),
  new URL("../out/", import.meta.url),
  new URL("../static-preview/", import.meta.url),
];

await Promise.all(
  generatedDirs.map((directory) =>
    rm(directory, { recursive: true, force: true }),
  ),
);
