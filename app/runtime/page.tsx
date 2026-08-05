import type { Metadata } from "next";
import { ModuleLesson } from "../../components/ModuleLesson";
import { SourceSpine } from "../../components/SourceSpine";
import { getModule } from "../../lib/content/modules";
import { runtimeEvidence, runtimeQuiz } from "../../lib/content/runtime";

export const metadata: Metadata = { title: "一次 Turn 的生命周期" };

export default function RuntimePage() {
  const lesson = getModule("runtime");
  return (
    <ModuleLesson
      module={lesson}
      visual={<SourceSpine />}
      evidence={runtimeEvidence}
      quiz={runtimeQuiz}
      concept={
        <>
          <article>
            <span>01 / TURN</span>
            <h3>Turn 不是一次模型请求</h3>
            <p>在 grok-build 里，一次 Turn 从用户输入开始，到系统得到一个不再要求调用工具的 assistant item 才结束。中间可能经历多次模型采样、多个工具调用和若干状态写入。因此，“模型返回了内容”和“本轮已经完成”是两件不同的事。</p>
            <p>把 Turn 理解成一个受控循环，比把它理解成问答接口更准确：模型负责提出下一步，运行时负责执行、记录并把结果重新交给模型判断。</p>
          </article>
          <article>
            <span>02 / SERIAL</span>
            <h3>Session Actor 守住因果顺序</h3>
            <p>Session Actor 像一位只服务当前会话的记录员。Prompt、assistant item、tool result、取消与持久化通知都必须按确定顺序改变 ChatState，否则模型可能看到尚未落盘的结果，或让后到的命令越过前一个工具调用。</p>
            <p>串行并不意味着整个程序只能做一件事。它只约束同一会话的状态推进，让“先发生什么、后发生什么”始终可以解释和重放。</p>
          </article>
          <article>
            <span>03 / PREPARE</span>
            <h3>采样前先组装真正的请求</h3>
            <p><code>handle_prompt</code> 并不是把字符串原样转发给模型。它还要识别 slash command、Skill 和 workflow 等上下文；随后 <code>process_conversation_turn</code> 根据 ChatState 构建消息、准备工具定义，并处理当前会话的控制条件。</p>
            <p>所以模型看见的请求，是用户输入、历史状态、系统指令和当前能力共同组装出的结果。排查“模型为什么这样回答”时，应先检查请求构建，而不是只盯着最后一条 Prompt。</p>
          </article>
          <article>
            <span>04 / CONCURRENT</span>
            <h3>Sampler 并发，但不破坏会话语义</h3>
            <p>Sampler 是共享 Actor，会为具体请求启动可取消任务。不同会话的请求因此可以同时在途，重试、空响应恢复和 doom-loop 恢复也由请求任务处理；而结果回到各自 Session 后，仍按该会话的顺序被消费。</p>
            <p>取消信号同样落在这层：它停止正在进行的采样任务，却不等于随意抹掉此前已经写入的会话事实。并发负责吞吐，Session 顺序负责一致性，两者分工明确。</p>
          </article>
          <article>
            <span>05 / LOOP</span>
            <h3>Tool Result 决定是否再转一圈</h3>
            <p>如果模型返回普通 assistant item，Turn 可以收束；如果返回 tool call，调用会进入准备、权限、分发和 post-flight 管线。执行结果作为新的消息追加到 ChatState，成为下一次采样可以观察的材料。</p>
            <p>这个循环可能被取消、权限拒绝、todo gate、action-stationarity 保护或 compaction 旁路影响。理解主循环后，这些机制就不再像零散特例，而是对“继续、暂停、恢复或结束”的不同控制分支。</p>
          </article>
        </>
      }
    />
  );
}
