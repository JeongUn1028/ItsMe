"use client";
import style from "./PortfolioForm.module.css";
import { createPortfolio } from "@/app/actions/create-portfolio.action";
import { editPortfolio } from "@/app/actions/edit-portfolio.action";
import { Portfolio } from "@/lib/types/portfilioTypes";
import Link from "next/link";
import { useActionState } from "react";
import ImageUpload from "../common/ImageUpload";

export default function PortfolioForm({
  isEditMode,
  portfolio,
}: {
  isEditMode: boolean;
  portfolio?: Portfolio;
}) {
  const [state, formAction, isPending] = useActionState(
    isEditMode ? editPortfolio : createPortfolio,
    {
      success: null,
      message: "",
    },
  );
  return (
    <form className={style.form} action={formAction}>
      <div className={style.metaSection}>
        <ImageUpload initialUrl={portfolio ? portfolio.thumbnail : undefined} />
        <div className={style.grid}>
          {/* 제목 */}
          <label className={style.fieldGroup}>
            <span className={style.label}>제목</span>
            <input
              className={style.input}
              name="title"
              defaultValue={portfolio ? portfolio.title : ""}
              placeholder="프로젝트 제목"
            />
          </label>

          {/* 프로젝트명(슬러그) */}
          <label className={style.fieldGroup}>
            <span className={style.label}>프로젝트 명</span>
            <input
              type="text"
              name="slug"
              className={style.input}
              placeholder="my-portfolio-project"
              defaultValue={portfolio ? portfolio.slug : ""}
            />
          </label>

          {/* 상태 */}
          <label className={style.fieldGroup}>
            <span className={style.label}>상태</span>
            <select
              name="status"
              defaultValue={portfolio ? portfolio.status : "draft"}
              className={style.select}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </label>

          {/* 태그 */}
          <label className={style.fieldGroup}>
            <span className={style.label}>태그 (쉼표 구분)</span>
            <input
              className={style.input}
              name="tags"
              defaultValue={portfolio ? portfolio.tags.join(", ") : ""}
              placeholder="Next.js, TypeScript, ..."
            />
          </label>

          {/* 카드 사이즈 */}
          <label className={style.fieldGroup}>
            <span className={style.label}>카드 사이즈</span>
            <input
              className={style.input}
              name="size"
              defaultValue={portfolio ? portfolio.size.join(",") : ""}
              placeholder="예: 2,1"
            />
          </label>

          {/* GitHub 링크 */}
          <label className={style.fieldGroup}>
            <span className={style.label}>GitHub 링크</span>
            <input
              className={style.input}
              name="githubLink"
              defaultValue={portfolio ? portfolio.githubLink : ""}
              placeholder="https://github.com/..."
            />
          </label>

          {/* Velog 링크 */}
          <label className={style.fieldGroup}>
            <span className={style.label}>Velog 링크</span>
            <input
              className={style.input}
              name="velogLink"
              defaultValue={portfolio ? portfolio.velogLink : ""}
              placeholder="https://velog.io/..."
            />
          </label>

          {/* 생성일 */}
          <input
            type="hidden"
            name="createdAt"
            value={portfolio?.createdAt ?? new Date().toISOString()}
          />
        </div>
      </div>

      {/* 콘텐츠 섹션 */}
      <div className={style.contentSection}>
        {/* 요약 */}
        <label className={style.fieldGroup}>
          <span className={style.label}>요약</span>
          <textarea
            className={style.textarea}
            name="summary"
            defaultValue={portfolio ? portfolio.summary : ""}
            rows={3}
            placeholder="프로젝트 요약"
          />
        </label>
        {/* 본문 */}
        <label className={style.fieldGroup}>
          <span className={style.label}>본문 (Markdown)</span>
          <textarea
            className={`${style.textarea} ${style.contentsArea}`}
            name="contents"
            defaultValue={portfolio ? portfolio.contents : ""}
            rows={18}
            placeholder="마크다운 내용을 입력하세요"
          />
        </label>
      </div>
      {/* 버튼 */}
      <div className={style.actions}>
        <button type="button" className={style.secondaryButton}>
          미리보기 열기
        </button>
        <button
          type="submit"
          className={style.primaryButton}
          disabled={isPending}
        >
          {isPending ? "저장 중..." : "저장"}
        </button>
        <Link href="/admin" className={style.cancelLink}>
          취소
        </Link>
      </div>
      {state.message && (
        <div className={style.messageWrap} role="status" aria-live="polite">
          <p
            className={
              state.success ? style.successMessage : style.errorMessage
            }
          >
            <span className={style.messageIcon} aria-hidden="true">
              {state.success ? "✓" : "!"}
            </span>
            <span>{state.message}</span>
          </p>
        </div>
      )}
    </form>
  );
}
