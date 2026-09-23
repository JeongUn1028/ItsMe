import { z } from "zod";
import {
  commaSeparated,
  fileOfType,
  firstIssueMessage,
  readFile,
  readText,
} from "@/lib/validation/formValue";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png"] as const;

const resumeFormSchema = z.object({
  description: z.string().min(1, "모든 필드를 입력해주세요."),
  skills: z
    .string()
    .min(1, "모든 필드를 입력해주세요.")
    .pipe(commaSeparated)
    .refine((skills) => skills.length > 0, {
      message: "최소 1개 이상의 기술을 입력해주세요.",
    }),
  image: fileOfType(
    ALLOWED_IMAGE_TYPES,
    "프로필 이미지는 JPG 또는 PNG만 업로드할 수 있습니다.",
  ),
  pdf: fileOfType(
    ["application/pdf"],
    "이력서는 PDF 파일만 업로드할 수 있습니다.",
  ),
});

export type ResumeFormValues = z.infer<typeof resumeFormSchema>;

export type ResumeParseResult =
  | { ok: true; values: ResumeFormValues }
  | { ok: false; message: string };

/**
 * 이력서 편집 폼의 FormData 를 검증하고 정규화한다.
 *
 * @example
 * const result = parseResumeForm(formData);
 * if (!result.ok) return { success: false, message: result.message };
 */
export function parseResumeForm(formData: FormData): ResumeParseResult {
  const parsed = resumeFormSchema.safeParse({
    description: readText(formData, "description"),
    skills: readText(formData, "skills"),
    image: readFile(formData, "thumbnail"),
    pdf: readFile(formData, "pdf"),
  });

  return parsed.success
    ? { ok: true, values: parsed.data }
    : { ok: false, message: firstIssueMessage(parsed.error) };
}
