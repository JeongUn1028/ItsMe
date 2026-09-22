import fs from "node:fs";
import matter from "gray-matter";
import type { RawFrontmatter } from "../types/portfolioTypes";

//* md 파일을 한 번만 읽어 frontmatter 와 본문(contents)을 함께 반환합니다.
export const parseMarkdownFile = (
  filePath: string,
): { frontmatter: RawFrontmatter; contents: string } => {
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  return { frontmatter: data as RawFrontmatter, contents: content.trim() };
};
