import { getProjects } from "./getProjects";

export const getProjectData = (slug: string) => {
  const projects = getProjects();
  const project = projects.find((project) => project.slug === slug);

  if (!project) {
    throw new Error(`Project with slug "${slug}" not found.`);
  }

  return project;
};
