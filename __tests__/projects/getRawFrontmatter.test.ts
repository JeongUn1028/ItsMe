import path from "node:path";

import { describe, expect, it } from "vitest";

import { getRawFrontmatter } from "@/lib/portfolio/getRawFrontmatter";

describe("getRawFrontmatter", () => {
  it("마크다운 파일의 경로를 입력받아 frontmatter를 파싱해서 반환한다", () => {
    const filePath = path.join(
      process.cwd(),
      "content",
      "projects",
      "sample-project.md",
    );

    const frontmatter = getRawFrontmatter(filePath);

    expect(frontmatter).toMatchObject({
      thumbnail: "images/portfolio.png",
      size: [1, 4],
      status: "published",
      title: "Next.js 기반 개인 포트폴리오 프로젝트",
      tags: ["Next.js", "TypeScript", "TDD"],
      createdAt: "2026-04-26",
      githubLink: "https://github.com/JeongUn1028",
      velogLink:
        "https://velog.io/@jeongun1028/Next.js-%EA%B8%B0%EB%B0%98-Static-Portfolio-%EA%B5%AC%EC%B6%95",
      summary:
        "Next.js를 활용하여 개인 포트폴리오 웹사이트를 개발한 프로젝트입니다.",
    });
  });
});
