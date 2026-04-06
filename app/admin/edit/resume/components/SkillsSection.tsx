"use client";

import style from "../page.module.css";

interface SkillsSectionProps {
  skills: string[];
}

export function SkillsSection({ skills }: SkillsSectionProps) {
  return (
    <div className={style.fieldGroup}>
      <label className={style.label}>기술 스택</label>
      <input
        type="text"
        className={style.input}
        placeholder="React, Next.js, TypeScript (쉼표로 구분)"
        defaultValue={skills.join(", ")}
        name="skills"
      />
      <span className={style.hint}>
        기술 스택을 쉼표로 구분하여 입력하세요.
      </span>
    </div>
  );
}
