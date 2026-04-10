import style from "./page.module.css";
import { getPortfolios } from "@/lib/portfolio/getPortfolios";
import Resume from "../components/home/resume/resume";
import PortfolioCard from "../components/portfolio/portfolio-card/portfolio-card";
import { Portfolio } from "@/lib/portfolio/types";
import Link from "next/link";

//* Admin Page
export default function Page() {
  const portfolio = getPortfolios();
  //TODO 레주메 Update 기능

  //TODO 포트폴리오 추가, 수정, 삭제 기능
  return (
    <div className={style.container}>
      <div className={`glass ${style.actionsSection}`}>
        <p className={style.actionsTitle}>관리 메뉴</p>
        <div className={style.buttonGroup}>
          <Link href="/admin/edit/resume" className={style.editResumeButton}>
            레주메 수정
          </Link>
          <Link href="/admin/write" className={style.addPortfolioButton}>
            포트폴리오 추가
          </Link>
        </div>
      </div>

      <section className={style.contentSection}>
        <div className={` glass ${style.resumeSection}`}>
          <h2 className={style.sectionTitle}>Resume</h2>
          <div className={style.resumeCardWrap}>
            <Resume />
          </div>
        </div>

        <div className={` glass ${style.portfolioSection}`}>
          <h2 className={style.sectionTitle}>Portfolio</h2>
          <div className={style.portfolioGrid}>
            {portfolio.map((portfolio: Portfolio) => (
              <PortfolioCard key={portfolio.slug} {...portfolio} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
