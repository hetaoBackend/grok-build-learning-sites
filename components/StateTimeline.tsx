"use client";

import { useState } from "react";
import { stateEvents, stateFiles } from "../lib/content/state";

export function StateTimeline() {
  const [active, setActive] = useState(0);
  const event = stateEvents[active];
  return (
    <div className="state-lab">
      <div className="disk-panel"><span>SESSION DIRECTORY</span>{stateFiles.map((file) => <code key={file} className={file === event.durable ? "active" : ""}>{file}<i /></code>)}</div>
      <div className="timeline-panel">
        <div className="timeline-track">{stateEvents.map((item, index) => <button key={item.id} className={`${item.color} ${index === active ? "active" : ""}`} onClick={() => setActive(index)}><span>{item.at}</span><i /><b>{item.label}</b></button>)}</div>
        <input aria-label="拖动会话时间轴" type="range" min="0" max={stateEvents.length - 1} value={active} onChange={(event) => setActive(Number(event.target.value))} />
      </div>
      <div className="state-readout" aria-live="polite"><span>CURRENT TRANSITION</span><h3>{event.label}</h3><dl><div><dt>磁盘</dt><dd>{event.durable}</dd></div><div><dt>内存</dt><dd>{event.memory}</dd></div></dl></div>
    </div>
  );
}
