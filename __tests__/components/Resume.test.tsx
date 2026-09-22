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

  test("토글 버튼은 데스크톱/모바일 라벨을 모두 갖고, 누르면 둘 다 바뀐다", () => {
    //* jsdom 에는 미디어쿼리가 없어 두 라벨이 모두 DOM 에 존재합니다. (실제 화면에서는 CSS 가 하나만 보여줌)
    render(<Resume />);

    const button = screen.getByRole("button");
    expect(button.textContent).toBe("소개글 보기더 보기");

    fireEvent.click(button);
    expect(button.textContent).toBe("사진 보기접기");

    fireEvent.click(button);
    expect(button.textContent).toBe("소개글 보기더 보기");
  });
});
