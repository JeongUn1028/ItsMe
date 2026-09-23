import { describe, expect, test } from "vitest";
import { render } from "@testing-library/react";
import PortfolioCardsSkeleton from "@/app/components/ui/skeleton/PortfolioCardsSkeleton";

describe("PortfolioCardsSkeleton", () => {
  //* CSS Modules 는 @keyframes 이름도 파일별로 스코프하므로, 쉬머는 전역 .shimmer 를 써야 동작한다.
  //* 예전에 다른 모듈의 클래스를 참조해 애니메이션이 죽은 적이 있어 회귀를 막는다.
  test("스켈레톤 막대에 전역 쉬머 클래스가 적용된다", () => {
    const { container } = render(<PortfolioCardsSkeleton />);

    const shimmers = container.querySelectorAll(".shimmer");
    expect(shimmers.length).toBeGreaterThan(0);
    shimmers.forEach((element) => {
      expect(element.className).not.toContain("undefined");
    });
  });

  test("스켈레톤은 보조기기에 노출되지 않는다", () => {
    const { container } = render(<PortfolioCardsSkeleton />);

    const cards = container.querySelectorAll('[aria-hidden="true"]');
    expect(cards.length).toBeGreaterThan(0);
  });
});
