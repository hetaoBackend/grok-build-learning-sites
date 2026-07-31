import type { Metadata } from "next";
import { InterfaceLayers } from "../../components/InterfaceLayers";
import { ModuleLesson } from "../../components/ModuleLesson";
import { interfaceEvidence, interfaceQuiz } from "../../lib/content/interfaces";
import { getModule } from "../../lib/content/modules";

export const metadata: Metadata = { title: "一种内核，多种外壳" };

export default function InterfacesPage() {
  const lesson = getModule("interfaces");
  return <ModuleLesson module={lesson} visual={<InterfaceLayers />} evidence={interfaceEvidence} quiz={interfaceQuiz} concept={<><article><span>01 / SHELL</span><h3>外壳决定怎样交流</h3><p>TUI 处理键盘与帧，Headless 输出结构化结果，ACP 转换协议事件。它们的首要差异是 I/O，而不是推理核心。</p></article><article><span>02 / CORE</span><h3>内核维持同一语义</h3><p>Session、ChatState、Sampler、Tools 和 Workspace 继续负责 Turn、采样、副作用与持久化。</p></article><article><span>03 / PRESSURE</span><h3>每种外壳有自己的背压</h3><p>TUI 特别需要协调 token、输入和绘制；协议外壳则更关心 channel 生命周期和事件映射。</p></article></>} />;
}
