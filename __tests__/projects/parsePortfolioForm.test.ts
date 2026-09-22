import { describe, expect, it } from "vitest";
import { parsePortfolioForm } from "@/lib/portfolio/parsePortfolioForm";

const validFields = {
  title: "제목",
  slug: "My-Project",
  status: "published",
  tags: "Next.js, TypeScript,",
  size: "2,1",
  githubLink: "https://github.com/x",
  velogLink: "https://velog.io/@x",
  createdAt: "2026-04-26T10:00:00.000Z",
  summary: "요약",
  contents: "## 본문",
};

function buildFormData(
  overrides: Record<string, string> = {},
  thumbnail?: File,
) {
  const formData = new FormData();
  for (const [key, value] of Object.entries({ ...validFields, ...overrides })) {
    formData.set(key, value);
  }
  if (thumbnail) {
    formData.set("thumbnail", thumbnail);
  }
  return formData;
}

const pngFile = new File([new Uint8Array([1, 2, 3])], "a.png", {
  type: "image/png",
});

describe("parsePortfolioForm", () => {
  it("유효한 입력을 정규화해서 반환한다", () => {
    const result = parsePortfolioForm(buildFormData({}, pngFile), {
      requireThumbnail: true,
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.values).toMatchObject({
      slug: "my-project",
      tags: ["Next.js", "TypeScript"],
      size: [2, 1],
      createdAt: "2026-04-26",
      thumbnail: pngFile,
    });
  });

  it("작성 모드에서는 썸네일이 필수다", () => {
    const result = parsePortfolioForm(buildFormData(), {
      requireThumbnail: true,
    });
    expect(result).toEqual({
      ok: false,
      message: "썸네일 이미지를 업로드해주세요.",
    });
  });

  it("Velog 링크는 선택 항목이다", () => {
    const result = parsePortfolioForm(buildFormData({ velogLink: "" }, pngFile), {
      requireThumbnail: true,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.values.velogLink).toBe("");
  });

  it("수정 모드에서는 썸네일이 없어도 통과한다", () => {
    const result = parsePortfolioForm(buildFormData(), {
      requireThumbnail: false,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.values.thumbnail).toBeNull();
  });

  it.each([
    [{ slug: "한글" }, "프로젝트 명은 영문 소문자, 숫자, 하이픈(-)만 사용할 수 있습니다."],
    [{ size: "2" }, "카드 사이즈는 2,1 처럼 두 개의 숫자로 입력해주세요."],
    [{ size: "4,1" }, "카드 사이즈 값은 1~3 사이여야 합니다."],
    [{ tags: " , " }, "태그를 1개 이상 입력해주세요."],
    [{ title: "" }, "필수 필드를 입력해주세요."],
  ])("잘못된 입력 %o 은 거부한다", (overrides, message) => {
    const result = parsePortfolioForm(buildFormData(overrides, pngFile), {
      requireThumbnail: true,
    });
    expect(result).toEqual({ ok: false, message });
  });

  it("허용되지 않은 이미지 타입은 거부한다", () => {
    const gif = new File([new Uint8Array([1])], "a.gif", { type: "image/gif" });
    const result = parsePortfolioForm(buildFormData({}, gif), {
      requireThumbnail: true,
    });
    expect(result).toEqual({
      ok: false,
      message: "썸네일 이미지는 JPG 또는 PNG만 업로드할 수 있습니다.",
    });
  });
});
