import type { Metadata } from "next";
import { ModuleLesson } from "../../components/ModuleLesson";
import { StateTimeline } from "../../components/StateTimeline";
import { getModule } from "../../lib/content/modules";
import { stateEvidence, stateQuiz } from "../../lib/content/state";

export const metadata: Metadata = { title: "会话为何不失忆" };

export default function StatePage() {
  const lesson = getModule("state");
  return (
    <ModuleLesson
      module={lesson}
      visual={<StateTimeline />}
      evidence={stateEvidence}
      quiz={stateQuiz}
      concept={
        <>
          <article>
            <span>01 / LAYERS</span>
            <h3>“会话状态”其实有好几层</h3>
            <p>运行中的 ChatState、磁盘上的事件日志、便于读取的聊天历史、摘要与计划文件，以及 workspace 的文件快照，都在保存连续性，但它们保存的不是同一种事实。把这些文件统称为“记忆”，会掩盖恢复时最关键的来源关系。</p>
            <p>先区分内存状态、耐久事实、派生视图和外部副作用，才能解释进程退出、上下文过长或主动回退时，系统分别需要恢复什么。</p>
          </article>
          <article>
            <span>02 / EVENT</span>
            <h3>先保存发生过什么</h3>
            <p><code>updates.jsonl</code> 以可追加、可重放的事件记录会话变化。Prompt 到来、assistant item 产生、工具返回结果，都会成为按顺序存在的耐久事实。即使进程中的 ChatState 消失，系统仍可以根据这些事件重新构建当前视图。</p>
            <p>事件源的优势不是“永远不会损坏”，而是来源更清楚：恢复过程可以解释某个状态由哪些事件推导出来，而不必盲信一个可能写到一半的巨大内存快照。</p>
          </article>
          <article>
            <span>03 / VIEW</span>
            <h3>历史、计划和信号各保存一类视图</h3>
            <p><code>chat_history.jsonl</code> 适合顺序读取对话，但它可以由更新事件重建，因此更接近派生视图。<code>summary.json</code>、<code>plan.json</code>、<code>plan_mode.json</code>、signals 与 goal state 则分别承载压缩摘要、计划内容、模式状态和控制信号。</p>
            <p>拆开保存意味着局部能力可以独立演化，也意味着排障时要先问“这个文件是事实源还是缓存”。删除一个可重建视图与删除事件日志，后果完全不同。</p>
          </article>
          <article>
            <span>04 / COMPACTION</span>
            <h3>压缩是在换表示，不是在粗暴删历史</h3>
            <p>当上下文接近预算时，compaction 会预触发并通过阶段化流程生成更短的表示，再用摘要和保留边界替换原有历史，同时维护 checkpoint 语义。目标是在模型上下文中释放空间，又保留继续任务所需的因果信息。</p>
            <p>因此压缩后的 ChatState 与原始事件日志不是同一形态：前者服务下一次推理，后者服务耐久恢复和追踪。把 compaction 说成“删掉最早几条消息”，会漏掉摘要生成、整体替换与 checkpoint。</p>
          </article>
          <article>
            <span>05 / REWIND</span>
            <h3>回退必须同时处理认知和现实</h3>
            <p>对话回退会截断某个节点之后的未来事件，让 Session 回到较早的认知状态。但工具可能已经改过 workspace；如果只删对话，模型会以为改动从未发生，磁盘上却仍保留结果。</p>
            <p>文件快照因此构成第二条时间线，负责恢复真实 workspace 状态。一次完整 rewind 要协调事件截断和文件恢复；任何一边失败或缺失，都可能留下“对话说没改、文件其实改了”的分叉。</p>
          </article>
        </>
      }
    />
  );
}
