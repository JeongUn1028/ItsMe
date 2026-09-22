import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import PortfolioCard from "@/app/components/portfolio/portfolio-card/PortfolioCard";
import type { Portfolio } from "@/lib/types/portfolioTypes";

const portfolio: Portfolio = {
  slug: "sample-project",
  thumbnail: "/portfolio/sample.png",
  size: [2, 1],
  status: "published",
  title: "샘플 프로젝트",
  tags: ["Next.js", "TypeScript"],
  createdAt: "2026-04-26",
  githubLink: "https://github.com/x",
  velogLink: "https://velog.io/@x",
  summary: "요약",
  contents: "## 본문",
};

describe("PortfolioCard", () => {
  test("키보드 접근이 가능한 링크로 렌더되고 상세 경로를 가리킨다", () => {
    render(<PortfolioCard {...portfolio} index={3} />);

    const link = screen.getByRole("link", { name: "샘플 프로젝트 자세히 보기" });
    expect(link.getAttribute("href")).toBe("/portfolio/sample-project");
    //* 순차 등장 지연은 --i 커스텀 프로퍼티로 전달
    expect(link.getAttribute("style")).toContain("--i: 3");
    expect(link.className).toContain("fade-up");
  });

  test("제목, 요약, 태그를 표시한다", () => {
    render(<PortfolioCard {...portfolio} />);

    expect(screen.getByRole("heading", { level: 2, name: "샘플 프로젝트" })).toBeDefined();
    expect(screen.getByText("요약")).toBeDefined();
    expect(screen.getAllByRole("listitem").map((li) => li.textContent)).toEqual([
      "Next.js",
      "TypeScript",
    ]);
  });
});
