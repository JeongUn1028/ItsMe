import { getPortfolios } from "@/lib/portfolio/getPortfolios";
import path from "node:path";
import { expect, describe, it } from "vitest";

const fixtureDirectory = path.join(
  process.cwd(),
  "__tests__",
  "fixtures",
  "portfolio",
);

describe("getPortfolios", () => {
  it("frontmatter와 contents를 합쳐서 포트폴리오 목록을 반환", () => {
    const portfolios = getPortfolios(fixtureDirectory);

    expect(portfolios).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          slug: "sample-project",
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
        }),
      ]),
    );

    const samplePortfolio = portfolios.find(
      (portfolio) => portfolio.slug === "sample-project",
    );
    expect(samplePortfolio?.contents).toContain("## 프로젝트 소개");
    expect(samplePortfolio?.contents).toContain("## 문제");
    expect(samplePortfolio?.contents).toContain("## 해결");
  });

  it("md 파일이 아닌 파일은 무시한다", () => {
    const slugs = getPortfolios(fixtureDirectory).map((p) => p.slug);

    expect(slugs).toEqual(
      expect.arrayContaining(["sample-project", "draft-project"]),
    );
    expect(slugs).toHaveLength(2);
  });

  it("누락된 frontmatter 필드는 기본값으로 채운다", () => {
    const draft = getPortfolios(fixtureDirectory).find(
      (p) => p.slug === "draft-project",
    );

    expect(draft).toMatchObject({
      status: "draft",
      thumbnail: "",
      size: [1, 1],
      tags: [],
      createdAt: "",
      githubLink: "",
      velogLink: "",
      summary: "",
    });
  });

  it("인자 없이 호출하면 실제 content/portfolio 디렉토리를 읽는다", () => {
    const portfolios = getPortfolios();

    expect(portfolios.length).toBeGreaterThan(0);
    for (const portfolio of portfolios) {
      expect(portfolio.slug).not.toBe("");
      expect(["draft", "published"]).toContain(portfolio.status);
      expect(typeof portfolio.contents).toBe("string");
    }
  });
});
