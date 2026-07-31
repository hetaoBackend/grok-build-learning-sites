"use client";

import Link from "next/link";
import { learningModules } from "../lib/content/modules";
import { SOURCE_DATE, SOURCE_REPOSITORY, SOURCE_SHORT } from "../lib/content/source";
import { useProgress } from "./ProgressProvider";

export function LearningShell({ children }: { children: React.ReactNode }) {
  const { completed, percent } = useProgress();

  return (
    <div className="site-shell">
      <a className="skip-link" href="#content">跳到正文</a>
      <header className="topbar">
        <Link className="brand" href="/" aria-label="返回学习驾驶舱首页">
          <span className="brand-mark">G/B</span>
          <span>源码学习驾驶舱</span>
        </Link>
        <nav className="module-rail" aria-label="六个学习专题">
          {learningModules.map((module) => (
            <a
              key={module.slug}
              href={`/${module.slug}`}
              className={completed.includes(module.slug) ? "is-complete" : ""}
              title={module.label}
            >
              <span>{module.index}</span>
              <i aria-hidden="true" />
            </a>
          ))}
        </nav>
        <div className="progress-readout" aria-label={`学习进度 ${percent}%`}>
          <span>{percent}%</span>
          <div><i style={{ width: `${percent}%` }} /></div>
        </div>
      </header>

      <main id="content">{children}</main>

      <footer className="site-footer">
        <div>
          <span className="footer-kicker">SOURCE LOCK</span>
          <a href={`${SOURCE_REPOSITORY}/commit/${SOURCE_SHORT}`} target="_blank" rel="noreferrer">
            {SOURCE_SHORT} · {SOURCE_DATE}
          </a>
        </div>
        <p>技术陈述固定到源码基线；“解释”是教学归纳，“边界”保留降级与回退行为。</p>
        <a href={SOURCE_REPOSITORY} target="_blank" rel="noreferrer">查看官方仓库 ↗</a>
      </footer>
    </div>
  );
}
