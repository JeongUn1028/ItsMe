import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import Links from "@/app/components/home/links/links";

describe("Links", () => {
  test("GitHub 과 Velog 프로필로 가는 외부 링크를 제공한다", () => {
    render(<Links />);

    const github = screen.getByRole("link", { name: "GitHub" });
    const velog = screen.getByRole("link", { name: "Velog" });

    expect(github.getAttribute("href")).toContain("github.com/JEONGUN1028");
    expect(velog.getAttribute("href")).toContain("velog.io/@jeongun1028");

    //* 새 탭으로 열리는 외부 링크는 rel 로 보호한다.
    [github, velog].forEach((link) => {
      expect(link.getAttribute("target")).toBe("_blank");
      expect(link.getAttribute("rel")).toContain("noopener");
    });
  });
});
