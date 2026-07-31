import type { LearningModule } from "./types";

export const learningModules: LearningModule[] = [
  {
    slug: "map",
    index: "A",
    label: "架构地图",
    title: "77 个 crate，不必从头读",
    thesis: "先找到真正的入口、会话内核和副作用边界，再看外围能力。",
    summary: "把 monorepo 压缩成六组职责与一条最小阅读路线。",
    duration: "12 分钟",
    accent: "signal",
    next: "runtime",
  },
  {
    slug: "runtime",
    index: "B",
    label: "Turn 生命周期",
    title: "一次 Turn，怎样活过来",
    thesis: "会话 Actor 保持串行语义，Sampler 并发请求；Tool Result 决定是否再转一圈。",
    summary: "单步走完 Prompt、采样、工具执行和结束分支。",
    duration: "18 分钟",
    accent: "signal",
    next: "tools-safety",
  },
  {
    slug: "tools-safety",
    index: "C",
    label: "工具与安全",
    title: "副作用发生之前，有几道门",
    thesis: "Plan Mode、Permission、Hook 与 OS Sandbox 是不同层，不能互相替代。",
    summary: "切换真实场景，看 tool call 如何被允许、询问、拒绝或降级。",
    duration: "16 分钟",
    accent: "caution",
    next: "state",
  },
  {
    slug: "state",
    index: "D",
    label: "状态与恢复",
    title: "会话为什么不会轻易失忆",
    thesis: "耐久事件、派生历史、压缩 checkpoint 与文件快照共同维持连续性。",
    summary: "拖动事件时间轴，观察退出、压缩和回退改变了什么。",
    duration: "14 分钟",
    accent: "memory",
    next: "interfaces",
  },
  {
    slug: "interfaces",
    index: "E",
    label: "多界面",
    title: "一个内核，五种外壳",
    thesis: "TUI、Headless、Agent Server、Leader 与 ACP 共享 Session、Sampler 和 Tools。",
    summary: "切换输入输出外壳，观察哪些层变化、哪些保持不动。",
    duration: "10 分钟",
    accent: "memory",
    next: "extensions",
  },
  {
    slug: "extensions",
    index: "F",
    label: "扩展与多 Agent",
    title: "能力从哪里进入系统",
    thesis: "Skill、Plugin、Hook、MCP 和 Subagent 进入系统的位置与信任成本各不相同。",
    summary: "组合一种新能力，检查它进入 prompt、工具、事件还是子会话。",
    duration: "17 分钟",
    accent: "caution",
  },
];

export function getModule(slug: LearningModule["slug"]): LearningModule {
  const module = learningModules.find((item) => item.slug === slug);
  if (!module) throw new Error(`Unknown learning module: ${slug}`);
  return module;
}
