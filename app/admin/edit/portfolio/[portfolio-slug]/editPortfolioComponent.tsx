"use client";

import Link from "next/link";
import { Portfolio } from "@/lib/portfolio/types";
import style from "./editPortfolioComponent.module.css";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function EditPortfolioComponent({
  portfolio,
}: {
  portfolio: Portfolio;
}) {
  const [portFolioData, setPortFolioData] = useState<Portfolio | undefined>(
    undefined,
  );

  useEffect(() => {
    setPortFolioData(portfolio);
  }, [portfolio]);
  return (
    <section className={style.viewport}>
      <article className={style.panel}>
        <header className={style.header}>
          <div className={style.headerTop}>
            <Link
              href={`/portfolio/${portFolioData?.slug}`}
              className={style.previewLink}
            >
              미리보기
            </Link>
            <span className={style.statusChip}>{portFolioData?.status}</span>
          </div>

          <h1 className={style.title}>프로젝트 수정</h1>
          <p className={style.subtitle}>슬러그: {portFolioData?.slug}</p>
        </header>

        <form className={style.form}>
          <div className={style.grid}>
            <label className={style.fieldGroup}>
              <span className={style.label}>제목</span>
              <input
                className={style.input}
                name="title"
                defaultValue={portFolioData?.title}
                placeholder="프로젝트 제목"
              />
            </label>

            <label className={style.fieldGroup}>
              <span className={style.label}>썸네일</span>
              <Image
                src={portFolioData?.thumbnail || ""}
                alt={portFolioData?.title || ""}
                width={100}
                height={100}
              />
            </label>

            <label className={style.fieldGroup}>
              <span className={style.label}>상태</span>
              <select>
                <option
                  value="draft"
                  selected={portFolioData?.status === "draft"}
                >
                  Draft
                </option>
                <option
                  value="published"
                  selected={portFolioData?.status === "published"}
                >
                  Published
                </option>
              </select>
            </label>

            <label className={style.fieldGroup}>
              <span className={style.label}>태그 (쉼표 구분)</span>
              <input
                className={style.input}
                name="tags"
                defaultValue={portFolioData?.tags.join(", ")}
                placeholder="Next.js, TypeScript, ..."
              />
            </label>

            <label className={style.fieldGroup}>
              <span className={style.label}>사이즈 (예: 2,1)</span>
              <input
                className={style.input}
                name="size"
                defaultValue={portFolioData?.size.join(",")}
                placeholder="1,1"
              />
            </label>

            <label className={style.fieldGroup}>
              <span className={style.label}>글 작성일</span>
              <input
                className={style.input}
                name="createdAt"
                defaultValue={portFolioData?.createdAt}
                type="date"
              />
            </label>

            <label className={style.fieldGroup}>
              <span className={style.label}>GitHub 링크</span>
              <input
                className={style.input}
                name="githubLink"
                defaultValue={portFolioData?.githubLink}
                placeholder="https://github.com/..."
              />
            </label>

            <label className={style.fieldGroup}>
              <span className={style.label}>Velog 링크</span>
              <input
                className={style.input}
                name="velogLink"
                defaultValue={portFolioData?.velogLink}
                placeholder="https://velog.io/..."
              />
            </label>
          </div>

          <label className={style.fieldGroup}>
            <span className={style.label}>요약</span>
            <textarea
              className={style.textarea}
              name="summary"
              defaultValue={portFolioData?.summary}
              rows={3}
              placeholder="프로젝트 요약"
            />
          </label>

          <label className={style.fieldGroup}>
            <span className={style.label}>본문 (Markdown)</span>
            <textarea
              className={`${style.textarea} ${style.contentsArea}`}
              name="contents"
              defaultValue={portFolioData?.contents}
              rows={18}
              placeholder="마크다운 내용을 입력하세요"
            />
          </label>

          <div className={style.actions}>
            <button type="button" className={style.secondaryButton}>
              미리보기 열기
            </button>
            <button type="button" className={style.primaryButton}>
              저장
            </button>
            <Link href="/admin" className={style.cancelLink}>
              취소
            </Link>
          </div>
        </form>
      </article>
    </section>
  );
}
