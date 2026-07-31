"use client";

import { useMemo, useState } from "react";
import { architectureGroups, readingRoute } from "../lib/content/architecture";

export function ArchitectureExplorer() {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("全部");
  const visible = useMemo(() => architectureGroups
    .filter((item) => group === "全部" || item.name === group)
    .map((item) => ({ ...item, crates: item.crates.filter((crate) => crate.includes(query.toLowerCase())) })), [query, group]);

  return (
    <div className="architecture-explorer">
      <div className="explorer-toolbar">
        <label><span>SEARCH CRATES</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="例如：sampler" /></label>
        <div className="filter-row"><button className={group === "全部" ? "active" : ""} onClick={() => setGroup("全部")}>全部</button>{architectureGroups.map((item) => <button key={item.name} className={group === item.name ? "active" : ""} onClick={() => setGroup(item.name)}>{item.name}</button>)}</div>
      </div>
      <div className="crate-map">
        {visible.map((item) => <section key={item.name} className={`crate-group tone-${item.tone}`}><div><span>{String(item.crates.length).padStart(2, "0")}</span><h3>{item.name}</h3></div><ul>{item.crates.map((crate) => <li key={crate}><i />{crate}</li>)}</ul></section>)}
      </div>
      <div className="reading-route"><div><span>MINIMUM READING TRACE</span><h3>先读这 8 个 crate</h3></div><ol>{readingRoute.map((crate, index) => <li key={crate}><span>{index + 1}</span><code>{crate}</code></li>)}</ol></div>
    </div>
  );
}
