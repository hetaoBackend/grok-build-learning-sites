import type { Metadata } from "next";
import { ModuleLesson } from "../../components/ModuleLesson";
import { SafetyPipeline } from "../../components/SafetyPipeline";
import { getModule } from "../../lib/content/modules";
import { safetyEvidence, safetyQuiz } from "../../lib/content/safety";

export const metadata: Metadata = { title: "工具与安全边界" };

export default function ToolsSafetyPage() {
  const lesson = getModule("tools-safety");
  return <ModuleLesson module={lesson} visual={<SafetyPipeline />} evidence={safetyEvidence} quiz={safetyQuiz} concept={<><article><span>01 / INTENT</span><h3>Plan Mode 约束工作意图</h3><p>它主要阻止不该发生的编辑，让 Agent 在计划阶段先描述动作。但 Bash 与 MCP 并不会因此天然隔离。</p></article><article><span>02 / DECISION</span><h3>Policy 决定是否放行</h3><p>权限系统按操作类型和命令结构返回 allow、ask、reject 或 policy deny；分析不了的不透明脚本更保守。</p></article><article><span>03 / CONTAINMENT</span><h3>Sandbox 限制实际能力</h3><p>操作被允许后，OS sandbox 仍尝试收紧进程和网络能力。它依赖平台支持，因此页面会明确标出降级。</p></article></>} />;
}
