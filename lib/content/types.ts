export type EvidenceKind = "fact" | "interpretation" | "boundary";

export interface SourceRef {
  path: string;
  line?: number;
  symbol?: string;
}

export interface EvidenceItem {
  kind: EvidenceKind;
  title: string;
  text: string;
  source?: SourceRef;
}

export interface QuizItem {
  question: string;
  answer: string;
}

export interface LearningModule {
  slug: "map" | "runtime" | "tools-safety" | "state" | "interfaces" | "extensions";
  index: string;
  label: string;
  title: string;
  thesis: string;
  summary: string;
  duration: string;
  accent: "signal" | "memory" | "caution";
  next?: string;
}

export interface RuntimeStep {
  id: string;
  actor: string;
  label: string;
  detail: string;
  state: string;
  source: SourceRef;
}
