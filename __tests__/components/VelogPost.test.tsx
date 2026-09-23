import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import VelogPost from "@/app/components/home/velog/VelogPost";

const post = {
  title: "Next.js App Router 회고",
  tags: ["nextjs", "react"],
  url_slug: "app-router-retro",
  released_at: "2026-08-31T09:00:00.000Z",
};

describe("VelogPost", () => {
  test("글 제목과 태그를 보여준다", () => {
    render(<VelogPost post={post} />);

    expect(screen.getByText("Next.js App Router 회고")).toBeDefined();
    post.tags.forEach((tag) => expect(screen.getByText(tag)).toBeDefined());
  });

  test("Velog 원문으로 가는 외부 링크를 만든다", () => {
    render(<VelogPost post={post} />);

    const link = screen.getByRole("link");
    expect(link.getAttribute("href")).toBe(
      "https://velog.io/@jeongun1028/app-router-retro",
    );
    //* 새 탭으로 열리는 외부 링크는 rel 로 보호한다.
    expect(link.getAttribute("target")).toBe("_blank");
    expect(link.getAttribute("rel")).toContain("noopener");
  });

  test("작성 일자를 사람이 읽는 형식으로 보여준다", () => {
    render(<VelogPost post={post} />);

    const expected = new Date(post.released_at).toLocaleDateString();
    expect(screen.getByText(new RegExp(expected))).toBeDefined();
  });
});
