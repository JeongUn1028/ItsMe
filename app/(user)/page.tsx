import { Suspense } from "react";
import Contact from "../components/home/contact/contact";
import HomeDeck from "../components/home/deck/HomeDeck";
import Hero from "../components/home/hero/Hero";
import { VelogPosts } from "../components/home/velog/VelogPosts";
import PortfolioCards from "../components/portfolio/portfolio-card/PortfolioCards";
import PortfolioCardsSkeleton from "../components/ui/skeleton/PortfolioCardsSkeleton";
import VelogPostsSkeleton from "../components/ui/skeleton/VelogPostsSkeleton";
import deck from "../components/home/deck/HomeDeck.module.css";
import style from "./page.module.css";

//* 데스크톱은 좌우 2페이지, 좁은 화면은 세로 스크롤. (#65)
//* 페이지 순서가 곧 우선순위다: 누구인가 + 무엇을 만들었나 → 글 · 연락처
const PAGES = [
  { slug: "intro", label: "소개 · 대표 프로젝트" },
  { slug: "contact", label: "글 · 연락처" },
];

export default function Home() {
  return (
    <div className={style.pageWrap}>
      <HomeDeck pages={PAGES}>
        <section className={deck.page} aria-labelledby="projects-heading">
          <Hero />
          <div>
            <h2 id="projects-heading" className={style.sectionTitle}>
              대표 프로젝트
            </h2>
            <div className={style.portfolioGrid}>
              <Suspense fallback={<PortfolioCardsSkeleton />}>
                <PortfolioCards />
              </Suspense>
            </div>
          </div>
        </section>

        <section className={deck.page} aria-label="글과 연락처">
          <div className={style.secondaryGrid}>
            <Suspense fallback={<VelogPostsSkeleton />}>
              <VelogPosts />
            </Suspense>
            <Contact />
          </div>
        </section>
      </HomeDeck>
    </div>
  );
}
