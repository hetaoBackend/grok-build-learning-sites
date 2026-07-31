"use client";

import { useState } from "react";
import { extensionKinds } from "../lib/content/extensions";

export function ExtensionComposer() {
  const [selected, setSelected] = useState(extensionKinds[0].id);
  const extension = extensionKinds.find((item) => item.id === selected) ?? extensionKinds[0];
  return (
    <div className="extension-lab">
      <div className="extension-picker"><span>CHOOSE CAPABILITY SOURCE</span>{extensionKinds.map((item) => <button key={item.id} className={selected === item.id ? "active" : ""} onClick={() => setSelected(item.id)}><i />{item.label}<b>→</b></button>)}</div>
      <div className="extension-route">
        <div className="extension-node source"><span>SOURCE</span><h3>{extension.label}</h3><code>{extension.payload}</code></div>
        <div className="route-line"><i /><span>enters</span><i /></div>
        <div className="extension-node target"><span>SYSTEM SURFACE</span><h3>{extension.enters}</h3><code>{extension.trust}</code></div>
      </div>
      <div className="extension-readout"><span>TRUST NOTE</span><p>{extension.note}</p></div>
    </div>
  );
}
