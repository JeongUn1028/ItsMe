import resume from "../../content/resume.json";

export const getResume = () => {
  const { description, skills } = resume;
  return { description, skills };
};
