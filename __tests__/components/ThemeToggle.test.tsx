import { beforeEach, describe, expect, test, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import ThemeToggle from "@/app/components/ui/ThemeToggle";

//* jsdom 에는 matchMedia 가 없으므로 시스템 설정을 라이트로 가정하는 스텁을 둡니다.
function stubMatchMedia(dark: boolean) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockImplementation((query: string) => ({
      matches: query.includes("dark") ? dark : false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  );
}

describe("ThemeToggle", () => {
  beforeEach(() => {
    localStorage.clear();
    delete document.documentElement.dataset.theme;
    stubMatchMedia(false);
  });

  test("system → dark → light → system 순으로 순환한다", () => {
    render(<ThemeToggle />);
    const button = screen.getByRole("button");

    expect(button.getAttribute("aria-label")).toContain("시스템");
    expect(document.documentElement.dataset.theme).toBeUndefined();

    fireEvent.click(button);
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(localStorage.getItem("theme")).toBe("dark");
    expect(button.getAttribute("aria-label")).toContain("다크");

    fireEvent.click(button);
    expect(document.documentElement.dataset.theme).toBe("light");
    expect(localStorage.getItem("theme")).toBe("light");

    fireEvent.click(button);
    expect(document.documentElement.dataset.theme).toBeUndefined();
    expect(localStorage.getItem("theme")).toBeNull();
  });

  test("저장된 값이 있으면 그 상태로 시작한다", () => {
    localStorage.setItem("theme", "dark");
    document.documentElement.dataset.theme = "dark";

    render(<ThemeToggle />);
    expect(screen.getByRole("button").getAttribute("aria-label")).toContain(
      "다크",
    );
  });

  test("theme-color 메타 태그를 현재 테마 색으로 갱신한다", () => {
    const meta = document.createElement("meta");
    meta.name = "theme-color";
    //* 서버가 채워둔 값을 흉내 낸 자리표시자. 팔레트 값을 하드코딩하지 않아야
    //* 색을 바꿔도 이 테스트가 의미를 유지한다.
    meta.content = "#000000";
    document.head.appendChild(meta);

    render(<ThemeToggle />);
    const button = screen.getByRole("button");

    fireEvent.click(button); // → dark
    const darkColor = meta.content;
    expect(darkColor).toMatch(/^#[0-9a-f]{6}$/i);
    expect(darkColor).not.toBe("#000000");

    fireEvent.click(button); // → light
    expect(meta.content).toMatch(/^#[0-9a-f]{6}$/i);
    expect(meta.content).not.toBe(darkColor);

    meta.remove();
  });
});
