//* 클라이언트 번들로 유입되면 빌드가 실패하도록 서버 전용임을 표시합니다. (#54)
import "server-only";

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
