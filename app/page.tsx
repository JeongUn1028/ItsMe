import { getProjects } from "@/lib/projects/getProjects";
import PortfolioCard from "./components/home/portfolio-card";
import Header from "./components/home/header";
import Resume from "./components/home/resume";
import Links from "./components/home/links";
import Contact from "./components/home/contact";
import style from "./page.module.css";
import Posts from "./components/home/velog-posts";

export default async function Home() {
  //* projects 중 status가 published인 프로젝트만 필터링
  const projects = getProjects().filter(
    (project) => project.status === "published",
  );

  return (
    <>
      <Header />
      <div className={style.pageWrap}>
        {/* 상단 홈 카드 그리드 */}
        <main className={style.homeGrid}>
          <Resume />
          <Links />
          <Contact />
          {/* Velog: mobile 1×2, tablet 2×2, desktop 1×2 */}
          <div className={style.velogCard}>
            <Posts />
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
