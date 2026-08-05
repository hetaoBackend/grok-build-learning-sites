import type { Metadata } from "next";
import { ExtensionComposer } from "../../components/ExtensionComposer";
import { ModuleLesson } from "../../components/ModuleLesson";
import { extensionEvidence, extensionQuiz } from "../../lib/content/extensions";
import { getModule } from "../../lib/content/modules";

export const metadata: Metadata = { title: "扩展与多 Agent" };

export default function ExtensionsPage() {
  const lesson = getModule("extensions");
  return (
    <ModuleLesson
      module={lesson}
      visual={<ExtensionComposer />}
      evidence={extensionEvidence}
      quiz={extensionQuiz}
      concept={
        <>
          <article>
            <span>01 / MODEL</span>
            <h3>先问能力进入系统的哪一层</h3>
            <p>Skill、Plugin、Hook、MCP 和 Subagent 都能让系统“多会一点”，但它们改变的平面完全不同：有的增加 prompt 上下文，有的注册工具，有的监听事件，还有的创建一条独立子会话。只按功能名称比较，容易忽略它们带来的执行面和信任成本。</p>
            <p>选择扩展机制前，先确定需要改变的是模型知识、可调用能力、运行时事件还是任务并行度。入口层越靠近真实副作用，越需要明确权限、失败模式和隔离边界。</p>
          </article>
          <article>
            <span>02 / CONTEXT</span>
            <h3>Skill 改变模型知道什么、按什么方法做</h3>
            <p>Skill 主要把指令与配套资源带入 prompt，适合封装工作方法、领域规范和可复用流程。它不必新建远程执行面，因此当目标只是“教模型如何处理某类任务”时，通常比新增工具更轻。</p>
            <p>同名 Skill 可能来自 local、repo、user、配置或服务端、bundled 等来源，解析存在优先级，并支持 plugin-qualified 名称。阅读最终 prompt 时，要同时确认内容和来源，避免把覆盖结果误认为唯一版本。</p>
          </article>
          <article>
            <span>03 / PACKAGE</span>
            <h3>Plugin 是分发容器，信任决定能启用多少</h3>
            <p>Plugin 可以打包 Skills、Agents、Hooks、MCP 与 scripts，把多种扩展作为一个单元发现和安装。它本身不是单一执行机制，而是把若干入口组织在一起，因此信任判断必须覆盖包内可能启动的主动能力。</p>
            <p>未信任的项目插件仍可暴露较低风险的 skills/agents 元数据，但 hooks、MCP 和 scripts 会被阻止。信任绑定 canonical plugin root，目的在于让授权对应确定位置，而不是只相信一个可碰撞或可移动的显示名称。</p>
          </article>
          <article>
            <span>04 / CAPABILITY</span>
            <h3>Hook 进入事件，MCP 进入工具目录</h3>
            <p>Hook 适合在运行时事件前后做观察、审计或显式阻断。它可以影响控制流，但处理器自身失败采用 fail-open，因此不能把 Hook 当作唯一安全边界。MCP 则通过 transport 连接外部服务，把能力作为 namespaced tools 暴露给模型。</p>
            <p>MCP 还涉及 OAuth、连接存活、工具搜索、调用与大输出收敛。它把能力扩展到进程甚至机器之外，本地 OS sandbox 未必覆盖远端副作用，所以服务端信任与逐次权限决策同样重要。</p>
          </article>
          <article>
            <span>05 / DELEGATION</span>
            <h3>Subagent 扩展的是执行主体</h3>
            <p>Subagent 不是往当前 prompt 再塞一段说明，而是创建子会话，把任务交给另一个 Agent 上下文推进。它继承的是父会话允许能力的交集，并受递归深度等限制，避免子会话无限扩大权限或继续无界派生。</p>
            <p>隔离 worktree 是可请求的能力，不是绝对保证。创建失败时实现可能回退到共享 workspace；调用方若把物理隔离当作前提，就必须检查实际结果而不能只相信配置意图。委派提高并行度，也会增加状态协调和失败恢复成本。</p>
          </article>
        </>
      }
    />
  );
}
