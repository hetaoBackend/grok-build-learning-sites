import type { EvidenceItem } from "../lib/content/types";
import { SourceLink } from "./SourceLink";

const labels = { fact: "源码事实", interpretation: "教学解释", boundary: "已知边界" };

export function EvidenceCard({ item }: { item: EvidenceItem }) {
  return (
    <article className={`evidence-card evidence-${item.kind}`}>
      <div className="evidence-label"><i aria-hidden="true" />{labels[item.kind]}</div>
      <h3>{item.title}</h3>
      <p>{item.text}</p>
      {item.source ? <SourceLink source={item.source} /> : null}
    </article>
  );
}
