import Contact from "../components/home/contact/contact";
import Links from "../components/home/links/links";
import Resume from "../components/home/resume/resume";
import { VelogPosts } from "../components/home/velog/VelogPosts";
import PortfolioCards from "../components/portfolio/portfolio-card/PortfolioCards";
import PortfolioCardsSkeleton from "../components/ui/skeleton/PortfolioCardsSkeleton";
import VelogPostsSkeleton from "../components/ui/skeleton/VelogPostsSkeleton";
import style from "./page.module.css";
import { Suspense } from "react";

//* Home Page
export default function Home() {
  return (
    <>
      <div className={style.pageWrap}>
        {/* 상단 홈 카드 그리드 */}
        <main className={style.homeGrid}>
          <Resume />
          <Links />
          <Contact />
          {/* Velog: mobile 1×2, tablet 2×2, desktop 1×2 */}
          <Suspense fallback={<VelogPostsSkeleton />}>
            <VelogPosts />
          </Suspense>
        </main>
        {/* 포트폴리오 카드 전용 그리드: 모바일 2열, 태블릿 2열, 데스크톱 3열 */}
        <section className={style.portfolioGrid}>
          <Suspense fallback={<PortfolioCardsSkeleton />}>
            <PortfolioCards />
          </Suspense>
        </section>
      </div>
    </>
  );
}
