import type { Metadata } from "next";
import { ArchitectureExplorer } from "../../components/ArchitectureExplorer";
import { ModuleLesson } from "../../components/ModuleLesson";
import { architectureEvidence, architectureQuiz } from "../../lib/content/architecture";
import { getModule } from "../../lib/content/modules";

export const metadata: Metadata = { title: "架构地图：77 个 crate，不必从头读" };

export default function MapPage() {
  const lesson = getModule("map");
  return <ModuleLesson module={lesson} visual={<ArchitectureExplorer />} evidence={architectureEvidence} quiz={architectureQuiz} concept={<><article><span>01 / ENTRY</span><h3>先找组合根</h3><p><code>xai-grok-pager-bin</code> 决定启动哪种模式；它把 UI、会话、权限和工作区拼起来。入口小，但架构信息密度最高。</p></article><article><span>02 / KERNEL</span><h3>再沿 Turn 主链</h3><p><code>shell → sampler → tools → workspace</code> 是理解真实执行的最短路径。其余 crate 大多在这条链上提供协议、数据或平台能力。</p></article><article><span>03 / EDGES</span><h3>最后看扩展边缘</h3><p>MCP、Hook、Plugin 和 ACP 都从不同位置接入共享内核。先知道接入点，再读各自协议。</p></article></>} />;
}
