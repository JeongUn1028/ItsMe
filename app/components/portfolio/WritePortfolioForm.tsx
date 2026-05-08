import style from "./WritePortfolioForm.module.css";
import PortfolioForm from "@/app/components/portfolio/PortfolioForm";

export default function WritePortfolioForm() {
  return (
    <section className={style.viewport}>
      <article className={style.panel}>
        <header className={style.header}>
          <div className={style.headerTop}>
            <span className={style.statusChip}>new portfolio</span>
          </div>

          <h1 className={style.title}>포트폴리오 작성</h1>
          <p className={style.subtitle}>
            메타 정보와 본문을 입력해 새 포트폴리오 문서를 작성합니다.
          </p>
        </header>

        <PortfolioForm isEditMode={false} />
      </article>
    </section>
  );
}
