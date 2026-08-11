import { getPortfolioData } from "@/lib/portfolio/getPortfolioData";
import style from "./EditPortfolioForm.module.css";

import PortfolioForm from "@/app/components/portfolio/PortfolioForm";

export default function EditPortfolioComponent({
  params,
}: {
  params: { "portfolio-slug": string };
}) {
  const { "portfolio-slug": slug } = params;
  const portfolio = getPortfolioData(slug);
  return (
    <section className={style.viewport}>
      <article className={style.panel}>
        <header className={style.header}>
          <div className={style.headerTop}>
            <span className={style.statusChip}>{portfolio.status}</span>
          </div>
          <h1 className={style.title}>프로젝트 수정</h1>
          <p className={style.subtitle}>슬러그: {portfolio.slug}</p>
        </header>

        <PortfolioForm isEditMode={true} portfolio={portfolio} />
      </article>
    </section>
  );
}
