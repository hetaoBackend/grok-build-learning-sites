import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const files = [
  "lib/content/source.ts",
  "lib/content/modules.ts",
  "lib/content/architecture.ts",
  "lib/content/runtime.ts",
  "lib/content/safety.ts",
  "lib/content/state.ts",
  "lib/content/interfaces.ts",
  "lib/content/extensions.ts",
];

async function read(path) {
  try {
    return await readFile(new URL(path, root), "utf8");
  } catch {
    return "";
  }
}

test("content model defines six modules and pins source evidence", async () => {
  const text = (await Promise.all(files.map(read))).join("\n");
  for (const slug of [
    "map",
    "runtime",
    "tools-safety",
    "state",
    "interfaces",
    "extensions",
  ]) {
    assert.match(text, new RegExp(`slug:\\s*["']${slug}["']`));
  }
  assert.match(text, /dd04f397b1d02f2272b092555669dfba1f01bc85/);
  assert.match(text, /github\.com\/xai-org\/grok-build\/blob/);
  assert.doesNotMatch(text, /TODO|TBD/);
});

test("safety and extension content preserve researched boundaries", async () => {
  const [safety, extensions] = await Promise.all([
    read("lib/content/safety.ts"),
    read("lib/content/extensions.ts"),
  ]);
  assert.match(safety, /Bash.*MCP|MCP.*Bash/s);
  assert.match(safety, /fail-open/i);
  assert.match(safety, /降级/);
  assert.match(extensions, /共享 workspace/);
  assert.match(extensions, /未信任/);
});
