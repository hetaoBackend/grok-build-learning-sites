"use client";

import { useState } from "react";
import { safetyGates, safetyScenarios } from "../lib/content/safety";

export function SafetyPipeline() {
  const [selected, setSelected] = useState(safetyScenarios[0].id);
  const scenario = safetyScenarios.find((item) => item.id === selected) ?? safetyScenarios[0];
  const stateClass = scenario.result === "拒绝" ? "deny" : scenario.result === "询问" ? "ask" : "allow";

  return (
    <div className="safety-lab">
      <div className="scenario-tabs" role="tablist" aria-label="工具调用场景">{safetyScenarios.map((item) => <button role="tab" aria-selected={selected === item.id} key={item.id} onClick={() => setSelected(item.id)}>{item.label}</button>)}</div>
      <div className="tool-packet"><span>TOOL CALL</span><code>{scenario.tool}</code><b className={stateClass}>{scenario.result}</b></div>
      <div className="gate-track">{safetyGates.map((gate, index) => <div key={gate} className={scenario.outcomes[index] === "deny" || scenario.outcomes[index] === "blocked" ? "is-blocked" : ""}><span>{String(index + 1).padStart(2, "0")}</span><b>{gate}</b><code>{scenario.outcomes[index]}</code><i /></div>)}</div>
      <p className="lab-note"><b>读法：</b>每一道门只回答自己的问题。Plan、Policy、Hook 和 Sandbox 不是四个名字相近的开关。</p>
    </div>
  );
}
