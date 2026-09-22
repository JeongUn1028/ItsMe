import path from "node:path";
import { describe, expect, it } from "vitest";
import { parseMarkdownFile } from "@/lib/portfolio/parseMarkdownFile";

const fixturePath = path.join(
  process.cwd(),
  "__tests__",
  "fixtures",
  "portfolio",
  "sample-project.md",
);

describe("parseMarkdownFile", () => {
  it("frontmatter를 파싱해서 반환한다", () => {
    const { frontmatter } = parseMarkdownFile(fixturePath);

    expect(frontmatter).toMatchObject({
      thumbnail: "images/portfolio.png",
      size: [1, 2],
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

  it("본문은 frontmatter를 제외하고 앞뒤 공백을 제거해 반환한다", () => {
    const { contents } = parseMarkdownFile(fixturePath);
    const normalized = contents.replace(/\n\s*\n/g, "\n");

    expect(contents).not.toContain("thumbnail:");
    expect(normalized).toBe(
      "## 프로젝트 소개\n이 프로젝트는 나를 소개하기 위한 포트폴리오입니다.\n---\n## 문제\n기존 포트폴리오는 결과만 보여주는 경우가 많았습니다.\n---\n## 해결\n설계와 과정을 함께 보여주는 구조로 설계했습니다.",
    );
  });
});
