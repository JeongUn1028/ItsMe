"use client";

import Link from "next/link";
import { Portfolio } from "@/lib/types/portfilioTypes";
import style from "./EditPortfolioForm.module.css";
import { useActionState, useState } from "react";
import Image from "next/image";
import { editPortfolio } from "@/app/actions/edit-portfolio.action";

export default function EditPortfolioComponent({
  portfolio,
}: {
  portfolio: Portfolio;
}) {
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(
    portfolio.thumbnail || null,
  );
  const [isDragOver, setIsDragOver] = useState(false);

  const handleThumbnailChange = (file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    handleThumbnailChange(file || null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file?.type.startsWith("image/")) {
      handleThumbnailChange(file);
    }
  };
  const [state, formAction, isPending] = useActionState(editPortfolio, {
    success: false,
    message: "",
  });
  return (
    <section className={style.viewport}>
      <article className={style.panel}>
        <header className={style.header}>
          <div className={style.headerTop}>
            <Link
              href={`/portfolio/${portfolio.slug}`}
              className={style.previewLink}
            >
              미리보기
            </Link>
            <span className={style.statusChip}>{portfolio.status}</span>
          </div>

          <h1 className={style.title}>프로젝트 수정</h1>
          <p className={style.subtitle}>슬러그: {portfolio.slug}</p>
        </header>

        <form className={style.form} action={formAction}>
          {/* 썸네일 섹션 */}
          <div className={style.thumbnailSection}>
            <label className={style.fieldGroup}>
              <span className={style.label}>썸네일</span>
              <div
                className={style.thumbnailUpload}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                data-drag-over={isDragOver}
              >
                <div className={style.uploadArea}>
                  {thumbnailPreview ? (
                    <div className={style.previewContainer}>
                      <Image
                        src={thumbnailPreview}
                        alt="썸네일 미리보기"
                        width={300}
                        height={200}
                        className={style.thumbnailPreview}
                      />
                      <label htmlFor="thumbnail" className={style.changeButton}>
                        변경
                      </label>
                    </div>
                  ) : (
                    <div className={style.emptyState}>
                      <div className={style.uploadIcon}>📸</div>
                      <p className={style.uploadText}>
                        이미지를 여기에 드래그하거나
                      </p>
                      <label htmlFor="thumbnail" className={style.uploadLink}>
                        클릭해서 선택
                      </label>
                    </div>
                  )}
                  <input
                    id="thumbnail"
                    type="file"
                    name="thumbnail"
                    accept="image/*"
                    onChange={handleFileInputChange}
                    className={style.fileInput}
                  />
                </div>
              </div>
            </label>
          </div>

          {/* 메타데이터 섹션 */}
          <div className={style.metaSection}>
            <div className={style.grid}>
              <label className={style.fieldGroup}>
                <span className={style.label}>제목</span>
                <input
                  className={style.input}
                  name="title"
                  defaultValue={portfolio.title}
                  placeholder="프로젝트 제목"
                />
              </label>

              <label className={style.fieldGroup}>
                <span className={style.label}>상태</span>
                <select
                  name="status"
                  defaultValue={portfolio.status}
                  className={style.select}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </label>

              <input type="hidden" name="slug" value={portfolio.slug} />

              <label className={style.fieldGroup}>
                <span className={style.label}>태그 (쉼표 구분)</span>
                <input
                  className={style.input}
                  name="tags"
                  defaultValue={portfolio.tags.join(", ")}
                  placeholder="Next.js, TypeScript, ..."
                />
              </label>

              <label className={style.fieldGroup}>
                <span className={style.label}>카드 사이즈</span>
                <input
                  className={style.input}
                  name="size"
                  defaultValue={portfolio.size.join(",")}
                  placeholder="예: 2,1"
                />
              </label>

              <label className={style.fieldGroup}>
                <span className={style.label}>글 작성일</span>
                <input
                  className={style.input}
                  name="createdAt"
                  defaultValue={portfolio.createdAt}
                  type="date"
                />
              </label>

              <label className={style.fieldGroup}>
                <span className={style.label}>GitHub 링크</span>
                <input
                  className={style.input}
                  name="githubLink"
                  defaultValue={portfolio.githubLink}
                  placeholder="https://github.com/..."
                />
              </label>

              <label className={style.fieldGroup}>
                <span className={style.label}>Velog 링크</span>
                <input
                  className={style.input}
                  name="velogLink"
                  defaultValue={portfolio.velogLink}
                  placeholder="https://velog.io/..."
                />
              </label>
            </div>
          </div>

          {/* 콘텐츠 섹션 */}
          <div className={style.contentSection}>
            <label className={style.fieldGroup}>
              <span className={style.label}>요약</span>
              <textarea
                className={style.textarea}
                name="summary"
                defaultValue={portfolio.summary}
                rows={3}
                placeholder="프로젝트 요약"
              />
            </label>

            <label className={style.fieldGroup}>
              <span className={style.label}>본문 (Markdown)</span>
              <textarea
                className={`${style.textarea} ${style.contentsArea}`}
                name="contents"
                defaultValue={portfolio.contents}
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
      </article>
    </section>
  );
}
