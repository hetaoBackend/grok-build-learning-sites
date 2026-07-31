"use client";

import Link from "next/link";
import type { EvidenceItem, LearningModule, QuizItem } from "../lib/content/types";
import { learningModules } from "../lib/content/modules";
import { CheckpointQuiz } from "./CheckpointQuiz";
import { EvidenceCard } from "./EvidenceCard";
import { ModuleHeader } from "./ModuleHeader";
import { useProgress } from "./ProgressProvider";

export function ModuleLesson({
  module,
  visual,
  concept,
  evidence,
  quiz,
}: {
  module: LearningModule;
  visual: React.ReactNode;
  concept: React.ReactNode;
  evidence: EvidenceItem[];
  quiz: QuizItem[];
}) {
  const { completed, markComplete } = useProgress();
  const done = completed.includes(module.slug);
  const next = learningModules.find((item) => item.slug === module.next);

  return (
    <div className="module-page">
      <ModuleHeader module={module} />
      <section className="lab-stage" aria-label={`${module.label}交互实验`}>{visual}</section>

      <section className="lesson-section concept-section">
        <div className="section-heading"><span>CONCEPT</span><h2>先建立一个可用的心智模型</h2></div>
        <div className="prose-grid">{concept}</div>
      </section>

      <section className="lesson-section">
        <div className="section-heading"><span>EVIDENCE</span><h2>回到固定版本的源码</h2></div>
        <div className="evidence-grid">{evidence.map((item) => <EvidenceCard key={item.title} item={item} />)}</div>
      </section>

      <section className="lesson-section quiz-section">
        <div className="section-heading"><span>CHECKPOINT</span><h2>不用背，试着解释</h2></div>
        <CheckpointQuiz items={quiz} />
      </section>

      <section className="module-finish">
        <div><span>MODULE {module.index}</span><h2>{done ? "这一站已经点亮" : "完成后，点亮这一站"}</h2></div>
        <button type="button" className="complete-button" onClick={() => markComplete(module.slug)} disabled={done}>
          {done ? "已完成" : "标记为已完成"}
        </button>
        {next ? <Link className="next-module" href={`/${next.slug}`}><span>下一站</span><b>{next.label} →</b></Link> : <Link className="next-module" href="/"><span>回到</span><b>学习驾驶舱 →</b></Link>}
      </section>
    </div>
  );
}
