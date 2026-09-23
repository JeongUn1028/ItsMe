import { Suspense } from "react";
import Contact from "../components/home/contact/contact";
import Hero from "../components/home/hero/Hero";
import Links from "../components/home/links/links";
import { VelogPosts } from "../components/home/velog/VelogPosts";
import PortfolioCards from "../components/portfolio/portfolio-card/PortfolioCards";
import PortfolioCardsSkeleton from "../components/ui/skeleton/PortfolioCardsSkeleton";
import VelogPostsSkeleton from "../components/ui/skeleton/VelogPostsSkeleton";
import style from "./page.module.css";

//* Home Page
//* 순서가 곧 우선순위다. 이름·포지셔닝 → 대표 프로젝트 → 글·링크·연락처. (#63)
export default function Home() {
  return (
    <div className={style.pageWrap}>
      <main className={style.main}>
        {/* 1. 누구인가 */}
        <Hero />

        {/* 2. 무엇을 만들었나 */}
        <section aria-labelledby="projects-heading">
          <h2 id="projects-heading" className={style.sectionTitle}>
            대표 프로젝트
          </h2>
          <div className={style.portfolioGrid}>
            <Suspense fallback={<PortfolioCardsSkeleton />}>
              <PortfolioCards />
            </Suspense>
          </div>
        </section>

        {/* 3. 글 · 링크 · 연락처는 보조 정보라 프로젝트 뒤에 둔다 */}
        <section className={style.secondaryGrid}>
          <Suspense fallback={<VelogPostsSkeleton />}>
            <VelogPosts />
          </Suspense>
          <Links />
          <Contact />
        </section>
      </main>
    </div>
  );
}
