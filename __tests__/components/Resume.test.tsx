import { expect, test, describe } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import Resume from "@/app/components/home/resume/resume";

describe("Resume", () => {
  test("h1 제목과 이력서 PDF 링크를 렌더링한다", () => {
    render(<Resume />);

    expect(
      screen.getByRole("heading", { level: 1, name: "ABOUT ME/RESUME" }),
    ).toBeDefined();

    const pdfLink = screen.getByRole("link", { name: "Resume PDF 보기" });
    expect(pdfLink.getAttribute("target")).toBe("_blank");
    expect(pdfLink.getAttribute("href")).toMatch(/\.pdf$/);
  });

  test("토글 버튼을 누르면 라벨이 사진 보기 / 소개글 보기로 바뀐다", () => {
    render(<Resume />);

    const button = screen.getByRole("button", { name: "소개글 보기" });
    fireEvent.click(button);
    expect(screen.getByRole("button", { name: "사진 보기" })).toBeDefined();

    fireEvent.click(button);
    expect(screen.getByRole("button", { name: "소개글 보기" })).toBeDefined();
  });
});
