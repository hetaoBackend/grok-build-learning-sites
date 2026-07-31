import type { EvidenceItem, QuizItem, RuntimeStep } from "./types";

export const runtimeSteps: RuntimeStep[] = [
  { id: "prompt", actor: "USER", label: "Prompt", detail: "输入进入当前 Session，并保留来源与上下文。", state: "input queued", source: { path: "crates/xai-grok-shell/src/session/acp_session_impl/turn.rs", symbol: "handle_prompt" } },
  { id: "session", actor: "ACTOR", label: "Session Actor", detail: "run_session 串行处理命令、完成事件和持久化通知。", state: "turn active", source: { path: "crates/xai-grok-shell/src/session/acp_session_impl/run_loop.rs", symbol: "run_session" } },
  { id: "prepare", actor: "SHELL", label: "准备上下文", detail: "解析 slash command、Skill、workflow，并从 ChatState 构建请求。", state: "request built", source: { path: "crates/xai-grok-shell/src/session/acp_session_impl/turn.rs", symbol: "process_conversation_turn" } },
  { id: "sample", actor: "SAMPLER", label: "Sampler", detail: "全局 Actor 为请求创建可取消任务，处理重试、空响应与 doom-loop 恢复。", state: "streaming", source: { path: "crates/xai-grok-sampler/src/actor/request_task.rs" } },
  { id: "decision", actor: "MODEL", label: "Assistant item", detail: "没有 tool call 就收束；有 tool call 就进入副作用管线。", state: "branch selected", source: { path: "crates/xai-grok-shell/src/session/acp_session_impl/turn.rs" } },
  { id: "tool", actor: "TOOLS", label: "Tool call", detail: "工具经过准备、权限、分发和 post-flight，结果写回 ChatState。", state: "result appended", source: { path: "crates/xai-grok-shell/src/session/acp_session_impl/tool_calls.rs" } },
  { id: "loop", actor: "STATE", label: "继续或结束", detail: "Tool Result 触发下一轮采样；否则完成 Turn，并可能预触发压缩。", state: "turn complete", source: { path: "crates/xai-grok-shell/src/session/compaction.rs" } },
];

export const runtimeEvidence: EvidenceItem[] = [
  { kind: "fact", title: "串行会话，并发请求", text: "Session Actor 维护单个会话的顺序；Sampler Actor 可以让不同请求任务并发执行。", source: { path: "crates/xai-grok-sampler/src/actor/mod.rs" } },
  { kind: "interpretation", title: "Tool call 不是 Turn 的终点", text: "它更像循环中的一次外部求值：结果回到对话状态后，模型才获得继续推理的材料。" },
  { kind: "boundary", title: "恢复预算彼此独立", text: "普通重试、空响应恢复和 doom-loop 恢复不是一个共享次数计数器；页面将它们合并显示只是教学简化。", source: { path: "crates/xai-grok-sampler/src/actor/request_task.rs" } },
];

export const runtimeQuiz: QuizItem[] = [
  { question: "为什么 Session Actor 要保持串行？", answer: "它要维持一个会话中命令、ChatState 和持久化更新的确定顺序。" },
  { question: "模型返回 tool call 后，系统会立刻结束 Turn 吗？", answer: "不会。工具结果追加到状态后，通常会进入下一次采样。" },
  { question: "取消信号最直接作用于哪里？", answer: "Sampler 为每个请求创建的任务持有 cancellation token，可停止在途采样。" },
];
