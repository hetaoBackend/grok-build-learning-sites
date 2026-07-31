# grok-build 中文学习站群设计规格

- 日期：2026-07-31
- 状态：设计已口头确认，等待书面规格确认后实施
- 研究对象：`xai-org/grok-build`
- 源码基线：`dd04f397b1d02f2272b092555669dfba1f01bc85`（2026-07-30）
- 上游同步标识：`SOURCE_REV=2a28b4a86cfc4a4c133c35b7fc2a6a9964387c39`

## 1. 设计目标

把 grok-build 从一个体量较大、入口分散的 Rust monorepo，转化成一组可以按认知顺序学习的中文互动网站。读者不需要先通读全部源码，也能先建立系统全景，再沿着一次 Turn 的真实执行链逐层进入工具、安全、状态、界面和扩展机制。

交付形态是“一个学习驾驶舱 + 六个专题站点”，部署在同一个站点的独立路由下。它们共享导航、术语、源码基线和学习进度，但每个专题都能独立阅读。

成功标准：

- 首次访问者在 10 分钟内能解释 grok-build 的主要组件以及一次 Turn 如何流转。
- 读者能从任一概念跳到对应 crate、文件和关键符号，而不是只看到二手总结。
- 每个专题都提供“概念 → 源码 → 练习”三个层级，既适合快速浏览，也支持深入研读。
- 明确区分源码事实、基于源码的解释和当前无法从仓库确认的边界。
- 桌面和移动端均可完整使用；核心内容不依赖鼠标悬停或动画才能理解。

## 2. 不做什么

- 不做 README 的中文翻译站。
- 不做所有 77 个 crate 的逐文件 API 文档；架构地图负责索引，专题站负责解释关键路径。
- 不假装运行一个真实 Grok 模型或在浏览器执行 Rust agent；交互动画是忠于源码状态机的可控演示。
- 不把源码中的设计选择包装成通用最佳实践；会保留具体实现的适用范围和已知边界。
- 第一版不需要账号、云同步、服务端数据库或社区评论系统。

## 3. 受众与学习路径

核心受众是对 coding agent、Rust 异步运行时或多 Agent 架构感兴趣，但尚不熟悉 grok-build 代码布局的工程师。

默认学习路径：

1. 首页用一张运行时全景建立心智模型。
2. 架构地图回答“代码在哪里”。
3. Turn 生命周期回答“系统怎么跑起来”。
4. 工具与安全回答“模型如何产生真实副作用，以及如何被约束”。
5. 状态专题回答“为什么重启、压缩或回退后仍能继续”。
6. 多界面专题回答“同一内核如何服务不同外壳”。
7. 扩展专题回答“如何接入 MCP、Skill、Plugin、Hook 和 Subagent”。

读者也可以从首页按角色进入：只想理解 Agent、想改工具系统、想接入新界面、想开发扩展。

## 4. 信息架构

### 4.1 首页 `/`

定位为学习驾驶舱，而不是营销首页。

首屏展示一张可播放的运行时全景：Prompt 进入 Session Actor，经 Sampler 产生 assistant item 或 tool call，工具执行结果写回 ChatState，再进入下一轮或结束。点击任一节点会展开一句解释并链接到相应专题。

首屏下方提供：

- 六个专题的学习卡片、预计时长和完成状态。
- 四种角色导向的推荐路线。
- 当前研究基线、官方仓库链接和“事实 / 解释 / 边界”图例。
- 本地保存的学习进度与“继续上次学习”。

### 4.2 架构地图 `/map`

目标：让读者理解 monorepo 的职责分区和关键依赖方向。

内容：

- 将全部 crate 按入口与界面、会话与 Agent、采样与模型、工具与权限、工作区与基础设施、扩展协议分组。
- 默认突出真正的组合入口 `xai-grok-pager-bin`，并显示它如何连接 TUI、Shell、Tools、Workspace。
- 支持按名称搜索、按职责过滤、点击 crate 查看路径、职责、关键依赖和相关专题。
- 提供一条“先读这 8 个 crate”的最小源码路线，避免 77 个 crate 平铺造成认知过载。

关键源码锚点：

- `crates/codegen/xai-grok-pager-bin/src/main.rs`
- `crates/xai-grok-pager/src/app/mod.rs`
- `crates/xai-grok-shell/src/session/acp_session_impl/run_loop.rs`
- `crates/xai-grok-sampler/src/actor/mod.rs`
- `crates/xai-grok-tools`
- `crates/xai-grok-workspace`

### 4.3 Turn 生命周期 `/runtime`

目标：逐步走完一次真实 conversation turn。

主交互是一个可以单步、自动播放和重置的事件时间线：

1. 输入 Prompt。
2. Session Actor 串行接收命令。
3. `handle_prompt` 解析 slash command、skill、workflow 等上下文。
4. `process_conversation_turn` 准备工具定义并从 ChatState 构建请求。
5. Sampler Actor 启动可取消的并发请求任务，处理重试和恢复。
6. 若模型未返回 tool call，完成本次 Turn。
7. 若返回 tool call，执行工具、追加结果并进入下一次采样。
8. 触发压缩、todo gate 或 action-stationarity 保护时，显示对应旁路。

每一步同时显示三层信息：人话解释、精简源码片段、文件与符号链接。右侧保留一个实时状态面板，展示 `ChatState`、待执行工具和 cancellation token 的变化。

关键源码锚点：

- `crates/xai-grok-shell/src/session/acp_session_impl/run_loop.rs::run_session`
- `crates/xai-grok-shell/src/session/acp_session_impl/turn.rs::handle_prompt`
- `crates/xai-grok-shell/src/session/acp_session_impl/turn.rs::process_conversation_turn`
- `crates/xai-grok-sampler/src/actor/request_task.rs`
- `crates/xai-grok-shell/src/session/acp_session_impl/tool_calls.rs`

### 4.4 工具与安全 `/tools-safety`

目标：解释从 tool call 到真实副作用之间有哪些门，以及每道门能防什么、不能防什么。

主交互是一条“执行检查线”：模型输出的 tool call 依次经过 prepare、Plan Mode edit gate、Hook、Permission Policy、ToolBridge dispatch、OS Sandbox 和 post-flight。读者可切换预设场景，如读取文件、编辑文件、运行不透明 shell、并行工具、MCP 工具，观察决策如何变化。

必须呈现的源码事实和边界：

- 权限类型包括 Read、Grep、Edit、Bash、MCP、Web；决策包括 Allow、Ask、Reject、PolicyDeny 等。
- policy 会拆分 shell command，并对无法透明分析的脚本采取更保守的询问策略。
- Plan Mode 的 edit gate 保护编辑类操作和计划文件边界，但不能被表述为对 Bash/MCP 的完整沙箱。
- OS sandbox 是另一层约束，平台不支持时可能降级。
- Hook 的显式 deny 可以阻断；Hook 自身失败按源码设计为 fail-open，页面需要把这一点醒目标出。
- 工具调用可以批处理或并行执行，但 exit-plan 类调用被移动到尾部。

关键源码锚点：

- `crates/xai-grok-shell/src/session/acp_session_impl/tool_calls.rs`
- `crates/xai-grok-shell/src/session/acp_session_impl/tool_dispatch.rs`
- `crates/xai-grok-workspace/src/permission/types.rs`
- `crates/xai-grok-workspace/src/permission/policy.rs`
- `crates/xai-grok-shell/src/session/plan_mode.rs`
- `crates/xai-grok-sandbox/src/lib.rs`
- `crates/xai-grok-hooks/src/dispatcher.rs`

### 4.5 状态与恢复 `/state`

目标：解释会话如何持久化、压缩、恢复和回退。

主交互是一个可拖动的会话时间轴。读者可添加 Prompt、assistant item、tool result、checkpoint 和 compaction，随后模拟“进程退出”“上下文过长”或“回退到早期节点”。页面会展示磁盘文件和内存 ChatState 的对应变化。

内容重点：

- `updates.jsonl` 是耐久事件源，`chat_history.jsonl` 可由事件重建。
- `summary.json`、`plan.json`、`plan_mode.json`、signals 和 goal state 分别保存不同维度状态。
- compaction 是两阶段流程，支持预触发、整体替换和 checkpoint，而不是简单删掉旧消息。
- rewind 同时处理会话未来事件和 workspace 文件状态；页面需分开显示“对话回退”与“文件恢复”。

关键源码锚点：

- `crates/xai-grok-shell/src/session/storage/mod.rs`
- `crates/xai-grok-shell/src/session/compaction.rs`
- `crates/xai-grok-compaction`
- `crates/xai-grok-shell/src/session/acp_session_impl/rewind.rs`
- `crates/xai-grok-workspace/src/session/file_state.rs`

### 4.6 多界面 `/interfaces`

目标：解释同一 Agent 内核怎样服务 TUI、Headless、Agent Server、Leader 和 ACP，而不是把它们误认为五套独立实现。

主交互是一张可切换外壳的剖面图：底部固定显示共享的 Session、Sampler、Tools、Workspace；顶部切换不同入口后，只替换输入输出适配和事件消费方式。

重点：

- `main.rs` 如何解析命令并分发到 TUI、headless、leader 或 stdio agent。
- TUI `event_loop` 如何用 biased `tokio::select!` 同时处理 token stream、输入、任务、writer ack 和更新，并通过批处理/节流避免输入饥饿。
- ACP 位于协议适配层，负责 channel/gateway 类型，不替代核心会话循环。

关键源码锚点：

- `crates/codegen/xai-grok-pager-bin/src/main.rs`
- `crates/xai-grok-pager/src/app/mod.rs`
- `crates/xai-grok-pager/src/app/event_loop.rs`
- `crates/xai-acp-lib`

### 4.7 扩展与多 Agent `/extensions`

目标：建立 Skills、Plugins、Hooks、MCP 和 Subagents 的统一扩展心智模型，并解释它们的信任边界。

主交互是一个“给 Grok 增加能力”的组合器。读者选择能力来源，页面展示它会进入 prompt、工具目录、事件钩子还是独立子会话，以及需要哪些信任或权限。

必须呈现的事实和边界：

- Skills 有明确优先级，覆盖 local、repo、user、config/server、bundled，并支持 plugin-qualified 名称。
- 未信任的项目插件可以暴露 skills/agents 元数据，但 hooks、MCP 和 scripts 被阻止；信任绑定 canonical plugin root。
- MCP 提供多种 transport、OAuth 和 liveness；工具通过 namespace 暴露，并有搜索/调用与大输出收敛机制。
- Subagent 与父会话共享部分状态与能力，但能力受交集和深度限制。
- 隔离 worktree 是可选能力；创建失败时源码存在回退到共享 workspace 的路径，因此不能把“子 Agent 必然隔离”写成保证。

关键源码锚点：

- `crates/xai-grok-agent/src/prompt/skills.rs`
- `crates/xai-grok-agent/src/plugins`
- `crates/xai-grok-hooks/src/dispatcher.rs`
- `crates/xai-grok-mcp`
- `crates/xai-grok-shell/src/agent/subagent`
- `crates/xai-grok-subagent-resolution`

## 5. 每个专题的统一教学结构

为了让六站可以互相迁移学习，所有专题采用同一套内容骨架：

1. **一句话回答**：先回答本页的核心问题。
2. **可操作全景**：图中节点可点击、可单步，不把交互当装饰。
3. **概念层**：用中文建立模型，避免一上来堆符号名。
4. **源码层**：展示经过节选的源码、crate、文件和关键符号；链接固定到研究 SHA。
5. **边界层**：列出容易误读、平台差异和 fail-open/fallback 行为。
6. **练习层**：提供 3 个递进问题和答案揭示；至少一个要求读者沿源码路径验证。
7. **下一站**：根据当前专题推荐唯一的下一步，同时允许回到地图自由探索。

页面上的证据标签统一为：

- **源码事实**：可由固定 SHA 的代码直接验证。
- **解释**：为了教学对多个实现点做的归纳。
- **已知边界**：源码明确存在的降级、回退或约束。

## 6. 视觉与交互方向

视觉主题为“源码实验室”：深色石墨背景、偏暖白正文、酸橙绿色表示活动路径、琥珀色表示询问/降级、红色表示拒绝/危险、青色表示持久状态。它应当像一张可研究的工程工作台，而不是普通终端皮肤或霓虹赛博营销页。

界面特征：

- 标题使用有工程感但易读的无衬线字体；源码和符号使用等宽字体。
- 路径以连线、信号脉冲和状态变化表达，动画控制在 160–450ms；支持 `prefers-reduced-motion`。
- 图表在窄屏改为纵向步骤卡，不要求横向拖动画布才能阅读。
- 所有颜色编码同时搭配文字或图标，不以颜色作为唯一信息载体。
- 代码块支持复制、折叠注释和跳转 GitHub 固定行；不嵌入庞大源码全文。
- 全局顶栏显示六站导航、学习进度和源码基线；移动端收拢为底部学习轨道。

社交预览图在正文文案和首屏构图稳定后统一生成一次，表现 Prompt 穿过 Session、Sampler、Tool 和 State 的主链，并作为 `/public/og.png` 使用。

## 7. 内容与数据实现

站点使用现有 React + vinext/Vite 骨架，不引入服务端依赖。专题内容和可视化数据放在类型化的本地模块中，避免六个页面各自硬编码：

- `lib/content/source.ts`：仓库 URL、固定 SHA、源码链接生成器。
- `lib/content/modules.ts`：六个专题的标题、摘要、学习时长、前后关系。
- `lib/content/crates.ts`：crate 分组和架构图节点。
- `lib/content/runtime.ts`：Turn 时间线步骤及源码锚点。
- `lib/content/safety.ts`：权限场景、检查线决策和边界。
- `lib/content/state.ts`：持久化文件、事件与恢复演示数据。
- `lib/content/extensions.ts`：扩展类型、信任级别和能力去向。

共享组件：

- `LearningShell`：全局导航、进度和源码基线。
- `EvidenceBadge`：事实、解释、边界标签。
- `SourceAnchor`：固定 SHA 的源码链接。
- `StepPlayer`：单步/播放/重置状态机。
- `ConceptPanel`：概念、源码和练习三层切换。
- `CheckpointQuiz`：本地答题与完成状态。

学习进度只写入浏览器 `localStorage`，键中包含源码基线版本。未来上游代码变化时不会把旧版本完成状态误套到新课程。

## 8. 内容可信度规则

- 所有技术陈述以固定 SHA 源码为准，官方 README/文档只用于产品定位和入口说明。
- 源码链接使用 commit permalink，避免默认分支变化后证据漂移。
- 不用代码行数代表架构重要性；crate 分组依据职责和调用关系。
- 代码节选优先展示分支条件和状态变化，不展示无关样板。
- 对 Plan Mode、Hook、Sandbox、Plugin trust、Subagent worktree 等安全主题，必须同时写出保护范围和未覆盖范围。
- 页面 footer 标注研究日期与 SHA，并提供“上游已经变化？”提示。

## 9. 响应式、无障碍和性能

- 目标断点：360px、768px、1280px；所有核心页面在 360px 下无水平溢出。
- 图表节点可通过键盘聚焦和激活；播放控件有清晰标签和当前步骤播报。
- 正文与背景达到 WCAG AA 对比度；焦点环不被动画或阴影吞没。
- 初始页面不加载整套课程数据；按路由拆分大型交互模块。
- 交互全部使用 CSS/SVG/React 状态完成，第一版不引入重量级图可视化库。
- 禁用 JavaScript 时至少能看到每页的核心解释、源码入口和边界清单。

## 10. 验证与发布

实现完成后执行：

1. `npm run build`，确保全部路由静态构建通过。
2. 检查首页和六个路由都能直接访问，无客户端异常。
3. 检查源码链接均包含固定 SHA，且页面不存在占位文案或 starter preview。
4. 检查 360px/768px/1280px 布局、键盘操作和 reduced-motion。
5. 检查 localStorage 进度、答题揭示、单步播放器和路由间继续学习。
6. 用官方 Sites 发布流程部署，发布后对首页和六个深链做在线检查。

## 11. 已确认的设计决策

- 采用一个部署、六个独立专题路由，而不是六个相互割裂的部署。
- 以运行时链路组织教学，不按 README 章节或 crate 字母顺序组织。
- 首页是学习驾驶舱，首屏直接给出可操作的 Turn 全景。
- 视觉采用深色源码实验室，并用状态色表达真实执行语义。
- 第一版必须同时包含架构、运行时、工具安全、状态恢复、多界面、扩展与多 Agent 六个专题。
- 技术内容固定到当前官方源码 SHA，明确标注事实、解释和边界。

## 12. 开放项

书面规格确认后进入实施计划。实现阶段只允许在不改变上述信息架构和核心边界的情况下微调文案、动效节奏和组件拆分；若需要删减专题或改变发布形态，应重新确认设计。
