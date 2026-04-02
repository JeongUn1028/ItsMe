import { getProjects } from "@/lib/projects/getProjects";
import PortfolioCard from "./components/portfolio/portfolio-card/portfolio-card";
import Resume from "./components/home/resume";
import Links from "./components/home/links";
import Contact from "./components/home/contact";
import style from "./page.module.css";
import { getVelogPosts } from "@/lib/projects/getVelogPosts";
import VelogPost from "./components/home/velog/velog-post";
import type { VelogPost as VelogPostType } from "@/lib/projects/types";

export default async function Home() {
  //* projects 중 status가 published인 프로젝트만 필터링
  const projects = getProjects().filter(
    (project) => project.status === "published",
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
          {projects.map((project) => (
            <PortfolioCard key={project.slug} {...project} />
          ))}
        </section>
      </div>
    </>
  );
}
