"use client";

import style from "../page.module.css";

interface DescriptionSectionProps {
  description: string;
}

export function DescriptionSection({ description }: DescriptionSectionProps) {
  return (
    <div className={style.fieldGroup}>
      <label className={style.label}>자기소개</label>
      <textarea
        className={style.textarea}
        placeholder="자신을 소개하는 글을 작성해주세요."
        maxLength={500}
        defaultValue={description}
        name="description"
      />
      <span className={style.hint}>마크다운 형식을 지원합니다.</span>
    </div>
  );
}
