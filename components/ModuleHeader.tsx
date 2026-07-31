import type { LearningModule } from "../lib/content/types";
import { SOURCE_SHORT } from "../lib/content/source";

export function ModuleHeader({ module }: { module: LearningModule }) {
  return (
    <header className={`module-header accent-${module.accent}`}>
      <div className="module-index" aria-hidden="true">{module.index}</div>
      <div className="module-title-wrap">
        <div className="eyebrow">
          <span>MODULE {module.index}</span>
          <span>{module.duration}</span>
          <span>rev {SOURCE_SHORT}</span>
        </div>
        <p className="module-label">{module.label}</p>
        <h1>{module.title}</h1>
        <p className="module-thesis">{module.thesis}</p>
      </div>
    </header>
  );
}
