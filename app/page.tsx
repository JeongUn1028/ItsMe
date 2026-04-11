import { getPortfolios } from "@/lib/portfolio/getPortfolios";
import PortfolioCard from "./components/portfolio/portfolio-card/portfolio-card";
import Resume from "./components/home/resume/resume";
import Links from "./components/home/links/links";
import Contact from "./components/home/contact/contact";
import style from "./page.module.css";
import { getVelogPosts } from "@/lib/portfolio/getVelogPosts";
import VelogPost from "./components/home/velog/velog-post";
import type { VelogPost as VelogPostType } from "@/lib/portfolio/types";

export default async function Home() {
  //* portfolio 중 status가 published인 프로젝트만 필터링
  const portfolio = getPortfolios().filter(
    (portfolio) => portfolio.status === "published",
  );
  const velogPosts = await getVelogPosts();

  return (
    <>
      <div className={style.pageWrap}>
        {/* 상단 홈 카드 그리드 */}
        <main className={style.homeGrid}>
          <Resume />
          <Links />
          <Contact />
          {/* Velog: mobile 1×2, tablet 2×2, desktop 1×2 */}
          <div className={`glass ${style.velogCard}`}>
            <h1 className={style.title}>VELOG POSTS</h1>
            {velogPosts.length > 0 ? (
              velogPosts.map((post: VelogPostType) => (
                <VelogPost key={post.url_slug} post={post} />
              ))
            ) : (
              <p className={style.noPosts}>최근 게시물이 없습니다.</p>
            )}
          </div>
        </main>
        {/* 포트폴리오 카드 전용 그리드: 모바일 2열, 태블릿 2열, 데스크톱 3열 */}
        <section className={style.portfolioGrid}>
          {portfolio.map((portfolio) => (
            <PortfolioCard key={portfolio.slug} {...portfolio} />
          ))}
        </section>
      </div>
    </>
  );
}
