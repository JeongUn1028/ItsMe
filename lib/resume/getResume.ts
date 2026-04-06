import resume from "../../content/resume.json";

export const getResume = () => {
  const { description, skills, imagePath, pdfPath } = resume;
  return { description, skills, imagePath, pdfPath };
};
