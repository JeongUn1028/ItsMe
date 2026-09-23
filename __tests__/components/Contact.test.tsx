import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import Contact from "@/app/components/home/contact/contact";

describe("Contact", () => {
  test("이메일이 실제 mailto 링크로 렌더된다", () => {
    render(<Contact />);

    const email = screen.getByRole("link", { name: /wjddns363@naver\.com/ });
    expect(email.getAttribute("href")).toBe("mailto:wjddns363@naver.com");
  });

  //* 전화번호는 스팸 수집 대상이라 공개 노출하지 않고 이력서 PDF 안에만 둔다. (#63)
  test("전화번호는 노출하지 않는다", () => {
    const { container } = render(<Contact />);

    expect(container.querySelector('a[href^="tel:"]')).toBeNull();
    expect(container.textContent).not.toMatch(/010-\d{4}-\d{4}/);
  });
});
