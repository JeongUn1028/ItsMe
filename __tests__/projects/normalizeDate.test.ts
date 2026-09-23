import { describe, expect, it } from "vitest";
import { normalizeDate } from "@/lib/normalizeDate";

describe("normalizeDate", () => {
  it("ISO 문자열을 받으면 날짜 부분만 남긴다", () => {
    expect(normalizeDate("2026-04-26T10:20:30.000Z")).toBe("2026-04-26");
  });

  it("이미 날짜 형식이면 그대로 둔다", () => {
    expect(normalizeDate("2026-04-26")).toBe("2026-04-26");
  });

  it("값이 비어 있으면 오늘 날짜로 채운다", () => {
    const today = new Date().toISOString().slice(0, 10);
    expect(normalizeDate("")).toBe(today);
  });
});
