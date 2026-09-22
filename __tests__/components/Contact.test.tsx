import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import Contact from "@/app/components/home/contact/contact";

describe("Contact", () => {
  test("이메일과 전화번호가 실제 링크로 렌더된다", () => {
    render(<Contact />);

    const email = screen.getByRole("link", { name: /wjddns363@naver\.com/ });
    expect(email.getAttribute("href")).toBe("mailto:wjddns363@naver.com");

    const phone = screen.getByRole("link", { name: /010-9656-1295/ });
    //* tel: 링크는 하이픈 없이 숫자만
    expect(phone.getAttribute("href")).toBe("tel:01096561295");
  });
});
