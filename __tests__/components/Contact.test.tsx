import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import Contact from "@/app/components/home/contact/contact";

describe("Contact", () => {
  test("이메일이 실제 mailto 링크로 렌더된다", () => {
    render(<Contact />);

    const email = screen.getByRole("link", { name: /wjddns363@naver\.com/ });
    expect(email.getAttribute("href")).toBe("mailto:wjddns363@naver.com");
  });

  //* 다크 모드에서 filter: invert 로 뒤집던 PNG 대신 글자색을 따르는 SVG 를 쓴다. (#44)
  test("이메일 아이콘은 이미지 파일이 아닌 inline SVG 다", () => {
    render(<Contact />);

    const email = screen.getByRole("link", { name: /wjddns363@naver\.com/ });
    expect(email.querySelector("img")).toBeNull();
    expect(email.querySelector("svg")).not.toBeNull();
  });

  //* 전화번호는 스팸 수집 대상이라 공개 노출하지 않고 이력서 PDF 안에만 둔다. (#63)
  test("전화번호는 노출하지 않는다", () => {
    const { container } = render(<Contact />);

    expect(container.querySelector('a[href^="tel:"]')).toBeNull();
    expect(container.textContent).not.toMatch(/010-\d{4}-\d{4}/);
  });
});
