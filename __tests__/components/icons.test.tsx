import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { EmailIcon, GitHubIcon } from "@/app/components/ui/icons";

//* PNG + filter: invert 대신 글자색을 그대로 따르는 inline SVG 아이콘 (#44)
describe.each([
  ["EmailIcon", EmailIcon],
  ["GitHubIcon", GitHubIcon],
])("%s", (_, Icon) => {
  test("글자색(currentColor)으로 칠해진다", () => {
    const { container } = render(<Icon />);

    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();
    const painted = [svg, ...container.querySelectorAll("svg *")].flatMap((el) => [
      el?.getAttribute("fill"),
      el?.getAttribute("stroke"),
    ]);
    expect(painted).toContain("currentColor");
    //* 고정 색이 섞이면 다크 모드에서 다시 안 보이게 된다.
    expect(painted.filter((value) => value && value !== "none" && value !== "currentColor")).toEqual([]);
  });

  test("제목이 없으면 보조기기에서 숨긴다", () => {
    const { container } = render(<Icon />);

    expect(container.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
    expect(screen.queryByRole("img")).toBeNull();
  });

  test("제목을 주면 그 이름의 이미지로 읽힌다", () => {
    render(<Icon title="아이콘 이름" />);

    expect(screen.getByRole("img", { name: "아이콘 이름" })).toBeTruthy();
  });

  test("size 로 가로·세로 크기를 정한다", () => {
    const { container } = render(<Icon size={32} />);

    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("width")).toBe("32");
    expect(svg?.getAttribute("height")).toBe("32");
  });
});
