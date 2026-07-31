"use client";

import { useState } from "react";
import type { QuizItem } from "../lib/content/types";

export function CheckpointQuiz({ items }: { items: QuizItem[] }) {
  const [open, setOpen] = useState<number[]>([]);
  const toggle = (index: number) =>
    setOpen((current) => current.includes(index) ? current.filter((item) => item !== index) : [...current, index]);

  return (
    <div className="quiz-list">
      {items.map((item, index) => {
        const visible = open.includes(index);
        return (
          <article className="quiz-item" key={item.question}>
            <span className="quiz-count">0{index + 1}</span>
            <h3>{item.question}</h3>
            <button type="button" aria-expanded={visible} onClick={() => toggle(index)}>
              {visible ? "收起答案" : "检验理解"}
            </button>
            {visible ? <p>{item.answer}</p> : null}
          </article>
        );
      })}
    </div>
  );
}
