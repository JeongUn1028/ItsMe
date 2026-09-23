import { z } from "zod";
import { normalizeDate } from "@/lib/normalizeDate";
import {
  commaSeparated,
  firstIssueMessage,
  readFile,
  readText,
} from "@/lib/validation/formValue";

export const ALLOWED_THUMBNAIL_TYPES = ["image/jpeg", "image/png"] as const;

const REQUIRED_MESSAGE = "필수 필드를 입력해주세요.";
const required = z.string().trim().min(1, REQUIRED_MESSAGE);

//* 1단계: 빠진 필드를 먼저 잡는다. 어느 필드가 비었든 같은 메시지를 보여준다.
//* (velogLink 는 글을 안 쓴 프로젝트도 있어 선택 항목이다)
const requiredFieldsSchema = z.object({
  title: required,
  slug: required,
  summary: required,
  contents: required,
  githubLink: required,
  size: required,
  tags: required,
});

const sizeSchema = z
  .string()
  .transform((value) =>
    value
      .split(",")
      .map((item) => Number(item.trim()))
      .filter((item) => Number.isInteger(item)),
  )
  .refine((size) => size.length === 2, {
    message: "카드 사이즈는 2,1 처럼 두 개의 숫자로 입력해주세요.",
  })
  .refine((size) => size.every((value) => value >= 1 && value <= 3), {
    message: "카드 사이즈 값은 1~3 사이여야 합니다.",
  });

const thumbnailSchema = (isRequired: boolean) =>
  z
    .instanceof(File)
    .nullable()
    .refine((file) => !isRequired || file !== null, {
      message: "썸네일 이미지를 업로드해주세요.",
    })
    .refine(
      (file) =>
        file === null ||
        (ALLOWED_THUMBNAIL_TYPES as readonly string[]).includes(file.type),
      { message: "썸네일 이미지는 JPG 또는 PNG만 업로드할 수 있습니다." },
    );

//* 2단계: 형식을 검증한다. 키 순서가 곧 사용자에게 보여줄 메시지의 우선순위다.
const detailSchema = (isThumbnailRequired: boolean) =>
  z.object({
    slug: z
      .string()
      .regex(/^[a-z0-9-]+$/, "프로젝트 명은 영문 소문자, 숫자, 하이픈(-)만 사용할 수 있습니다."),
    status: z.enum(["draft", "published"], {
      message: "상태 값이 올바르지 않습니다.",
    }),
    tags: commaSeparated.refine((tags) => tags.length > 0, {
      message: "태그를 1개 이상 입력해주세요.",
    }),
    size: sizeSchema,
    thumbnail: thumbnailSchema(isThumbnailRequired),
    title: z.string(),
    githubLink: z.string(),
    velogLink: z.string(),
    createdAt: z.string().transform(normalizeDate),
    summary: z.string(),
    contents: z.string(),
  });

export type PortfolioFormValues = z.infer<ReturnType<typeof detailSchema>>;

export type ParseResult =
  | { ok: true; values: PortfolioFormValues }
  | { ok: false; message: string };

/**
 * 포트폴리오 작성/수정 폼의 FormData 를 검증하고 정규화한다.
 *
 * @param requireThumbnail 작성 시에는 필수, 수정 시에는 선택
 * @example
 * const parsed = parsePortfolioForm(formData, { requireThumbnail: true });
 * if (!parsed.ok) return { success: false, message: parsed.message };
 */
export function parsePortfolioForm(
  formData: FormData,
  { requireThumbnail }: { requireThumbnail: boolean },
): ParseResult {
  //* contents 는 본문이라 앞뒤 공백을 보존하고, 비었는지만 trim 으로 판단한다.
  const contents = formData.get("contents")?.toString() ?? "";
  const raw = {
    title: readText(formData, "title"),
    slug: readText(formData, "slug").toLowerCase(),
    status: readText(formData, "status") || "draft",
    size: readText(formData, "size"),
    tags: readText(formData, "tags"),
    githubLink: readText(formData, "githubLink"),
    velogLink: readText(formData, "velogLink"),
    createdAt: readText(formData, "createdAt"),
    summary: readText(formData, "summary"),
    contents,
    thumbnail: readFile(formData, "thumbnail"),
  };

  const requiredCheck = requiredFieldsSchema.safeParse(raw);
  if (!requiredCheck.success) {
    return { ok: false, message: REQUIRED_MESSAGE };
  }

  const parsed = detailSchema(requireThumbnail).safeParse(raw);
  return parsed.success
    ? { ok: true, values: parsed.data }
    : { ok: false, message: firstIssueMessage(parsed.error) };
}
