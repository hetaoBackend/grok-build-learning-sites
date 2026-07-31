import type { EvidenceItem, QuizItem } from "./types";

export const safetyGates = ["PREPARE", "PLAN", "HOOK", "POLICY", "DISPATCH", "SANDBOX", "POST"];

export const safetyScenarios = [
  { id: "read", label: "读取文件", tool: "Read", outcomes: ["pass", "pass", "pass", "allow", "run", "read-only", "record"], result: "允许" },
  { id: "edit", label: "Plan Mode 编辑", tool: "Edit", outcomes: ["pass", "deny", "skip", "skip", "skip", "skip", "blocked"], result: "拒绝" },
  { id: "opaque", label: "不透明脚本", tool: "Bash", outcomes: ["split?", "not gated", "pass", "ask", "pending", "restricted", "record"], result: "询问" },
  { id: "mcp", label: "MCP 工具", tool: "MCP", outcomes: ["resolve", "not gated", "pass", "ask", "remote", "outside", "record"], result: "询问" },
  { id: "parallel", label: "并行工具组", tool: "Batch", outcomes: ["partition", "pass", "per call", "per call", "parallel", "per child", "merge"], result: "分流" },
];

export const safetyEvidence: EvidenceItem[] = [
  { kind: "fact", title: "权限是一组类型化决策", text: "Read、Grep、Edit、Bash、MCP、Web 会得到 Allow、Ask、Reject、PolicyDeny 等决策。", source: { path: "crates/xai-grok-workspace/src/permission/types.rs" } },
  { kind: "boundary", title: "Plan Mode 不是完整沙箱", text: "edit gate 约束编辑类操作，但不能把它描述成对 Bash 与 MCP 的完整隔离；这两类能力还要依赖其他权限与沙箱层。", source: { path: "crates/xai-grok-shell/src/session/plan_mode.rs" } },
  { kind: "boundary", title: "Hook 失败是 fail-open", text: "Hook 的显式 deny 可以阻断工具；Hook 处理器自身报错时，调度器按设计继续执行。", source: { path: "crates/xai-grok-hooks/src/dispatcher.rs" } },
  { kind: "boundary", title: "OS Sandbox 可能降级", text: "进程级和子进程网络约束依赖平台能力；不支持时存在 graceful degradation，而不是所有系统都获得同等隔离。", source: { path: "crates/xai-grok-sandbox/src/lib.rs" } },
];

export const safetyQuiz: QuizItem[] = [
  { question: "Plan Mode 开启后，任意 Bash 都一定安全了吗？", answer: "没有。Plan Mode 的 edit gate 不等同于 Bash/MCP 沙箱，仍需权限策略与 OS sandbox。" },
  { question: "Hook 进程崩溃会默认拒绝工具吗？", answer: "不会。显式 deny 能阻断，但 Hook 处理失败采用 fail-open。" },
  { question: "为什么不透明 shell 更可能触发 Ask？", answer: "策略无法可靠拆分和分析它的真实副作用，因此采用更保守的询问决策。" },
];
