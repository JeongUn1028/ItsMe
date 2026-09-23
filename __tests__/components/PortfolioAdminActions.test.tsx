import { describe, expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import PortfolioAdminActions from "@/app/components/portfolio/portfolio-admin-actions/PortfolioAdminActions";

//* 서버 액션은 모듈 경계만 필요하므로 대체한다 (네트워크 모킹이 아님).
vi.mock("@/app/actions/delete-portfolio.action", () => ({
  deletePortfolioAction: vi.fn(),
}));

describe("PortfolioAdminActions", () => {
  test("수정 링크는 해당 포트폴리오의 편집 경로를 가리킨다", () => {
    render(<PortfolioAdminActions slug="itsme" thumbnail="/portfolio/itsme.png" />);

    const editLink = screen.getByRole("link", { name: "수정" });
    expect(editLink.getAttribute("href")).toBe("/admin/edit/portfolio/itsme");
  });

  test("삭제 폼은 slug 와 썸네일 경로를 함께 전송한다", () => {
    const { container } = render(
      <PortfolioAdminActions slug="itsme" thumbnail="/portfolio/itsme.png" />,
    );

    expect(screen.getByRole("button", { name: "삭제" })).toBeDefined();
    const hidden = [...container.querySelectorAll('input[type="hidden"]')].map(
      (input) => [input.getAttribute("name"), input.getAttribute("value")],
    );
    expect(hidden).toEqual([
      ["slug", "itsme"],
      ["thumbnail", "/portfolio/itsme.png"],
    ]);
  });
});
