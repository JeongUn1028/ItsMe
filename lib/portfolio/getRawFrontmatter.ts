import fs from "node:fs";
import matter from "gray-matter";
import type { RawFrontmatter } from "../types/portfilioTypes";

//* 파일 이름을 받아서 해당 파일의 frontmatter를 파싱해서 반환
export const getRawFrontmatter = (filePath: string): RawFrontmatter => {
  const fileContent = fs.readFileSync(filePath, "utf8");
  const { data } = matter(fileContent);
  return data as RawFrontmatter;
};
