import type { EvidenceItem, QuizItem } from "./types";

export const architectureGroups = [
  { name: "入口与界面", tone: "signal", crates: ["xai-grok-pager-bin", "xai-grok-pager", "xai-acp-lib", "xai-tui"] },
  { name: "会话与 Agent", tone: "signal", crates: ["xai-grok-shell", "xai-grok-agent", "xai-grok-chat-state", "xai-grok-subagent-resolution"] },
  { name: "采样与模型", tone: "memory", crates: ["xai-grok-sampler", "xai-model", "xai-proto", "xai-tokenizer"] },
  { name: "工具与权限", tone: "caution", crates: ["xai-grok-tools", "xai-grok-hooks", "xai-grok-sandbox", "xai-command-parser"] },
  { name: "工作区与状态", tone: "memory", crates: ["xai-grok-workspace", "xai-grok-compaction", "xai-persistence", "xai-diff"] },
  { name: "扩展协议", tone: "caution", crates: ["xai-grok-mcp", "xai-grok-skills", "xai-plugin", "xai-auth"] },
];

export const readingRoute = [
  "xai-grok-pager-bin",
  "xai-grok-pager",
  "xai-grok-shell",
  "xai-grok-sampler",
  "xai-grok-tools",
  "xai-grok-workspace",
  "xai-grok-hooks",
  "xai-grok-mcp",
];

export const architectureEvidence: EvidenceItem[] = [
  {
    kind: "fact",
    title: "组合根在 codegen 目录",
    text: "真正组装命令、运行时与不同模式的二进制入口是 xai-grok-pager-bin，而不是体量最大的 pager crate。",
    source: { path: "crates/codegen/xai-grok-pager-bin/src/main.rs" },
  },
  {
    kind: "interpretation",
    title: "按执行责任读，比按目录读更快",
    text: "先沿入口 → 会话 → 采样 → 工具 → 工作区追踪一圈，再回头理解外围 crate，认知负担更小。",
  },
  {
    kind: "boundary",
    title: "分组不是 Cargo workspace 原生层级",
    text: "六组职责是教学归纳；crate 之间仍存在跨组依赖，不能把分组当成严格模块边界。",
  },
];

export const architectureQuiz: QuizItem[] = [
  { question: "如果只想找不同运行模式的分发入口，先读哪个文件？", answer: "crates/codegen/xai-grok-pager-bin/src/main.rs。" },
  { question: "TUI 的事件循环属于会话内核吗？", answer: "不完全。它消费 UI 输入与会话更新；核心 conversation turn 在 xai-grok-shell。" },
  { question: "77 个 crate 是否应该按体量排序阅读？", answer: "不应该。体量包含测试与生成内容，职责链比代码行数更能说明架构位置。" },
];
