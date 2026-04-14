import fs from "node:fs";
import path from "node:path";
import { getSlugFromFileName } from "./getSlugFromFileName";
import { getRawFrontmatter } from "./getRawFrontmatter";
import type { Portfolio } from "../types/portfilioTypes";
import { getRawContents } from "./getRawContents";

//* content/portfolio 디렉토리에 있는 md 파일들을 읽어서 프로젝트 데이터를 반환
export const getPortfolios = (): Portfolio[] => {
  const portfolioDirectory = path.join(process.cwd(), "content", "portfolio");
  const fileNames = fs
    .readdirSync(portfolioDirectory)
    .filter((fileName) => fileName.endsWith(".md"));

  //* 각 md 파일에서 frontmatter와 contents를 읽어서 프로젝트 객체로 변환
  const portfolio: Portfolio[] = fileNames.map((fileName) => {
    const filePath = path.join(portfolioDirectory, fileName);
    const rawFrontMatterData = getRawFrontmatter(filePath);
    const rawContents = getRawContents(filePath);

    return {
      slug: getSlugFromFileName(fileName),
      thumbnail: rawFrontMatterData.thumbnail ?? "",
      size: rawFrontMatterData.size ?? [1, 1],
      status: rawFrontMatterData.status ?? "draft",
      title: rawFrontMatterData.title ?? "",
      tags: rawFrontMatterData.tags ?? [],
      createdAt: rawFrontMatterData.createdAt ?? "",
      githubLink: rawFrontMatterData.githubLink ?? "",
      velogLink: rawFrontMatterData.velogLink ?? "",
      summary: rawFrontMatterData.summary ?? "",
      contents: rawContents,
    };
  });
  return portfolio;
};
