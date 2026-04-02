import { getProjects } from "@/lib/projects/getProjects";
import Resume from "../components/home/resume";
import PortfolioCard from "../components/portfolio/portfolio-card/portfolio-card";
import { Project } from "@/lib/projects/types";

//* Admin Page
export default function Page() {
  const projects = getProjects();
  //TODO 레주메, 포트폴리오 카드 추가, 수정, 삭제 기능 구현
  return (
    <div>
      <Resume />
      {projects.map((project: Project) => (
        <PortfolioCard key={project.slug} {...project} />
      ))}
    </div>
  );
}
