import type { Metadata } from "next";
import { ModuleLesson } from "../../components/ModuleLesson";
import { SourceSpine } from "../../components/SourceSpine";
import { getModule } from "../../lib/content/modules";
import { runtimeEvidence, runtimeQuiz } from "../../lib/content/runtime";

export const metadata: Metadata = { title: "一次 Turn 的生命周期" };

export default function RuntimePage() {
  const lesson = getModule("runtime");
  return <ModuleLesson module={lesson} visual={<SourceSpine />} evidence={runtimeEvidence} quiz={runtimeQuiz} concept={<><article><span>01 / SERIAL</span><h3>会话先保证顺序</h3><p>Session Actor 像一位记录员：一次只推进一个会话状态变化，确保 Prompt、assistant item、工具结果和持久化事件顺序一致。</p></article><article><span>02 / CONCURRENT</span><h3>请求可以并发</h3><p>Sampler 是全局 Actor。它为每次模型请求启动独立任务，因此不同会话可以同时采样，单个会话仍维持自己的因果链。</p></article><article><span>03 / LOOP</span><h3>工具把 Turn 变成循环</h3><p>模型先提出调用，系统在外部求值，再把结果写回 ChatState。直到模型不再请求工具，Turn 才真正收束。</p></article></>} />;
}
