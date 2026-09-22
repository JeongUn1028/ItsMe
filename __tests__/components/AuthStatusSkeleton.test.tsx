import { describe, expect, test } from "vitest";
import { render } from "@testing-library/react";
import AuthStatusSkeleton from "@/app/components/ui/skeleton/AuthStatusSkeleton";

describe("AuthStatusSkeleton", () => {
  test("그룹 컨테이너 클래스와 쉬머 클래스가 모두 적용된다", () => {
    const { container } = render(<AuthStatusSkeleton />);
    const group = container.firstElementChild!;

    //* 이전에는 다른 CSS 모듈에 있는 클래스를 참조해 undefined 가 들어갔습니다.
    expect(group.className).not.toContain("undefined");
    expect(group.className.length).toBeGreaterThan(0);
    expect(group.getAttribute("aria-hidden")).toBe("true");

    const pills = group.querySelectorAll("span");
    expect(pills).toHaveLength(2);
    pills.forEach((pill) => expect(pill.className).toContain("shimmer"));
  });
});
