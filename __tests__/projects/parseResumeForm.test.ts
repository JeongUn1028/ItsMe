import { describe, expect, it } from "vitest";
import { parseResumeForm } from "@/lib/resume/parseResumeForm";

function buildFormData(
  fields: Record<string, string> = {},
  files: Record<string, File> = {},
) {
  const formData = new FormData();
  const base = { description: "소개 문구", skills: "React, TypeScript," };
  for (const [key, value] of Object.entries({ ...base, ...fields })) {
    formData.set(key, value);
  }
  for (const [key, file] of Object.entries(files)) formData.set(key, file);
  return formData;
}

const png = new File([new Uint8Array([1])], "a.png", { type: "image/png" });
const pdf = new File([new Uint8Array([1])], "a.pdf", {
  type: "application/pdf",
});

describe("parseResumeForm", () => {
  it("설명과 기술이 있으면 기술 목록을 정규화해서 반환한다", () => {
    const result = parseResumeForm(buildFormData());

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.values.description).toBe("소개 문구");
    expect(result.values.skills).toEqual(["React", "TypeScript"]);
    expect(result.values.image).toBeNull();
    expect(result.values.pdf).toBeNull();
  });

  it("설명이 비어 있으면 거부한다", () => {
    expect(parseResumeForm(buildFormData({ description: " " }))).toEqual({
      ok: false,
      message: "모든 필드를 입력해주세요.",
    });
  });

  it("기술이 구분자뿐이면 거부한다", () => {
    expect(parseResumeForm(buildFormData({ skills: " , " }))).toEqual({
      ok: false,
      message: "최소 1개 이상의 기술을 입력해주세요.",
    });
  });

  it("업로드된 파일이 있으면 값으로 함께 반환한다", () => {
    const result = parseResumeForm(
      buildFormData({}, { thumbnail: png, pdf: pdf }),
    );

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.values.image).toBe(png);
    expect(result.values.pdf).toBe(pdf);
  });

  it("허용되지 않은 이미지 형식이면 거부한다", () => {
    const gif = new File([new Uint8Array([1])], "a.gif", { type: "image/gif" });
    expect(parseResumeForm(buildFormData({}, { thumbnail: gif }))).toEqual({
      ok: false,
      message: "프로필 이미지는 JPG 또는 PNG만 업로드할 수 있습니다.",
    });
  });

  it("PDF 가 아닌 이력서 파일이면 거부한다", () => {
    const txt = new File([new Uint8Array([1])], "a.txt", { type: "text/plain" });
    expect(parseResumeForm(buildFormData({}, { pdf: txt }))).toEqual({
      ok: false,
      message: "이력서는 PDF 파일만 업로드할 수 있습니다.",
    });
  });

  it("빈 파일은 업로드하지 않은 것으로 본다", () => {
    const empty = new File([], "empty.png", { type: "image/png" });
    const result = parseResumeForm(buildFormData({}, { thumbnail: empty }));

    expect(result.ok).toBe(true);
    if (result.ok) expect(result.values.image).toBeNull();
  });
});
