import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "../app/page";

test("Home", () => {
  render(<Home />);
  expect(
    screen.getByRole("heading", {
      level: 1,
      name: "Next.js 기반 개인 포트폴리오 프로젝트",
    }),
  ).toBeDefined();
});
