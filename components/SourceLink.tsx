import { sourceUrl } from "../lib/content/source";
import type { SourceRef } from "../lib/content/types";

export function SourceLink({ source }: { source: SourceRef }) {
  return (
    <a className="source-link" href={sourceUrl(source)} target="_blank" rel="noreferrer">
      <span>{source.path}</span>
      {source.symbol ? <code>{source.symbol}</code> : null}
      <b aria-hidden="true">↗</b>
    </a>
  );
}
