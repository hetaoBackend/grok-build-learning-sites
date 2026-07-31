import type { Metadata } from "next";
import { ModuleLesson } from "../../components/ModuleLesson";
import { StateTimeline } from "../../components/StateTimeline";
import { getModule } from "../../lib/content/modules";
import { stateEvidence, stateQuiz } from "../../lib/content/state";

export const metadata: Metadata = { title: "会话为何不失忆" };

export default function StatePage() {
  const lesson = getModule("state");
  return <ModuleLesson module={lesson} visual={<StateTimeline />} evidence={stateEvidence} quiz={stateQuiz} concept={<><article><span>01 / EVENT</span><h3>先保存发生过什么</h3><p><code>updates.jsonl</code> 记录耐久事件。内存状态消失后，系统可以重放它，而不是依赖某个永远正确的巨大快照。</p></article><article><span>02 / VIEW</span><h3>历史是派生视图</h3><p><code>chat_history.jsonl</code> 方便读取，但它可以从事实事件重建。这个区别决定了恢复时谁是来源、谁是缓存。</p></article><article><span>03 / REWIND</span><h3>对话与文件要一起回退</h3><p>截断未来消息只改变认知历史；workspace 快照负责撤回已发生的文件副作用。</p></article></>} />;
}
