import { getPortfolios } from "@/lib/portfolio/getPortfolios";
import { expect, describe, it } from "vitest";

describe("getPortfolios", () => {
  it("frontmatter와 contents를 합쳐서 포트폴리오 목록을 반환", () => {
    const portfolios = getPortfolios();

    expect(portfolios).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          slug: "sample-project",
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
        }),
      ]),
    );

    const samplePortfolio = portfolios.find(
      (portfolio) => portfolio.slug === "sample-portfolio",
    );
    expect(samplePortfolio?.contents).toContain("## 프로젝트 소개");
    expect(samplePortfolio?.contents).toContain("## 문제");
    expect(samplePortfolio?.contents).toContain("## 해결");
  });
});
