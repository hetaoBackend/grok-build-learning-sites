import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

async function read(path) {
  try {
    return await readFile(new URL(path, root), "utf8");
  } catch {
    return "";
  }
}

test("finished site exposes the full learning route contract", async () => {
  const files = await Promise.all([
    read("app/page.tsx"),
    read("app/map/page.tsx"),
    read("app/runtime/page.tsx"),
    read("app/tools-safety/page.tsx"),
    read("app/state/page.tsx"),
    read("app/interfaces/page.tsx"),
    read("app/extensions/page.tsx"),
  ]);
  const all = files.join("\n");
  assert.match(all, /学习驾驶舱/);
  assert.match(all, /架构地图/);
  assert.match(all, /一次 Turn/);
  assert.match(all, /工具与安全/);
  assert.match(all, /会话为何不失忆/);
  assert.match(all, /一种内核，多种外壳/);
  assert.match(all, /扩展与多 Agent/);
});

test("layout and progress storage are production ready", async () => {
  const [layout, progress, page, packageJson] = await Promise.all([
    read("app/layout.tsx"),
    read("components/ProgressProvider.tsx"),
    read("app/page.tsx"),
    read("package.json"),
  ]);
  assert.match(layout, /lang="zh-CN"/);
  assert.match(layout, /grok-build 源码学习驾驶舱/);
  assert.match(layout, /headers\(\)/);
  assert.match(layout, /\/og\.png/);
  assert.match(progress, /grok-build-progress:/);
  assert.doesNotMatch(page + layout, /codex-preview|SkeletonPreview/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
});
