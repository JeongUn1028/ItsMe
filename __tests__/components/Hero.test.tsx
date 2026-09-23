import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import Hero from "@/app/components/home/hero/Hero";
import { getResume } from "@/lib/resume/getResume";

describe("Hero", () => {
  test("이름을 최상위 제목으로 보여준다", () => {
    render(<Hero />);
    expect(
      screen.getByRole("heading", { level: 1, name: "이정운" }),
    ).toBeDefined();
  });

  //* 포지셔닝 문구는 소개글 첫 줄을 그대로 쓴다. 관리자에서 소개글을 고치면 같이 바뀐다.
  test("소개글의 첫 줄을 포지셔닝 문구로 보여준다", () => {
    const [headline] = getResume().description.split("\n");
    render(<Hero />);
    expect(screen.getByText(headline.trim())).toBeDefined();
  });

  test("나머지 소개글은 접힌 상태로 두고 펼칠 수 있게 한다", () => {
    const { container } = render(<Hero />);
    const details = container.querySelector("details");

    expect(details).not.toBeNull();
    //* 기본은 접힘. JS 없이 동작하도록 details/summary 를 쓴다.
    expect(details?.hasAttribute("open")).toBe(false);
    expect(screen.getByText("소개 더 보기")).toBeDefined();
  });

  //* 카드가 옆 위젯 높이에 맞춰 늘어나므로 둘째 문단까지는 항상 보여 공간을 채운다.
  test("소개글 둘째 문단은 접지 않고 바로 보여준다", () => {
    const [, lead] = getResume().description.split("\n");
    render(<Hero />);
    expect(screen.getByText(lead.trim())).toBeDefined();
  });

  test("주력 기술을 목록으로 보여준다", () => {
    const { skills } = getResume();
    render(<Hero />);

    const listed = screen.getAllByRole("listitem").map((li) => li.textContent);
    skills.forEach((skill) => expect(listed).toContain(skill));
  });

  test("이력서 PDF · GitHub · Velog 로 가는 링크를 제공한다", () => {
    render(<Hero />);

    expect(
      screen.getByRole("link", { name: "이력서 PDF" }).getAttribute("href"),
    ).toMatch(/\.pdf$/);
    expect(
      screen.getByRole("link", { name: "GitHub" }).getAttribute("href"),
    ).toContain("github.com");
    expect(
      screen.getByRole("link", { name: "Velog" }).getAttribute("href"),
    ).toContain("velog.io");
  });
});
