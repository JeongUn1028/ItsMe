import resume from "../../content/resume.json";

export const updateResume = async (
  fileName: string,
  contents?: { description: string; skills: string[] },
) => {
  try {
    const updateResume = await fetch("/api/update-file", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fileName,
        content: contents ? contents : resume,
      }),
    });
    return updateResume.ok;
  } catch (error) {
    console.error("Error updating resume:", error);
    return false;
  }
};
