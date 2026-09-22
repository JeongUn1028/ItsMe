import { afterEach, describe, expect, it } from "vitest";
import {
  hashPassword,
  verifyAdminCredentials,
  verifyPassword,
} from "@/lib/auth/verifyAdminCredentials";

describe("verifyPassword", () => {
  it("hashPassword로 만든 해시는 원래 비밀번호로 검증된다", async () => {
    const hash = await hashPassword("correct horse battery staple");

    expect(hash.startsWith("scrypt$")).toBe(true);
    expect(await verifyPassword("correct horse battery staple", hash)).toBe(true);
    expect(await verifyPassword("wrong password", hash)).toBe(false);
  });

  it("형식이 잘못된 해시는 항상 false", async () => {
    expect(await verifyPassword("anything", "plain-text")).toBe(false);
    expect(await verifyPassword("anything", "bcrypt$abc$def")).toBe(false);
  });
});

describe("verifyAdminCredentials", () => {
  const original = {
    username: process.env.ADMIN_USERNAME,
    hash: process.env.ADMIN_PASSWORD_HASH,
  };

  afterEach(() => {
    process.env.ADMIN_USERNAME = original.username;
    process.env.ADMIN_PASSWORD_HASH = original.hash;
  });

  it("아이디와 비밀번호가 모두 맞을 때만 true", async () => {
    process.env.ADMIN_USERNAME = "admin";
    process.env.ADMIN_PASSWORD_HASH = await hashPassword("secret");

    expect(await verifyAdminCredentials("admin", "secret")).toBe(true);
    expect(await verifyAdminCredentials("admin", "nope")).toBe(false);
    expect(await verifyAdminCredentials("other", "secret")).toBe(false);
  });

  it("환경변수가 없으면 false", async () => {
    delete process.env.ADMIN_USERNAME;
    delete process.env.ADMIN_PASSWORD_HASH;

    expect(await verifyAdminCredentials("admin", "secret")).toBe(false);
  });
});
