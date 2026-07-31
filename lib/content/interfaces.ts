import type { EvidenceItem, QuizItem } from "./types";

export const interfaceModes = [
  { id: "tui", label: "TUI", input: "keyboard / terminal", output: "frames + token stream", adapter: "pager event_loop" },
  { id: "headless", label: "Headless", input: "prompt / stdin", output: "structured result", adapter: "run_headless" },
  { id: "server", label: "Agent Server", input: "stdio channel", output: "agent events", adapter: "run_stdio_agent" },
  { id: "leader", label: "Leader", input: "delegated task", output: "coordination events", adapter: "run_leader" },
  { id: "acp", label: "ACP", input: "protocol request", output: "channel / gateway", adapter: "xai-acp-lib" },
];

export const sharedLayers = ["SESSION ACTOR", "CHAT STATE", "SAMPLER", "TOOLS + PERMISSION", "WORKSPACE"];

export const interfaceEvidence: EvidenceItem[] = [
  { kind: "fact", title: "入口先分模式，再进入共享内核", text: "main.rs 解析命令、加载沙箱并分发 TUI、headless、leader 或 stdio agent。", source: { path: "crates/codegen/xai-grok-pager-bin/src/main.rs" } },
  { kind: "fact", title: "TUI 同时消费多路事件", text: "biased tokio::select! 处理 token stream、输入、任务、writer ack 与更新，并用批处理和节流避免输入饥饿。", source: { path: "crates/xai-grok-pager/src/app/event_loop.rs" } },
  { kind: "boundary", title: "ACP 不是另一套 Agent 内核", text: "它提供协议 channel/gateway 适配；conversation turn 的核心状态机仍来自 shell/session。", source: { path: "crates/xai-acp-lib/src/lib.rs" } },
];

export const interfaceQuiz: QuizItem[] = [
  { question: "切换 TUI 到 Headless 后，Sampler 会被替换吗？", answer: "不会。主要变化是输入输出适配，Sampler、Session 和 Tools 仍是共享层。" },
  { question: "TUI 为什么使用 biased select 还要做节流？", answer: "优先级和批处理共同避免高频 token/update 让用户输入长期得不到处理。" },
  { question: "ACP 的职责是什么？", answer: "把外部协议请求和事件映射到共享 Agent 运行时，而不是重写运行时。" },
];
