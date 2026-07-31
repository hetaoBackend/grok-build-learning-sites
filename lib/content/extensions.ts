import type { EvidenceItem, QuizItem } from "./types";

export const extensionKinds = [
  { id: "skill", label: "Skill", enters: "PROMPT", trust: "按来源优先级", payload: "instructions + assets", note: "local → repo → user → server → bundled" },
  { id: "plugin", label: "Plugin", enters: "DISCOVERY", trust: "canonical root", payload: "skills / agents / hooks / MCP", note: "未信任项目插件只暴露安全元数据" },
  { id: "hook", label: "Hook", enters: "EVENT", trust: "command / HTTP", payload: "observe / explicit deny", note: "handler failure 为 fail-open" },
  { id: "mcp", label: "MCP", enters: "TOOLS", trust: "server + permission", payload: "namespaced tools", note: "transport / OAuth / liveness" },
  { id: "subagent", label: "Subagent", enters: "CHILD SESSION", trust: "capability intersection", payload: "agent + task + optional worktree", note: "深度受限，隔离失败可能回退" },
];

export const extensionEvidence: EvidenceItem[] = [
  { kind: "fact", title: "Skill 有来源优先级", text: "本地、仓库、用户、配置/服务端与 bundled 来源按顺序解析，并支持 plugin-qualified 名称。", source: { path: "crates/xai-grok-agent/src/prompt/skills.rs" } },
  { kind: "fact", title: "未信任插件只露出低风险表面", text: "未信任的项目插件可显示 skills/agents 元数据，但 hooks、MCP 与 scripts 被阻止；信任绑定 canonical plugin root。", source: { path: "crates/xai-grok-agent/src/plugins/mod.rs" } },
  { kind: "boundary", title: "Subagent 不保证文件隔离", text: "可请求 isolated worktree，但创建失败时存在回退到共享 workspace 的路径；共享状态和能力仍受父会话与深度限制。", source: { path: "crates/xai-grok-shell/src/agent/subagent/mod.rs" } },
];

export const extensionQuiz: QuizItem[] = [
  { question: "只想给模型增加操作指南，优先选择什么？", answer: "Skill。它主要进入 prompt，不必引入新的远程工具或事件执行面。" },
  { question: "未信任项目插件能直接启动 MCP 与脚本吗？", answer: "不能。元数据可见，但 hooks、MCP 和 scripts 被阻止。" },
  { question: "Subagent 指定 worktree 后是否一定隔离？", answer: "不一定。创建失败存在回退到共享 workspace 的实现路径，调用方必须理解这个边界。" },
];
