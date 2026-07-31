# grok-build Learning Sites Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and publish a Chinese interactive learning cockpit with six source-backed grok-build modules.

**Architecture:** Keep the existing vinext/React application and add seven static routes behind one shared learning shell. Source facts live in typed local content modules pinned to one upstream commit; client components own only playback, filters, quizzes, and device-local progress.

**Tech Stack:** React 19, TypeScript 5.9, vinext/Vite, CSS/SVG, Node test runner, Cloudflare Sites.

## Global Constraints

- Pin every source link to `dd04f397b1d02f2272b092555669dfba1f01bc85`.
- Deliver `/`, `/map`, `/runtime`, `/tools-safety`, `/state`, `/interfaces`, and `/extensions`.
- Every module must include concept, source, boundary, and exercise layers.
- Use browser `localStorage` only for device-local progress; the storage key includes the source revision.
- Do not add D1, R2, authentication, a charting dependency, or a server data dependency.
- Preserve `.openai/hosting.json`, the `sites()` Vite plugin, and Cloudflare-compatible ESM output.
- Support 360px, 768px, and 1280px layouts, keyboard focus, and `prefers-reduced-motion`.
- Remove the starter preview, starter metadata, and `react-loading-skeleton` before final build.

## Visual System

- **Ink** `#0B0E0C`: page background.
- **Bench** `#121813`: panels and diagrams.
- **Paper** `#ECEADF`: primary text.
- **Signal** `#C6EC58`: active execution path.
- **Caution** `#E8B35F`: ask, fallback, and degraded states.
- **Memory** `#67CFC5`: persisted state.
- Display type: condensed system sans (`Arial Narrow`, `Aptos Display`, `PingFang SC`).
- Body type: system Chinese sans (`PingFang SC`, `Microsoft YaHei`).
- Utility type: `SFMono-Regular`, `Cascadia Code`, monospace.
- Signature element: a persistent “source spine” that turns the real Prompt → Session → Sampler → Tool → State path into a playable orientation device across all routes.

Desktop shell:

```text
┌ source SHA ───────────── six-module learning rail ───────── progress ┐
│  route thesis                                                      │
│  ┌──── playable source spine ────┐  ┌─ state / evidence panel ───┐ │
│  │ Prompt → Session → Sampler    │  │ source fact                │ │
│  │              ↘ Tool → State  │  │ interpretation / boundary  │ │
│  └───────────────────────────────┘  └─────────────────────────────┘ │
│  concept blocks · source anchors · exercise checkpoint             │
└─────────────────────────────────────────────────────────────────────┘
```

Mobile shell:

```text
┌ source SHA ┐
│ thesis     │
│ vertical   │
│ step cards │
│ evidence   │
│ exercise   │
└ module rail┘
```

The visual review rejected scattered terminal decoration: the one bold device is the source spine; borders, labels, and motion remain quiet so the execution semantics carry the identity.

---

### Task 1: Source-backed content model

**Files:**
- Create: `lib/content/types.ts`
- Create: `lib/content/source.ts`
- Create: `lib/content/modules.ts`
- Create: `lib/content/architecture.ts`
- Create: `lib/content/runtime.ts`
- Create: `lib/content/safety.ts`
- Create: `lib/content/state.ts`
- Create: `lib/content/interfaces.ts`
- Create: `lib/content/extensions.ts`
- Create: `tests/content-model.test.mjs`

**Interfaces:**
- Produces: `SOURCE_REVISION`, `sourceUrl(path, line?)`, `learningModules`, `architectureGroups`, `runtimeSteps`, `safetyScenarios`, `stateEvents`, `interfaceModes`, `extensionKinds`.
- Each evidence item uses `{ kind: "fact" | "interpretation" | "boundary"; text: string; source?: SourceRef }`.

- [ ] **Step 1: Write the failing source-content test**

```js
test("all learning modules and source links are revision pinned", async () => {
  const files = await Promise.all(contentFiles.map((file) => readFile(file, "utf8")));
  assert.equal(files.filter((text) => text.includes('slug: "')).length, 6);
  assert.ok(files.every((text) => !/TODO|TBD/.test(text)));
  assert.match(files.join("\n"), /dd04f397b1d02f2272b092555669dfba1f01bc85/);
});
```

- [ ] **Step 2: Run `node --test tests/content-model.test.mjs` and confirm it fails because content modules do not exist.**
- [ ] **Step 3: Add the typed modules with the exact six slugs and the researched source anchors from the approved specification.**
- [ ] **Step 4: Run `node --test tests/content-model.test.mjs` and confirm it passes.**
- [ ] **Step 5: Commit with `feat: add source-backed learning content`.**

### Task 2: Shared shell, evidence primitives, and local progress

**Files:**
- Create: `components/LearningShell.tsx`
- Create: `components/ModuleHeader.tsx`
- Create: `components/EvidenceCard.tsx`
- Create: `components/SourceLink.tsx`
- Create: `components/ProgressProvider.tsx`
- Create: `components/CheckpointQuiz.tsx`
- Modify: `app/layout.tsx`
- Create: `tests/site-contract.test.mjs`

**Interfaces:**
- Consumes: `LearningModule`, `EvidenceItem`, `sourceUrl`.
- Produces: `LearningShell({ children })`, `ModuleHeader({ module })`, `EvidenceCard({ item })`, `SourceLink({ source })`, `useProgress()` with `completed`, `markComplete(slug)`, and `percent`.

- [ ] **Step 1: Write failing contract tests that require Chinese metadata, the seven routes, the fixed SHA, progress storage key `grok-build-progress:<SHA>`, evidence labels, and no `codex-preview`.**
- [ ] **Step 2: Run `node --test tests/site-contract.test.mjs` and confirm the missing shared components cause failure.**
- [ ] **Step 3: Implement the shared shell and progress provider; guard `localStorage` access behind client effects and use semantic `<nav>`, `<main>`, and `<footer>`.**
- [ ] **Step 4: Implement evidence/source/quiz primitives with visible focus states and answer reveal controls.**
- [ ] **Step 5: Run the contract test and TypeScript build; confirm both pass.**
- [ ] **Step 6: Commit with `feat: add shared learning shell`.**

### Task 3: Learning cockpit and playable source spine

**Files:**
- Create: `components/SourceSpine.tsx`
- Create: `components/LearningCockpit.tsx`
- Modify: `app/page.tsx`
- Create: `tests/home-content.test.mjs`

**Interfaces:**
- Consumes: `runtimeSteps`, `learningModules`, `useProgress()`.
- Produces: `SourceSpine({ compact?: boolean; autoPlay?: boolean })` with previous, next, play/pause, and reset controls.

- [ ] **Step 1: Write a failing test requiring the homepage thesis, all six module links, the five source-spine nodes, source baseline, and four role-based entry paths.**
- [ ] **Step 2: Run `node --test tests/home-content.test.mjs` and verify the starter page fails the new assertions.**
- [ ] **Step 3: Implement a client-side step player using a bounded numeric index and a reduced-motion-safe timer.**
- [ ] **Step 4: Replace the starter page with the learning cockpit, module cards, role paths, evidence legend, and continue-learning action.**
- [ ] **Step 5: Run the homepage test and build; confirm both pass.**
- [ ] **Step 6: Commit with `feat: build grok-build learning cockpit`.**

### Task 4: Architecture map and Turn runtime routes

**Files:**
- Create: `app/map/page.tsx`
- Create: `app/runtime/page.tsx`
- Create: `components/ArchitectureExplorer.tsx`
- Create: `components/RuntimeLab.tsx`
- Create: `components/ModuleLesson.tsx`
- Create: `tests/core-routes.test.mjs`

**Interfaces:**
- Consumes: `architectureGroups`, `runtimeSteps`, shared shell primitives.
- Produces: `ArchitectureExplorer` with search/group filters and `RuntimeLab` with single-step/auto-play/reset and state snapshot.

- [ ] **Step 1: Write a failing test that requests `/map` and `/runtime` from the built worker and asserts their thesis, source anchors, boundaries, and exercises.**
- [ ] **Step 2: Run the route test and verify both routes return 404.**
- [ ] **Step 3: Implement the architecture explorer with six responsibility groups, search input, and an eight-crate minimal reading route.**
- [ ] **Step 4: Implement the runtime lab with Prompt → Session Actor → handle prompt → request → Sampler → tool branch → finish states.**
- [ ] **Step 5: Add concept/source/boundary/exercise sections and next-module links to both routes.**
- [ ] **Step 6: Run route tests and build; confirm both pass.**
- [ ] **Step 7: Commit with `feat: add architecture and runtime labs`.**

### Task 5: Safety, state, interface, and extension routes

**Files:**
- Create: `app/tools-safety/page.tsx`
- Create: `app/state/page.tsx`
- Create: `app/interfaces/page.tsx`
- Create: `app/extensions/page.tsx`
- Create: `components/SafetyPipeline.tsx`
- Create: `components/StateTimeline.tsx`
- Create: `components/InterfaceLayers.tsx`
- Create: `components/ExtensionComposer.tsx`
- Create: `tests/specialist-routes.test.mjs`

**Interfaces:**
- Consumes: the four specialist content modules and shared lesson primitives.
- Produces: scenario selector for safety, event scrubber for state, shell selector for interfaces, and capability selector for extensions.

- [ ] **Step 1: Write a failing built-worker test for all four routes and require their defining boundary copy: Plan Mode is not a Bash/MCP sandbox, hooks fail open on handler failure, sandbox may degrade, and subagent worktree creation may fall back.**
- [ ] **Step 2: Run the test and verify all four routes return 404.**
- [ ] **Step 3: Implement the safety pipeline with Read/Edit/Opaque shell/MCP/Parallel presets and explicit allow/ask/deny/degrade outcomes.**
- [ ] **Step 4: Implement the state timeline showing `updates.jsonl`, derived chat history, compaction checkpoints, process recovery, and workspace rewind.**
- [ ] **Step 5: Implement interface layers for TUI, Headless, Agent Server, Leader, and ACP over shared runtime layers.**
- [ ] **Step 6: Implement the extension composer for Skills, Plugins, Hooks, MCP, and Subagents with trust and capability destinations.**
- [ ] **Step 7: Add source, boundary, exercises, and next-module links to all four routes.**
- [ ] **Step 8: Run specialist route tests and build; confirm both pass.**
- [ ] **Step 9: Commit with `feat: add specialist learning labs`.**

### Task 6: Responsive visual system and starter removal

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`
- Modify: `package.json`
- Modify: `package-lock.json`
- Delete: `app/_sites-preview/SkeletonPreview.tsx`
- Delete: `app/_sites-preview/preview.css`
- Modify: `tests/rendered-html.test.mjs`

**Interfaces:**
- Consumes: all page and component class names.
- Produces: the project-wide token system, responsive layout, focus states, reduced-motion behavior, print-friendly source sections, and final metadata.

- [ ] **Step 1: Replace the starter test with failing assertions for the finished metadata, no preview directory/import/dependency, `lang="zh-CN"`, semantic navigation, and the seven rendered routes.**
- [ ] **Step 2: Run the test and confirm it fails against starter metadata and dependencies.**
- [ ] **Step 3: Implement the six-color token system, typography, source spine, module grid, lab panels, evidence cards, and mobile vertical flow.**
- [ ] **Step 4: Add explicit `:focus-visible`, `prefers-reduced-motion`, 360px/768px/1280px rules, and color-independent status labels.**
- [ ] **Step 5: Remove the starter preview, remove `react-loading-skeleton` with `npm uninstall react-loading-skeleton`, and update metadata/icons.**
- [ ] **Step 6: Run `npm test` and `npm run lint`; fix all failures and warnings.**
- [ ] **Step 7: Commit with `feat: finish responsive learning experience`.**

### Task 7: Social card, final verification, and publishing

**Files:**
- Create: `public/og.png`
- Modify: `app/layout.tsx`

**Interfaces:**
- Produces: one validated 1200×630 social card and absolute request-host Open Graph/X image metadata.

- [ ] **Step 1: Freeze this card brief: “grok-build 源码学习驾驶舱; Prompt → Session → Sampler → Tool → State source spine; Ink/Bench/Paper/Signal palette; Chinese title fully legible; no invented logos or code.”**
- [ ] **Step 2: Make exactly one image-generation request, inspect the returned title and source-spine labels, and omit the asset if it is unusable.**
- [ ] **Step 3: If usable, save it as `public/og.png` and add request-host-derived Open Graph/X image metadata.**
- [ ] **Step 4: Run `npm test`, `npm run lint`, and `npm run build`; require zero failures.**
- [ ] **Step 5: Verify `/`, `/map`, `/runtime`, `/tools-safety`, `/state`, `/interfaces`, and `/extensions` against the built worker and scan for TODO/TBD/starter copy/unpinned GitHub links.**
- [ ] **Step 6: Publish with the Sites hosting workflow and verify the homepage plus all six deployed deep links.**
- [ ] **Step 7: Commit with `chore: prepare grok-build learning sites release`.**
