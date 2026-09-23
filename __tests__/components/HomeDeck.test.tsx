import { beforeEach, describe, expect, test } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import HomeDeck from "@/app/components/home/deck/HomeDeck";

const PAGES = [
  { slug: "intro", label: "소개" },
  { slug: "contact", label: "글 · 연락처" },
];

const renderDeck = () =>
  render(
    <HomeDeck pages={PAGES}>
      <section>소개 페이지</section>
      <section>연락처 페이지</section>
    </HomeDeck>,
  );

describe("HomeDeck", () => {
  beforeEach(() => {
    window.history.replaceState(null, "", "/");
  });

  test("페이지 수만큼 도트를 그리고 첫 페이지를 현재로 표시한다", () => {
    renderDeck();

    const dots = PAGES.map(({ label }) =>
      screen.getByRole("button", { name: `${label} 페이지로 이동` }),
    );
    expect(dots).toHaveLength(2);
    expect(dots[0].getAttribute("aria-current")).toBe("true");
    expect(dots[1].getAttribute("aria-current")).toBe("false");
  });

  test("도트를 누르면 현재 페이지 표시와 URL 이 함께 바뀐다", () => {
    renderDeck();

    fireEvent.click(screen.getByRole("button", { name: "글 · 연락처 페이지로 이동" }));

    expect(window.location.search).toBe("?page=contact");
    expect(
      screen.getByRole("button", { name: "글 · 연락처 페이지로 이동" }).getAttribute("aria-current"),
    ).toBe("true");
  });

  //* 첫 페이지는 기본 상태라 URL 을 깨끗하게 둔다.
  test("첫 페이지로 돌아오면 page 파라미터를 지운다", () => {
    renderDeck();

    fireEvent.click(screen.getByRole("button", { name: "글 · 연락처 페이지로 이동" }));
    expect(window.location.search).toBe("?page=contact");

    fireEvent.click(screen.getByRole("button", { name: "소개 페이지로 이동" }));
    expect(window.location.search).toBe("");
  });

  test("양 끝에서는 해당 방향 화살표를 비활성화한다", () => {
    renderDeck();

    const prev = () =>
      screen.getByRole("button", { name: "이전 페이지" }) as HTMLButtonElement;
    const next = () =>
      screen.getByRole("button", { name: "다음 페이지" }) as HTMLButtonElement;

    expect(prev().disabled).toBe(true);
    expect(next().disabled).toBe(false);

    fireEvent.click(next());

    expect(prev().disabled).toBe(false);
    expect(next().disabled).toBe(true);
  });

  test("키보드 좌우 방향키로 페이지를 넘길 수 있다", () => {
    renderDeck();
    const track = screen.getByLabelText("홈 페이지 넘기기");

    fireEvent.keyDown(track, { key: "ArrowRight" });
    expect(window.location.search).toBe("?page=contact");

    fireEvent.keyDown(track, { key: "ArrowLeft" });
    expect(window.location.search).toBe("");
  });
});
