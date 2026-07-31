import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

async function render(pathname) {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${pathname}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request(`http://localhost${pathname}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

const routes = [
  ["/", "把一次 Turn 拆开来看"],
  ["/map", "77 个 crate，不必从头读"],
  ["/runtime", "一次 Turn，怎样活过来"],
  ["/tools-safety", "副作用发生之前，有几道门"],
  ["/state", "会话为什么不会轻易失忆"],
  ["/interfaces", "一个内核，五种外壳"],
  ["/extensions", "能力从哪里进入系统"],
];

for (const [pathname, thesis] of routes) {
  test(`renders ${pathname}`, async () => {
    const response = await render(pathname);
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.match(html, new RegExp(thesis));
    assert.match(html, /dd04f397/);
    assert.doesNotMatch(html, /Your site is taking shape|codex-preview/);
  });
}

test("finished tree contains no starter preview", async () => {
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  assert.doesNotMatch(page, /SkeletonPreview/);
});
