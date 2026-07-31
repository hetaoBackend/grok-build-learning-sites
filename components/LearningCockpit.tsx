"use client";

import { learningModules } from "../lib/content/modules";
import { SOURCE_SHORT } from "../lib/content/source";
import { useProgress } from "./ProgressProvider";
import { SourceSpine } from "./SourceSpine";

const routes = [
  { role: "我想理解 Agent", path: "架构地图 → Turn 生命周期", href: "/map" },
  { role: "我想改工具系统", path: "工具安全 → 状态恢复", href: "/tools-safety" },
  { role: "我想接新界面", path: "多界面 → ACP", href: "/interfaces" },
  { role: "我想开发扩展", path: "Plugin / MCP → Subagent", href: "/extensions" },
];

export function LearningCockpit() {
  const { completed, percent } = useProgress();
  const resume = learningModules.find((module) => !completed.includes(module.slug)) ?? learningModules[0];

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-copy">
          <div className="hero-kicker"><span>GROK-BUILD / SOURCE LAB</span><span>rev {SOURCE_SHORT}</span></div>
          <h1>把一次 Turn<br /><em>拆开来看。</em></h1>
          <p>不是 README 翻译，也不是 crate 清单。沿一条真实执行路径，理解 Grok coding agent 怎样采样、调用工具、保存状态并扩展能力。</p>
          <div className="hero-actions">
            <a className="primary-action" href={`/${resume.slug}`}>{percent ? "继续学习" : "从架构地图开始"}<span>↗</span></a>
            <a className="text-action" href="#modules">查看六个专题 ↓</a>
          </div>
        </div>
        <div className="hero-seal" aria-label="研究范围">
          <span>77</span><b>CRATES</b><i />
          <small>ONE RUNTIME<br />SIX LENSES</small>
        </div>
      </section>

      <section className="home-spine">
        <SourceSpine autoPlay />
      </section>

      <section className="manifesto-strip" aria-label="内容可信度图例">
        <span><i className="dot fact" />源码事实</span>
        <span><i className="dot interpretation" />教学解释</span>
        <span><i className="dot boundary" />已知边界</span>
        <p>每个结论都告诉你：它来自哪里，以及它没有保证什么。</p>
      </section>

      <section id="modules" className="home-section">
        <div className="home-section-title"><span>LEARNING MODULES</span><h2>六个问题，拼成一个系统</h2><p>推荐按 A → F 学习；每一站也能独立阅读。</p></div>
        <div className="module-grid">
          {learningModules.map((module) => {
            const done = completed.includes(module.slug);
            return (
              <a key={module.slug} href={`/${module.slug}`} className={`module-card accent-${module.accent}`}>
                <div className="card-top"><span>{module.index}</span><i>{done ? "DONE" : module.duration}</i></div>
                <p>{module.label}</p>
                <h3>{module.title}</h3>
                <div className="card-path"><i /><i /><i /><i /></div>
                <small>{module.summary}</small>
                <b>进入专题 <span>↗</span></b>
              </a>
            );
          })}
        </div>
      </section>

      <section className="home-section role-section">
        <div className="home-section-title"><span>CHOOSE A TRACE</span><h2>从你要解决的问题进入</h2></div>
        <div className="role-grid">
          {routes.map((route, index) => <a key={route.role} href={route.href}><span>0{index + 1}</span><h3>{route.role}</h3><p>{route.path}</p><b>→</b></a>)}
        </div>
      </section>
    </div>
  );
}
