import fs from "node:fs";
import matter from "gray-matter";

//* md 파일의 경로를 받아 해당 파일의 contents를 파싱해서 반환
export const getRawContents = (filePath: string): string => {
  const rawContent = fs.readFileSync(filePath, "utf8");
  const { content } = matter(rawContent);
  return content.trim();
};
