import type { Metadata } from "next";
import { InterfaceLayers } from "../../components/InterfaceLayers";
import { ModuleLesson } from "../../components/ModuleLesson";
import { interfaceEvidence, interfaceQuiz } from "../../lib/content/interfaces";
import { getModule } from "../../lib/content/modules";

export const metadata: Metadata = { title: "一种内核，多种外壳" };

export default function InterfacesPage() {
  const lesson = getModule("interfaces");
  return (
    <ModuleLesson
      module={lesson}
      visual={<InterfaceLayers />}
      evidence={interfaceEvidence}
      quiz={interfaceQuiz}
      concept={
        <>
          <article>
            <span>01 / SEPARATION</span>
            <h3>先把“怎么交流”和“怎么推理”分开</h3>
            <p>TUI、Headless、Agent Server、Leader 与 ACP 看起来像五种产品形态，但它们首先是五种输入输出外壳。键盘事件、stdin、协议请求或委派任务进入后，最终仍要被翻译成共享会话能够处理的命令；输出也要从同一批运行时事件映射成屏幕、结构化结果或协议消息。</p>
            <p>这层分离让内核语义不会随着界面数量一起复制。新增外壳时，核心问题通常不是重写 Agent，而是设计可靠的适配与事件消费方式。</p>
          </article>
          <article>
            <span>02 / ROUTING</span>
            <h3>入口先选模式，再组装共享依赖</h3>
            <p>二进制入口解析命令与配置后，分发到 TUI、headless、leader 或 stdio agent 等运行路径。不同路径会建立不同的输入源、输出消费者和生命周期控制，但都会继续依赖 Session、Sampler、Tools、Permission 与 Workspace。</p>
            <p>阅读入口分支时，不要只记录有哪些子命令；更值得观察的是每个分支新增了什么适配器，以及哪些对象在所有模式下都被复用。</p>
          </article>
          <article>
            <span>03 / CORE</span>
            <h3>共享内核维持同一套 Turn 语义</h3>
            <p>无论 Prompt 来自终端还是协议网关，Session Actor 仍负责状态顺序，ChatState 仍承载会话上下文，Sampler 仍执行模型请求，工具与权限仍控制副作用，Workspace 仍保存环境与文件状态。</p>
            <p>所以从 TUI 切换到 Headless，不应改变“tool result 会触发下一轮采样”这类核心规则。若不同外壳出现行为差异，优先检查适配层是否丢失、重排或重复消费了事件。</p>
          </article>
          <article>
            <span>04 / PRESSURE</span>
            <h3>外壳真正不同的是背压和生命周期</h3>
            <p>TUI 同时面对高速 token stream、键盘输入、后台任务、writer ack 和状态更新。事件循环使用带偏向的 <code>tokio::select!</code>，再配合批处理与节流，避免持续输出让用户输入长期饥饿，也避免每个 token 都触发昂贵重绘。</p>
            <p>协议外壳的压力形态不同：它更关心 channel 关闭、请求关联、事件序列化和客户端消费速度。共享内核并不会自动解决这些 I/O 层问题，每个外壳仍需明确自己的背压策略。</p>
          </article>
          <article>
            <span>05 / PROTOCOL</span>
            <h3>ACP 是适配层，不是第二套 Agent</h3>
            <p>ACP 提供 channel、gateway 和协议对象之间的转换，让外部客户端能够驱动共享运行时。它规定消息如何进出，却不接管 conversation turn 的状态机，也不替代 shell/session 对状态、工具和持久化的管理。</p>
            <p>判断一个新协议应该放在哪里，可以看它是否只改变传输和事件表达。如果它开始复制 ChatState、工具循环或权限决策，边界多半已经放错了。</p>
          </article>
        </>
      }
    />
  );
}
