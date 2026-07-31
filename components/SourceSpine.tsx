"use client";

import { useEffect, useState } from "react";
import { runtimeSteps } from "../lib/content/runtime";
import { SourceLink } from "./SourceLink";

export function SourceSpine({ compact = false, autoPlay = false }: { compact?: boolean; autoPlay?: boolean }) {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(autoPlay);
  const step = runtimeSteps[active];

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % runtimeSteps.length), 1800);
    return () => window.clearInterval(timer);
  }, [playing]);

  return (
    <div className={`source-spine ${compact ? "is-compact" : ""}`}>
      <div className="spine-topline">
        <span>LIVE EXECUTION MAP</span>
        <span>STEP {String(active + 1).padStart(2, "0")} / {String(runtimeSteps.length).padStart(2, "0")}</span>
      </div>
      <div className="spine-track" role="list" aria-label="一次 Turn 的执行步骤">
        {runtimeSteps.map((item, index) => (
          <button
            key={item.id}
            className={index === active ? "is-active" : index < active ? "is-past" : ""}
            onClick={() => { setActive(index); setPlaying(false); }}
            type="button"
            role="listitem"
            aria-current={index === active ? "step" : undefined}
          >
            <span>{item.actor}</span>
            <b>{item.label}</b>
            <i aria-hidden="true" />
          </button>
        ))}
      </div>
      <div className="spine-detail" aria-live="polite">
        <div><span className="status-pulse" aria-hidden="true" /><code>{step.state}</code></div>
        <h3>{step.label}</h3>
        <p>{step.detail}</p>
        <SourceLink source={step.source} />
      </div>
      <div className="player-controls">
        <button type="button" onClick={() => setActive((active - 1 + runtimeSteps.length) % runtimeSteps.length)} aria-label="上一步">←</button>
        <button type="button" className="play-button" onClick={() => setPlaying(!playing)}>{playing ? "暂停路径" : "播放路径"}</button>
        <button type="button" onClick={() => setActive((active + 1) % runtimeSteps.length)} aria-label="下一步">→</button>
        <button type="button" onClick={() => { setActive(0); setPlaying(false); }}>重置</button>
      </div>
    </div>
  );
}
