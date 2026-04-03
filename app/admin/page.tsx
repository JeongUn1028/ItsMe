import style from "./page.module.css";
import { getProjects } from "@/lib/projects/getProjects";
import Resume from "../components/home/resume/resume";
import PortfolioCard from "../components/portfolio/portfolio-card/portfolio-card";
import { Project } from "@/lib/projects/types";
import Link from "next/link";

//* Admin Page
export default function Page() {
  const projects = getProjects();
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

      {projects.map((project: Project) => (
        <PortfolioCard key={project.slug} {...project} />
      ))}
    </div>
  );
}
