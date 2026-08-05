import type { Metadata } from "next";
import { ArchitectureExplorer } from "../../components/ArchitectureExplorer";
import { ModuleLesson } from "../../components/ModuleLesson";
import { architectureEvidence, architectureQuiz } from "../../lib/content/architecture";
import { getModule } from "../../lib/content/modules";

export const metadata: Metadata = { title: "架构地图：77 个 crate，不必从头读" };

export default function MapPage() {
  const lesson = getModule("map");
  return (
    <ModuleLesson
      module={lesson}
      visual={<ArchitectureExplorer />}
      evidence={architectureEvidence}
      quiz={architectureQuiz}
      concept={
        <>
          <article>
            <span>01 / ORIENTATION</span>
            <h3>先把仓库看成一张职责地图</h3>
            <p>面对 77 个 crate，最容易犯的错是把目录树当成架构图：从第一个名字开始逐个打开，读了很多局部实现，却仍然不知道一次请求从哪里进入、在哪里改变状态、又在哪里产生副作用。更有效的做法，是先按职责把仓库压缩成入口与界面、会话与 Agent、采样与模型、工具与权限、工作区与状态、扩展协议六个区域。</p>
            <p>这些区域不是 Cargo 强制规定的层级，而是一张用于导航的教学地图。它的价值不在于把每个 crate 永久归类，而在于让你遇到一个符号时，能先判断它正在回答哪类问题。</p>
          </article>
          <article>
            <span>02 / ENTRY</span>
            <h3>从组合根确认系统如何启动</h3>
            <p><code>xai-grok-pager-bin</code> 是信息密度最高的起点。它解析命令和运行模式，并把 UI、会话、权限、沙箱与工作区等部件组装起来。入口文件本身未必包含复杂算法，但它会告诉你有哪些运行形态，以及每种形态最终复用了哪些底层能力。</p>
            <p>这也解释了为什么不应该直接从体量最大的 crate 开读：大型 crate 往往混合了实现、适配和测试，而组合根展示的是系统实际选择依赖的方式。</p>
          </article>
          <article>
            <span>03 / KERNEL</span>
            <h3>沿一条 Turn 主链建立骨架</h3>
            <p>确认入口后，沿 <code>shell → sampler → tools → workspace</code> 追踪一次 Turn。Shell 维护会话顺序与 ChatState，Sampler 负责模型请求，Tools 把模型意图转换成可执行调用，Workspace 则承接权限、文件状态和真实环境。</p>
            <p>先走通这条链，你会获得一副可以挂载细节的骨架。以后看到 compaction、hook 或 MCP，不必重新理解整套系统，只需要判断它接入主链的哪个位置、改变了哪一种状态。</p>
          </article>
          <article>
            <span>04 / EDGES</span>
            <h3>再读界面和扩展边缘</h3>
            <p>TUI、Headless 与 ACP 主要改变输入输出和事件适配；MCP、Hook、Plugin 与 Skill 则分别进入工具、事件、发现和 prompt 等不同平面。它们都很重要，但如果先读协议细节，很容易误以为每种外壳或扩展都拥有一套独立 Agent 内核。</p>
            <p>判断边缘模块时可以固定问三个问题：它从哪里进入系统？它能影响 prompt、状态还是副作用？失败时是阻断、降级还是回退？这三个问题通常比 API 列表更接近架构本质。</p>
          </article>
          <article>
            <span>05 / ROUTE</span>
            <h3>用最小路线验证理解</h3>
            <p>推荐路线不是“读完八个 crate”，而是带着同一个问题横穿八个锚点：一个 Prompt 如何进入、被采样、调用工具并写回状态。每到一个 crate，只读足以回答当前问题的入口、核心类型和分支条件，然后继续向下游移动。</p>
            <p>走完一圈后再返回感兴趣的区域深挖。此时目录不再是一长串陌生名字，而是一组已经知道上下游关系的实现选择。</p>
          </article>
        </>
      }
    />
  );
}
