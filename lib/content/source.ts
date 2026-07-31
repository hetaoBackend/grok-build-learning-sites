import type { SourceRef } from "./types";

export const SOURCE_REVISION = "dd04f397b1d02f2272b092555669dfba1f01bc85";
export const SOURCE_SHORT = SOURCE_REVISION.slice(0, 8);
export const SOURCE_REPOSITORY = "https://github.com/xai-org/grok-build";
export const SOURCE_BLOB_ROOT =
  "https://github.com/xai-org/grok-build/blob/dd04f397b1d02f2272b092555669dfba1f01bc85";
export const SOURCE_DATE = "2026-07-30";

export function sourceUrl(source: SourceRef | string): string {
  const ref = typeof source === "string" ? { path: source } : source;
  const line = ref.line ? `#L${ref.line}` : "";
  return `${SOURCE_BLOB_ROOT}/${ref.path}${line}`;
}
