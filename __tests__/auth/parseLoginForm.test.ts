import { describe, expect, it } from "vitest";
import { parseLoginForm } from "@/lib/auth/parseLoginForm";

function buildFormData(fields: Record<string, string>) {
  const formData = new FormData();
  for (const [key, value] of Object.entries(fields)) formData.set(key, value);
  return formData;
}

describe("parseLoginForm", () => {
  it("아이디와 비밀번호가 있으면 값을 반환한다", () => {
    const result = parseLoginForm(
      buildFormData({ username: "admin", password: "secret" }),
    );

    expect(result).toEqual({
      ok: true,
      redirectTo: "/admin",
      values: { username: "admin", password: "secret" },
    });
  });

  it("아이디나 비밀번호가 비어 있으면 거부한다", () => {
    expect(
      parseLoginForm(buildFormData({ username: "", password: "secret" })),
    ).toEqual({ ok: false, redirectTo: "/admin" });
    expect(
      parseLoginForm(buildFormData({ username: "admin", password: "" })),
    ).toEqual({ ok: false, redirectTo: "/admin" });
  });

  it("내부 경로는 redirect 대상으로 유지한다", () => {
    const result = parseLoginForm(
      buildFormData({
        username: "admin",
        password: "secret",
        redirect: "/admin/write",
      }),
    );

    expect(result.ok).toBe(true);
    expect(result.redirectTo).toBe("/admin/write");
  });

  //* 외부 도메인으로 튕겨내는 open redirect 를 막는다.
  it.each(["//evil.com", "https://evil.com", "evil.com", ""])(
    "외부 경로 %s 는 /admin 으로 대체한다",
    (redirect) => {
      const result = parseLoginForm(
        buildFormData({ username: "admin", password: "secret", redirect }),
      );

      expect(result.ok).toBe(true);
      expect(result.redirectTo).toBe("/admin");
    },
  );
});
