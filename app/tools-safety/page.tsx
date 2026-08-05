import type { Metadata } from "next";
import { ModuleLesson } from "../../components/ModuleLesson";
import { SafetyPipeline } from "../../components/SafetyPipeline";
import { getModule } from "../../lib/content/modules";
import { safetyEvidence, safetyQuiz } from "../../lib/content/safety";

export const metadata: Metadata = { title: "工具与安全边界" };

export default function ToolsSafetyPage() {
  const lesson = getModule("tools-safety");
  return (
    <ModuleLesson
      module={lesson}
      visual={<SafetyPipeline />}
      evidence={safetyEvidence}
      quiz={safetyQuiz}
      concept={
        <>
          <article>
            <span>01 / MODEL</span>
            <h3>安全不是一个总开关</h3>
            <p>从模型产生 tool call 到副作用真正发生，中间经过多个职责不同的检查层。Plan Mode 约束当前工作意图，Hook 观察或阻断事件，Permission Policy 作授权决策，ToolBridge 找到执行器，OS Sandbox 再限制进程实际能触及的资源。</p>
            <p>这些层可以叠加，却不能互相冒充。看到某一层“通过”，只表示它负责的条件满足了，并不代表整个调用已经无条件安全。</p>
          </article>
          <article>
            <span>02 / INTENT</span>
            <h3>Plan Mode 管的是“现在该不该改”</h3>
            <p>计划阶段的核心承诺是先分析和描述，再进入实现。因此 edit gate 会拦截编辑类操作，避免 Agent 一边声称只做方案，一边直接改变项目文件。这是一层工作流约束，而不是操作系统级隔离。</p>
            <p>Bash 可能间接写文件，MCP 也可能调用远端有副作用的能力；它们并不会因为 Plan Mode 开启就自动变成只读。判断安全边界时，必须继续看权限和执行环境。</p>
          </article>
          <article>
            <span>03 / DECISION</span>
            <h3>Policy 把调用翻译成授权问题</h3>
            <p>权限系统不会只返回“是或否”。它先识别 Read、Grep、Edit、Bash、MCP、Web 等操作类型，再结合策略得到 Allow、Ask、Reject 或 PolicyDeny。Ask 把高影响但可能合理的选择交给用户，Reject 与 PolicyDeny 则表达不同来源的拒绝。</p>
            <p>对于 shell，策略会尽量拆分和分析命令结构。若脚本经过包装、动态拼接或无法透明解析，系统不能可靠证明它只做了什么，于是更倾向于询问，而不是乐观猜测。</p>
          </article>
          <article>
            <span>04 / EXECUTION</span>
            <h3>Hook、Dispatch 与 Sandbox 各守一段</h3>
            <p>Hook 可以在事件边界加入组织规则或审计逻辑，显式 deny 能阻断调用；但 Hook 处理器自身失败时采用 fail-open，避免扩展故障让主系统完全不可用。Dispatch 随后解析具体工具并把调用送到本地或远端执行面。</p>
            <p>对本地进程，OS Sandbox 尝试收紧文件、进程和网络能力。它依赖平台特性，无法建立时可能降级；而远端 MCP 工具本就在本地沙箱之外，更要依赖服务端信任与权限决策。</p>
          </article>
          <article>
            <span>05 / OUTCOME</span>
            <h3>用真实结果，而不是层数判断风险</h3>
            <p>读取文件通常一路通过并在受限环境中执行；Plan Mode 编辑会提前被 gate 拒绝；不透明 Bash 可能停在 Ask；并行工具组则会按单个调用分别决策、执行并合并结果。exit-plan 一类改变控制状态的调用还会被移动到批次尾部。</p>
            <p>检查一个新工具时，最实用的方法是沿管线逐层回答：谁识别它、谁授权它、在哪里执行、失败时默认放行还是阻断、结果如何记录。少回答任何一个，安全结论都可能过度乐观。</p>
          </article>
        </>
      }
    />
  );
}
