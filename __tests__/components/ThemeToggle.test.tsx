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
    meta.content = "#f6f0e4";
    document.head.appendChild(meta);

    render(<ThemeToggle />);
    fireEvent.click(screen.getByRole("button")); // → dark
    expect(meta.content).not.toBe("#f6f0e4");

    meta.remove();
  });
});
