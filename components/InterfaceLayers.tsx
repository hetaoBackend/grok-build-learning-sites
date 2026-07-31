"use client";

import { useState } from "react";
import { interfaceModes, sharedLayers } from "../lib/content/interfaces";

export function InterfaceLayers() {
  const [selected, setSelected] = useState(interfaceModes[0].id);
  const mode = interfaceModes.find((item) => item.id === selected) ?? interfaceModes[0];
  return (
    <div className="interface-lab">
      <div className="shell-tabs">{interfaceModes.map((item) => <button key={item.id} className={selected === item.id ? "active" : ""} onClick={() => setSelected(item.id)}>{item.label}</button>)}</div>
      <div className="shell-adapter"><div><span>INPUT</span><code>{mode.input}</code></div><div className="adapter-core"><span>ADAPTER</span><h3>{mode.adapter}</h3></div><div><span>OUTPUT</span><code>{mode.output}</code></div></div>
      <div className="shared-stack"><span>SHARED RUNTIME — SWITCHING THE SHELL DOES NOT REPLACE THESE</span>{sharedLayers.map((layer) => <div key={layer}><i />{layer}<i /></div>)}</div>
    </div>
  );
}
