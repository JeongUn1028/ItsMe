import { getProjects } from "@/lib/projects/getProjects";
import PortfolioCard from "./components/home/portfolio-card";
import style from "./page.module.css";
import Header from "./components/home/header";
import Resume from "./components/home/resume";
import Links from "./components/home/links";
import Contact from "./components/home/contact";

export default function Home() {
  //* projects 중 status가 published인 프로젝트만 필터링
  const projects = getProjects().filter(
    (project) => project.status === "published",
  );

  return (
    <>
      <Header />
      <div className={style.container}>
        {/* 반응형 bento 그리드: 모바일 1열, 태블릿 2열, 데스크톱 3열 */}
        <main className="grid w-full grid-cols-1 auto-rows-[clamp(120px,32vw,180px)] gap-3 sm:grid-cols-2 sm:auto-rows-[200px] xl:grid-cols-3 xl:auto-rows-[220px]">
          {/* Resume: mobile 1×2, tablet 2×2, desktop 1×2 */}
          <div className="col-span-1 row-span-2 h-full sm:col-span-2 xl:col-span-1 xl:col-start-1 xl:row-start-1">
            <Resume />
          </div>
          {/* Links: 1×1 */}
          <div className="col-span-1 row-span-1 h-full xl:col-start-2 xl:row-start-1">
            <Links />
          </div>
          {/* Contact: 1×1 */}
          <div className="col-span-1 row-span-1 h-full xl:col-start-2 xl:row-start-2">
            <Contact />
          </div>
          {/* Velog: mobile 1×2, tablet 2×2, desktop 1×2 */}
          <div className="col-span-1 row-span-2 h-full sm:col-span-2 xl:col-span-1 xl:col-start-3 xl:row-start-1">
            <div className="glass p-4 w-full h-full">벨로그 최근 글</div>
          </div>
          {/* PortfolioCard: size 값에 따라 tablet/desktop span 적용 */}
          {projects.map((project) => (
            <PortfolioCard key={project.slug} {...project} />
          ))}
        </main>
      </div>
    </>
  );
}
