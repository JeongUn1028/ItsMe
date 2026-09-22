import { normalizeDate } from "@/lib/normalizeDate";

export const ALLOWED_THUMBNAIL_TYPES = ["image/jpeg", "image/png"];

export interface PortfolioFormValues {
  title: string;
  slug: string;
  status: string;
  tags: string[];
  size: number[];
  githubLink: string;
  velogLink: string;
  createdAt: string;
  summary: string;
  contents: string;
  //* 새로 업로드된 썸네일 (없으면 null)
  thumbnail: File | null;
}

export type ParseResult =
  | { ok: true; values: PortfolioFormValues }
  | { ok: false; message: string };

//* 포트폴리오 작성/수정 폼의 FormData 를 검증하고 정규화합니다.
//* requireThumbnail: 작성 시에는 필수, 수정 시에는 선택
export function parsePortfolioForm(
  formData: FormData,
  { requireThumbnail }: { requireThumbnail: boolean },
): ParseResult {
  const text = (key: string) => formData.get(key)?.toString().trim() ?? "";

  const title = text("title");
  const slug = text("slug").toLowerCase();
  const status = text("status") || "draft";
  const size = text("size");
  const tags = text("tags");
  const githubLink = text("githubLink");
  const velogLink = text("velogLink");
  const createdAt = text("createdAt");
  const summary = text("summary");
  const contents = formData.get("contents")?.toString() ?? "";

  const rawThumbnail = formData.get("thumbnail");
  const thumbnail =
    rawThumbnail instanceof File && rawThumbnail.size > 0 ? rawThumbnail : null;

  //* velogLink 는 선택 (글을 안 쓴 프로젝트도 있음)
  if (
    !title ||
    !slug ||
    !summary ||
    !contents.trim() ||
    !githubLink ||
    !size ||
    !tags
  ) {
    return { ok: false, message: "필수 필드를 입력해주세요." };
  }

  if (!/^[a-z0-9-]+$/.test(slug)) {
    return {
      ok: false,
      message:
        "프로젝트 명은 영문 소문자, 숫자, 하이픈(-)만 사용할 수 있습니다.",
    };
  }

  if (status !== "draft" && status !== "published") {
    return { ok: false, message: "상태 값이 올바르지 않습니다." };
  }

  const tagsArray = tags
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);
  if (tagsArray.length === 0) {
    return { ok: false, message: "태그를 1개 이상 입력해주세요." };
  }

  const sizeArray = size
    .split(",")
    .map((s) => Number(s.trim()))
    .filter((n) => Number.isInteger(n));
  if (sizeArray.length !== 2) {
    return {
      ok: false,
      message: "카드 사이즈는 2,1 처럼 두 개의 숫자로 입력해주세요.",
    };
  }
  if (sizeArray.some((n) => n < 1 || n > 3)) {
    return { ok: false, message: "카드 사이즈 값은 1~3 사이여야 합니다." };
  }

  if (requireThumbnail && !thumbnail) {
    return { ok: false, message: "썸네일 이미지를 업로드해주세요." };
  }
  if (thumbnail && !ALLOWED_THUMBNAIL_TYPES.includes(thumbnail.type)) {
    return {
      ok: false,
      message: "썸네일 이미지는 JPG 또는 PNG만 업로드할 수 있습니다.",
    };
  }

  return {
    ok: true,
    values: {
      title,
      slug,
      status,
      tags: tagsArray,
      size: sizeArray,
      githubLink,
      velogLink,
      createdAt: normalizeDate(createdAt),
      summary,
      contents,
      thumbnail,
    },
  };
}
