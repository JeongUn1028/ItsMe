import { describe, expect, it } from "vitest";
import { z } from "zod";
import {
  commaSeparated,
  firstIssueMessage,
  readFile,
  readText,
} from "@/lib/validation/formValue";

describe("formValue", () => {
  it("없는 키를 읽으면 빈 문자열을 돌려준다", () => {
    expect(readText(new FormData(), "missing")).toBe("");
  });

  it("텍스트는 앞뒤 공백을 제거해서 읽는다", () => {
    const formData = new FormData();
    formData.set("title", "  제목  ");
    expect(readText(formData, "title")).toBe("제목");
  });

  it("0바이트 파일이나 파일이 아닌 값은 없는 것으로 본다", () => {
    const formData = new FormData();
    formData.set("empty", new File([], "a.png", { type: "image/png" }));
    formData.set("text", "파일이 아님");

    expect(readFile(formData, "empty")).toBeNull();
    expect(readFile(formData, "text")).toBeNull();
    expect(readFile(formData, "missing")).toBeNull();
  });

  it("쉼표 구분 입력에서 빈 항목을 걸러낸다", () => {
    expect(commaSeparated.parse("a, ,b,")).toEqual(["a", "b"]);
  });

  it("검증 실패 메시지가 여러 개면 첫 번째만 보여준다", () => {
    const result = z
      .object({ a: z.string().min(1, "먼저"), b: z.string().min(1, "나중") })
      .safeParse({ a: "", b: "" });

    expect(result.success).toBe(false);
    if (!result.success) expect(firstIssueMessage(result.error)).toBe("먼저");
  });
});
