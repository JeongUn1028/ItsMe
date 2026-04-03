"use client";

import Link from "next/link";
import style from "./page.module.css";
import { getResume } from "@/lib/resume/getResume";
import { useActionState, useEffect, useState } from "react";
import { submitResumeAction } from "@/app/actions/submit-resume";

//* Resume Edit Page
export default function Page() {
  const [resume, setResume] = useState<{
    description: string;
    skills: string[];
  }>({ description: "", skills: [] });

  const [state, formAction, isPending] = useActionState(submitResumeAction, {
    success: null,
    message: "",
  });

  useEffect(() => {
    const { description, skills } = getResume();
    setResume({ description, skills });
  }, []);

  return (
    <div className={style.container}>
      <div className={style.header}>
        <h1 className={style.title}>레주메 수정</h1>
        <Link href="/admin" className={style.backLink}>
          돌아가기
        </Link>
      </div>

      <form className={`${style.form} glass`} action={formAction}>
        <div className={style.fieldGroup}>
          <label className={style.label}>자기소개</label>
          <textarea
            className={style.textarea}
            placeholder="자신을 소개하는 글을 작성해주세요."
            maxLength={500}
            defaultValue={resume.description}
            name="description"
          />
          <span className={style.hint}>마크다운 형식을 지원합니다.</span>
        </div>

        <div className={style.fieldGroup}>
          <label className={style.label}>기술 스택</label>
          <input
            type="text"
            className={style.input}
            placeholder="React, Next.js, TypeScript (쉼표로 구분)"
            defaultValue={resume.skills.join(", ")}
            name="skills"
          />
          <span className={style.hint}>
            기술 스택을 쉼표로 구분하여 입력하세요.
          </span>
        </div>

        {state.message && (
          <div
            className={
              state.success
                ? `${style.alert} ${style.alertSuccess}`
                : `${style.alert} ${style.alertError}`
            }
          >
            {state.message}
          </div>
        )}

        <div className={style.actions}>
          <button
            type="submit"
            className={style.saveButton}
            disabled={isPending}
          >
            {isPending ? "저장 중..." : "저장"}
          </button>
          <Link href="/admin" className={style.cancelLink}>
            취소
          </Link>
        </div>
      </form>
    </div>
  );
}
