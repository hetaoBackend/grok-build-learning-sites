import type { Metadata } from "next";
import { ExtensionComposer } from "../../components/ExtensionComposer";
import { ModuleLesson } from "../../components/ModuleLesson";
import { extensionEvidence, extensionQuiz } from "../../lib/content/extensions";
import { getModule } from "../../lib/content/modules";

export const metadata: Metadata = { title: "扩展与多 Agent" };

export default function ExtensionsPage() {
  const lesson = getModule("extensions");
  return <ModuleLesson module={lesson} visual={<ExtensionComposer />} evidence={extensionEvidence} quiz={extensionQuiz} concept={<><article><span>01 / CONTEXT</span><h3>Skill 改变模型知道什么</h3><p>它把指令和资源带入 prompt，适合增加工作方法，不需要新建远程执行面。</p></article><article><span>02 / CAPABILITY</span><h3>MCP 与 Plugin 增加能力面</h3><p>MCP 暴露 namespaced tools；Plugin 可以打包 Skill、Agent、Hook 与 MCP，但项目来源需要显式信任。</p></article><article><span>03 / DELEGATION</span><h3>Subagent 新建子会话</h3><p>它继承父会话允许的能力交集并受深度限制。worktree 是可选隔离，不是永远成立的承诺。</p></article></>} />;
}
