"use client";

import Link from "next/link";
import { createPortfolio } from "@/app/actions/create-portfolio.action";
import style from "./WritePortfolioForm.module.css";
import { useActionState } from "react";

export default function WritePortfolioForm() {
  const [state, formAction, isPending] = useActionState(createPortfolio, {
    success: null,
    message: "",
  });
  return (
    <section className={style.viewport}>
      <article className={style.panel}>
        <header className={style.header}>
          <div className={style.headerTop}>
            <Link href="/admin" className={style.backLink}>
              관리자 홈
            </Link>
            <span className={style.statusChip}>new draft</span>
          </div>

          <h1 className={style.title}>포트폴리오 작성</h1>
          <p className={style.subtitle}>
            메타 정보와 본문을 입력해 새 포트폴리오 문서를 작성합니다.
          </p>
        </header>

        <form className={style.form} action={formAction}>
          <div className={style.grid}>
            <label className={style.fieldGroup}>
              <span className={style.label}>글 제목</span>
              <input
                type="text"
                name="title"
                className={style.input}
                placeholder="프로젝트 제목"
              />
            </label>

            <label className={style.fieldGroup}>
              <span className={style.label}>프로젝트 명</span>
              <input
                type="text"
                name="slug"
                className={style.input}
                placeholder="my-portfolio-project"
              />
            </label>

            <input
              type="hidden"
              name="createdAt"
              value={new Date().toISOString()}
            />

            <label className={style.fieldGroup}>
              <span className={style.label}>썸네일 이미지</span>
              <input type="file" name="thumbnail" className={style.input} />
            </label>

            <label className={style.fieldGroup}>
              <span className={style.label}>상태</span>
              <select
                name="status"
                className={style.input}
                defaultValue="draft"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </label>

            <label className={style.fieldGroup}>
              <span className={style.label}>카드 사이즈</span>
              <input
                type="text"
                name="size"
                className={style.input}
                placeholder="예: 2,1"
              />
            </label>

            <label className={style.fieldGroup}>
              <span className={style.label}>태그</span>
              <input
                type="text"
                name="tags"
                className={style.input}
                placeholder="Next.js, TypeScript, TDD"
              />
            </label>

            <label className={style.fieldGroup}>
              <span className={style.label}>GitHub 링크</span>
              <input
                type="url"
                name="githubLink"
                className={style.input}
                placeholder="https://github.com/..."
              />
            </label>

            <label className={style.fieldGroup}>
              <span className={style.label}>Velog 링크</span>
              <input
                type="url"
                name="velogLink"
                className={style.input}
                placeholder="https://velog.io/..."
              />
            </label>
          </div>

          <label className={style.fieldGroup}>
            <span className={style.label}>요약</span>
            <textarea
              name="summary"
              className={style.textarea}
              rows={3}
              placeholder="프로젝트를 짧게 소개하는 문장을 입력하세요"
            />
          </label>

          <label className={style.fieldGroup}>
            <span className={style.label}>본문 (Markdown)</span>
            <textarea
              name="contents"
              className={`${style.textarea} ${style.contentsArea}`}
              rows={18}
              placeholder="# 프로젝트 소개"
            />
          </label>

          <div className={style.actions}>
            <button
              type="submit"
              className={style.primaryButton}
              disabled={isPending}
            >
              {isPending ? "저장 중..." : "저장"}
            </button>
            <button type="button" className={style.secondaryButton}>
              미리보기 준비
            </button>
            <Link href="/admin" className={style.cancelLink}>
              취소
            </Link>
          </div>

          {state.message && (
            <p
              className={
                state.success
                  ? `${style.alert} ${style.alertSuccess}`
                  : style.alert
              }
            >
              {state.message}
            </p>
          )}
        </form>
      </article>
    </section>
  );
}
