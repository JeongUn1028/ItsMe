import { getProjects } from "@/lib/projects/getProjects";
import PortfolioCard from "./components/portfolio-card";

export default function Home() {
  //* projects 중 status가 published인 프로젝트만 필터링
  const projects = getProjects().filter(
    (project) => project.status === "published",
  );

  return (
    <main>
      <section>
        {projects.map((project) => (
          <PortfolioCard key={project.slug} {...project} />
        ))}
      </section>
    </main>
  );
}
