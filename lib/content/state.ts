import type { EvidenceItem, QuizItem } from "./types";

export const stateEvents = [
  { id: "u1", at: "00:00", label: "Prompt", durable: "updates.jsonl", memory: "ChatState +1", color: "signal" },
  { id: "u2", at: "00:04", label: "Tool Result", durable: "updates.jsonl", memory: "ChatState +1", color: "signal" },
  { id: "cp", at: "00:07", label: "Checkpoint", durable: "summary.json", memory: "boundary saved", color: "memory" },
  { id: "cx", at: "00:08", label: "Compaction", durable: "updates.jsonl", memory: "history replaced", color: "caution" },
  { id: "rs", at: "—", label: "Process restart", durable: "replay events", memory: "ChatState rebuilt", color: "memory" },
  { id: "rw", at: "—", label: "Rewind", durable: "truncate future", memory: "files restored", color: "caution" },
];

export const stateFiles = ["updates.jsonl", "chat_history.jsonl", "summary.json", "plan.json", "plan_mode.json", "signals.json", "goal/state.json"];

export const stateEvidence: EvidenceItem[] = [
  { kind: "fact", title: "更新日志是耐久事实源", text: "updates.jsonl 保存可重放事件；chat_history.jsonl 是可重建的会话视图。", source: { path: "crates/xai-grok-shell/src/session/storage/mod.rs" } },
  { kind: "fact", title: "压缩不是删除最旧消息", text: "compaction 具有预触发、两阶段处理、整体替换与 checkpoint 语义。", source: { path: "crates/xai-grok-shell/src/session/compaction.rs" } },
  { kind: "boundary", title: "回退同时触及两条时间线", text: "对话事件的未来会被截断；workspace 的文件状态则通过快照恢复，二者必须分开理解。", source: { path: "crates/xai-grok-workspace/src/session/file_state.rs" } },
];

export const stateQuiz: QuizItem[] = [
  { question: "进程退出后，ChatState 从哪里恢复？", answer: "从 updates.jsonl 等耐久状态重放；chat_history.jsonl 可以被重建。" },
  { question: "Compaction 是否只是删掉最早的消息？", answer: "不是。它生成摘要和替换状态，并维护 checkpoint 语义。" },
  { question: "Rewind 为什么还需要 workspace 文件快照？", answer: "只截断对话无法撤回工具已写入的文件，文件状态必须独立恢复。" },
];
