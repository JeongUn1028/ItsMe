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
      <div className={style.resumeSection}>
        <Link href="/admin/edit/resume" className={style.editResumeButton}>
          레주메 수정
        </Link>
        <Resume />
      </div>

      {portfolio.map((portfolio: Portfolio) => (
        <PortfolioCard key={portfolio.slug} {...portfolio} />
      ))}
    </div>
  );
}
